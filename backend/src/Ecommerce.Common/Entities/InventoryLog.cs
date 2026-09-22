using System;

namespace Ecommerce.Common.Entities
{
    public class InventoryLog
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int? ProductVariantId { get; set; }
        public ProductVariant? ProductVariant { get; set; }
        
        public string Type { get; set; } = "IMPORT"; // 'IMPORT', 'EXPORT', 'ADJUST'
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? SupplierOrDestination { get; set; }
        public string? Note { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

