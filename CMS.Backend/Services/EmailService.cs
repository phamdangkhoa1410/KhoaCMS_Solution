using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpServer = _configuration["SmtpSettings:Server"];
            var smtpPort = int.Parse(_configuration["SmtpSettings:Port"]);
            var senderName = _configuration["SmtpSettings:SenderName"];
            var senderEmail = _configuration["SmtpSettings:SenderEmail"];
            var password = _configuration["SmtpSettings:Password"];

            var message = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(toEmail));

            using var client = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            await client.SendMailAsync(message);
        }
    }
}
