using System;
using System.Collections.Generic;

namespace Ecommerce.Common.Entities
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }

    public class User : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AvatarUrl { get; set; }
        public int RoleId { get; set; } = 2; // Customer
        public Role? Role { get; set; }
        
        public string MemberTier { get; set; } = "Thành viên Mới";
        public int RewardPoints { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    }

    public class UserAddress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public string DetailedAddress { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

