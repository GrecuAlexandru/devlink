namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class PostRecord
{
    public Guid Id { get; set; }
    public string Content { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public UserRecord? Author { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public bool IsLikedByMe { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public List<CommentRecord> Comments { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}
