using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class FeedbackListSpec : Specification<Feedback>
{
    public FeedbackListSpec() => Query
        .Include(e => e.User)
        .OrderByDescending(e => e.CreatedAt);
}
