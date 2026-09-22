using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<ProductSummaryDto>> GetProductsAsync(ProductFilterParameters filter)
        {
            var query = _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.Reviews)
                .Where(p => p.IsActive);

            // Filter by Search text
            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var search = filter.Search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(search) || 
                                         p.Slug.ToLower().Contains(search) ||
                                         (p.Chipset != null && p.Chipset.ToLower().Contains(search)));
            }

            // Filter by Category
            if (filter.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(filter.CategorySlug))
            {
                query = query.Where(p => p.Category != null && p.Category.Slug == filter.CategorySlug.Trim());
            }

            // Filter by Brand
            if (filter.BrandId.HasValue)
            {
                query = query.Where(p => p.BrandId == filter.BrandId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(filter.BrandSlug))
            {
                query = query.Where(p => p.Brand != null && p.Brand.Slug == filter.BrandSlug.Trim());
            }

            // Filter by Price range
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(p => p.BasePrice >= filter.MinPrice.Value);
            }
            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(p => p.BasePrice <= filter.MaxPrice.Value);
            }

            // Filter by Featured / Hot
            if (filter.IsFeatured.HasValue)
            {
                query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);
            }
            if (filter.IsHot.HasValue)
            {
                query = query.Where(p => p.IsHot == filter.IsHot.Value);
            }

            // Sorting
            query = filter.SortBy?.ToLowerInvariant() switch
            {
                "price_asc" => query.OrderBy(p => p.BasePrice),
                "price_desc" => query.OrderByDescending(p => p.BasePrice),
                "name" => query.OrderBy(p => p.Name),
                "popular" => query.OrderByDescending(p => p.Reviews.Count),
                _ => query.OrderByDescending(p => p.CreatedAt) // "newest"
            };

            var totalCount = await query.CountAsync();
            var pageNumber = Math.Max(1, filter.PageNumber);
            var pageSize = Math.Clamp(filter.PageSize, 1, 50);

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<ProductSummaryDto>>(items);
            return new PagedResult<ProductSummaryDto>(dtos, totalCount, pageNumber, pageSize);
        }

        public async Task<ProductDetailDto?> GetProductByIdAsync(int id)
        {
            var product = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants.Where(v => v.IsActive))
                .Include(p => p.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

            return product == null ? null : _mapper.Map<ProductDetailDto>(product);
        }

        public async Task<ProductDetailDto?> GetProductBySlugAsync(string slug)
        {
            var normalizedSlug = slug.Trim().ToLowerInvariant();
            var product = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants.Where(v => v.IsActive))
                .Include(p => p.Reviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(p => p.Slug.ToLower() == normalizedSlug && p.IsActive);

            return product == null ? null : _mapper.Map<ProductDetailDto>(product);
        }

        public async Task<IEnumerable<ProductSummaryDto>> GetFeaturedProductsAsync(int take = 8)
        {
            var products = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants.Where(v => v.IsActive))
                .Include(p => p.Reviews)
                .Where(p => p.IsActive && p.IsFeatured)
                .OrderByDescending(p => p.CreatedAt)
                .Take(take)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ProductSummaryDto>>(products);
        }

        public async Task<IEnumerable<ProductSummaryDto>> GetHotProductsAsync(int take = 8)
        {
            var products = await _unitOfWork.Products.Query()
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.Variants.Where(v => v.IsActive))
                .Include(p => p.Reviews)
                .Where(p => p.IsActive && p.IsHot)
                .OrderByDescending(p => p.CreatedAt)
                .Take(take)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ProductSummaryDto>>(products);
        }
    }
}

