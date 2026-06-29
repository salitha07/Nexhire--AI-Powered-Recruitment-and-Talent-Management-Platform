using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexhire.DTOs;
using Nexhire.Services;
using System.Security.Claims;

namespace Nexhire.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _authService.Register(dto);

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Email already exists."
                });
            }

            var token = _authService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            return Created("", response);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _authService.Login(dto);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var token = _authService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60)
            };

            return Ok(response);
        }

        // GET: api/auth/me
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userInfo = new
            {
                FullName = User.FindFirst("FullName")?.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Role = User.FindFirst(ClaimTypes.Role)?.Value
            };

            return Ok(userInfo);
        }
    }
}