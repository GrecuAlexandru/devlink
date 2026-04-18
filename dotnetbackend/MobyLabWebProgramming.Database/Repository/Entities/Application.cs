using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Application : BaseEntity
{
    public ApplicationStatusEnum Status { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid JobPostId { get; set; }
    public JobPost JobPost { get; set; } = null!;
}