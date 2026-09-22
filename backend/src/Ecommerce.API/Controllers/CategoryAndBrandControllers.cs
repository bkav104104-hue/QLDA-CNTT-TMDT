using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<IEnumerable<CategoryDto>>.SuccessResult(categories, "Lấy danh mục sản phẩm thành công"));
        }

        [HttpGet("home-catalog")]
        public async Task<IActionResult> GetHomeCatalog()
        {
            var catalog = await _categoryService.GetHomeCatalogAsync();
            return Ok(ApiResponse<HomeCatalogResponse>.SuccessResult(catalog, "Lấy danh mục trang chủ thành công"));
        }

        [HttpGet("by-slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var category = await _categoryService.GetCategoryBySlugAsync(slug);
            if (category == null)
            {
                return NotFound(ApiResponse<CategoryDto>.ErrorResult($"Không tìm thấy danh mục '{slug}'", null, 404));
            }

            return Ok(ApiResponse<CategoryDto>.SuccessResult(category, "Lấy thông tin danh mục thành công"));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _brandService.GetAllBrandsAsync();
            return Ok(ApiResponse<IEnumerable<BrandDto>>.SuccessResult(brands, "Lấy danh sách thương hiệu thành công"));
        }

        [HttpGet("by-slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var brand = await _brandService.GetBrandBySlugAsync(slug);
            if (brand == null)
            {
                return NotFound(ApiResponse<BrandDto>.ErrorResult($"Không tìm thấy thương hiệu '{slug}'", null, 404));
            }

            return Ok(ApiResponse<BrandDto>.SuccessResult(brand, "Lấy thông tin thương hiệu thành công"));
        }
    }
}

