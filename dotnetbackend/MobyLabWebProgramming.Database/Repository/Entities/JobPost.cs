using MobyLabWebProgramming.Infrastructure.BaseObjects;

namespace MobyLabWebProgramming.Database.Repository.Entities;

public class JobPost : BaseEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? Level { get; set; }
    public string? Type { get; set; }
    
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;

    public ICollection<Application> Applications { get; set; } = null!;
}