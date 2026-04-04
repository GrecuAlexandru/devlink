namespace MobyLabWebProgramming.Services.DataTransferObjects;

public record CompanyUpdateRecord(Guid Id, string? Name = null, string? Industry = null, string? Website = null, string? Description = null);
