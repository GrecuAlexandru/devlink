using Microsoft.AspNetCore.Http;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IPostService
{
    Task<ServiceResponse> CreatePost(string content, List<IFormFile>? images, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdatePost(PostUpdateRecord post, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeletePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<PostRecord>>> GetFeed(Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> LikePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UnlikePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> AddComment(Guid postId, string content, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteComment(Guid commentId, UserRecord requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<CommentRecord>>> GetPostComments(Guid postId, CancellationToken cancellationToken = default);
}
