namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class CompanyAddRecord
{
    public string Name { get; set; } = null!;
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
}
