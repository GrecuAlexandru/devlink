using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class UserProfileSpec : Specification<UserProfile>
{
    public UserProfileSpec(Guid userId) => Query.Where(e => e.UserId == userId);
}
