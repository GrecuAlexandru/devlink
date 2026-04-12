using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class FeedbackRecord
{
    public Guid Id { get; set; }
    public FeedbackQualityEnum Quality { get; set; }
    public bool WouldRecommend { get; set; }
    public bool AllowContact { get; set; }
    public string Message { get; set; } = null!;
    public Guid UserId { get; set; }
    public UserRecord? User { get; set; }
    public DateTime CreatedAt { get; set; }
}
