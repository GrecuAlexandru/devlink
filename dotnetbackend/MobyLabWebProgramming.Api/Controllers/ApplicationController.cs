using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Requests;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.Authorization;
using MobyLabWebProgramming.Services.DataTransferObjects;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ApplicationController(ILogger<ApplicationController> logger, IUserService userService, IApplicationService applicationService) : AuthorizedController(logger, userService)
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Apply([FromBody] ApplicationAddRecord application)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await applicationService.Apply(application, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<ApplicationRecord>>>> GetMyApplications()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await applicationService.GetMyApplications(currentUser.Result.Id))
            : ErrorMessageResult<List<ApplicationRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpGet("{jobPostId:guid}")]
    public async Task<ActionResult<RequestResponse<List<ApplicationRecord>>>> GetJobApplications([FromRoute] Guid jobPostId)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await applicationService.GetJobApplications(jobPostId, currentUser.Result))
            : ErrorMessageResult<List<ApplicationRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<RequestResponse>> UpdateStatus([FromBody] ApplicationUpdateRecord application)
    {
        var currentUser = await GetCurrentUser();

        if (currentUser.Result == null || application.Status == null)
        {
            return ErrorMessageResult(currentUser.Error ?? new(HttpStatusCode.BadRequest, "Status is required!", ErrorCodes.CannotUpdate));
        }

        return FromServiceResponse(await applicationService.UpdateStatus(application.Id, application.Status.Value, currentUser.Result));
    }
}
