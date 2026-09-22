using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.Constants;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.Entities;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICouponService _couponService;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, ICouponService couponService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _couponService = couponService;
            _mapper = mapper;
        }

        public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto request, int? userId = null)
        {
            if (request.Items == null || !request.Items.Any())
            {
                throw new ArgumentException("Đơn hàng phải có ít nhất 1 sản phẩm.");
            }

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                // 1. Validate Product Variants & Stock
                decimal subTotal = 0;
                var orderItemsToCreate = new List<OrderItem>();

                foreach (var itemReq in request.Items)
                {
                    var variant = await _unitOfWork.ProductVariants.Query()
                        .Include(pv => pv.Product)
                        .FirstOrDefaultAsync(pv => pv.Id == itemReq.ProductVariantId && pv.IsActive);

                    if (variant == null || variant.Product == null || !variant.Product.IsActive)
                    {
                        // Fallback to first available active variant if ID not found
                        variant = await _unitOfWork.ProductVariants.Query()
                            .Include(pv => pv.Product)
                            .FirstOrDefaultAsync(pv => pv.IsActive);
                    }

                    if (variant == null || variant.Product == null)
                    {
                        throw new InvalidOperationException($"Không tìm thấy sản phẩm hợp lệ trong hệ thống.");
                    }

                    if (variant.StockQuantity >= itemReq.Quantity)
                    {
                        variant.StockQuantity -= itemReq.Quantity;
                        _unitOfWork.ProductVariants.Update(variant);
                    }

                    var unitPrice = (itemReq.CustomPrice.HasValue && itemReq.CustomPrice.Value > 0)
                        ? itemReq.CustomPrice.Value
                        : variant.Price;

                    var itemTotal = unitPrice * itemReq.Quantity;
                    subTotal += itemTotal;

                    var summaryParts = new List<string>();
                    if (!string.IsNullOrEmpty(variant.StorageCapacity)) summaryParts.Add(variant.StorageCapacity);
                    if (!string.IsNullOrEmpty(variant.ColorName)) summaryParts.Add(variant.ColorName);
                    var defaultSummary = string.Join(" - ", summaryParts);
                    var variantSummary = !string.IsNullOrWhiteSpace(itemReq.VariantSummary)
                        ? itemReq.VariantSummary.Trim()
                        : defaultSummary;

                    var productName = !string.IsNullOrWhiteSpace(itemReq.ProductName)
                        ? itemReq.ProductName.Trim()
                        : variant.Product.Name;

                    orderItemsToCreate.Add(new OrderItem
                    {
                        ProductVariantId = variant.Id,
                        ProductName = productName,
                        VariantSummary = variantSummary,
                        Quantity = itemReq.Quantity,
                        UnitPrice = unitPrice,
                        TotalPrice = itemTotal
                    });
                }

                // 2. Validate and Apply Coupon if provided
                decimal discountAmount = 0;
                int? couponId = null;
                if (!string.IsNullOrWhiteSpace(request.CouponCode))
                {
                    var couponResult = await _couponService.ApplyCouponAsync(new ApplyCouponRequestDto
                    {
                        Code = request.CouponCode,
                        OrderAmount = subTotal
                    });

                    if (couponResult.IsValid)
                    {
                        discountAmount = couponResult.DiscountAmount;
                        var couponEntity = await _unitOfWork.Coupons.FirstOrDefaultAsync(c => c.Code.ToUpper() == request.CouponCode.Trim().ToUpper());
                        if (couponEntity != null)
                        {
                            couponId = couponEntity.Id;
                            couponEntity.UsedCount += 1;
                            _unitOfWork.Coupons.Update(couponEntity);
                        }
                    }
                }

                // 3. Shipping fee
                decimal shippingFee = 0; // Free shipping for NextPhone nationwide
                decimal totalAmount = Math.Max(0, subTotal - discountAmount + shippingFee);

                // 4. Generate unique Order Code: NP-XXXXXX
                string orderCode;
                var random = new Random();
                int attempts = 0;
                do
                {
                    orderCode = $"NP-{random.Next(100000, 999999)}";
                    attempts++;
                    if (attempts > 50)
                    {
                        orderCode = $"NP-{DateTime.UtcNow:yyMMddHHmmss}";
                        break;
                    }
                } while (await _unitOfWork.Orders.AnyAsync(o => o.OrderCode == orderCode));

                // 5. Append notes for preferences
                var fullNotes = new StringBuilder();
                if (!string.IsNullOrWhiteSpace(request.Notes))
                {
                    fullNotes.AppendLine(request.Notes.Trim());
                }
                if (request.TransferData)
                {
                    fullNotes.AppendLine("[Yêu cầu: Hỗ trợ chuyển dữ liệu, danh bạ sang máy mới]");
                }
                if (request.VatInvoice)
                {
                    fullNotes.AppendLine("[Yêu cầu: Xuất hóa đơn VAT cho công ty]");
                }
                if (request.DeliveryMethod == "store")
                {
                    fullNotes.AppendLine("[Hình thức: Nhận tại cửa hàng]");
                }

                // 6. Create Order Entity
                var order = new Order
                {
                    OrderCode = orderCode,
                    UserId = userId,
                    ReceiverName = request.ReceiverName.Trim(),
                    ReceiverPhone = request.ReceiverPhone.Trim(),
                    ReceiverEmail = string.IsNullOrWhiteSpace(request.ReceiverEmail) ? null : request.ReceiverEmail.Trim(),
                    ShippingAddress = request.ShippingAddress.Trim(),
                    SubTotal = subTotal,
                    DiscountAmount = discountAmount,
                    ShippingFee = shippingFee,
                    TotalAmount = totalAmount,
                    OrderStatus = AppConstants.OrderStatus.Pending,
                    PaymentMethod = request.PaymentMethod?.ToUpperInvariant() ?? AppConstants.PaymentMethod.COD,
                    PaymentStatus = AppConstants.PaymentStatus.Pending,
                    Notes = fullNotes.ToString().Trim(),
                    CouponId = couponId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                // 7. Attach OrderId to items and add
                foreach (var item in orderItemsToCreate)
                {
                    item.OrderId = order.Id;
                    await _unitOfWork.OrderItems.AddAsync(item);
                }

                // 8. Reward points for registered users
                if (userId.HasValue)
                {
                    var user = await _unitOfWork.Users.GetByIdAsync(userId.Value);
                    if (user != null)
                    {
                        var earnedPoints = (int)(totalAmount / 100000m); // 1 điểm cho mỗi 100k
                        user.RewardPoints += earnedPoints;
                        _unitOfWork.Users.Update(user);
                    }
                }

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitAsync();

                // 9. Return mapped DTO
                var createdOrder = await _unitOfWork.Orders.Query()
                    .Include(o => o.Coupon)
                    .Include(o => o.Items)
                        .ThenInclude(i => i.ProductVariant)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                return _mapper.Map<OrderResponseDto>(createdOrder ?? order);
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<OrderResponseDto?> GetOrderByCodeAsync(string orderCode)
        {
            var normalized = orderCode.Trim().ToUpperInvariant();
            var order = await _unitOfWork.Orders.Query()
                .AsNoTracking()
                .Include(o => o.Coupon)
                .Include(o => o.Items)
                    .ThenInclude(i => i.ProductVariant)
                .FirstOrDefaultAsync(o => o.OrderCode.ToUpper() == normalized);

            return order == null ? null : _mapper.Map<OrderResponseDto>(order);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _unitOfWork.Orders.Query()
                .AsNoTracking()
                .Include(o => o.Coupon)
                .Include(o => o.Items)
                    .ThenInclude(i => i.ProductVariant)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }
    }
}

