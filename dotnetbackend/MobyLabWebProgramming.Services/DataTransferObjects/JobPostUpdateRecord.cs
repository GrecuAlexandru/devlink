namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record JobPostUpdateRecord(
    Guid Id,
    string? Title = null,
    string? Description = null,
    string? Location = null,
    string? SalaryRange = null,
    string? Level = null,
    string? Type = null,
    bool? IsRecruiterPosition = null);
