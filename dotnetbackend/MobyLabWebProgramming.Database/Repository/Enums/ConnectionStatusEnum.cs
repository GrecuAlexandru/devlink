using System.Text.Json.Serialization;

namespace MobyLabWebProgramming.Database.Repository.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ConnectionStatusEnum
{
    Pending,
    Accepted,
    Rejected
}
