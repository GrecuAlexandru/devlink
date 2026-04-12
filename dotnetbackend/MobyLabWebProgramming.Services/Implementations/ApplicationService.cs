using System.Net;
using Microsoft.Extensions.Logging;
using MobyLabWebProgramming.Database.Repository;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.Constants;
using MobyLabWebProgramming.Services.DataTransferObjects;
using MobyLabWebProgramming.Services.Specifications;

namespace MobyLabWebProgramming.Services.Implementations;

public class ApplicationService(IRepository<WebAppDatabaseContext> repository, IMailService mailService, ILogger<ApplicationService> logger) : IApplicationService
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
            User = a.User == null
                ? null
                : new UserRecord
                {
                    Id = a.User.Id,
                    Name = a.User.Name,
                    Email = a.User.Email,
                    Role = a.User.Role
                },
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

        var companyId = await GetCompanyIdForUser(requestingUser.Id, cancellationToken);
        if (companyId == null || jobPost.CompanyId != companyId.Value)
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

    private async Task<Guid?> GetCompanyIdForUser(Guid userId, CancellationToken cancellationToken)
    {
        var company = await repository.GetAsync(new CompanyByUserSpec(userId), cancellationToken);
        if (company != null) return company.Id;

        var member = await repository.GetAsync(new CompanyMemberByUserAnyCompanySpec(userId), cancellationToken);
        if (member != null) return member.CompanyId;

        return null;
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

        var companyId = await GetCompanyIdForUser(requestingUser.Id, cancellationToken);
        if (companyId == null || jobPost.CompanyId != companyId.Value)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You can only update applications for your own company's jobs!", ErrorCodes.CannotUpdate));
        }

        if (application.UserId == requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You cannot modify your own application state!", ErrorCodes.CannotUpdate));
        }

        if (application.Status != ApplicationStatusEnum.Pending && status == ApplicationStatusEnum.Pending)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "You cannot change the state back to Pending!", ErrorCodes.CannotUpdate));
        }

        if (application.Status == ApplicationStatusEnum.Accepted || application.Status == ApplicationStatusEnum.Rejected)
        {
             return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You cannot change the state of an application that has already been accepted or rejected!", ErrorCodes.CannotUpdate));
        }

        application.Status = status;
        await repository.UpdateAsync(application, cancellationToken);

        var user = await repository.GetAsync(new UserSpec(application.UserId), cancellationToken);
        if (user != null)
        {
            var statusText = status switch
            {
                ApplicationStatusEnum.Accepted => "accepted",
                ApplicationStatusEnum.Rejected => "rejected",
                ApplicationStatusEnum.Pending => "pending",
                _ => "updated"
            };
            
            var jobTitle = jobPost.Title;
            var applicantMailResponse = await mailService.SendMail(
                user.Email,
                $"Your application for {jobTitle} has been {statusText}",
                MailTemplates.ApplicationStatusTemplate(user.Name, jobTitle, statusText),
                true,
                "DevLink",
                cancellationToken);

            if (!applicantMailResponse.IsOk)
            {
                logger.LogWarning("Failed to send application status email for application {ApplicationId} to user {UserId}.", application.Id, user.Id);
            }
        }

        if (status == ApplicationStatusEnum.Accepted)
        {
            if (user != null)
            {
                var existingMember = await repository.GetAsync(new CompanyMemberByUserSpec(application.UserId, companyId.Value), cancellationToken);
                if (existingMember == null)
                {
                    var role = jobPost.IsRecruiterPosition ? UserRoleEnum.Recruiter : UserRoleEnum.Client;
                    user.Role = role;
                    await repository.UpdateAsync(user, cancellationToken);

                    var newMember = new CompanyMember
                    {
                        UserId = application.UserId,
                        CompanyId = companyId.Value,
                        Role = role
                    };
                    await repository.AddAsync(newMember, cancellationToken);
                }
            }
        }

        return ServiceResponse.ForSuccess();
    }
}
