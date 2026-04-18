using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class ApplicationRecord
{
    public Guid Id { get; set; }
    public ApplicationStatusEnum Status { get; set; }
    public Guid UserId { get; set; }
    public UserRecord? User { get; set; }
    public Guid JobPostId { get; set; }
    public JobPostRecord? JobPost { get; set; }
}
