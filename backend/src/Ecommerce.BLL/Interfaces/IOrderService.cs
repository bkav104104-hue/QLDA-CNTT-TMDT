using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto request, int? userId = null);
        Task<OrderResponseDto?> GetOrderByCodeAsync(string orderCode);
        Task<IEnumerable<OrderResponseDto>> GetUserOrdersAsync(int userId);
    }

    public interface ICouponService
    {
        Task<ApplyCouponResponseDto> ApplyCouponAsync(ApplyCouponRequestDto request);
        Task<CouponResponseDto?> GetCouponByCodeAsync(string code);
    }
}

