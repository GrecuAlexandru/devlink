using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class CompanySpec : Specification<Company>
{
    public CompanySpec(Guid id) => Query.Where(e => e.Id == id);
}

public sealed class CompanyByUserSpec : Specification<Company>
{
    public CompanyByUserSpec(Guid userId) => Query.Where(e => e.Users.Any(u => u.Id == userId)).Include(e => e.Users);
}

public sealed class CompanyWithUsersSpec : Specification<Company>
{
    public CompanyWithUsersSpec(Guid id) => Query.Where(e => e.Id == id).Include(e => e.Users);
}
