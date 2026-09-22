using System;
using System.Collections.Generic;

namespace Ecommerce.Common.DTOs
{
    public class AdminDashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal RevenueToday { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrdersCount { get; set; }
        public int ShippingOrdersCount { get; set; }
        public int CompletedOrdersCount { get; set; }
        public int TotalProducts { get; set; }
        public int ActiveProductsCount { get; set; }
        public int LowStockProductsCount { get; set; }
        public int FlaggedReviewsCount { get; set; }
        public decimal AverageOrderValue => TotalOrders > 0 ? TotalRevenue / TotalOrders : 0;
        public List<DailyRevenuePointDto> RevenueChart { get; set; } = new();
        public List<TopSellingProductDto> TopProducts { get; set; } = new();
    }

    public class DailyRevenuePointDto
    {
        public string Date { get; set; } = string.Empty; // "dd/MM"
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
    }

    public class TopSellingProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int SoldCount { get; set; }
        public decimal Revenue { get; set; }
        public int CurrentStock { get; set; }
    }

    public class AdminProductListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int DiscountPercent { get; set; }
        public decimal MemberDiscountPercent { get; set; }
        public int TotalStockQuantity { get; set; }
        public bool InStock { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsHot { get; set; }
        public string? ThumbnailUrl { get; set; }
        public int WarrantyMonths { get; set; }
        public string? RamCapacity { get; set; }
        public string? StorageCapacity { get; set; }
        public string? Chipset { get; set; }
        public string? BatteryCapacity { get; set; }
        public string? ScreenSpecs { get; set; }
        public string? CameraSpecs { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminProductCreateUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int DiscountPercent { get; set; } = 0;
        public decimal MemberDiscountPercent { get; set; } = 3.0m;
        public int WarrantyMonths { get; set; } = 12;
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        
        public string? RamCapacity { get; set; }
        public string? StorageCapacity { get; set; }
        public string? Chipset { get; set; }
        public string? BatteryCapacity { get; set; }
        public string? ScreenSpecs { get; set; }
        public string? CameraSpecs { get; set; }

        public bool IsFeatured { get; set; } = false;
        public bool IsHot { get; set; } = false;
        public bool InStock { get; set; } = true;
        public bool IsActive { get; set; } = true;
        
        public int InitialStockQuantity { get; set; } = 20;
    }

    public class UpdateOrderStatusRequestDto
    {
        public string OrderStatus { get; set; } = string.Empty; // 'Chờ xác nhận', 'Đã xác nhận & Đang đóng gói', 'Đang vận chuyển', 'Giao hàng thành công', 'Đã hủy'
        public string? PaymentStatus { get; set; }
        public string? TrackingCode { get; set; }
        public string? ShippingProvider { get; set; } // 'Giao Hàng Nhanh', 'Viettel Post', 'GHTK'
        public string? AdminNote { get; set; }
    }

    public class InventoryLogDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int? ProductVariantId { get; set; }
        public string Type { get; set; } = "IMPORT"; // 'IMPORT', 'EXPORT', 'ADJUST'
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? SupplierOrDestination { get; set; }
        public string? Note { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateInventoryImportDto
    {
        public int ProductId { get; set; }
        public int? ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string SupplierOrDestination { get; set; } = "Nhà phân phối chính hãng";
        public string? Note { get; set; }
    }

    public class LowStockAlertDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int AlertThreshold { get; set; } = 5;
        public string Severity { get; set; } = "CRITICAL"; // "CRITICAL" (<=3) or "WARNING" (<=10)
    }

    public class ReviewModerationDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserPhone { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public bool IsVerifiedPurchase { get; set; }
        public bool IsFlaggedByAi { get; set; }
        public string? AiFlagReason { get; set; }
        public decimal? AiFlagConfidence { get; set; }
        public string ModerationStatus { get; set; } = "Approved"; // "Pending", "Approved", "Rejected"
        public string? AdminResponse { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ModerateReviewRequestDto
    {
        public string ModerationStatus { get; set; } = "Approved"; // "Approved" or "Rejected"
        public string? AdminResponse { get; set; }
    }
}

