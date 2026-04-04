using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class ApplicationAddRecord
{
    public string? CoverLetter { get; set; }
    public decimal? ExpectedSalary { get; set; }
    public Guid JobPostId { get; set; }
}
