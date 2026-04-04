using System.Net;
using MobyLabWebProgramming.Database.Repository;
using MobyLabWebProgramming.Database.Repository.Entities;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.DataTransferObjects;
using MobyLabWebProgramming.Services.Specifications;

namespace MobyLabWebProgramming.Services.Implementations;

public class UserProfileService(IRepository<WebAppDatabaseContext> repository) : IUserProfileService
{
    public async Task<ServiceResponse<UserProfileRecord>> GetProfile(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user == null)
        {
            return ServiceResponse.FromError<UserProfileRecord>(CommonErrors.UserNotFound);
        }

        var profile = await repository.GetAsync(new UserProfileSpec(userId), cancellationToken);

        if (profile == null)
        {
            return ServiceResponse.ForSuccess(new UserProfileRecord
            {
                Id = Guid.Empty,
                Bio = null,
                ProfilePictureUrl = null,
                LinkedInUrl = null,
                GitHubUrl = null,
                UserId = userId
            });
        }

        return ServiceResponse.ForSuccess(new UserProfileRecord
        {
            Id = profile.Id,
            Bio = profile.Bio,
            ProfilePictureUrl = profile.ProfilePictureUrl,
            LinkedInUrl = profile.LinkedInUrl,
            GitHubUrl = profile.GitHubUrl,
            UserId = userId
        });
    }

    public async Task<ServiceResponse<UserProfileRecord>> GetMyProfile(Guid userId, CancellationToken cancellationToken = default)
    {
        return await GetProfile(userId, cancellationToken);
    }

    public async Task<ServiceResponse> CreateProfile(UserProfileAddRecord profile, Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user == null)
        {
            return ServiceResponse.FromError(CommonErrors.UserNotFound);
        }

        var existingProfile = await repository.GetAsync(new UserProfileSpec(userId), cancellationToken);
        if (existingProfile != null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "Profile already exists!", ErrorCodes.CannotAdd));
        }

        var newProfile = new UserProfile
        {
            Bio = profile.Bio,
            ProfilePictureUrl = profile.ProfilePictureUrl,
            LinkedInUrl = profile.LinkedInUrl,
            GitHubUrl = profile.GitHubUrl,
            UserId = userId
        };

        await repository.AddAsync(newProfile, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateProfile(UserProfileUpdateRecord profile, Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await repository.GetAsync(new UserSpec(userId), cancellationToken);
        if (user == null)
        {
            return ServiceResponse.FromError(CommonErrors.UserNotFound);
        }

        var existingProfile = await repository.GetAsync(new UserProfileSpec(userId), cancellationToken);

        if (existingProfile == null)
        {
            var newProfile = new UserProfile
            {
                Bio = profile.Bio,
                ProfilePictureUrl = profile.ProfilePictureUrl,
                LinkedInUrl = profile.LinkedInUrl,
                GitHubUrl = profile.GitHubUrl,
                UserId = userId
            };
            await repository.AddAsync(newProfile, cancellationToken);
        }
        else
        {
            existingProfile.Bio = profile.Bio ?? existingProfile.Bio;
            existingProfile.ProfilePictureUrl = profile.ProfilePictureUrl ?? existingProfile.ProfilePictureUrl;
            existingProfile.LinkedInUrl = profile.LinkedInUrl ?? existingProfile.LinkedInUrl;
            existingProfile.GitHubUrl = profile.GitHubUrl ?? existingProfile.GitHubUrl;
            await repository.UpdateAsync(existingProfile, cancellationToken);
        }

        return ServiceResponse.ForSuccess();
    }
}
