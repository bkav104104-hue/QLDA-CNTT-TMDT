# Kiến trúc Ứng dụng: Layered (N-Tier) Architecture

Backend được tổ chức theo chuẩn kiến trúc phân tầng **N-Tier (Layered Architecture)**, giúp phân tách rõ ràng trách nhiệm giữa các tầng, dễ dàng kiểm thử (Unit Test), bảo trì và mở rộng.

```
+-------------------------------------------------------------------------+
|                  1. PRESENTATION LAYER (Ecommerce.API)                  |
|  - Controllers: Nhận HTTP Request, trả về HTTP Response / DTOs          |
|  - Middlewares: Xử lý ngoại lệ toàn cục (Global Exception), Logging...   |
|  - Configurations: Dependency Injection (DI), Swagger, JWT Auth Config   |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                2. BUSINESS LOGIC LAYER (Ecommerce.BLL)                  |
|  - Services: Xử lý nghiệp vụ (ProductService, OrderService, Cart...)    |
|  - Interfaces: Khai báo hợp đồng dịch vụ (IProductService,...)          |
|  - Validators: Kiểm tra tính hợp lệ của dữ liệu đầu vào (FluentValidation|
|  - Mappings: Ánh xạ giữa Entity và DTO (AutoMapper / Mapster)           |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  3. DATA ACCESS LAYER (Ecommerce.DAL)                   |
|  - DbContext: Kết nối Entity Framework Core                             |
|  - Repositories: Thao tác CRUD trực tiếp với cơ sở dữ liệu              |
|  - UnitOfWork: Đảm bảo tính toàn vẹn của Transaction database            |
|  - Configurations: Fluent API cấu hình bảng, quan hệ, khóa chính/ngoại  |
+-------------------------------------------------------------------------+
                                     ^
                                     |
+------------------------------------+------------------------------------+
|                  4. SHARED / CORE LAYER (Ecommerce.Common)              |
|  (Được dùng chung qua lại giữa các tầng để tránh phụ thuộc vòng)        |
|  - Entities: Các thực thể CSDL (Product, Category, Order, User...)      |
|  - DTOs: Đối tượng truyền dữ liệu (Requests / Responses)                |
|  - Enums: Trạng thái đơn hàng, kích thước, màu sắc thời trang...       |
|  - Exceptions: Các custom exception chuẩn hóa cho ứng dụng             |
+-------------------------------------------------------------------------+
```

## Luồng luân chuyển dữ liệu (Data Flow):
1. **Client** gửi Request `GET /api/products` đến **Presentation Layer (Controllers)**.
2. Controller gọi **Business Logic Layer (Services)** thông qua Interface `IProductService`.
3. Service thực hiện kiểm tra logic nghiệp vụ, sau đó gọi **Data Access Layer (Repositories/UnitOfWork)** để lấy dữ liệu.
4. DAL thực hiện truy vấn xuống **Database (SQL Server / PostgreSQL)** thông qua EF Core.
5. Dữ liệu thực thể (`Entity`) từ Database được Service ánh xạ sang `DTO` và trả ngược về Controller -> Client.
