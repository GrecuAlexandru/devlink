namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class JobPostRecord
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public int? Salary { get; set; }
    public bool IsRecruiterPosition { get; set; }
    public CompanyRecord? Company { get; set; }
    public Guid CompanyId { get; set; }
}
