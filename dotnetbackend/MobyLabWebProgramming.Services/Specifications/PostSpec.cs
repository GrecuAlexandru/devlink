using Ardalis.Specification;
using MobyLabWebProgramming.Database.Repository.Entities;

namespace MobyLabWebProgramming.Services.Specifications;

public sealed class PostSpec : Specification<Post>
{
    public PostSpec(Guid id) => Query.Where(e => e.Id == id)
        .Include(e => e.Author)
        .Include(e => e.Images)
        .Include(e => e.Likes)
        .Include(e => e.Comments).ThenInclude(c => c.Author);
}

public sealed class PostsByAuthorIdsSpec : Specification<Post>
{
    public PostsByAuthorIdsSpec(List<Guid> authorIds) => Query
        .Where(e => authorIds.Contains(e.AuthorId))
        .Include(e => e.Author)
        .Include(e => e.Images)
        .Include(e => e.Likes)
        .Include(e => e.Comments).ThenInclude(c => c.Author)
        .OrderByDescending(e => e.CreatedAt);
}

public sealed class PostLikeSpec : Specification<PostLike>
{
    public PostLikeSpec(Guid postId, Guid userId) => Query.Where(e => e.PostId == postId && e.UserId == userId);
}

public sealed class CommentSpec : Specification<Comment>
{
    public CommentSpec(Guid id) => Query.Where(e => e.Id == id);
}

public sealed class CommentsByPostSpec : Specification<Comment>
{
    public CommentsByPostSpec(Guid postId) => Query
        .Where(e => e.PostId == postId)
        .Include(e => e.Author)
        .OrderBy(e => e.CreatedAt);
}
