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

public class CompanyService(IRepository<WebAppDatabaseContext> repository) : ICompanyService
{
    public async Task<ServiceResponse<CompanyRecord>> GetCompany(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new CompanyProjectionSpec(id), cancellationToken);

        return result != null
            ? ServiceResponse.ForSuccess(result)
            : ServiceResponse.FromError<CompanyRecord>(CommonErrors.CompanyNotFound);
    }

    public async Task<ServiceResponse<CompanyRecord?>> GetCompanyByUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);

        if (result == null)
        {
            var member = await repository.GetAsync(new CompanyMemberByUserAnyCompanySpec(userId), cancellationToken);
            if (member != null)
            {
                result = await repository.GetAsync(new CompanySpec(member.CompanyId), cancellationToken);
            }
            if (result == null)
            {
                return ServiceResponse.ForSuccess<CompanyRecord?>(null);
            }
        }

        return ServiceResponse.ForSuccess<CompanyRecord?>(new CompanyRecord
        {
            Id = result.Id,
            Name = result.Name,
            Description = result.Description
        });
    }

    public async Task<ServiceResponse> AddCompany(CompanyAddRecord company, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role != UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company admins can create companies!", ErrorCodes.CannotAdd));
        }

        var existingCompany = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (existingCompany != null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "You already have a company!", ErrorCodes.CompanyAlreadyExists));
        }

        var newCompany = new Company
        {
            Name = company.Name,
            Description = company.Description
        };

        await repository.AddAsync(newCompany, cancellationToken);

        var user = await repository.GetAsync(new UserSpec(requestingUser.Id), cancellationToken);
        if (user != null)
        {
            user.CompanyId = newCompany.Id;
            await repository.UpdateAsync(user, cancellationToken);
        }

        var newMember = new CompanyMember
        {
            UserId = requestingUser.Id,
            CompanyId = newCompany.Id,
            Role = UserRoleEnum.CompanyAdmin
        };
        await repository.AddAsync(newMember, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateCompany(CompanyUpdateRecord company, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new CompanySpec(company.Id), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(CommonErrors.CompanyNotFound);
        }

        var userCompany = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (requestingUser.Role != UserRoleEnum.Admin && (userCompany == null || userCompany.Id != company.Id))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the company owner or admin can update the company!", ErrorCodes.CannotUpdate));
        }

        entity.Name = company.Name ?? entity.Name;
        entity.Description = company.Description ?? entity.Description;

        await repository.UpdateAsync(entity, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteCompany(Guid id, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new CompanySpec(id), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(CommonErrors.CompanyNotFound);
        }

        var userCompany = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (requestingUser.Role != UserRoleEnum.Admin && (userCompany == null || userCompany.Id != id))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the company owner or admin can delete the company!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Company>(id, cancellationToken);

        return ServiceResponse.ForSuccess();
    }
}
