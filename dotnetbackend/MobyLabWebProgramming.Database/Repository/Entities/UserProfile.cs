using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class UserProfile : BaseEntity
{
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    
    public Guid UserId {  get; set; }
    public User User { get; set; } = null!;
}