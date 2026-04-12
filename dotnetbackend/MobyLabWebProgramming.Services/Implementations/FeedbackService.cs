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

public class FeedbackService(IRepository<WebAppDatabaseContext> repository) : IFeedbackService
{
    public async Task<ServiceResponse> AddFeedback(FeedbackAddRecord feedback, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role == UserRoleEnum.Admin)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Admins cannot submit feedback.", ErrorCodes.CannotAdd));
        }

        if (string.IsNullOrWhiteSpace(feedback.Message))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Feedback message cannot be empty!", ErrorCodes.CannotAdd));
        }

        var entity = new Feedback
        {
            Quality = feedback.Quality,
            WouldRecommend = feedback.WouldRecommend,
            AllowContact = feedback.AllowContact,
            Message = feedback.Message.Trim(),
            UserId = requestingUser.Id
        };

        await repository.AddAsync(entity, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<FeedbackRecord>>> GetFeedback(UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser.Role != UserRoleEnum.Admin)
        {
            return ServiceResponse.FromError<List<FeedbackRecord>>(new(HttpStatusCode.Forbidden, "Only admins can view feedback.", ErrorCodes.CannotUpdate));
        }

        var feedback = await repository.ListNoTrackingAsync(new FeedbackListSpec(), cancellationToken);

        var result = feedback.Select(f => new FeedbackRecord
        {
            Id = f.Id,
            Quality = f.Quality,
            WouldRecommend = f.WouldRecommend,
            AllowContact = f.AllowContact,
            Message = f.Message,
            UserId = f.UserId,
            CreatedAt = f.CreatedAt,
            User = f.User == null
                ? null
                : new UserRecord
                {
                    Id = f.User.Id,
                    Name = f.User.Name,
                    Email = f.User.Email,
                    Role = f.User.Role
                }
        }).ToList();

        return ServiceResponse.ForSuccess(result);
    }
}
