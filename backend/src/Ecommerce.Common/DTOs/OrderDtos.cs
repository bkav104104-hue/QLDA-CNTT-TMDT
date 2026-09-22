using System;
using System.Collections.Generic;

namespace Ecommerce.Common.DTOs
{
    public class OrderItemRequestDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal? CustomPrice { get; set; }
        public string? ProductName { get; set; }
        public string? VariantSummary { get; set; }
    }

    public class CreateOrderRequestDto
    {
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string? ReceiverEmail { get; set; }
        
        // Delivery mode: "home" | "store"
        public string DeliveryMethod { get; set; } = "home";
        public string ShippingAddress { get; set; } = string.Empty;
        
        public string PaymentMethod { get; set; } = "COD";
        public string? Notes { get; set; }
        public string? CouponCode { get; set; }
        
        public bool TransferData { get; set; } = false;
        public bool VatInvoice { get; set; } = false;

        public List<OrderItemRequestDto> Items { get; set; } = new List<OrderItemRequestDto>();
    }

    public class OrderItemResponseDto
    {
        public int Id { get; set; }
        public int ProductVariantId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? VariantSummary { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public string OrderCode { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string? ReceiverEmail { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        
        public decimal SubTotal { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal TotalAmount { get; set; }
        
        public string OrderStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? CouponCode { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }

    public class CouponResponseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "FIXED";
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class ApplyCouponRequestDto
    {
        public string Code { get; set; } = string.Empty;
        public decimal OrderAmount { get; set; }
    }

    public class ApplyCouponResponseDto
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
    }
}

