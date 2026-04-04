using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Comment : BaseEntity
{
    public string Content { get; set; } = null!;
    
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;
}