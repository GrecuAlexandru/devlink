using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Company : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }

    public ICollection<JobPost> JobPosts { get; set; } = null!;
}