using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.Authorization;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class UserProfileController(ILogger<UserProfileController> logger, IUserService userService, IUserProfileService profileService) : AuthorizedController(logger, userService)
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<UserProfileRecord>>> GetMyProfile()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.GetMyProfile(currentUser.Result.Id))
            : ErrorMessageResult<UserProfileRecord>(currentUser.Error);
    }

    [Authorize]
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<RequestResponse<UserProfileRecord>>> GetProfile([FromRoute] Guid userId)
    {
        return FromServiceResponse(await profileService.GetProfile(userId));
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<RequestResponse>> UpdateProfile([FromBody] UserProfileUpdateRecord profile)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await profileService.UpdateProfile(profile, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }
}
