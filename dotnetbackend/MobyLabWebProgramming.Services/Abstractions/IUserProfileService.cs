using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Abstractions;

public interface IUserProfileService
{
    public Task<ServiceResponse<UserProfileRecord>> GetProfile(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse<UserProfileRecord>> GetMyProfile(Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> CreateProfile(UserProfileAddRecord profile, Guid userId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> UpdateProfile(UserProfileUpdateRecord profile, Guid userId, CancellationToken cancellationToken = default);
}
