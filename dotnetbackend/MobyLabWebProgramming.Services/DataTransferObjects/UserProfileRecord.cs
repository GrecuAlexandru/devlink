namespace MobyLabWebProgramming.Services.DataTransferObjects;

public class UserProfileRecord
{
    public Guid Id { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public Guid UserId { get; set; }
}
