using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class CompanyProjectionSpec : Specification<Company, CompanyRecord>
{
    public CompanyProjectionSpec(Guid id) => Query.Where(e => e.Id == id);

    public CompanyProjectionSpec() { }
}
