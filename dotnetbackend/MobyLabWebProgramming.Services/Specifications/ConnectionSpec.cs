using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class ConnectionSpec : Specification<Connection>
{
    public ConnectionSpec(Guid id) => Query.Where(e => e.Id == id).Include(e => e.Requester).Include(e => e.Receiver);
}

public sealed class ConnectionBetweenUsersSpec : Specification<Connection>
{
    public ConnectionBetweenUsersSpec(Guid userId1, Guid userId2) => Query
        .Where(e => (e.RequesterId == userId1 && e.ReceiverId == userId2) ||
                    (e.RequesterId == userId2 && e.ReceiverId == userId1))
        .Include(e => e.Requester)
        .Include(e => e.Receiver);
}

public sealed class ConnectionsByUserAcceptedSpec : Specification<Connection>
{
    public ConnectionsByUserAcceptedSpec(Guid userId) => Query
        .Where(e => (e.RequesterId == userId || e.ReceiverId == userId) && e.Status == ConnectionStatusEnum.Accepted)
        .Include(e => e.Requester)
        .Include(e => e.Receiver)
        .OrderByDescending(e => e.UpdatedAt);
}

public sealed class PendingRequestsForUserSpec : Specification<Connection>
{
    public PendingRequestsForUserSpec(Guid userId) => Query
        .Where(e => e.ReceiverId == userId && e.Status == ConnectionStatusEnum.Pending)
        .Include(e => e.Requester)
        .Include(e => e.Receiver)
        .OrderByDescending(e => e.CreatedAt);
}

public sealed class SentRequestsByUserSpec : Specification<Connection>
{
    public SentRequestsByUserSpec(Guid userId) => Query
        .Where(e => e.RequesterId == userId && e.Status == ConnectionStatusEnum.Pending)
        .Include(e => e.Requester)
        .Include(e => e.Receiver)
        .OrderByDescending(e => e.CreatedAt);
}
