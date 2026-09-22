using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IValidator<RegisterRequestDto> _registerValidator;
        private readonly IValidator<LoginRequestDto> _loginValidator;

        public AuthController(
            IAuthService _authService,
            IValidator<RegisterRequestDto> registerValidator,
            IValidator<LoginRequestDto> loginValidator)
        {
            this._authService = _authService;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.ConvertAll(e => e.ErrorMessage);
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResult("Dữ liệu đăng ký không hợp lệ", errors));
            }

            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Đăng ký tài khoản thành công!", 201));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.ConvertAll(e => e.ErrorMessage);
                return BadRequest(ApiResponse<AuthResponseDto>.ErrorResult("Dữ liệu đăng nhập không hợp lệ", errors));
            }

            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Đăng nhập thành công!"));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<UserProfileDto>.ErrorResult("Không thể xác định danh tính người dùng", null, 401));
            }

            var userProfile = await _authService.GetUserProfileAsync(userId);
            if (userProfile == null)
            {
                return NotFound(ApiResponse<UserProfileDto>.ErrorResult("Không tìm thấy thông tin tài khoản", null, 404));
            }

            return Ok(ApiResponse<UserProfileDto>.SuccessResult(userProfile, "Lấy thông tin tài khoản thành công"));
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<UserProfileDto>.ErrorResult("Không thể xác định danh tính người dùng", null, 401));
            }

            var updated = await _authService.UpdateUserProfileAsync(userId, request);
            return Ok(ApiResponse<UserProfileDto>.SuccessResult(updated, "Cập nhật thông tin cá nhân thành công!"));
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<bool>.ErrorResult("Không thể xác định danh tính người dùng", null, 401));
            }

            await _authService.ChangePasswordAsync(userId, request);
            return Ok(ApiResponse<bool>.SuccessResult(true, "Đổi mật khẩu thành công!"));
        }
    }
}

