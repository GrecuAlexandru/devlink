using System.Security.Claims;
using Microsoft.Extensions.Logging;
using MobyLabWebProgramming.Infrastructure.Handlers;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Services.Authorization;

public abstract class AuthorizedController(ILogger logger, IUserService userService) : BaseResponseController(logger)
{
    private UserClaims? _userClaims;
    protected readonly IUserService UserService = userService;

    protected UserClaims ExtractClaims()
    {
        if (_userClaims != null)
        {
            return _userClaims;
        }

        var enumerable = User.Claims.ToList();
        var userId = enumerable.Where(x => x.Type == ClaimTypes.NameIdentifier).Select(x => Guid.Parse(x.Value)).FirstOrDefault();
        var email = enumerable.Where(x => x.Type == ClaimTypes.Email).Select(x => x.Value).FirstOrDefault();
        var name = enumerable.Where(x => x.Type == ClaimTypes.Name).Select(x => x.Value).FirstOrDefault();

        _userClaims = new(userId, name, email);

        return _userClaims;
    }

    protected Task<ServiceResponse<UserRecord>> GetCurrentUser() => UserService.GetUser(ExtractClaims().Id);
}
