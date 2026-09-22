using System;
using System.Collections.Generic;

namespace Ecommerce.Common.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public Category? Parent { get; set; }
        public string? IconName { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public int BrandId { get; set; }
        public Brand? Brand { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        
        public decimal BasePrice { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int DiscountPercent { get; set; } = 0;
        public decimal MemberDiscountPercent { get; set; } = 3.00m;
        public int WarrantyMonths { get; set; } = 12;

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

        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
        public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    }

    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string ColorName { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#000000";
        public string? StorageCapacity { get; set; }
        public string? RamCapacity { get; set; }
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int StockQuantity { get; set; } = 0;
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

