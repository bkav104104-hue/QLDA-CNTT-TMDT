using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        #region 1. Dashboard & Reports
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(ApiResponse<AdminDashboardStatsDto>.SuccessResult(stats, "Lấy số liệu thống kê kinh doanh thành công"));
        }
        #endregion

        #region 2. Product Management (Seller role)
        [HttpGet("products")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _adminService.GetAllProductsAsync();
            return Ok(ApiResponse<IEnumerable<AdminProductListItemDto>>.SuccessResult(products, "Lấy danh sách sản phẩm quản trị thành công"));
        }

        [HttpGet("products/{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _adminService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(ApiResponse<AdminProductListItemDto>.ErrorResult($"Không tìm thấy sản phẩm #{id}", null, 404));
            }
            return Ok(ApiResponse<AdminProductListItemDto>.SuccessResult(product, "Lấy chi tiết sản phẩm thành công"));
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] AdminProductCreateUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.BasePrice <= 0)
            {
                return BadRequest(ApiResponse<AdminProductListItemDto>.ErrorResult("Tên sản phẩm và giá bán không được để trống", null, 400));
            }

            var created = await _adminService.CreateProductAsync(dto);
            return Ok(ApiResponse<AdminProductListItemDto>.SuccessResult(created, "Thêm sản phẩm mới lên sàn thành công!", 201));
        }

        [HttpPut("products/{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] AdminProductCreateUpdateDto dto)
        {
            var updated = await _adminService.UpdateProductAsync(id, dto);
            if (updated == null)
            {
                return NotFound(ApiResponse<AdminProductListItemDto>.ErrorResult($"Không tìm thấy sản phẩm #{id}", null, 404));
            }
            return Ok(ApiResponse<AdminProductListItemDto>.SuccessResult(updated, "Cập nhật thông tin sản phẩm thành công!"));
        }

        [HttpPatch("products/{id:int}/toggle-status")]
        public async Task<IActionResult> ToggleProductStatus(int id)
        {
            var result = await _adminService.ToggleProductStatusAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResult($"Không tìm thấy sản phẩm #{id}", null, 404));
            }
            return Ok(ApiResponse<bool>.SuccessResult(true, "Thay đổi trạng thái kinh doanh của sản phẩm thành công!"));
        }

        [HttpDelete("products/{id:int}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _adminService.DeleteProductAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<bool>.ErrorResult($"Không tìm thấy sản phẩm #{id}", null, 404));
            }
            return Ok(ApiResponse<bool>.SuccessResult(true, "Gỡ sản phẩm khỏi sàn thành công!"));
        }
        #endregion

        #region 3. Orders & Shipping Management
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _adminService.GetAllOrdersAsync();
            return Ok(ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResult(orders, "Lấy danh sách đơn hàng thành công"));
        }

        [HttpPut("orders/{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequestDto dto)
        {
            var updated = await _adminService.UpdateOrderStatusAsync(id, dto);
            if (updated == null)
            {
                return NotFound(ApiResponse<OrderResponseDto>.ErrorResult($"Không tìm thấy đơn hàng #{id}", null, 404));
            }
            return Ok(ApiResponse<OrderResponseDto>.SuccessResult(updated, $"Cập nhật trạng thái đơn hàng thành công: {dto.OrderStatus}"));
        }
        #endregion

        #region 4. Inventory & Stock Monitoring
        [HttpGet("inventory/alerts")]
        public async Task<IActionResult> GetLowStockAlerts([FromQuery] int threshold = 10)
        {
            var alerts = await _adminService.GetLowStockAlertsAsync(threshold);
            return Ok(ApiResponse<IEnumerable<LowStockAlertDto>>.SuccessResult(alerts, "Lấy danh sách cảnh báo tồn kho thành công"));
        }

        [HttpGet("inventory/logs")]
        public async Task<IActionResult> GetInventoryLogs()
        {
            var logs = await _adminService.GetInventoryLogsAsync();
            return Ok(ApiResponse<IEnumerable<InventoryLogDto>>.SuccessResult(logs, "Lấy lịch sử xuất nhập kho thành công"));
        }

        [HttpPost("inventory/import")]
        public async Task<IActionResult> CreateInventoryImport([FromBody] CreateInventoryImportDto dto)
        {
            if (dto.Quantity <= 0)
            {
                return BadRequest(ApiResponse<InventoryLogDto>.ErrorResult("Số lượng nhập kho phải lớn hơn 0", null, 400));
            }

            var userName = User.Identity?.Name ?? "Quản trị viên NextPhone";
            var log = await _adminService.CreateInventoryImportAsync(dto, userName);
            return Ok(ApiResponse<InventoryLogDto>.SuccessResult(log, "Tạo phiếu nhập hàng và cộng tồn kho thành công!", 201));
        }
        #endregion

        #region 5. Review Moderation (AI Flagged)
        [HttpGet("reviews/moderation")]
        public async Task<IActionResult> GetReviewsForModeration([FromQuery] bool? onlyFlagged = null)
        {
            var reviews = await _adminService.GetReviewsForModerationAsync(onlyFlagged);
            return Ok(ApiResponse<IEnumerable<ReviewModerationDto>>.SuccessResult(reviews, "Lấy danh sách kiểm duyệt đánh giá thành công"));
        }

        [HttpPut("reviews/{id:int}/moderate")]
        public async Task<IActionResult> ModerateReview(int id, [FromBody] ModerateReviewRequestDto dto)
        {
            var result = await _adminService.ModerateReviewAsync(id, dto);
            if (result == null)
            {
                return NotFound(ApiResponse<ReviewModerationDto>.ErrorResult($"Không tìm thấy đánh giá #{id}", null, 404));
            }
            return Ok(ApiResponse<ReviewModerationDto>.SuccessResult(result, $"Xử lý đánh giá thành công: {dto.ModerationStatus}"));
        }
        #endregion
    }
}

