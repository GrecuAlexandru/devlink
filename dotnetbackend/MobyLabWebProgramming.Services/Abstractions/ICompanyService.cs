using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface ICompanyService
{
    public Task<ServiceResponse<CompanyRecord>> GetCompany(Guid id, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<CompanyRecord?>> GetCompanyByUser(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> AddCompany(CompanyAddRecord company, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> UpdateCompany(CompanyUpdateRecord company, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> DeleteCompany(Guid id, UserRecord requestingUser, CancellationToken cancellationToken = default);
}
