using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Database.Repository.Enums;
using MobyLabWebProgramming.Infrastructure.Requests;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;
using MobyLabWebProgramming.Services.Authorization;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class CompanyMemberController(ILogger<CompanyMemberController> logger, IUserService userService, ICompanyMemberService companyMemberService) : AuthorizedController(logger, userService)
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<Services.DataTransferObjects.CompanyMemberRecord>>>> GetMembers()
    {
        var currentUser = await GetCurrentUser();

        if (currentUser.Result == null)
        {
            return ErrorMessageResult<List<Services.DataTransferObjects.CompanyMemberRecord>>(currentUser.Error);
        }

        var company = await companyMemberService.GetCompanyMembersByUser(currentUser.Result.Id);
        return company.Result != null
            ? FromServiceResponse(company)
            : ErrorMessageResult<List<Services.DataTransferObjects.CompanyMemberRecord>>(company.Error);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> AddMember([FromBody] AddMemberRequest request)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await companyMemberService.AddMember(request.UserId, request.Role, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpDelete("{userId:guid}")]
    public async Task<ActionResult<RequestResponse>> RemoveMember([FromRoute] Guid userId)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await companyMemberService.RemoveMember(userId, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<RequestResponse>> UpdateMemberRole([FromBody] UpdateMemberRoleRequest request)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await companyMemberService.UpdateMemberRole(request.UserId, request.Role, currentUser.Result))
            : ErrorMessageResult(currentUser.Error);
    }
}

public record AddMemberRequest(Guid UserId, UserRoleEnum Role);
public record UpdateMemberRoleRequest(Guid UserId, UserRoleEnum Role);
