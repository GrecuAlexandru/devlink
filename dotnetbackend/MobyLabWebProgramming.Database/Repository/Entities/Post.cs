using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Post : BaseEntity
{
    public string Content { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = null!;
    public ICollection<PostLike> Likes { get; set; } = null!;
    public ICollection<PostImage> Images { get; set; } = null!;
}