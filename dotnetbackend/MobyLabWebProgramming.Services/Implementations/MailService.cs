using System.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MobyLabWebProgramming.Infrastructure.Configurations;
using MobyLabWebProgramming.Infrastructure.Errors;
using MobyLabWebProgramming.Infrastructure.Responses;
using MobyLabWebProgramming.Services.Abstractions;

namespace MobyLabWebProgramming.Services.Implementations;

/// <summary>
/// Inject the required service configuration from the application.json or environment variables.
/// </summary>
public class MailService(IOptions<MailConfiguration> mailConfiguration, ILogger<MailService> logger) : IMailService
{
    private readonly MailConfiguration _mailConfiguration = mailConfiguration.Value;
    private const int MaxRateLimitRetryAttempts = 3;
    private static readonly TimeSpan MinTimeBetweenEmails = TimeSpan.FromMilliseconds(1100);
    private static readonly SemaphoreSlim SendLock = new(1, 1);
    private static DateTimeOffset _lastSendAtUtc = DateTimeOffset.MinValue;


    public async Task<ServiceResponse> SendMail(string recipientEmail, string subject, string body, bool isHtmlBody = false, 
        string? senderTitle = null, CancellationToken cancellationToken = default)
    {
        if (!_mailConfiguration.MailEnable) // If you need only to test and not send emails you can set this variable to false, otherwise it will try to send the emails.
        {
            logger.LogInformation("Skipping email send because mail is disabled. Recipient: {RecipientEmail}, Subject: {Subject}", recipientEmail, subject);
            return ServiceResponse.ForSuccess();
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderTitle ?? _mailConfiguration.MailAddress, _mailConfiguration.MailAddress)); // Set the sender alias and sender's real address.
        message.To.Add(new MailboxAddress(recipientEmail, recipientEmail)); // Add the recipient mail address.
        message.Subject = subject; // Set the subject.
        message.Body = new TextPart(isHtmlBody ? "html" : "plain") { Text = body };  // Set the MIME type and email body.

        await SendLock.WaitAsync(cancellationToken);

        try
        {
            var delayUntilNextSend = (_lastSendAtUtc + MinTimeBetweenEmails) - DateTimeOffset.UtcNow;
            if (delayUntilNextSend > TimeSpan.Zero)
            {
                logger.LogInformation("Delaying email send by {DelayMs} ms to stay within provider rate limit.", (int)delayUntilNextSend.TotalMilliseconds);
                await Task.Delay(delayUntilNextSend, cancellationToken);
            }

            for (var attempt = 1; attempt <= MaxRateLimitRetryAttempts; attempt++)
            {
                try
                {
                    using var client = new SmtpClient(); // Create the SMTP client. Note that this object is disposable and as such need to use the keyword "using" to properly dispose the object after leaving the scope.
                    await client.ConnectAsync(_mailConfiguration.MailHost, _mailConfiguration.MailPort, SecureSocketOptions.Auto, cancellationToken); // Connect to the mail host.
                    client.AuthenticationMechanisms.Remove("XOAUTH2"); // Just to avoid issues with some clients this header is removed from the authentication request.
                    await client.AuthenticateAsync(_mailConfiguration.MailUser, _mailConfiguration.MailPassword, cancellationToken); // Set the user and password for the email account.
                    await client.SendAsync(message, cancellationToken); // Send the message.
                    await client.DisconnectAsync(true, cancellationToken); // Disconnect the client from the host to save resources.

                    _lastSendAtUtc = DateTimeOffset.UtcNow;
                    return ServiceResponse.ForSuccess();
                }
                catch (SmtpCommandException ex) when (IsRateLimitException(ex) && attempt < MaxRateLimitRetryAttempts)
                {
                    var delayMs = 1200 * attempt;
                    logger.LogWarning(ex,
                        "Mail provider rate limit reached (attempt {Attempt}/{MaxAttempts}). Retrying in {DelayMs} ms. Recipient: {RecipientEmail}, Subject: {Subject}",
                        attempt,
                        MaxRateLimitRetryAttempts,
                        delayMs,
                        recipientEmail,
                        subject);
                    await Task.Delay(delayMs, cancellationToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to send email. Recipient: {RecipientEmail}, Subject: {Subject}", recipientEmail, subject);
                    return ServiceResponse.FromError(new(HttpStatusCode.ServiceUnavailable, "Mail couldn't be send!", ErrorCodes.MailSendFailed));
                }
            }

            logger.LogError("Failed to send email after {MaxAttempts} attempts due to provider rate limiting. Recipient: {RecipientEmail}, Subject: {Subject}",
                MaxRateLimitRetryAttempts,
                recipientEmail,
                subject);
            return ServiceResponse.FromError(new(HttpStatusCode.ServiceUnavailable, "Mail couldn't be send!", ErrorCodes.MailSendFailed));
        }
        finally
        {
            SendLock.Release();
        }
    }

    private static bool IsRateLimitException(SmtpCommandException exception) =>
        exception.Message.Contains("Too many emails per second", StringComparison.OrdinalIgnoreCase);
}
