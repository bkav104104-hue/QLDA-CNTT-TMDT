using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private static readonly List<TechNewsArticleDto> SampleArticles = new()
        {
            new TechNewsArticleDto
            {
                Id = 1,
                Title = "Đánh giá chi tiết iPhone 17 Pro Max: Khung viền Titan bóng, chip A19 Pro và tản nhiệt buồng hơi vượt trội",
                Slug = "danh-gia-chi-tiet-iphone-17-pro-max-titan-a19-pro",
                Summary = "Apple tiếp tục khẳng định vị thế dẫn đầu phân khúc smartphone cao cấp với iPhone 17 Pro Max, sở hữu chip A19 Pro 3nm thế hệ thứ ba, cụm camera telephoto 48MP zoom tiềm vọng 10x và công nghệ AI Apple Intelligence tiếng Việt chuẩn xác.",
                Content = "iPhone 17 Pro Max là bước chuyển mình mạnh mẽ của Apple khi trang bị khung viền Titan mạ PVD siêu bền, hệ thống tản nhiệt buồng hơi graphene giúp máy mát hơn 30% khi chơi game nặng. Cụm camera Fusion 48MP cho chất lượng chụp đêm và quay video 8K ProRes đỉnh cao.",
                ThumbnailUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
                Author = "NextPhone Reviewer",
                Category = "Đánh giá công nghệ",
                PublishedAt = DateTime.UtcNow.AddHours(-3),
                ViewCount = 4820,
                AiSummary = "iPhone 17 Pro Max nâng cấp tản nhiệt graphene, chip A19 Pro mạnh hơn 25%, camera zoom 10x quang học và hỗ trợ đầy đủ tiếng Việt cho trợ lý Apple Intelligence."
            },
            new TechNewsArticleDto
            {
                Id = 2,
                Title = "So sánh sạc nhanh GaN 65W và sạc truyền thống: Tại sao bạn nên đổi củ sạc ngay hôm nay?",
                Slug = "so-sanh-sac-nhanh-gan-65w-va-sac-truyen-thong",
                Summary = "Công nghệ bán dẫn GaN (Gallium Nitride) giúp giảm kích thước củ sạc tới 50% trong khi tăng gấp đôi hiệu suất truyền tải điện năng, an toàn nhiệt độ tối ưu cho các thiết bị iPhone và laptop hiện đại.",
                Content = "Củ sạc GaN 65W cho phép sạc đồng thời 3 thiết bị với phân bổ công suất thông minh Power Delivery 3.1. Nhờ vật liệu bán dẫn thế hệ mới, củ sạc giảm thiểu 40% nhiệt lượng tỏa ra so với củ sạc silicon truyền thống.",
                ThumbnailUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
                Author = "NextPhone Lab",
                Category = "Tư vấn phụ kiện",
                PublishedAt = DateTime.UtcNow.AddHours(-8),
                ViewCount = 2950,
                AiSummary = "Sạc GaN 65W nhỏ gọn hơn 50%, sạc nhanh 3 thiết bị cùng lúc, tỏa ít nhiệt hơn và bảo vệ tuổi thọ pin điện thoại."
            },
            new TechNewsArticleDto
            {
                Id = 3,
                Title = "Chương trình Thu Cũ Đổi Mới tại NextPhone: Trợ giá thêm 100.000đ - 5.000.000đ khi lên đời smartphone 2026",
                Slug = "chuong-trinh-thu-cu-doi-moi-tro-gia-tai-nextphone",
                Summary = "Khách hàng có thể mang điện thoại cũ bất kể tình trạng đến NextPhone để được định giá bằng AI trong 3 phút, nhận thêm voucher trợ giá độc quyền cho thành viên Smember.",
                Content = "NextPhone hợp tác cùng các đối tác kiểm định hàng đầu áp dụng công nghệ AI Scan để kiểm tra tình trạng máy cũ trong 3 phút. Khách hàng lên đời iPhone, Samsung hoặc OPPO sẽ nhận ngay mức trợ giá trực tiếp vào hóa đơn.",
                ThumbnailUrl = "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
                Author = "NextPhone Promotions",
                Category = "Tin tức khuyến mãi",
                PublishedAt = DateTime.UtcNow.AddDays(-1),
                ViewCount = 6120,
                AiSummary = "Định giá máy cũ bằng AI siêu nhanh, trợ giá trực tiếp lên đến 5 triệu đồng, thủ tục đơn giản nhận máy ngay trong ngày."
            },
            new TechNewsArticleDto
            {
                Id = 4,
                Title = "OPPO Find X9s và Dimensity 9400: Bước nhảy vọt về AI on-device và nhiếp ảnh quang học Hasselblad",
                Slug = "oppo-find-x9s-dimensity-9400-ai-hasselblad",
                Summary = "OPPO ra mắt Find X9s với màn hình OLED 1.5K 120Hz siêu sáng 4500 nits, cảm biến ảnh 1 inch phối hợp cùng huyền thoại nhiếp ảnh Thụy Điển Hasselblad và hệ thống AI tự động xóa vật thể tức thì.",
                Content = "Find X9s mang đến trải nghiệm camera ấn tượng với khả năng chụp ảnh telephoto chân dung đạt chuẩn studio. Chip Dimensity 9400 tiến trình 3nm tối ưu điện năng cực tốt, kết hợp sạc nhanh SuperVOOC 80W sạc đầy chỉ 32 phút.",
                ThumbnailUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
                Author = "Tech Insight",
                Category = "Tin hot công nghệ",
                PublishedAt = DateTime.UtcNow.AddDays(-2),
                ViewCount = 3840,
                AiSummary = "OPPO Find X9s đột phá với chip Dimensity 9400, camera Hasselblad chân dung xóa phông tự nhiên và pin lớn 5800mAh."
            }
        };

        [HttpGet]
        public IActionResult GetAllNews()
        {
            return Ok(ApiResponse<IEnumerable<TechNewsArticleDto>>.SuccessResult(
                SampleArticles.OrderByDescending(a => a.PublishedAt), 
                "Lấy danh sách tin tức công nghệ thành công"));
        }

        [HttpGet("hot")]
        public IActionResult GetHotNews()
        {
            return Ok(ApiResponse<IEnumerable<TechNewsArticleDto>>.SuccessResult(
                SampleArticles.OrderByDescending(a => a.ViewCount).Take(4), 
                "Lấy danh sách tin hot công nghệ thành công"));
        }

        [HttpGet("{slug}")]
        public IActionResult GetBySlug(string slug)
        {
            var article = SampleArticles.FirstOrDefault(a => 
                a.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase) || 
                a.Slug.Replace("-", "").Equals(slug.Replace("-", ""), StringComparison.OrdinalIgnoreCase));

            if (article == null)
            {
                return NotFound(ApiResponse<TechNewsArticleDto>.ErrorResult($"Không tìm thấy bài viết '{slug}'", null, 404));
            }

            return Ok(ApiResponse<TechNewsArticleDto>.SuccessResult(article, "Lấy thông tin bài viết thành công"));
        }
    }
}

