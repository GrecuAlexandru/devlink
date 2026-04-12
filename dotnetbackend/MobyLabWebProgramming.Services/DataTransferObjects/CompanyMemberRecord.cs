namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class CompanyMemberRecord
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UserRecord? User { get; set; }
    public Guid CompanyId { get; set; }
    public string Role { get; set; } = null!;
}
