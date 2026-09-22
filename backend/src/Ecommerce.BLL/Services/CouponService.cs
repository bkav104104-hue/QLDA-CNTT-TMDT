using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class CouponService : ICouponService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CouponService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApplyCouponResponseDto> ApplyCouponAsync(ApplyCouponRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return new ApplyCouponResponseDto
                {
                    IsValid = false,
                    Message = "Vui lòng nhập mã giảm giá.",
                    Code = string.Empty,
                    DiscountAmount = 0,
                    FinalAmount = request.OrderAmount
                };
            }

            var code = request.Code.Trim().ToUpperInvariant();
            var now = DateTime.UtcNow;

            var coupon = await _unitOfWork.Coupons.FirstOrDefaultAsync(c =>
                c.Code.ToUpper() == code &&
                c.IsActive &&
                c.StartDate <= now &&
                c.EndDate >= now);

            if (coupon == null)
            {
                return new ApplyCouponResponseDto
                {
                    IsValid = false,
                    Message = "Mã giảm giá không tồn tại hoặc đã hết hạn áp dụng.",
                    Code = code,
                    DiscountAmount = 0,
                    FinalAmount = request.OrderAmount
                };
            }

            if (coupon.UsedCount >= coupon.UsageLimit)
            {
                return new ApplyCouponResponseDto
                {
                    IsValid = false,
                    Message = "Mã giảm giá đã hết lượt sử dụng.",
                    Code = code,
                    DiscountAmount = 0,
                    FinalAmount = request.OrderAmount
                };
            }

            if (request.OrderAmount < coupon.MinOrderAmount)
            {
                return new ApplyCouponResponseDto
                {
                    IsValid = false,
                    Message = $"Đơn hàng tối thiểu phải từ {coupon.MinOrderAmount:N0} ₫ để áp dụng mã này.",
                    Code = code,
                    DiscountAmount = 0,
                    FinalAmount = request.OrderAmount
                };
            }

            decimal discount = 0;
            if (coupon.DiscountType.ToUpperInvariant() == "PERCENT")
            {
                discount = Math.Round(request.OrderAmount * (coupon.DiscountValue / 100m));
                if (coupon.MaxDiscountAmount.HasValue && discount > coupon.MaxDiscountAmount.Value)
                {
                    discount = coupon.MaxDiscountAmount.Value;
                }
            }
            else // FIXED
            {
                discount = coupon.DiscountValue;
            }

            discount = Math.Min(discount, request.OrderAmount);
            var finalAmount = Math.Max(0, request.OrderAmount - discount);

            return new ApplyCouponResponseDto
            {
                IsValid = true,
                Message = $"Áp dụng mã giảm giá '{coupon.Title}' thành công!",
                Code = coupon.Code,
                DiscountAmount = discount,
                FinalAmount = finalAmount
            };
        }

        public async Task<CouponResponseDto?> GetCouponByCodeAsync(string code)
        {
            var normalized = code.Trim().ToUpperInvariant();
            var coupon = await _unitOfWork.Coupons.FirstOrDefaultAsync(c => c.Code.ToUpper() == normalized && c.IsActive);
            return coupon == null ? null : _mapper.Map<CouponResponseDto>(coupon);
        }
    }
}

