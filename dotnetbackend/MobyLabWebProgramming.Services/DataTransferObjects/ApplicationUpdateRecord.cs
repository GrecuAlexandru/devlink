using MobyLabWebProgramming.Database.Repository.Enums;

namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record ApplicationUpdateRecord(
    Guid Id,
    ApplicationStatusEnum? Status = null,
    string? CoverLetter = null,
    decimal? ExpectedSalary = null);
