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
public class JobPostController(ILogger<JobPostController> logger, IUserService userService, IJobPostService jobPostService) : AuthorizedController(logger, userService)
{
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RequestResponse<JobPostRecord>>> GetById([FromRoute] Guid id)
    {
        return FromServiceResponse(await jobPostService.GetJobPost(id));
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<ActionResult<RequestResponse<List<JobPostRecord>>>> GetAll()
    {
        return FromServiceResponse(await jobPostService.GetAllJobs());
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<JobPostRecord>>>> GetMyCompanyJobs()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await jobPostService.GetCompanyJobsByUser(currentUser.Result.Id))
            : ErrorMessageResult<List<JobPostRecord>>(currentUser.Error);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] JobPostAddRecord jobPost)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await jobPostService.AddJobPost(jobPost, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<RequestResponse>> Update([FromBody] JobPostUpdateRecord jobPost)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await jobPostService.UpdateJobPost(jobPost, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Delete([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await jobPostService.DeleteJobPost(id, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }
}
