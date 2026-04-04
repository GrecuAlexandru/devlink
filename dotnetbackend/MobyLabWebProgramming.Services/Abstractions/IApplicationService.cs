using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IApplicationService
{
    public Task<ServiceResponse> Apply(ApplicationAddRecord application, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<ApplicationRecord>>> GetMyApplications(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<ApplicationRecord>>> GetJobApplications(Guid jobPostId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> UpdateStatus(Guid id, ApplicationStatusEnum status, UserRecord requestingUser, CancellationToken cancellationToken = default);
}
