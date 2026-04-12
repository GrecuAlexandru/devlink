using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class PostImage : BaseEntity
{
    public Guid PostId { get; set; }
    public Post Post { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
    public int SortOrder { get; set; }
}
