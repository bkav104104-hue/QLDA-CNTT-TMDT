using System;
using System.Collections.Generic;

namespace Ecommerce.Common.DTOs
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Country { get; set; }
        public int ProductCount { get; set; }
    }

    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? IconName { get; set; }
        public int? ParentId { get; set; }
        public int DisplayOrder { get; set; }
        public List<CategoryDto> SubCategories { get; set; } = new List<CategoryDto>();
        public int ProductCount { get; set; }
    }

    public class HomeCategoryDto : CategoryDto
    {
        public string? Badge { get; set; }
        public bool IsHot { get; set; }
        public string Group { get; set; } = "main"; // "main", "secondary", "news"
        public string UrlHash => $"#cat-{Slug}";
    }

    public class HomeCatalogResponse
    {
        public List<HomeCategoryDto> MainCategories { get; set; } = new();
        public List<HomeCategoryDto> SecondaryCategories { get; set; } = new();
        public List<HomeCategoryDto> NewsCategories { get; set; } = new();
    }

    public class TechNewsArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string Author { get; set; } = "NextPhone Tech Team";
        public string Category { get; set; } = "Tin hot công nghệ";
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public int ViewCount { get; set; } = 1250;
        public string AiSummary { get; set; } = string.Empty;
    }

    public class ProductVariantDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string ColorName { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#000000";
        public string? StorageCapacity { get; set; }
        public string? RamCapacity { get; set; }
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProductSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int DiscountPercent { get; set; }
        public decimal MemberDiscountPercent { get; set; }
        public decimal MemberPrice => BasePrice * (1 - (MemberDiscountPercent / 100m));
        
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public string? ScreenSpecs { get; set; }
        public string? Chipset { get; set; }
        public string? RamCapacity { get; set; }
        public string? StorageCapacity { get; set; }
        public string? BatteryCapacity { get; set; }
        
        public bool IsFeatured { get; set; }
        public bool IsHot { get; set; }
        public bool InStock { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }

        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    }

    public class ProductDetailDto : ProductSummaryDto
    {
        public string? Description { get; set; }
        public int WarrantyMonths { get; set; }
        public string? CameraSpecs { get; set; }
        public List<ProductReviewDto> Reviews { get; set; } = new List<ProductReviewDto>();
    }

    public class ProductReviewDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserAvatar { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public bool IsVerifiedPurchase { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProductFilterParameters
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public string? CategorySlug { get; set; }
        public int? BrandId { get; set; }
        public string? BrandSlug { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsHot { get; set; }
        
        // Sorting: "price_asc", "price_desc", "newest", "name"
        public string? SortBy { get; set; } = "newest";

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }
}

