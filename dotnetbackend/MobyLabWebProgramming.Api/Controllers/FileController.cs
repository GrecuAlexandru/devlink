using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;

namespace MobyLabWebProgramming.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController(IFileRepository fileRepository) : ControllerBase
{
    [HttpGet("{directory}/{fileName}")]
    public IActionResult GetFile([FromRoute] string directory, [FromRoute] string fileName)
    {
        var filePath = $"{directory}/{fileName}";
        var result = fileRepository.GetFile(filePath);

        if (!result.IsOk || result.Result == null)
        {
            return NotFound();
        }

        var contentType = "application/octet-stream";
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        switch (extension)
        {
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".gif":
                contentType = "image/gif";
                break;
            case ".webp":
                contentType = "image/webp";
                break;
        }

        return File(result.Result.Stream, contentType);
    }
}
