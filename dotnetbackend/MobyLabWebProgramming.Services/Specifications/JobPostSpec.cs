using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class JobPostSpec : Specification<JobPost>
{
    public JobPostSpec(Guid id) => Query.Where(e => e.Id == id);
}

public sealed class JobPostByCompanySpec : Specification<JobPost>
{
    public JobPostByCompanySpec(Guid companyId) => Query.Where(e => e.CompanyId == companyId).OrderByDescending(e => e.CreatedAt);
}

public sealed class JobPostProjectionSpec : Specification<JobPost, JobPostRecord>
{
    public JobPostProjectionSpec() => Query.Select(e => new JobPostRecord
    {
        Id = e.Id,
        Title = e.Title,
        Description = e.Description,
        Location = e.Location,
        SalaryRange = e.SalaryRange,
        Level = e.Level,
        Type = e.Type,
        IsRecruiterPosition = e.IsRecruiterPosition,
        CompanyId = e.CompanyId,
        Company = e.Company == null
            ? null
            : new CompanyRecord
            {
                Id = e.Company.Id,
                Name = e.Company.Name,
                Industry = e.Company.Industry,
                Website = e.Company.Website,
                Description = e.Company.Description
            }
    });

    public JobPostProjectionSpec(Guid id) : this() => Query.Where(e => e.Id == id);
}
