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
            Salary = result.Salary,
            IsRecruiterPosition = result.IsRecruiterPosition,
            CompanyId = result.CompanyId
        });
    }

    public async Task<ServiceResponse<List<JobPostRecord>>> GetAllJobs(CancellationToken cancellationToken = default)
    {
        var jobs = await repository.ListAsync(new JobPostWithCompanySpecAll(), cancellationToken);

        return ServiceResponse.ForSuccess(jobs.Select(j => new JobPostRecord
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Location = j.Location,
            Salary = j.Salary,
            IsRecruiterPosition = j.IsRecruiterPosition,
            CompanyId = j.CompanyId,
            Company = j.Company == null
                ? null
                : new CompanyRecord
                {
                    Id = j.Company.Id,
                    Name = j.Company.Name,
                    Description = j.Company.Description
                }
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
            Salary = j.Salary,
            IsRecruiterPosition = j.IsRecruiterPosition,
            CompanyId = j.CompanyId
        }).ToList());
    }

    public async Task<ServiceResponse<List<JobPostRecord>>> GetCompanyJobsByUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var company = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);
        if (company != null)
        {
            return await GetCompanyJobs(company.Id, cancellationToken);
        }

        var member = await repository.GetAsync(new CompanyMemberByUserAnyCompanySpec(userId), cancellationToken);
        if (member != null)
        {
            return await GetCompanyJobs(member.CompanyId, cancellationToken);
        }

        return ServiceResponse.ForSuccess(new List<JobPostRecord>());
    }

    private bool IsCompanyMember(UserRoleEnum role) => role == UserRoleEnum.CompanyAdmin || role == UserRoleEnum.Recruiter;

    private async Task<Guid?> GetCompanyIdForUser(Guid userId, CancellationToken cancellationToken)
    {
        var company = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);
        if (company != null) return company.Id;

        var member = await repository.GetAsync(new CompanyMemberByUserAnyCompanySpec(userId), cancellationToken);
        if (member != null) return member.CompanyId;

        return null;
    }

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

        var companyId = await GetCompanyIdForUser(requestingUser.Id, cancellationToken);
        if (companyId == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Company not found!", ErrorCodes.EntityNotFound));
        }

        var newJob = new JobPost
        {
            Title = jobPost.Title,
            Description = jobPost.Description,
            Location = jobPost.Location,
            Salary = jobPost.Salary,
            IsRecruiterPosition = jobPost.IsRecruiterPosition,
            CompanyId = companyId.Value
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

        var companyId = await GetCompanyIdForUser(requestingUser.Id, cancellationToken);
        if (companyId == null || entity.CompanyId != companyId.Value)
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
        entity.Salary = jobPost.Salary ?? entity.Salary;
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

        var companyId = await GetCompanyIdForUser(requestingUser.Id, cancellationToken);
        if (companyId == null || entity.CompanyId != companyId.Value)
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
