using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryBySlugAsync(string slug);
        Task<HomeCatalogResponse> GetHomeCatalogAsync();
    }

    public interface IBrandService
    {
        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();
        Task<BrandDto?> GetBrandBySlugAsync(string slug);
    }
}

