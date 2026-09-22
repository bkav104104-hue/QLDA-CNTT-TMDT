# 📱 NextPhone - Hệ Thống Thương Mại Điện Tử Điện Thoại & Phụ Kiện Tích Hợp AI

> **NextPhone** là nền tảng thương mại điện tử chuyên biệt cho lĩnh vực **công nghệ, smartphone và phụ kiện**, hỗ trợ đa nền tảng (**Web & Mobile App**), tích hợp cổng thanh toán trực tuyến VietQR / Thẻ tín dụng và trợ lý AI thông minh cùng hệ thống quản trị chuyên nghiệp cho Admin & Người bán.

---

## 🏛️ Kiến Trúc Dự Án

### 1. Kiến trúc hệ thống: **Client - Server Architecture**
* **Client Tier:**
  * **Web Client:** Xây dựng bằng **React 18**, **TypeScript**, **Vite**, **Tailwind CSS** phục vụ khách hàng trên máy tính và cổng quản trị riêng biệt (**Admin & Seller Portal**).
  * **Mobile Client:** Xây dựng bằng **React Native (Expo SDK 52)** đa nền tảng (**iOS & Android**) mang lại trải nghiệm mua sắm mượt mà trên thiết bị di động.
* **Server Tier:**
  * **ASP.NET Core Web API (C# .NET 10):** Đóng vai trò máy chủ trung tâm xử lý nghiệp vụ, xác thực JWT, phân quyền, kiểm duyệt AI và kết nối cơ sở dữ liệu.
* **Data Tier & CSDL:**
  * **Database:** SQL Server (LocalDB / SQLEXPRESS) với Entity Framework Core 10.
  * **Cổng thanh toán:** Hỗ trợ thanh toán VietQR mã động và thanh toán thẻ tín dụng bảo mật OTP.

### 2. Kiến trúc ứng dụng: **Layered (N-Tier) Architecture** (Backend C# .NET 10)
* **Presentation Layer (`Ecommerce.API`):** Controllers, Middlewares xử lý lỗi toàn cục, cấu hình JWT Bearer, Swagger UI.
* **Business Logic Layer (`Ecommerce.BLL`):** Services (Admin, Sản phẩm, Đơn hàng, Giỏ hàng, Thanh toán, Danh mục, Tin tức), Validators (FluentValidation), Mappings (AutoMapper).
* **Data Access Layer (`Ecommerce.DAL`):** Entity Framework Core ApplicationDbContext, Repositories, UnitOfWork pattern.
* **Common / Core Layer (`Ecommerce.Common`):** Entities (Sản phẩm, Đơn hàng, Người dùng, Đánh giá, Nhật ký kho), DTOs, Enums, Constants, ApiResponse wrapper.

---

## ✨ Tính Năng Nổi Bật

1. **Sàn Mua Sắm NextPhone**:
   - Trang chủ hiện đại với Banner, danh mục phân cấp URL hash (`#cat-dienthoai`, `#cat-phukien`, `#cat-tinhotcongnghe`...).
   - Chi tiết sản phẩm với chọn phiên bản bộ nhớ, màu sắc, thông số kỹ thuật và tóm tắt đánh giá bằng Gemini AI.
   - Giỏ hàng thông minh, áp dụng mã giảm giá, hỗ trợ đặt hàng giao tận nơi hoặc nhận tại siêu thị.
   - Cổng thanh toán trực tuyến riêng (VietQR quét mã thanh toán tức thì & thẻ tín dụng có mã OTP kiểm thử).
   - Tra cứu và xem chi tiết lịch sử thanh toán / đơn hàng đã mua.
   - Hồ sơ người dùng Smember, bảo mật đổi mật khẩu, phân cấp hạng thành viên.

2. **Kênh Quản Trị & Người Bán (Admin & Seller Portal)**:
   - Giao diện quản trị riêng biệt với bảo mật xác thực cấp cao (Admin Guard Screen).
   - Quản lý danh mục sản phẩm (xem, thêm mới, chỉnh sửa, gỡ / ngừng bán).
   - Giám sát kho hàng & lập phiếu nhập kho, tự động cảnh báo sản phẩm sắp cạn kho ($\le 5$ chiếc).
   - Tiếp nhận đơn đặt hàng và cập nhật quy trình vận chuyển kèm mã vận đơn.
   - Báo cáo kinh doanh: Doanh thu tổng, doanh thu ngày/tháng, biểu đồ 7 ngày, top sản phẩm, xuất file báo cáo CSV.
   - Kiểm duyệt nội dung đánh giá độc hại do AI gắn cờ cảnh báo (AI Moderation).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cơ sở dữ liệu:
- Chạy các script SQL trong thư mục `database/run_all.sql` hoặc `database/schemas/01_create_database_and_tables.sql` và `database/seeds/02_seed_initial_data.sql` trên SQL Server.

### 2. Khởi chạy Backend (.NET 10 Web API)
```powershell
cd backend/src/Ecommerce.API
dotnet run --launch-profile http
```
- API lắng nghe tại: **`http://localhost:5245`**

### 3. Khởi chạy Web Client (React + Vite)
```powershell
cd web
npm install
npm run dev
```
- Truy cập ứng dụng tại: **`http://localhost:3000`**

### 4. Tài khoản kiểm thử mẫu:
- **Quản trị viên (Admin)**: `0901234567` / `NextPhone@2026`
- **Khách hàng (Customer)**: `0912345678` / `NextPhone@2026`
