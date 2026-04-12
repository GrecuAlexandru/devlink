using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IFeedbackService
{
    Task<ServiceResponse> AddFeedback(FeedbackAddRecord feedback, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<FeedbackRecord>>> GetFeedback(UserRecord requestingUser, CancellationToken cancellationToken = default);
}
