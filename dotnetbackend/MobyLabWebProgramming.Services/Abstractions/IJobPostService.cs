using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IJobPostService
{
    public Task<ServiceResponse<JobPostRecord>> GetJobPost(Guid id, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<JobPostRecord>>> GetAllJobs(CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<JobPostRecord>>> GetCompanyJobs(Guid companyId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<List<JobPostRecord>>> GetCompanyJobsByUser(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> AddJobPost(JobPostAddRecord jobPost, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> UpdateJobPost(JobPostUpdateRecord jobPost, UserRecord requestingUser, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> DeleteJobPost(Guid id, UserRecord requestingUser, CancellationToken cancellationToken = default);
}
