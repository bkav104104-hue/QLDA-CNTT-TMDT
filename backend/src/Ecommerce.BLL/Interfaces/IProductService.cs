using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.BLL.Interfaces
{
    public interface IProductService
    {
        Task<PagedResult<ProductSummaryDto>> GetProductsAsync(ProductFilterParameters filter);
        Task<ProductDetailDto?> GetProductByIdAsync(int id);
        Task<ProductDetailDto?> GetProductBySlugAsync(string slug);
        Task<IEnumerable<ProductSummaryDto>> GetFeaturedProductsAsync(int take = 8);
        Task<IEnumerable<ProductSummaryDto>> GetHotProductsAsync(int take = 8);
    }
}

