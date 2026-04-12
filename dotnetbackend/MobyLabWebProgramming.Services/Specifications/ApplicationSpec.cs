using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class ApplicationSpec : Specification<Application>
{
    public ApplicationSpec(Guid id) => Query.Where(e => e.Id == id);
}

public sealed class ApplicationByUserSpec : Specification<Application>
{
    public ApplicationByUserSpec(Guid userId) => Query.Where(e => e.UserId == userId).OrderByDescending(e => e.CreatedAt);
}

public sealed class ApplicationByJobSpec : Specification<Application>
{
    public ApplicationByJobSpec(Guid jobPostId) => Query.Where(e => e.JobPostId == jobPostId).OrderByDescending(e => e.CreatedAt);
}

public sealed class AllJobPostsSpec : Specification<JobPost>
{
    public AllJobPostsSpec() => Query.OrderByDescending(e => e.CreatedAt);
}

public sealed class JobPostWithCompanySpec : Specification<JobPost>
{
    public JobPostWithCompanySpec(Guid id) => Query.Where(e => e.Id == id).Include(e => e.Company).ThenInclude(c => c!.Users);
}

public sealed class JobPostWithCompanySpecAll : Specification<JobPost>
{
    public JobPostWithCompanySpecAll() => Query.OrderByDescending(e => e.CreatedAt).Include(e => e.Company);
}

public sealed class ApplicationProjectionSpec : Specification<Application, ApplicationRecord>
{
    public ApplicationProjectionSpec(Guid id) => Query.Where(e => e.Id == id);
    public ApplicationProjectionSpec() { }
}
