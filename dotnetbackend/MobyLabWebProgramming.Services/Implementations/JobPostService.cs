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

public class JobPostService(IRepository<WebAppDatabaseContext> repository) : IJobPostService
{
    public async Task<ServiceResponse<JobPostRecord>> GetJobPost(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new JobPostSpec(id), cancellationToken);

        if (result == null)
        {
            return ServiceResponse.FromError<JobPostRecord>(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        return ServiceResponse.ForSuccess(new JobPostRecord
        {
            Id = result.Id,
            Title = result.Title,
            Description = result.Description,
            Location = result.Location,
            SalaryRange = result.SalaryRange,
            Level = result.Level,
            Type = result.Type,
            IsRecruiterPosition = result.IsRecruiterPosition,
            CompanyId = result.CompanyId
        });
    }

    public async Task<ServiceResponse<List<JobPostRecord>>> GetAllJobs(CancellationToken cancellationToken = default)
    {
        var jobs = await repository.ListAsync(new AllJobPostsSpec(), cancellationToken);

        return ServiceResponse.ForSuccess(jobs.Select(j => new JobPostRecord
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Location = j.Location,
            SalaryRange = j.SalaryRange,
            Level = j.Level,
            Type = j.Type,
            IsRecruiterPosition = j.IsRecruiterPosition,
            CompanyId = j.CompanyId
        }).ToList());
    }

    public async Task<ServiceResponse<List<JobPostRecord>>> GetCompanyJobs(Guid companyId, CancellationToken cancellationToken = default)
    {
        var jobs = await repository.ListAsync(new JobPostByCompanySpec(companyId), cancellationToken);

        return ServiceResponse.ForSuccess(jobs.Select(j => new JobPostRecord
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Location = j.Location,
            SalaryRange = j.SalaryRange,
            Level = j.Level,
            Type = j.Type,
            IsRecruiterPosition = j.IsRecruiterPosition,
            CompanyId = j.CompanyId
        }).ToList());
    }

    public async Task<ServiceResponse<List<JobPostRecord>>> GetCompanyJobsByUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var company = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.ForSuccess(new List<JobPostRecord>());
        }

        return await GetCompanyJobs(company.Id, cancellationToken);
    }

    private bool IsCompanyMember(UserRoleEnum role) => role == UserRoleEnum.CompanyAdmin || role == UserRoleEnum.Recruiter;

    public async Task<ServiceResponse> AddJobPost(JobPostAddRecord jobPost, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (!IsCompanyMember(requestingUser.Role))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company members can create job posts!", ErrorCodes.CannotAdd));
        }

        if (jobPost.IsRecruiterPosition && requestingUser.Role != UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company admins can create recruiter positions!", ErrorCodes.CannotAdd));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Company not found!", ErrorCodes.EntityNotFound));
        }

        var newJob = new JobPost
        {
            Title = jobPost.Title,
            Description = jobPost.Description,
            Location = jobPost.Location,
            SalaryRange = jobPost.SalaryRange,
            Level = jobPost.Level,
            Type = jobPost.Type,
            IsRecruiterPosition = jobPost.IsRecruiterPosition,
            CompanyId = company.Id
        };

        await repository.AddAsync(newJob, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateJobPost(JobPostUpdateRecord jobPost, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new JobPostSpec(jobPost.Id), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null || entity.CompanyId != company.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only update your own company's job posts!", ErrorCodes.CannotUpdate));
        }

        if (!IsCompanyMember(requestingUser.Role))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company members can update job posts!", ErrorCodes.CannotUpdate));
        }

        entity.Title = jobPost.Title ?? entity.Title;
        entity.Description = jobPost.Description ?? entity.Description;
        entity.Location = jobPost.Location ?? entity.Location;
        entity.SalaryRange = jobPost.SalaryRange ?? entity.SalaryRange;
        entity.Level = jobPost.Level ?? entity.Level;
        entity.Type = jobPost.Type ?? entity.Type;
        entity.IsRecruiterPosition = jobPost.IsRecruiterPosition ?? entity.IsRecruiterPosition;

        await repository.UpdateAsync(entity, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteJobPost(Guid id, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var entity = await repository.GetAsync(new JobPostSpec(id), cancellationToken);

        if (entity == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null || entity.CompanyId != company.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only delete your own company's job posts!", ErrorCodes.CannotDelete));
        }

        if (!IsCompanyMember(requestingUser.Role))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only company members can delete job posts!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<JobPost>(id, cancellationToken);

        return ServiceResponse.ForSuccess();
    }
}
