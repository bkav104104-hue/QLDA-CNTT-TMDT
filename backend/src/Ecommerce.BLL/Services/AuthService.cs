using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.Constants;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.Entities;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var phone = request.PhoneNumber.Trim();
            var exists = await _unitOfWork.Users.AnyAsync(u => u.PhoneNumber == phone);
            if (exists)
            {
                throw new InvalidOperationException("Số điện thoại này đã được đăng ký tài khoản.");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var email = request.Email.Trim().ToLowerInvariant();
                var emailExists = await _unitOfWork.Users.AnyAsync(u => u.Email == email);
                if (emailExists)
                {
                    throw new InvalidOperationException("Địa chỉ Email này đã được sử dụng.");
                }
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                FullName = request.FullName.Trim(),
                PhoneNumber = phone,
                Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim().ToLowerInvariant(),
                PasswordHash = passwordHash,
                DateOfBirth = request.DateOfBirth,
                RoleId = AppConstants.Roles.CustomerId,
                MemberTier = AppConstants.MemberTier.New,
                RewardPoints = 50, // Thưởng 50 điểm chào mừng thành viên mới
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Users.AddAsync(newUser);
            await _unitOfWork.SaveChangesAsync();

            // Load user with Role
            var createdUser = await _unitOfWork.Users.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == newUser.Id);

            var userProfile = _mapper.Map<UserProfileDto>(createdUser ?? newUser);
            var (token, expiresAt) = GenerateJwtToken(createdUser ?? newUser);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = userProfile
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var username = request.Username.Trim();
            
            var user = await _unitOfWork.Users.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.PhoneNumber == username || (u.Email != null && u.Email.ToLower() == username.ToLower()));

            if (user == null)
            {
                throw new UnauthorizedAccessException("Số điện thoại hoặc mật khẩu không chính xác.");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Tài khoản của bạn đã bị khóa hoặc tạm ngưng.");
            }

            if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Số điện thoại hoặc mật khẩu không chính xác.");
            }

            var userProfile = _mapper.Map<UserProfileDto>(user);
            var (token, expiresAt) = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = userProfile
            };
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(int userId)
        {
            var user = await _unitOfWork.Users.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user == null ? null : _mapper.Map<UserProfileDto>(user);
        }

        public async Task<UserProfileDto> UpdateUserProfileAsync(int userId, UpdateUserProfileRequestDto request)
        {
            var user = await _unitOfWork.Users.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy thông tin tài khoản người dùng.");
            }

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                user.FullName = request.FullName.Trim();
            }

            if (request.Email != null)
            {
                user.Email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
            }

            if (request.DateOfBirth.HasValue)
            {
                user.DateOfBirth = request.DateOfBirth.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.AvatarUrl))
            {
                user.AvatarUrl = request.AvatarUrl.Trim();
            }

            user.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<UserProfileDto>(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto request)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy thông tin người dùng.");
            }

            if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            {
                throw new ArgumentException("Mật khẩu hiện tại không chính xác.");
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
            {
                throw new ArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        private (string token, DateTime expiresAt) GenerateJwtToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"] ?? "NextPhone_ECommerce_Secret_Key_Super_Secure_2026!#*";
            var issuer = _configuration["Jwt:Issuer"] ?? "NextPhone";
            var audience = _configuration["Jwt:Audience"] ?? "NextPhoneUsers";
            var expiryDays = int.TryParse(_configuration["Jwt:ExpiryDays"], out var days) ? days : 7;

            var expiresAt = DateTime.UtcNow.AddDays(expiryDays);
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "Customer"),
                new Claim("MemberTier", user.MemberTier),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
        }
    }
}

