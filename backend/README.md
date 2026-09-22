# Backend (.NET Web API - N-Tier Architecture)

Thư mục backend được xây dựng bằng **C# .NET (ASP.NET Core Web API)** tuân thủ kiến trúc phân tầng **N-Tier**.

## Cấu trúc thư mục chi tiết:

```text
backend/
|-- src/
|   |-- Ecommerce.API/             # [Presentation Layer] Tiếp nhận request, controller, middleware, JWT
|   |   |-- Controllers/           # AuthController, ProductController, OrderController, CartController...
|   |   |-- Middlewares/           # GlobalExceptionMiddleware, JwtMiddleware...
|   |   `-- Configurations/        # DependencyInjection, SwaggerSetup, DbContextSetup...
|   |
|   |-- Ecommerce.BLL/             # [Business Logic Layer] Xử lý nghiệp vụ
|   |   |-- Services/              # ProductService, OrderService, PaymentService, AIService...
|   |   |-- Interfaces/            # IProductService, IOrderService...
|   |   |-- Validators/            # FluentValidation rules
|   |   `-- Mappings/              # AutoMapper profiles
|   |
|   |-- Ecommerce.DAL/             # [Data Access Layer] Tương tác cơ sở dữ liệu
|   |   |-- Context/               # ApplicationDbContext (EF Core)
|   |   |-- Repositories/          # GenericRepository, ProductRepository, OrderRepository...
|   |   |-- Interfaces/            # IGenericRepository, IUnitOfWork...
|   |   `-- Configurations/        # Fluent API cấu hình bảng (Entity Configurations)
|   |
|   `-- Ecommerce.Common/          # [Shared / Domain Layer] Thực thể & DTO dùng chung
|       |-- Entities/              # User, Product, Category, Variant, Order, OrderItem...
|       |-- DTOs/                  # Data Transfer Objects (Requests & Responses)
|       |-- Enums/                 # OrderStatus, PaymentStatus, Size (S, M, L, XL), Color...
|       |-- Exceptions/            # Custom NotFoundException, BadRequestException...
|       `-- Constants/             # Application constants, Role definitions...
|
`-- tests/
    |-- Ecommerce.Tests.Unit/          # Unit tests cho BLL & Services
    `-- Ecommerce.Tests.Integration/   # Integration tests cho API endpoints
```
