namespace LoginAPI.Models;
public class LoginRequest
{
    public string? Uid { get; set; }  
    public string Username { get; set; }
    public string Password { get; set; }
}