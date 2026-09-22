using System;

namespace Ecommerce.Common.DTOs
{
    public class RegisterRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Password { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
    }

    public class LoginRequestDto
    {
        public string Username { get; set; } = string.Empty; // SĐT hoặc Email
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserProfileDto User { get; set; } = null!;
    }

    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string MemberTier { get; set; } = string.Empty;
        public int RewardPoints { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateUserProfileRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class ChangePasswordRequestDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

