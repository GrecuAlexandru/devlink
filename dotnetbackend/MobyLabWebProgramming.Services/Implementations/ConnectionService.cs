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

public class ConnectionService(IRepository<WebAppDatabaseContext> repository) : IConnectionService
{
    public async Task<ServiceResponse> SendRequest(Guid receiverId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (receiverId == requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "You cannot connect with yourself!", ErrorCodes.CannotAdd));
        }

        var existing = await repository.GetAsync(new ConnectionBetweenUsersSpec(requestingUser.Id, receiverId), cancellationToken);
        if (existing != null)
        {
            if (existing.Status == ConnectionStatusEnum.Accepted)
                return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "You are already connected!", ErrorCodes.CannotAdd));
            if (existing.Status == ConnectionStatusEnum.Pending)
                return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "A connection request already exists!", ErrorCodes.CannotAdd));
            if (existing.Status == ConnectionStatusEnum.Rejected)
            {
                existing.Status = ConnectionStatusEnum.Pending;
                existing.RequesterId = requestingUser.Id;
                existing.ReceiverId = receiverId;
                await repository.UpdateAsync(existing, cancellationToken);
                return ServiceResponse.ForSuccess();
            }
        }

        var receiver = await repository.GetAsync<User>(receiverId, cancellationToken);
        if (receiver == null)
        {
            return ServiceResponse.FromError(CommonErrors.UserNotFound);
        }

        var connection = new Connection
        {
            RequesterId = requestingUser.Id,
            ReceiverId = receiverId,
            Status = ConnectionStatusEnum.Pending
        };

        await repository.AddAsync(connection, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> AcceptRequest(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var connection = await repository.GetAsync(new ConnectionSpec(connectionId), cancellationToken);
        if (connection == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Connection request not found!", ErrorCodes.EntityNotFound));
        }

        if (connection.ReceiverId != requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the receiver can accept a request!", ErrorCodes.CannotUpdate));
        }

        if (connection.Status != ConnectionStatusEnum.Pending)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "This request is no longer pending!", ErrorCodes.CannotUpdate));
        }

        connection.Status = ConnectionStatusEnum.Accepted;
        await repository.UpdateAsync(connection, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> RejectRequest(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var connection = await repository.GetAsync(new ConnectionSpec(connectionId), cancellationToken);
        if (connection == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Connection request not found!", ErrorCodes.EntityNotFound));
        }

        if (connection.ReceiverId != requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the receiver can reject a request!", ErrorCodes.CannotUpdate));
        }

        if (connection.Status != ConnectionStatusEnum.Pending)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "This request is no longer pending!", ErrorCodes.CannotUpdate));
        }

        connection.Status = ConnectionStatusEnum.Rejected;
        await repository.UpdateAsync(connection, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> RemoveConnection(Guid connectionId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var connection = await repository.GetAsync(new ConnectionSpec(connectionId), cancellationToken);
        if (connection == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Connection not found!", ErrorCodes.EntityNotFound));
        }

        if (connection.RequesterId != requestingUser.Id && connection.ReceiverId != requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You are not part of this connection!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Connection>(connectionId, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<ConnectionRecord>>> GetMyConnections(Guid userId, CancellationToken cancellationToken = default)
    {
        var connections = await repository.ListNoTrackingAsync(new ConnectionsByUserAcceptedSpec(userId), cancellationToken);
        return ServiceResponse.ForSuccess(connections.Select(MapToRecord).ToList());
    }

    public async Task<ServiceResponse<List<ConnectionRecord>>> GetPendingRequests(Guid userId, CancellationToken cancellationToken = default)
    {
        var connections = await repository.ListNoTrackingAsync(new PendingRequestsForUserSpec(userId), cancellationToken);
        return ServiceResponse.ForSuccess(connections.Select(MapToRecord).ToList());
    }

    public async Task<ServiceResponse<List<ConnectionRecord>>> GetSentRequests(Guid userId, CancellationToken cancellationToken = default)
    {
        var connections = await repository.ListNoTrackingAsync(new SentRequestsByUserSpec(userId), cancellationToken);
        return ServiceResponse.ForSuccess(connections.Select(MapToRecord).ToList());
    }

    public async Task<ServiceResponse<ConnectionRecord?>> GetConnectionStatus(Guid userId, Guid otherUserId, CancellationToken cancellationToken = default)
    {
        var connection = await repository.GetAsync(new ConnectionBetweenUsersSpec(userId, otherUserId), cancellationToken);
        return ServiceResponse.ForSuccess<ConnectionRecord?>(connection != null ? MapToRecord(connection) : null);
    }

    private static ConnectionRecord MapToRecord(Connection c) => new()
    {
        Id = c.Id,
        RequesterId = c.RequesterId,
        ReceiverId = c.ReceiverId,
        Status = c.Status,
        CreatedAt = c.CreatedAt,
        Requester = c.Requester != null ? new UserRecord { Id = c.Requester.Id, Name = c.Requester.Name, Email = c.Requester.Email, Role = c.Requester.Role } : null,
        Receiver = c.Receiver != null ? new UserRecord { Id = c.Receiver.Id, Name = c.Receiver.Name, Email = c.Receiver.Email, Role = c.Receiver.Role } : null,
    };
}
