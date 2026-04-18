using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class CompanyProjectionSpec : Specification<Company, CompanyRecord>
{
    public CompanyProjectionSpec() => Query.Select(e => new CompanyRecord
    {
        Id = e.Id,
        Name = e.Name,
        Description = e.Description
    });

    public CompanyProjectionSpec(Guid id) : this() => Query.Where(e => e.Id == id);

}
