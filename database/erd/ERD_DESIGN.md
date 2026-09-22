# Sơ Đồ Thiết Kế Cơ Sở Dữ Liệu: NextPhoneDb (Entity-Relationship Diagram)

Hệ thống cơ sở dữ liệu quan hệ được thiết kế chuẩn hóa cho nền tảng thương mại điện tử công nghệ, tối ưu hóa cho mô hình N-Tier của ASP.NET Core và SQL Server.

---

## 📊 Sơ Đồ Quan Hệ Thực Thể (Mermaid ERD)

```mermaid
erDiagram
    Roles ||--o{ Users : "has"
    Users ||--o{ UserAddresses : "has"
    Users ||--o{ Orders : "places"
    Users ||--o{ ProductReviews : "writes"

    Brands ||--o{ Products : "manufactures"
    Categories ||--o{ Products : "contains"
    Categories ||--o{ Categories : "sub-category"

    Products ||--o{ ProductVariants : "has"
    Products ||--o{ ProductReviews : "receives"

    Orders ||--|{ OrderItems : "contains"
    ProductVariants ||--o{ OrderItems : "ordered_in"
    Orders ||--o{ Payments : "has"
    Coupons ||--o{ Orders : "applies_to"

    Roles {
        int Id PK
        string Name
        string Description
    }

    Users {
        int Id PK
        string FullName
        string Email
        string PhoneNumber UK
        string PasswordHash
        date DateOfBirth
        int RoleId FK
        string MemberTier
        int RewardPoints
        boolean IsActive
    }

    Brands {
        int Id PK
        string Name
        string Slug UK
        string Country
        string LogoUrl
    }

    Categories {
        int Id PK
        string Name
        string Slug UK
        int ParentId FK
        int DisplayOrder
    }

    Products {
        int Id PK
        string Name
        string Slug UK
        int BrandId FK
        int CategoryId FK
        decimal BasePrice
        decimal OriginalPrice
        int DiscountPercent
        decimal MemberDiscountPercent
        string RamCapacity
        string StorageCapacity
        string Chipset
        string BatteryCapacity
        boolean InStock
    }

    ProductVariants {
        int Id PK
        int ProductId FK
        string Sku UK
        string ColorName
        string ColorHex
        string StorageCapacity
        decimal Price
        int StockQuantity
    }

    Coupons {
        int Id PK
        string Code UK
        string Title
        string DiscountType
        decimal DiscountValue
        decimal MinOrderAmount
    }

    Orders {
        int Id PK
        string OrderCode UK
        int UserId FK
        string ReceiverName
        string ReceiverPhone
        string ShippingAddress
        decimal SubTotal
        decimal DiscountAmount
        decimal TotalAmount
        string OrderStatus
        string PaymentMethod
        string PaymentStatus
    }

    OrderItems {
        int Id PK
        int OrderId FK
        int ProductVariantId FK
        string ProductName
        string VariantSummary
        int Quantity
        decimal UnitPrice
        decimal TotalPrice
    }

    Payments {
        int Id PK
        int OrderId FK
        string PaymentMethod
        string TransactionCode
        decimal Amount
        string Status
    }

    ProductReviews {
        int Id PK
        int ProductId FK
        int UserId FK
        int Rating
        string Comment
        boolean IsVerifiedPurchase
    }
```

---

## 🗄️ Bảng Tóm Tắt Chức Năng Các Bảng

| Tên Bảng | Mục Đích Sử Dụng | Các Khóa Ngoại (Foreign Keys) |
| :--- | :--- | :--- |
| **`Roles`** | Quản lý vai trò người dùng (Admin, Customer, Staff) | Không có |
| **`Users`** | Quản lý hội viên NextPhone Member (SĐT, Email, điểm thưởng, hạng thẻ) | `RoleId` $\rightarrow$ `Roles(Id)` |
| **`UserAddresses`** | Sổ địa chỉ nhận hàng của khách hàng | `UserId` $\rightarrow$ `Users(Id)` |
| **`Brands`** | Danh sách hãng công nghệ (Apple, Samsung, Xiaomi, OPPO, Anker...) | Không có |
| **`Categories`** | Danh mục đa cấp (Điện thoại, Laptop, Phụ kiện...) | `ParentId` $\rightarrow$ `Categories(Id)` |
| **`Products`** | Thông tin sản phẩm chính, giá gốc, giá KM, cấu hình tóm tắt | `BrandId`, `CategoryId` |
| **`ProductVariants`**| Biến thể chi tiết theo màu sắc, bộ nhớ, SKU, tồn kho thực tế | `ProductId` $\rightarrow$ `Products(Id)` |
| **`Coupons`** | Mã khuyến mãi, voucher 100K cho thành viên mới, ưu đãi EDU | Không có |
| **`Orders`** | Đơn đặt hàng, thông tin giao nhận, trạng thái vận chuyển | `UserId`, `CouponId` |
| **`OrderItems`** | Từng mặt hàng cụ thể trong giỏ của đơn hàng | `OrderId`, `ProductVariantId` |
| **`Payments`** | Lịch sử giao dịch thanh toán (VNPay, MoMo, COD, Stripe) | `OrderId` $\rightarrow$ `Orders(Id)` |
| **`ProductReviews`**| Đánh giá sao (1-5) và bình luận trải nghiệm của khách | `ProductId`, `UserId` |

