using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<JobPost> JobPosts { get; set; } = null!;

    // Company owner
    public ICollection<User> Users { get; set; } = null!;
}