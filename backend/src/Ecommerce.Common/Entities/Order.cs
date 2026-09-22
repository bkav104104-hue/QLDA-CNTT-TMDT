using System;
using System.Collections.Generic;

namespace Ecommerce.Common.Entities
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "FIXED"; // 'FIXED' or 'PERCENT'
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; } = 0;
        public decimal? MaxDiscountAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UsageLimit { get; set; } = 1000;
        public int UsedCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Order : BaseEntity
    {
        public string OrderCode { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public User? User { get; set; }
        
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string? ReceiverEmail { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;

        public decimal SubTotal { get; set; }
        public decimal DiscountAmount { get; set; } = 0;
        public decimal ShippingFee { get; set; } = 0;
        public decimal TotalAmount { get; set; }

        public string OrderStatus { get; set; } = "Chờ xác nhận";
        public string PaymentMethod { get; set; } = "COD";
        public string PaymentStatus { get; set; } = "Chưa thanh toán";
        
        public string? Notes { get; set; }
        public int? CouponId { get; set; }
        public Coupon? Coupon { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public int ProductVariantId { get; set; }
        public ProductVariant? ProductVariant { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string? VariantSummary { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? TransactionCode { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Pending";
        public string? ResponseJson { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ProductReview
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
        public string? ImagesJson { get; set; }
        public bool IsVerifiedPurchase { get; set; } = true;
        public bool IsFlaggedByAi { get; set; } = false;
        public string? AiFlagReason { get; set; }
        public decimal? AiFlagConfidence { get; set; }
        public string ModerationStatus { get; set; } = "Approved"; // "Pending", "Approved", "Rejected"
        public string? AdminResponse { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

