namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record UserProfileUpdateRecord(Guid Id, string? ProfilePictureUrl = null, string? LinkedInUrl = null, string? GitHubUrl = null);
