namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class PostRecord
{
    public Guid Id { get; set; }
    public string Content { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public UserRecord? Author { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
}
