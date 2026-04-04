using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Handlers;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthorizationController(ILogger<AuthorizationController> logger, IUserService userService) : BaseResponseController(logger)
{
    [HttpPost]
    public async Task<ActionResult<RequestResponse<LoginResponseRecord>>> Login([FromBody] LoginRecord login)
    {
        return FromServiceResponse(await userService.Login(login with { Password = PasswordUtils.HashPassword(login.Password) }));
    }

    [HttpPost]
    public async Task<ActionResult<RequestResponse<LoginResponseRecord>>> Register([FromBody] UserAddRecord user)
    {
        user.Password = PasswordUtils.HashPassword(user.Password);
        var result = await userService.AddUser(user, null);
        
        if (!result.IsOk)
        {
            return ErrorMessageResult<LoginResponseRecord>(result.Error);
        }
        
        var loginResult = await userService.Login(new LoginRecord(user.Email, user.Password));
        return FromServiceResponse(loginResult);
    }
}
