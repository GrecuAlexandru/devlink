namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class JobPostAddRecord
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? Level { get; set; }
    public string? Type { get; set; }
    public bool IsRecruiterPosition { get; set; }
    public Guid CompanyId { get; set; }
}
