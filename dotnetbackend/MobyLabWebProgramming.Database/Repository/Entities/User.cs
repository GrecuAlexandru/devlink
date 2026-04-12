using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public UserRoleEnum Role { get; set; }

    public UserProfile? Profile { get; set; }

    // For feed
    public ICollection<Post> Posts { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = null!;
    public ICollection<PostLike> PostLikes { get; set; } = null!;

    // For jobs
    public ICollection<Application> Applications { get; set; } = null!;

    // For company owners
    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }

    // For connections
    public ICollection<Connection> SentConnections { get; set; } = null!;
    public ICollection<Connection> ReceivedConnections { get; set; } = null!;
}