using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class Feedback : BaseEntity
{
    public FeedbackQualityEnum Quality { get; set; }
    public bool WouldRecommend { get; set; }
    public bool AllowContact { get; set; }
    public string Message { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
