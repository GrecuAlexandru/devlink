using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class ConnectionRecord
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }
    public Guid ReceiverId { get; set; }
    public ConnectionStatusEnum Status { get; set; }
    public UserRecord? Requester { get; set; }
    public UserRecord? Receiver { get; set; }
    public DateTime CreatedAt { get; set; }
}
