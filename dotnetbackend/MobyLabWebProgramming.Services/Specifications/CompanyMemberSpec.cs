using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class CompanyMemberByCompanySpec : Specification<CompanyMember>
{
    public CompanyMemberByCompanySpec(Guid companyId) => Query.Where(e => e.CompanyId == companyId).Include(e => e.User);
}

public sealed class CompanyMemberByUserSpec : Specification<CompanyMember>
{
    public CompanyMemberByUserSpec(Guid userId, Guid companyId) => Query.Where(e => e.UserId == userId && e.CompanyId == companyId);
}

public sealed class CompanyMemberByUserAnyCompanySpec : Specification<CompanyMember>
{
    public CompanyMemberByUserAnyCompanySpec(Guid userId) => Query.Where(e => e.UserId == userId);
}

public sealed class CompanyAdminByCompanySpec : Specification<CompanyMember>
{
    public CompanyAdminByCompanySpec(Guid companyId) => Query.Where(e => e.CompanyId == companyId && e.Role == UserRoleEnum.CompanyAdmin).Include(e => e.User);
}
