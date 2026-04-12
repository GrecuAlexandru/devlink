using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record FeedbackAddRecord(FeedbackQualityEnum Quality, bool WouldRecommend, bool AllowContact, string Message);
