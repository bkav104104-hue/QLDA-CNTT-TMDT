using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Interfaces
{
    public interface IAdminService
    {
        // 1. Dashboard & Reports
        Task<AdminDashboardStatsDto> GetDashboardStatsAsync();

        // 2. Product Management (Seller role)
        Task<IEnumerable<AdminProductListItemDto>> GetAllProductsAsync();
        Task<AdminProductListItemDto?> GetProductByIdAsync(int id);
        Task<AdminProductListItemDto> CreateProductAsync(AdminProductCreateUpdateDto dto);
        Task<AdminProductListItemDto?> UpdateProductAsync(int id, AdminProductCreateUpdateDto dto);
        Task<bool> ToggleProductStatusAsync(int id);
        Task<bool> DeleteProductAsync(int id);

        // 3. Orders & Shipping Management
        Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync();
        Task<OrderResponseDto?> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequestDto dto);

        // 4. Inventory & Stock Monitoring
        Task<IEnumerable<LowStockAlertDto>> GetLowStockAlertsAsync(int threshold = 10);
        Task<IEnumerable<InventoryLogDto>> GetInventoryLogsAsync();
        Task<InventoryLogDto> CreateInventoryImportAsync(CreateInventoryImportDto dto, string? createdBy);

        // 5. Review Moderation (AI Flagged)
        Task<IEnumerable<ReviewModerationDto>> GetReviewsForModerationAsync(bool? onlyFlagged = null);
        Task<ReviewModerationDto?> ModerateReviewAsync(int reviewId, ModerateReviewRequestDto dto);
    }
}

