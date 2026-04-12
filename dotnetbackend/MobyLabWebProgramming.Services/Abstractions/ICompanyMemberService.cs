using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface ICompanyMemberService
{
    public Task<ServiceResponse<List<CompanyMemberRecord>>> GetCompanyMembers(Guid companyId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<CompanyMemberRecord>>> GetCompanyMembersByUser(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> AddMember(Guid userId, UserRoleEnum role, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> RemoveMember(Guid userId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> UpdateMemberRole(Guid userId, UserRoleEnum role, UserRecord requestingUser, CancellationToken cancellationToken = default);
}
