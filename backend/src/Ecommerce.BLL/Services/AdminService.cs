using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.Entities;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        #region 1. Dashboard & Reports
        public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.UtcNow;
            var today = now.Date;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            var orders = await _unitOfWork.Orders.Query()
                .AsNoTracking()
                .Include(o => o.Items)
                .ToListAsync();

            var products = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Variants)
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .ToListAsync();

            var reviews = await _unitOfWork.ProductReviews.Query()
                .AsNoTracking()
                .ToListAsync();

            var validOrders = orders.Where(o => o.OrderStatus != "Đã hủy").ToList();

            var stats = new AdminDashboardStatsDto
            {
                TotalRevenue = validOrders.Sum(o => o.TotalAmount),
                RevenueToday = validOrders.Where(o => o.CreatedAt.Date == today).Sum(o => o.TotalAmount),
                RevenueThisMonth = validOrders.Where(o => o.CreatedAt >= startOfMonth).Sum(o => o.TotalAmount),
                TotalOrders = orders.Count,
                PendingOrdersCount = orders.Count(o => o.OrderStatus == "Chờ xác nhận"),
                ShippingOrdersCount = orders.Count(o => o.OrderStatus == "Đang vận chuyển" || o.OrderStatus == "Đã xác nhận & Đang đóng gói"),
                CompletedOrdersCount = orders.Count(o => o.OrderStatus == "Giao hàng thành công"),
                TotalProducts = products.Count,
                ActiveProductsCount = products.Count(p => p.IsActive),
                LowStockProductsCount = products.Count(p => p.Variants.Any(v => v.StockQuantity <= 5) || !p.InStock),
                FlaggedReviewsCount = reviews.Count(r => r.IsFlaggedByAi && r.ModerationStatus == "Pending")
            };

            // 7 Days Daily Revenue Chart
            for (int i = 6; i >= 0; i--)
            {
                var targetDate = today.AddDays(-i);
                var dayOrders = validOrders.Where(o => o.CreatedAt.Date == targetDate).ToList();
                stats.RevenueChart.Add(new DailyRevenuePointDto
                {
                    Date = targetDate.ToString("dd/MM"),
                    Revenue = dayOrders.Sum(o => o.TotalAmount),
                    OrderCount = dayOrders.Count
                });
            }

            // Top Selling Products
            var itemGroups = orders
                .Where(o => o.OrderStatus != "Đã hủy")
                .SelectMany(o => o.Items)
                .GroupBy(i => i.ProductName)
                .Select(g => new
                {
                    Name = g.Key,
                    SoldCount = g.Sum(x => x.Quantity),
                    Revenue = g.Sum(x => x.TotalPrice)
                })
                .OrderByDescending(x => x.SoldCount)
                .Take(5)
                .ToList();

            foreach (var item in itemGroups)
            {
                var prod = products.FirstOrDefault(p => p.Name == item.Name);
                stats.TopProducts.Add(new TopSellingProductDto
                {
                    ProductId = prod?.Id ?? 0,
                    Name = item.Name,
                    ThumbnailUrl = prod?.ThumbnailUrl ?? "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
                    SoldCount = item.SoldCount,
                    Revenue = item.Revenue,
                    CurrentStock = prod?.Variants.Sum(v => v.StockQuantity) ?? 0
                });
            }

            return stats;
        }
        #endregion

        #region 2. Product Management (Seller role)
        public async Task<IEnumerable<AdminProductListItemDto>> GetAllProductsAsync()
        {
            var products = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return products.Select(p => new AdminProductListItemDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                BrandId = p.BrandId,
                BrandName = p.Brand?.Name ?? "Khác",
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "Khác",
                BasePrice = p.BasePrice,
                OriginalPrice = p.OriginalPrice,
                DiscountPercent = p.DiscountPercent,
                MemberDiscountPercent = p.MemberDiscountPercent,
                TotalStockQuantity = p.Variants.Sum(v => v.StockQuantity),
                InStock = p.InStock,
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                IsHot = p.IsHot,
                ThumbnailUrl = p.ThumbnailUrl,
                WarrantyMonths = p.WarrantyMonths,
                Chipset = p.Chipset,
                RamCapacity = p.RamCapacity,
                StorageCapacity = p.StorageCapacity,
                BatteryCapacity = p.BatteryCapacity,
                ScreenSpecs = p.ScreenSpecs,
                CameraSpecs = p.CameraSpecs,
                Description = p.Description,
                CreatedAt = p.CreatedAt
            });
        }

        public async Task<AdminProductListItemDto?> GetProductByIdAsync(int id)
        {
            var p = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(prod => prod.Brand)
                .Include(prod => prod.Category)
                .Include(prod => prod.Variants)
                .FirstOrDefaultAsync(prod => prod.Id == id);

            if (p == null) return null;

            return new AdminProductListItemDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                BrandId = p.BrandId,
                BrandName = p.Brand?.Name ?? "Khác",
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "Khác",
                BasePrice = p.BasePrice,
                OriginalPrice = p.OriginalPrice,
                DiscountPercent = p.DiscountPercent,
                MemberDiscountPercent = p.MemberDiscountPercent,
                TotalStockQuantity = p.Variants.Sum(v => v.StockQuantity),
                InStock = p.InStock,
                IsActive = p.IsActive,
                IsFeatured = p.IsFeatured,
                IsHot = p.IsHot,
                ThumbnailUrl = p.ThumbnailUrl,
                WarrantyMonths = p.WarrantyMonths,
                Chipset = p.Chipset,
                RamCapacity = p.RamCapacity,
                StorageCapacity = p.StorageCapacity,
                BatteryCapacity = p.BatteryCapacity,
                ScreenSpecs = p.ScreenSpecs,
                CameraSpecs = p.CameraSpecs,
                Description = p.Description,
                CreatedAt = p.CreatedAt
            };
        }

        public async Task<AdminProductListItemDto> CreateProductAsync(AdminProductCreateUpdateDto dto)
        {
            var slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Name) : dto.Slug.Trim().ToLowerInvariant();
            
            // Ensure unique slug
            var existingSlug = await _unitOfWork.Products.Query().AnyAsync(p => p.Slug == slug);
            if (existingSlug)
            {
                slug = $"{slug}-{DateTime.UtcNow.Ticks % 10000}";
            }

            var product = new Product
            {
                Name = dto.Name.Trim(),
                Slug = slug,
                BrandId = dto.BrandId,
                CategoryId = dto.CategoryId,
                BasePrice = dto.BasePrice,
                OriginalPrice = dto.OriginalPrice ?? (dto.BasePrice * 1.15m),
                DiscountPercent = dto.DiscountPercent,
                MemberDiscountPercent = dto.MemberDiscountPercent,
                WarrantyMonths = dto.WarrantyMonths,
                Description = dto.Description,
                ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) 
                    ? "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80" 
                    : dto.ThumbnailUrl.Trim(),
                RamCapacity = dto.RamCapacity,
                StorageCapacity = dto.StorageCapacity,
                Chipset = dto.Chipset,
                BatteryCapacity = dto.BatteryCapacity,
                ScreenSpecs = dto.ScreenSpecs,
                CameraSpecs = dto.CameraSpecs,
                IsFeatured = dto.IsFeatured,
                IsHot = dto.IsHot,
                InStock = dto.InitialStockQuantity > 0,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            // Create standard variant with initial stock
            var variant = new ProductVariant
            {
                ProductId = product.Id,
                Sku = $"NP-{product.Id}-STD",
                ColorName = "Tiêu chuẩn",
                ColorHex = "#009981",
                RamCapacity = dto.RamCapacity,
                StorageCapacity = dto.StorageCapacity,
                Price = dto.BasePrice,
                OriginalPrice = dto.OriginalPrice,
                StockQuantity = dto.InitialStockQuantity,
                ImageUrl = product.ThumbnailUrl,
                IsActive = true
            };

            await _unitOfWork.ProductVariants.AddAsync(variant);

            // Log Initial Stock in Inventory
            if (dto.InitialStockQuantity > 0)
            {
                var log = new InventoryLog
                {
                    ProductId = product.Id,
                    ProductVariantId = variant.Id,
                    Type = "IMPORT",
                    Quantity = dto.InitialStockQuantity,
                    UnitPrice = dto.BasePrice * 0.8m,
                    SupplierOrDestination = "Nhà phân phối ủy quyền NextPhone",
                    Note = "Khởi tạo sản phẩm & lô hàng đầu tiên trên sàn",
                    CreatedBy = "Admin / Người bán",
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.InventoryLogs.AddAsync(log);
            }

            await _unitOfWork.SaveChangesAsync();

            return (await GetProductByIdAsync(product.Id))!;
        }

        public async Task<AdminProductListItemDto?> UpdateProductAsync(int id, AdminProductCreateUpdateDto dto)
        {
            var product = await _unitOfWork.Products.Query()
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return null;

            product.Name = dto.Name.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Slug))
            {
                product.Slug = dto.Slug.Trim().ToLowerInvariant();
            }
            product.BrandId = dto.BrandId;
            product.CategoryId = dto.CategoryId;
            product.BasePrice = dto.BasePrice;
            product.OriginalPrice = dto.OriginalPrice;
            product.DiscountPercent = dto.DiscountPercent;
            product.MemberDiscountPercent = dto.MemberDiscountPercent;
            product.WarrantyMonths = dto.WarrantyMonths;
            product.Description = dto.Description;
            if (!string.IsNullOrWhiteSpace(dto.ThumbnailUrl))
            {
                product.ThumbnailUrl = dto.ThumbnailUrl.Trim();
            }
            product.RamCapacity = dto.RamCapacity;
            product.StorageCapacity = dto.StorageCapacity;
            product.Chipset = dto.Chipset;
            product.BatteryCapacity = dto.BatteryCapacity;
            product.ScreenSpecs = dto.ScreenSpecs;
            product.CameraSpecs = dto.CameraSpecs;
            product.IsFeatured = dto.IsFeatured;
            product.IsHot = dto.IsHot;
            product.IsActive = dto.IsActive;

            // Sync main variant price
            var mainVariant = product.Variants.FirstOrDefault();
            if (mainVariant != null)
            {
                mainVariant.Price = dto.BasePrice;
                mainVariant.OriginalPrice = dto.OriginalPrice;
                mainVariant.IsActive = dto.IsActive;
            }

            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync();

            return (await GetProductByIdAsync(id))!;
        }

        public async Task<bool> ToggleProductStatusAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            product.IsActive = !product.IsActive;
            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            // Soft delete by deactivating
            product.IsActive = false;
            product.InStock = false;
            _unitOfWork.Products.Update(product);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region 3. Orders & Shipping Management
        public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _unitOfWork.Orders.Query()
                .AsNoTracking()
                .Include(o => o.Items)
                .Include(o => o.Payments)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<OrderResponseDto?> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequestDto dto)
        {
            var order = await _unitOfWork.Orders.Query()
                .Include(o => o.Items)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) return null;

            var previousStatus = order.OrderStatus;
            var newStatus = dto.OrderStatus.Trim();

            order.OrderStatus = newStatus;

            if (!string.IsNullOrWhiteSpace(dto.PaymentStatus))
            {
                order.PaymentStatus = dto.PaymentStatus.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.TrackingCode))
            {
                order.Notes = (string.IsNullOrWhiteSpace(order.Notes) ? "" : order.Notes + " | ") + 
                    $"Mã vận đơn: {dto.TrackingCode} ({dto.ShippingProvider ?? "Đơn vị vận chuyển liên kết"})";
            }

            if (!string.IsNullOrWhiteSpace(dto.AdminNote))
            {
                order.Notes = (string.IsNullOrWhiteSpace(order.Notes) ? "" : order.Notes + " | ") + dto.AdminNote;
            }

            // 1. If order was NOT cancelled and is now CANCELLED: Restore stock to inventory
            if (previousStatus != "Đã hủy" && newStatus == "Đã hủy")
            {
                foreach (var item in order.Items)
                {
                    var variant = await _unitOfWork.ProductVariants.GetByIdAsync(item.ProductVariantId);
                    if (variant != null)
                    {
                        variant.StockQuantity += item.Quantity;
                        _unitOfWork.ProductVariants.Update(variant);

                        await _unitOfWork.InventoryLogs.AddAsync(new InventoryLog
                        {
                            ProductId = variant.ProductId,
                            ProductVariantId = variant.Id,
                            Type = "ADJUST",
                            Quantity = item.Quantity,
                            UnitPrice = item.UnitPrice,
                            SupplierOrDestination = "Khách hủy đơn",
                            Note = $"Hoàn tồn kho từ đơn hàng bị hủy #{order.OrderCode}",
                            CreatedBy = "Hệ thống Quản trị",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }
            }

            // 2. If order completed: Mark as paid and award Smember reward points
            if (previousStatus != "Giao hàng thành công" && newStatus == "Giao hàng thành công")
            {
                if (order.PaymentStatus != "Đã thanh toán")
                {
                    order.PaymentStatus = "Đã thanh toán";
                }

                if (order.UserId.HasValue)
                {
                    var customer = await _unitOfWork.Users.GetByIdAsync(order.UserId.Value);
                    if (customer != null)
                    {
                        var points = (int)(order.TotalAmount / 100000m); // 1 điểm cho mỗi 100k
                        if (points > 0)
                        {
                            customer.RewardPoints += points;
                            _unitOfWork.Users.Update(customer);
                        }
                    }
                }
            }

            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<OrderResponseDto>(order);
        }
        #endregion

        #region 4. Inventory & Stock Monitoring
        public async Task<IEnumerable<LowStockAlertDto>> GetLowStockAlertsAsync(int threshold = 10)
        {
            var products = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Where(p => p.IsActive)
                .ToListAsync();

            var alerts = new List<LowStockAlertDto>();

            foreach (var p in products)
            {
                var totalStock = p.Variants.Sum(v => v.StockQuantity);
                if (totalStock <= threshold || !p.InStock)
                {
                    alerts.Add(new LowStockAlertDto
                    {
                        ProductId = p.Id,
                        ProductName = p.Name,
                        ThumbnailUrl = p.ThumbnailUrl,
                        CategoryName = p.Category?.Name ?? "Điện thoại",
                        CurrentStock = totalStock,
                        AlertThreshold = threshold,
                        Severity = totalStock <= 3 ? "CRITICAL" : "WARNING"
                    });
                }
            }

            return alerts.OrderBy(a => a.CurrentStock);
        }

        public async Task<IEnumerable<InventoryLogDto>> GetInventoryLogsAsync()
        {
            var logs = await _unitOfWork.InventoryLogs.Query()
                .AsNoTracking()
                .Include(l => l.Product)
                .OrderByDescending(l => l.CreatedAt)
                .Take(100)
                .ToListAsync();

            return logs.Select(l => new InventoryLogDto
            {
                Id = l.Id,
                ProductId = l.ProductId,
                ProductName = l.Product?.Name ?? $"Sản phẩm #{l.ProductId}",
                ProductVariantId = l.ProductVariantId,
                Type = l.Type,
                Quantity = l.Quantity,
                UnitPrice = l.UnitPrice,
                SupplierOrDestination = l.SupplierOrDestination,
                Note = l.Note,
                CreatedBy = l.CreatedBy,
                CreatedAt = l.CreatedAt
            });
        }

        public async Task<InventoryLogDto> CreateInventoryImportAsync(CreateInventoryImportDto dto, string? createdBy)
        {
            var product = await _unitOfWork.Products.Query()
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == dto.ProductId);

            if (product == null)
            {
                throw new ArgumentException($"Không tìm thấy sản phẩm #{dto.ProductId}");
            }

            // Update variant stock
            var variant = dto.ProductVariantId.HasValue 
                ? product.Variants.FirstOrDefault(v => v.Id == dto.ProductVariantId.Value) 
                : product.Variants.FirstOrDefault();

            if (variant == null)
            {
                variant = new ProductVariant
                {
                    ProductId = product.Id,
                    Sku = $"NP-{product.Id}-STD",
                    ColorName = "Tiêu chuẩn",
                    ColorHex = "#009981",
                    Price = product.BasePrice,
                    StockQuantity = dto.Quantity,
                    IsActive = true
                };
                await _unitOfWork.ProductVariants.AddAsync(variant);
            }
            else
            {
                variant.StockQuantity += dto.Quantity;
                variant.IsActive = true;
                _unitOfWork.ProductVariants.Update(variant);
            }

            product.InStock = true;
            _unitOfWork.Products.Update(product);

            var log = new InventoryLog
            {
                ProductId = product.Id,
                ProductVariantId = variant.Id,
                Type = "IMPORT",
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice ?? (product.BasePrice * 0.8m),
                SupplierOrDestination = string.IsNullOrWhiteSpace(dto.SupplierOrDestination) ? "Nhà phân phối ủy quyền NextPhone" : dto.SupplierOrDestination.Trim(),
                Note = dto.Note?.Trim() ?? "Nhập bổ sung hàng vào kho",
                CreatedBy = createdBy ?? "Admin / Người bán",
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.InventoryLogs.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();

            return new InventoryLogDto
            {
                Id = log.Id,
                ProductId = log.ProductId,
                ProductName = product.Name,
                ProductVariantId = log.ProductVariantId,
                Type = log.Type,
                Quantity = log.Quantity,
                UnitPrice = log.UnitPrice,
                SupplierOrDestination = log.SupplierOrDestination,
                Note = log.Note,
                CreatedBy = log.CreatedBy,
                CreatedAt = log.CreatedAt
            };
        }
        #endregion

        #region 5. Review Moderation (AI Flagged)
        public async Task<IEnumerable<ReviewModerationDto>> GetReviewsForModerationAsync(bool? onlyFlagged = null)
        {
            var query = _unitOfWork.ProductReviews.Query()
                .AsNoTracking()
                .Include(r => r.Product)
                .Include(r => r.User)
                .AsQueryable();

            if (onlyFlagged == true)
            {
                query = query.Where(r => r.IsFlaggedByAi);
            }

            var reviews = await query
                .OrderByDescending(r => r.IsFlaggedByAi)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews.Select(r => new ReviewModerationDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                ProductName = r.Product?.Name ?? $"Sản phẩm #{r.ProductId}",
                UserId = r.UserId,
                UserName = r.User?.FullName ?? "Khách hàng ẩn danh",
                UserPhone = r.User?.PhoneNumber,
                Rating = r.Rating,
                Comment = r.Comment,
                IsVerifiedPurchase = r.IsVerifiedPurchase,
                IsFlaggedByAi = r.IsFlaggedByAi,
                AiFlagReason = r.AiFlagReason,
                AiFlagConfidence = r.AiFlagConfidence,
                ModerationStatus = r.ModerationStatus,
                AdminResponse = r.AdminResponse,
                CreatedAt = r.CreatedAt
            });
        }

        public async Task<ReviewModerationDto?> ModerateReviewAsync(int reviewId, ModerateReviewRequestDto dto)
        {
            var review = await _unitOfWork.ProductReviews.Query()
                .Include(r => r.Product)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null) return null;

            review.ModerationStatus = dto.ModerationStatus.Trim(); // "Approved" or "Rejected"
            if (!string.IsNullOrWhiteSpace(dto.AdminResponse))
            {
                review.AdminResponse = dto.AdminResponse.Trim();
            }

            _unitOfWork.ProductReviews.Update(review);
            await _unitOfWork.SaveChangesAsync();

            return new ReviewModerationDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                ProductName = review.Product?.Name ?? $"Sản phẩm #{review.ProductId}",
                UserId = review.UserId,
                UserName = review.User?.FullName ?? "Khách hàng",
                UserPhone = review.User?.PhoneNumber,
                Rating = review.Rating,
                Comment = review.Comment,
                IsVerifiedPurchase = review.IsVerifiedPurchase,
                IsFlaggedByAi = review.IsFlaggedByAi,
                AiFlagReason = review.AiFlagReason,
                AiFlagConfidence = review.AiFlagConfidence,
                ModerationStatus = review.ModerationStatus,
                AdminResponse = review.AdminResponse,
                CreatedAt = review.CreatedAt
            };
        }
        #endregion

        #region Helpers
        private static string GenerateSlug(string phrase)
        {
            string str = RemoveAccent(phrase).ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 80 ? str.Length : 80).Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            return str;
        }

        private static string RemoveAccent(string text)
        {
            string[] accented = {
                "aAeEoOuUiIdDyY",
                "áàạảãâấầậẩẫăắằặẳẵ",
                "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
                "éèẹẻẽêếềệểễ",
                "ÉÈẸẺẼÊẾỀỆỂỄ",
                "óòọỏõôốồộổỗơớờợởỡ",
                "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
                "úùụủũưứừựửữ",
                "ÚÙỤỦŨƯỨỪỰỬỮ",
                "íìịỉĩ",
                "ÍÌỊỈĨ",
                "đ",
                "Đ",
                "ýỳỵỷỹ",
                "ÝỲỴỶỸ"
            };

            for (int i = 1; i < accented.Length; i++)
            {
                for (int j = 0; j < accented[i].Length; j++)
                    text = text.Replace(accented[i][j], accented[0][i - 1]);
            }
            return text;
        }
        #endregion
    }
}

