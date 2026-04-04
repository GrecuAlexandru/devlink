namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class JobPostRecord
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? Level { get; set; }
    public string? Type { get; set; }
    public CompanyRecord? Company { get; set; }
    public Guid CompanyId { get; set; }
}
