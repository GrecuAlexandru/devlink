namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record CompanyUpdateRecord(Guid Id, string? Name = null, string? Description = null);
