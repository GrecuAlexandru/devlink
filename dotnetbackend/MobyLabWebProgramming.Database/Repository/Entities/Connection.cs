using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Connection : BaseEntity
{
    public Guid RequesterId { get; set; }
    public User Requester { get; set; } = null!;

    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;

    public ConnectionStatusEnum Status { get; set; } = ConnectionStatusEnum.Pending;
}
