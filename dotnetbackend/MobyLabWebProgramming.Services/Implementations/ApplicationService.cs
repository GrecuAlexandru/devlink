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

public class ApplicationService(IRepository<WebAppDatabaseContext> repository) : IApplicationService
{
    public async Task<ServiceResponse> Apply(ApplicationAddRecord application, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role == UserRoleEnum.CompanyAdmin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Company admins cannot apply to jobs!", ErrorCodes.CannotAdd));
        }

        var jobPost = await repository.GetAsync(new JobPostSpec(application.JobPostId), cancellationToken);
        if (jobPost == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        var existingApplications = await repository.ListAsync(new ApplicationByUserSpec(requestingUser.Id), cancellationToken);
        if (existingApplications.Any(a => a.JobPostId == application.JobPostId))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "You have already applied to this job!", ErrorCodes.CannotAdd));
        }

        var newApplication = new Application
        {
            Status = ApplicationStatusEnum.Pending,
            CoverLetter = application.CoverLetter,
            ExpectedSalary = application.ExpectedSalary,
            UserId = requestingUser.Id,
            JobPostId = application.JobPostId
        };

        await repository.AddAsync(newApplication, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<ApplicationRecord>>> GetMyApplications(Guid userId, CancellationToken cancellationToken = default)
    {
        var applications = await repository.ListAsync(new ApplicationByUserSpec(userId), cancellationToken);

        return ServiceResponse.ForSuccess(applications.Select(a => new ApplicationRecord
        {
            Id = a.Id,
            Status = a.Status,
            CoverLetter = a.CoverLetter,
            ExpectedSalary = a.ExpectedSalary,
            UserId = a.UserId,
            JobPostId = a.JobPostId
        }).ToList());
    }

    public async Task<ServiceResponse<List<ApplicationRecord>>> GetJobApplications(Guid jobPostId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var jobPost = await repository.GetAsync(new JobPostSpec(jobPostId), cancellationToken);
        if (jobPost == null)
        {
            return ServiceResponse.FromError<List<ApplicationRecord>>(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null || jobPost.CompanyId != company.Id)
        {
            return ServiceResponse.FromError<List<ApplicationRecord>>(new(HttpStatusCode.Forbidden, "You can only view applications for your own company's jobs!", ErrorCodes.CannotUpdate));
        }

        var applications = await repository.ListAsync(new ApplicationByJobSpec(jobPostId), cancellationToken);

        return ServiceResponse.ForSuccess(applications.Select(a => new ApplicationRecord
        {
            Id = a.Id,
            Status = a.Status,
            CoverLetter = a.CoverLetter,
            ExpectedSalary = a.ExpectedSalary,
            UserId = a.UserId,
            JobPostId = a.JobPostId
        }).ToList());
    }

    public async Task<ServiceResponse> UpdateStatus(Guid id, ApplicationStatusEnum status, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var application = await repository.GetAsync(new ApplicationSpec(id), cancellationToken);
        if (application == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Application not found!", ErrorCodes.EntityNotFound));
        }

        var jobPost = await repository.GetAsync(new JobPostSpec(application.JobPostId), cancellationToken);
        if (jobPost == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Job post not found!", ErrorCodes.EntityNotFound));
        }

        var company = await repository.GetAsync(new CompanyByUserSpec(requestingUser.Id), cancellationToken);
        if (company == null || jobPost.CompanyId != company.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only update applications for your own company's jobs!", ErrorCodes.CannotUpdate));
        }

        application.Status = status;
        await repository.UpdateAsync(application, cancellationToken);

        return ServiceResponse.ForSuccess();
    }
}
