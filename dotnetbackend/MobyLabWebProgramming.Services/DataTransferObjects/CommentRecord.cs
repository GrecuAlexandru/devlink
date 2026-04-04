namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class CommentRecord
{
    public Guid Id { get; set; }
    public string Content { get; set; } = null!;
    public Guid PostId { get; set; }
    public Guid AuthorId { get; set; }
    public UserRecord? Author { get; set; }
}
