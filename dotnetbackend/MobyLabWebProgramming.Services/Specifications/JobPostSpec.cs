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
    public JobPostProjectionSpec(Guid id) => Query.Where(e => e.Id == id);
    public JobPostProjectionSpec() { }
}
