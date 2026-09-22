using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.Query()
                .AsNoTracking()
                .Include(c => c.Products)
                .Include(c => c.SubCategories)
                .Where(c => c.IsActive && c.ParentId == null)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto?> GetCategoryBySlugAsync(string slug)
        {
            var raw = slug.Trim().ToLowerInvariant();
            var noHyphen = raw.Replace("-", "");
            var category = await _unitOfWork.Categories.Query()
                .AsNoTracking()
                .Include(c => c.Products)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => (c.Slug.ToLower() == raw || c.Slug.ToLower().Replace("-", "") == noHyphen) && c.IsActive);

            return category == null ? null : _mapper.Map<CategoryDto>(category);
        }

        public async Task<HomeCatalogResponse> GetHomeCatalogAsync()
        {
            var categories = await _unitOfWork.Categories.Query()
                .AsNoTracking()
                .Include(c => c.Products)
                .Include(c => c.SubCategories)
                .Where(c => c.IsActive && c.ParentId == null)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            var response = new HomeCatalogResponse();

            foreach (var cat in categories)
            {
                var dto = new HomeCategoryDto
                {
                    Id = cat.Id,
                    Name = cat.Name,
                    Slug = cat.Slug,
                    IconName = cat.IconName,
                    ParentId = cat.ParentId,
                    DisplayOrder = cat.DisplayOrder,
                    ProductCount = cat.Products?.Count(p => p.IsActive) ?? 0,
                    SubCategories = _mapper.Map<List<CategoryDto>>(cat.SubCategories)
                };

                // Group categorization
                if (cat.Slug == "tinhotcongnghe" || cat.Slug == "tin-hot-cong-nghe")
                {
                    dto.Group = "news";
                    dto.IsHot = true;
                    response.NewsCategories.Add(dto);
                }
                else if (cat.Slug == "hangcu" || cat.Slug == "hang-cu" || cat.Slug == "thucudoimoi" || cat.Slug == "thu-cu-doi-moi")
                {
                    dto.Group = "secondary";
                    if (cat.Slug.Contains("thucu")) dto.Badge = "Trợ giá 100K";
                    response.SecondaryCategories.Add(dto);
                }
                else
                {
                    dto.Group = "main";
                    if (cat.Slug == "dienthoai" || cat.Slug == "phukien") dto.IsHot = true;
                    response.MainCategories.Add(dto);
                }
            }

            return response;
        }
    }

    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var brands = await _unitOfWork.Brands.Query()
                .AsNoTracking()
                .Include(b => b.Products)
                .Where(b => b.IsActive)
                .OrderBy(b => b.Name)
                .ToListAsync();

            return _mapper.Map<IEnumerable<BrandDto>>(brands);
        }

        public async Task<BrandDto?> GetBrandBySlugAsync(string slug)
        {
            var normalized = slug.Trim().ToLowerInvariant();
            var brand = await _unitOfWork.Brands.Query()
                .AsNoTracking()
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.Slug.ToLower() == normalized && b.IsActive);

            return brand == null ? null : _mapper.Map<BrandDto>(brand);
        }
    }
}

