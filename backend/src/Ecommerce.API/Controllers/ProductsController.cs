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
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterParameters parameters)
        {
            var pagedResult = await _productService.GetProductsAsync(parameters);
            return Ok(ApiResponse<PagedResult<ProductSummaryDto>>.SuccessResult(pagedResult, "Lấy danh sách sản phẩm thành công"));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(ApiResponse<ProductDetailDto>.ErrorResult($"Không tìm thấy sản phẩm với mã #{id}", null, 404));
            }

            return Ok(ApiResponse<ProductDetailDto>.SuccessResult(product, "Lấy chi tiết sản phẩm thành công"));
        }

        [HttpGet("by-slug/{slug}")]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _productService.GetProductBySlugAsync(slug);
            if (product == null)
            {
                return NotFound(ApiResponse<ProductDetailDto>.ErrorResult($"Không tìm thấy sản phẩm với đường dẫn '{slug}'", null, 404));
            }

            return Ok(ApiResponse<ProductDetailDto>.SuccessResult(product, "Lấy chi tiết sản phẩm thành công"));
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedProducts([FromQuery] int take = 8)
        {
            var products = await _productService.GetFeaturedProductsAsync(take);
            return Ok(ApiResponse<IEnumerable<ProductSummaryDto>>.SuccessResult(products, "Lấy danh sách sản phẩm nổi bật thành công"));
        }

        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts([FromQuery] int take = 8)
        {
            var products = await _productService.GetHotProductsAsync(take);
            return Ok(ApiResponse<IEnumerable<ProductSummaryDto>>.SuccessResult(products, "Lấy danh sách sản phẩm HOT thành công"));
        }
    }
}

