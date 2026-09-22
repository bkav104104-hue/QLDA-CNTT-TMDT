using System.Linq;
using AutoMapper;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.Entities;

namespace Ecommerce.BLL.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User Mappings
            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.Name : "Customer"));

            // Brand Mappings
            CreateMap<Brand, BrandDto>()
                .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));

            // Category Mappings
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count))
                .ForMember(dest => dest.SubCategories, opt => opt.MapFrom(src => src.SubCategories));

            // Product Variant Mappings
            CreateMap<ProductVariant, ProductVariantDto>();

            // Product Summary Mappings
            CreateMap<Product, ProductSummaryDto>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : string.Empty))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count))
                .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Any() ? src.Reviews.Average(r => r.Rating) : 5.0))
                .ForMember(dest => dest.Variants, opt => opt.MapFrom(src => src.Variants.Where(v => v.IsActive)));

            // Product Detail Mappings
            CreateMap<Product, ProductDetailDto>()
                .IncludeBase<Product, ProductSummaryDto>()
                .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews));

            // Product Review Mappings
            CreateMap<ProductReview, ProductReviewDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : "Khách hàng"));

            // Order Item Mappings
            CreateMap<OrderItem, OrderItemResponseDto>()
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ProductVariant != null ? src.ProductVariant.ImageUrl : null));

            // Order Mappings
            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.CouponCode, opt => opt.MapFrom(src => src.Coupon != null ? src.Coupon.Code : null))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

            // Coupon Mappings
            CreateMap<Coupon, CouponResponseDto>();
        }
    }
}

