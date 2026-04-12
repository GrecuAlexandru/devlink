using System.Net;
using Microsoft.AspNetCore.Http;
using MobyLabWebProgramming.Database.Repository;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.DataTransferObjects;
using MobyLabWebProgramming.Services.Specifications;

namespace MobyLabWebProgramming.Services.Implementations;

public class PostService(IRepository<WebAppDatabaseContext> repository, IFileRepository fileRepository, IConnectionService connectionService) : IPostService
{
    public async Task<ServiceResponse> CreatePost(string content, List<IFormFile>? images, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Post content cannot be empty!", ErrorCodes.CannotAdd));
        }

        if (images != null && images.Count > 4)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Maximum 4 images per post!", ErrorCodes.CannotAdd));
        }

        var post = new Post
        {
            Content = content,
            AuthorId = requestingUser.Id
        };

        await repository.AddAsync(post, cancellationToken);

        if (images != null)
        {
            var sortOrder = 0;
            foreach (var image in images)
            {
                var saveResult = fileRepository.SaveFile(image, "posts");
                if (saveResult.IsOk)
                {
                    var postImage = new PostImage
                    {
                        PostId = post.Id,
                        ImageUrl = $"posts/{saveResult.Result}",
                        SortOrder = sortOrder++
                    };
                    await repository.AddAsync(postImage, cancellationToken);
                }
            }
        }

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeletePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var post = await repository.GetAsync(new PostSpec(postId), cancellationToken);
        if (post == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Post not found!", ErrorCodes.EntityNotFound));
        }

        if (post.AuthorId != requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the author can delete their post!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Post>(postId, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<PostRecord>>> GetFeed(Guid userId, CancellationToken cancellationToken = default)
    {
        var connectionsResult = await connectionService.GetMyConnections(userId, cancellationToken);
        var connections = connectionsResult.Result ?? new List<ConnectionRecord>();

        var connectedUserIds = connections
            .Where(c => c.Status == ConnectionStatusEnum.Accepted) // Defensive check
            .Select(c => c.RequesterId == userId ? c.ReceiverId : c.RequesterId)
            .Distinct()
            .ToList();

        connectedUserIds.Add(userId);

        var posts = await repository.ListNoTrackingAsync(new PostsByAuthorIdsSpec(connectedUserIds), cancellationToken);

        var result = posts.Select(p => new PostRecord
        {
            Id = p.Id,
            Content = p.Content,
            AuthorId = p.AuthorId,
            Author = p.Author != null ? new UserRecord { Id = p.Author.Id, Name = p.Author.Name, Email = p.Author.Email, Role = p.Author.Role } : null,
            LikesCount = p.Likes?.Count ?? 0,
            CommentsCount = p.Comments?.Count ?? 0,
            IsLikedByMe = p.Likes?.Any(l => l.UserId == userId) ?? false,
            ImageUrls = p.Images?.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList() ?? new(),
            Comments = p.Comments?.OrderBy(c => c.CreatedAt).Select(c => new CommentRecord
            {
                Id = c.Id,
                Content = c.Content,
                PostId = c.PostId,
                AuthorId = c.AuthorId,
                Author = c.Author != null ? new UserRecord { Id = c.Author.Id, Name = c.Author.Name, Email = c.Author.Email, Role = c.Author.Role } : null
            }).ToList() ?? new(),
            CreatedAt = p.CreatedAt
        }).ToList();

        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> LikePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var post = await repository.GetAsync<Post>(postId, cancellationToken);
        if (post == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Post not found!", ErrorCodes.EntityNotFound));
        }

        var existingLike = await repository.GetAsync(new PostLikeSpec(postId, requestingUser.Id), cancellationToken);
        if (existingLike != null)
        {
            return ServiceResponse.ForSuccess();
        }

        var like = new PostLike
        {
            PostId = postId,
            UserId = requestingUser.Id
        };

        await repository.AddAsync(like, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UnlikePost(Guid postId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var existingLike = await repository.GetAsync(new PostLikeSpec(postId, requestingUser.Id), cancellationToken);
        if (existingLike == null)
        {
            return ServiceResponse.ForSuccess();
        }

        await repository.DeleteAsync<PostLike>(existingLike.Id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> AddComment(Guid postId, string content, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Comment cannot be empty!", ErrorCodes.CannotAdd));
        }

        var post = await repository.GetAsync<Post>(postId, cancellationToken);
        if (post == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Post not found!", ErrorCodes.EntityNotFound));
        }

        var comment = new Comment
        {
            PostId = postId,
            Content = content,
            AuthorId = requestingUser.Id
        };

        await repository.AddAsync(comment, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteComment(Guid commentId, UserRecord requestingUser, CancellationToken cancellationToken = default)
    {
        var comment = await repository.GetAsync(new CommentSpec(commentId), cancellationToken);
        if (comment == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Comment not found!", ErrorCodes.EntityNotFound));
        }

        if (comment.AuthorId != requestingUser.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the author can delete their comment!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Comment>(commentId, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<CommentRecord>>> GetPostComments(Guid postId, CancellationToken cancellationToken = default)
    {
        var comments = await repository.ListNoTrackingAsync(new CommentsByPostSpec(postId), cancellationToken);
        var result = comments.Select(c => new CommentRecord
        {
            Id = c.Id,
            Content = c.Content,
            PostId = c.PostId,
            AuthorId = c.AuthorId,
            Author = c.Author != null ? new UserRecord { Id = c.Author.Id, Name = c.Author.Name, Email = c.Author.Email, Role = c.Author.Role } : null
        }).ToList();

        return ServiceResponse.ForSuccess(result);
    }
}
