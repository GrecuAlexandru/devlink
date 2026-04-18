namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class CompanyRecord
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}
