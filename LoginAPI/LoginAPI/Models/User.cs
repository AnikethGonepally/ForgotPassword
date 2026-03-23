using System.ComponentModel.DataAnnotations.Schema;

namespace LoginAPI.Models
{
    [Table("Users_Registration")]
    public class User
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int RoleId { get; set; }

        public string UserName { get; set; }
        public string RoleName { get; set; }
        public int RoleLevel { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }

        public bool IsLoggedIn { get; set; }
        public string MobileNumber { get; set; }

        public string? OTP { get; set; }
        public DateTime? OTPExpiry { get; set; }
        public bool IsOtpVerified { get; set; }
    }
}