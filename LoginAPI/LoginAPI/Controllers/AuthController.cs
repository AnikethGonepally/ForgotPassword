using Microsoft.AspNetCore.Mvc;
using LoginAPI.Models;
using LoginAPI.Data;
using System.Linq;

namespace LoginAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ LOGIN (FIXED: EMAIL OR USERNAME)
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u =>
                    (u.UserName == request.Username || u.Email == request.Username) &&
                    u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Login" });
            }

            return Ok(new
            {
                message = "Login Successful",
                username = user.UserName
            });
        }

        // ✅ FORGOT PASSWORD
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Input || u.MobileNumber == request.Input);

            if (user == null)
                return BadRequest(new { message = "User not found" });

            var otp = new Random().Next(1000, 9999).ToString();

            user.OTP = otp;
            user.OTPExpiry = DateTime.Now.AddMinutes(5);
            user.IsOtpVerified = false;

            _context.SaveChanges();

            return Ok(new
            {
                message = "OTP Sent",
                otp = otp   // ⚠️ TEMP (remove in production)
            });
        }

        // ✅ VERIFY OTP
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Input || u.MobileNumber == request.Input);

            if (user == null ||
                user.OTP != request.Otp ||
                user.OTPExpiry == null ||
                user.OTPExpiry < DateTime.Now)
            {
                return BadRequest(new { message = "Invalid OTP" });
            }

            user.IsOtpVerified = true;
            _context.SaveChanges();

            return Ok(new { message = "OTP Verified" });
        }

        // ✅ RESET PASSWORD
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Input || u.MobileNumber == request.Input);

            if (user == null || !user.IsOtpVerified)
                return BadRequest(new { message = "OTP not verified" });

            user.Password = request.NewPassword;

            // 🔥 CLEANUP
            user.OTP = null;
            user.OTPExpiry = null;
            user.IsOtpVerified = false;

            _context.SaveChanges();

            return Ok(new { message = "Password reset successful" });
        }
    }
}