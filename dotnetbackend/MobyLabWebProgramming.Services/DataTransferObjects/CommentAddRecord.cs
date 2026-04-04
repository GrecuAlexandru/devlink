namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class CommentAddRecord
{
    public string Content { get; set; } = null!;
    public Guid PostId { get; set; }
}
