namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record JobPostUpdateRecord(
    Guid Id,
    string? Title = null,
    string? Description = null,
    string? Location = null,
    int? Salary = null,
    bool? IsRecruiterPosition = null);
