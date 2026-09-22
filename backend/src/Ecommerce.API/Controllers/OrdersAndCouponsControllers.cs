using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IValidator<CreateOrderRequestDto> _orderValidator;

        public OrdersController(
            IOrderService orderService,
            IValidator<CreateOrderRequestDto> orderValidator)
        {
            _orderService = orderService;
            _orderValidator = orderValidator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            var validationResult = await _orderValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.ConvertAll(e => e.ErrorMessage);
                return BadRequest(ApiResponse<OrderResponseDto>.ErrorResult("Thông tin đặt hàng không hợp lệ", errors));
            }

            int? userId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            if (User.IsInRole("Admin"))
            {
                return StatusCode(403, ApiResponse<OrderResponseDto>.ErrorResult("Tài khoản Quản trị viên (Admin) không được phép thực hiện đặt hàng trên sàn. Vui lòng sử dụng tài khoản Khách hàng.", null, 403));
            }

            var order = await _orderService.CreateOrderAsync(request, userId);
            return Ok(ApiResponse<OrderResponseDto>.SuccessResult(order, "Đặt hàng thành công!", 201));
        }

        [HttpGet("by-code/{orderCode}")]
        public async Task<IActionResult> GetOrderByCode(string orderCode)
        {
            var order = await _orderService.GetOrderByCodeAsync(orderCode);
            if (order == null)
            {
                return NotFound(ApiResponse<OrderResponseDto>.ErrorResult($"Không tìm thấy đơn hàng với mã '{orderCode}'", null, 404));
            }

            int? currentUserId = null;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
            {
                currentUserId = parsedId;
            }

            bool isAuthorizedUser = User.IsInRole("Admin") || (order.UserId.HasValue && order.UserId == currentUserId);

            if (!isAuthorizedUser)
            {
                // Mask sensitive personal information to prevent IDOR data harvesting
                order.ReceiverPhone = MaskPhone(order.ReceiverPhone);
                order.ReceiverEmail = MaskEmail(order.ReceiverEmail);
                order.ShippingAddress = MaskAddress(order.ShippingAddress);
            }

            return Ok(ApiResponse<OrderResponseDto>.SuccessResult(order, "Tra cứu đơn hàng thành công"));
        }

        private static string MaskPhone(string? phone)
        {
            if (string.IsNullOrWhiteSpace(phone) || phone.Length < 6) return "****";
            return phone.Substring(0, 3) + "****" + phone.Substring(phone.Length - 3);
        }

        private static string? MaskEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains('@')) return null;
            var parts = email.Split('@');
            var name = parts[0];
            var maskedName = name.Length <= 2 ? name[0] + "***" : name.Substring(0, 2) + "***" + name.Substring(name.Length - 1);
            return $"{maskedName}@{parts[1]}";
        }

        private static string MaskAddress(string? address)
        {
            if (string.IsNullOrWhiteSpace(address)) return "";
            var parts = address.Split(',');
            if (parts.Length > 1)
            {
                return "***, " + parts[^1].Trim();
            }
            return address.Length > 10 ? address.Substring(0, 5) + " ***" : "***";
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResult("Vui lòng đăng nhập", null, 401));
            }

            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResult(orders, "Lấy danh sách đơn hàng thành công"));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponsController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyCoupon([FromBody] ApplyCouponRequestDto request)
        {
            var result = await _couponService.ApplyCouponAsync(request);
            if (!result.IsValid)
            {
                return BadRequest(ApiResponse<ApplyCouponResponseDto>.ErrorResult(result.Message, null, 400));
            }

            return Ok(ApiResponse<ApplyCouponResponseDto>.SuccessResult(result, result.Message));
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var coupon = await _couponService.GetCouponByCodeAsync(code);
            if (coupon == null)
            {
                return NotFound(ApiResponse<CouponResponseDto>.ErrorResult($"Không tìm thấy mã giảm giá '{code}'", null, 404));
            }

            return Ok(ApiResponse<CouponResponseDto>.SuccessResult(coupon, "Lấy thông tin mã giảm giá thành công"));
        }
    }
}

