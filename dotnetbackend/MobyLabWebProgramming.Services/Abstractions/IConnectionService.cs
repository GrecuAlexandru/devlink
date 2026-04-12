using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IConnectionService
{
    Task<ServiceResponse> SendRequest(Guid receiverId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> AcceptRequest(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> RejectRequest(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> RemoveConnection(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<ConnectionRecord>>> GetMyConnections(Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<ConnectionRecord>>> GetPendingRequests(Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<ConnectionRecord>>> GetSentRequests(Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<ConnectionRecord?>> GetConnectionStatus(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default);
}
