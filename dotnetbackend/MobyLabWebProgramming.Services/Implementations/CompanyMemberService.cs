using System.Net;
using MobyLabWebProgramming.Database.Repository;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.DataTransferObjects;
using MobyLabWebProgramming.Services.Specifications;

namespace MobyLabWebProgramming.Services.Implementations;

public class CompanyMemberService(IRepository<WebAppDatabaseContext> repository) : ICompanyMemberService
{
    public async Task<ServiceResponse<List<CompanyMemberRecord>>> GetCompanyMembers(Guid companyId, CancellationToken cancellationToken = default)
    {
        var members = await repository.ListAsync(new CompanyMemberByCompanySpec(companyId), cancellationToken);

        return ServiceResponse.ForSuccess(members.Select(m => new CompanyMemberRecord
        {
            Id = m.Id,
            UserId = m.UserId,
            CompanyId = m.CompanyId,
            Role = m.Role.ToString(),
            User = new UserRecord
            {
                Id = m.User.Id,
                Name = m.User.Name,
                Email = m.User.Email,
                Role = m.User.Role
            }
        }).ToList());
    }

    public async Task<ServiceResponse<List<CompanyMemberRecord>>> GetCompanyMembersByUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var company = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.ForSuccess(new List<CompanyMemberRecord>());
        }

        return await GetCompanyMembers(company.Id, cancellationToken);
    }

    public async Task<ServiceResponse> AddMember(Guid userId, UserRoleEnum role, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role != UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company admins can add members!", ErrorCodes.CannotAdd));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Company not found!", ErrorCodes.EntityNotFound));
        }

        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "User not found!", ErrorCodes.EntityNotFound));
        }

        var existingMember = await repository.GetAsync(new CompanyMemberByUserSpec(userId, company.Id), cancellationToken);
        if (existingMember != null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "User is already a member of this company!", ErrorCodes.CannotAdd));
        }

        var newMember = new CompanyMember
        {
            UserId = userId,
            CompanyId = company.Id,
            Role = role
        };

        user.Role = role;
        await repository.UpdateAsync(user, cancellationToken);
        await repository.AddAsync(newMember, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> RemoveMember(Guid userId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role != UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company admins can remove members!", ErrorCodes.CannotDelete));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Company not found!", ErrorCodes.EntityNotFound));
        }

        var member = await repository.GetAsync(new CompanyMemberByUserSpec(userId, company.Id), cancellationToken);
        if (member == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Member not found!", ErrorCodes.EntityNotFound));
        }

        if (member.Role == UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Cannot remove the company owner!", ErrorCodes.CannotDelete));
        }

        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user != null)
        {
            user.Role = UserRoleEnum.Client;
            await repository.UpdateAsync(user, cancellationToken);
        }

        await repository.DeleteAsync<CompanyMember>(member.Id, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateMemberRole(Guid userId, UserRoleEnum role, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role != UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company admins can update member roles!", ErrorCodes.CannotUpdate));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Company not found!", ErrorCodes.EntityNotFound));
        }

        var member = await repository.GetAsync(new CompanyMemberByUserSpec(userId, company.Id), cancellationToken);
        if (member == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Member not found!", ErrorCodes.EntityNotFound));
        }

        member.Role = role;

        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user != null)
        {
            user.Role = role;
            await repository.UpdateAsync(user, cancellationToken);
        }

        await repository.UpdateAsync(member, cancellationToken);

        return ServiceResponse.ForSuccess();
    }
}
