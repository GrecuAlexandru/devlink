using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Infrastructure.Requests;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.Authorization;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ConnectionController(ILogger<ConnectionController> logger, IUserService userService, IConnectionService connectionService) : AuthorizedController(logger, userService)
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> SendRequest([FromBody] SendConnectionRequest request)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.SendRequest(request.ReceiverId, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> AcceptRequest([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.AcceptRequest(id, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> RejectRequest([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.RejectRequest(id, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Remove([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.RemoveConnection(id, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<ConnectionRecord>>>> GetMyConnections()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.GetMyConnections(currentUser.Result.Id))
            : ErrorMessageResult<List<ConnectionRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<ConnectionRecord>>>> GetPendingRequests()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.GetPendingRequests(currentUser.Result.Id))
            : ErrorMessageResult<List<ConnectionRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<ConnectionRecord>>>> GetSentRequests()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.GetSentRequests(currentUser.Result.Id))
            : ErrorMessageResult<List<ConnectionRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<RequestResponse<ConnectionRecord?>>> GetStatus([FromRoute] Guid userId)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await connectionService.GetConnectionStatus(currentUser.Result.Id, userId))
            : ErrorMessageResult<ConnectionRecord?>(currentUser.Error);
    }
}

public record SendConnectionRequest(Guid ReceiverId);
