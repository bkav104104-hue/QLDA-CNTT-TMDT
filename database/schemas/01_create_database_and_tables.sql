-- ============================================================================
-- Hệ Thống Thương Mại Điện Tử NextPhone (Điện Thoại & Phụ Kiện Công Nghệ)
-- CƠ SỞ DỮ LIỆU: NextPhoneDb (Microsoft SQL Server)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'NextPhoneDb')
BEGIN
    CREATE DATABASE NextPhoneDb;
END
GO

USE NextPhoneDb;
GO

-- 1. BẢNG PHÂN QUYỀN (Roles)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(250) NULL
    );
END
GO

-- 2. BẢNG NGƯỜI DÙNG (Users - NextPhone Member)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NULL,
        PhoneNumber VARCHAR(20) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NULL,
        DateOfBirth DATE NULL,
        AvatarUrl NVARCHAR(500) NULL,
        RoleId INT NOT NULL DEFAULT 2, -- 1: Admin, 2: Customer, 3: Staff
        MemberTier NVARCHAR(30) NOT NULL DEFAULT N'Thành viên Mới', -- 'Thành viên Mới', 'Bạc', 'Vàng', 'Kim Cương', 'EDU'
        RewardPoints INT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id)
    );
END
GO

-- 3. BẢNG ĐỊA CHỈ GIAO HÀNG (UserAddresses)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserAddresses')
BEGIN
    CREATE TABLE UserAddresses (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ReceiverName NVARCHAR(150) NOT NULL,
        ReceiverPhone VARCHAR(20) NOT NULL,
        Province NVARCHAR(100) NOT NULL,
        District NVARCHAR(100) NOT NULL,
        Ward NVARCHAR(100) NOT NULL,
        DetailedAddress NVARCHAR(255) NOT NULL,
        IsDefault BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_UserAddresses_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );
END
GO

-- 4. BẢNG THƯƠNG HIỆU CÔNG NGHỆ (Brands)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Brands')
BEGIN
    CREATE TABLE Brands (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL UNIQUE,
        Slug VARCHAR(100) NOT NULL UNIQUE,
        LogoUrl NVARCHAR(500) NULL,
        Country NVARCHAR(100) NULL,
        IsActive BIT NOT NULL DEFAULT 1
    );
END
GO

-- 5. BẢNG DANH MỤC SẢN PHẨM (Categories)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        Slug VARCHAR(150) NOT NULL UNIQUE,
        Description NVARCHAR(500) NULL,
        ParentId INT NULL,
        IconName VARCHAR(50) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CONSTRAINT FK_Categories_Parent FOREIGN KEY (ParentId) REFERENCES Categories(Id)
    );
END
GO

-- 6. BẢNG SẢN PHẨM CHÍNH (Products)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(255) NOT NULL,
        Slug VARCHAR(255) NOT NULL UNIQUE,
        BrandId INT NOT NULL,
        CategoryId INT NOT NULL,
        Description NVARCHAR(MAX) NULL,
        ThumbnailUrl NVARCHAR(500) NULL,
        BasePrice DECIMAL(18, 2) NOT NULL,
        OriginalPrice DECIMAL(18, 2) NULL,
        DiscountPercent INT NOT NULL DEFAULT 0,
        MemberDiscountPercent DECIMAL(5, 2) NOT NULL DEFAULT 3.00, -- Chiết khấu riêng cho member (3-5%)
        WarrantyMonths INT NOT NULL DEFAULT 12,
        
        -- Thông số kỹ thuật tóm tắt hiển thị trên Card
        RamCapacity VARCHAR(20) NULL,      -- '8GB', '12GB'
        StorageCapacity VARCHAR(20) NULL,  -- '128GB', '256GB', '512GB'
        Chipset NVARCHAR(100) NULL,        -- 'Snapdragon 8 Gen 3', 'Apple A18 Pro'
        BatteryCapacity VARCHAR(30) NULL,  -- '5000mAh', '4500mAh'
        ScreenSpecs NVARCHAR(150) NULL,    -- 'AMOLED 120Hz 6.7 inch'
        CameraSpecs NVARCHAR(150) NULL,    -- '108MP + 12MP + 5MP'

        IsFeatured BIT NOT NULL DEFAULT 0,
        IsHot BIT NOT NULL DEFAULT 0,
        InStock BIT NOT NULL DEFAULT 1,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Products_Brands FOREIGN KEY (BrandId) REFERENCES Brands(Id),
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
    );
END
GO

-- 7. BẢNG BIẾN THỂ SẢN PHẨM (ProductVariants: Màu sắc, Bộ nhớ)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductVariants')
BEGIN
    CREATE TABLE ProductVariants (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId INT NOT NULL,
        Sku VARCHAR(50) NOT NULL UNIQUE,
        ColorName NVARCHAR(50) NOT NULL,      -- 'Titan Tự Nhiên', 'Xanh Dương', 'Đen Midnight'
        ColorHex VARCHAR(20) NOT NULL,        -- '#38bdf8', '#000000'
        StorageCapacity VARCHAR(20) NULL,     -- '256GB'
        RamCapacity VARCHAR(20) NULL,         -- '12GB'
        Price DECIMAL(18, 2) NOT NULL,
        OriginalPrice DECIMAL(18, 2) NULL,
        StockQuantity INT NOT NULL DEFAULT 0,
        ImageUrl NVARCHAR(500) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CONSTRAINT FK_ProductVariants_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
    );
END
GO

-- 8. BẢNG MÃ GIẢM GIÁ / VOUCHER (Coupons)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Coupons')
BEGIN
    CREATE TABLE Coupons (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Code VARCHAR(50) NOT NULL UNIQUE,
        Title NVARCHAR(150) NOT NULL,
        DiscountType VARCHAR(20) NOT NULL DEFAULT 'FIXED', -- 'FIXED' (tiền cố định) hoặc 'PERCENT' (phần trăm)
        DiscountValue DECIMAL(18, 2) NOT NULL,
        MinOrderAmount DECIMAL(18, 2) NOT NULL DEFAULT 0,
        MaxDiscountAmount DECIMAL(18, 2) NULL,
        StartDate DATETIME2 NOT NULL,
        EndDate DATETIME2 NOT NULL,
        UsageLimit INT NOT NULL DEFAULT 1000,
        UsedCount INT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1
    );
END
GO

-- 9. BẢNG ĐƠN HÀNG (Orders)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderCode VARCHAR(30) NOT NULL UNIQUE,
        UserId INT NULL, -- NULL nếu mua vãng lai không đăng nhập
        ReceiverName NVARCHAR(150) NOT NULL,
        ReceiverPhone VARCHAR(20) NOT NULL,
        ReceiverEmail NVARCHAR(150) NULL,
        ShippingAddress NVARCHAR(500) NOT NULL,
        
        SubTotal DECIMAL(18, 2) NOT NULL,
        DiscountAmount DECIMAL(18, 2) NOT NULL DEFAULT 0,
        ShippingFee DECIMAL(18, 2) NOT NULL DEFAULT 0,
        TotalAmount DECIMAL(18, 2) NOT NULL,
        
        OrderStatus NVARCHAR(50) NOT NULL DEFAULT N'Chờ xác nhận', 
        -- N'Chờ xác nhận', N'Đã xác nhận', N'Đang đóng gói', N'Đang giao hàng', N'Đã giao thành công', N'Đã hủy'
        
        PaymentMethod NVARCHAR(50) NOT NULL DEFAULT N'COD', 
        -- N'COD', N'VNPAY', N'MOMO', N'ZALOPAY', N'STRIPE'
        
        PaymentStatus NVARCHAR(50) NOT NULL DEFAULT N'Chưa thanh toán', 
        -- N'Chưa thanh toán', N'Đã thanh toán', N'Hoàn tiền'
        
        Notes NVARCHAR(500) NULL,
        CouponId INT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
        CONSTRAINT FK_Orders_Coupons FOREIGN KEY (CouponId) REFERENCES Coupons(Id)
    );
END
GO

-- 10. BẢNG CHI TIẾT ĐƠN HÀNG (OrderItems)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        ProductVariantId INT NOT NULL,
        ProductName NVARCHAR(255) NOT NULL,
        VariantSummary NVARCHAR(150) NULL, -- 'Màu Xanh Dương / 256GB'
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(18, 2) NOT NULL,
        TotalPrice DECIMAL(18, 2) NOT NULL,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_ProductVariants FOREIGN KEY (ProductVariantId) REFERENCES ProductVariants(Id)
    );
END
GO

-- 11. BẢNG GIAO DỊCH THANH TOÁN (Payments)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Payments')
BEGIN
    CREATE TABLE Payments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OrderId INT NOT NULL,
        PaymentMethod VARCHAR(50) NOT NULL,
        TransactionCode VARCHAR(100) NULL,
        Amount DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(50) NOT NULL, -- 'Pending', 'Success', 'Failed'
        ResponseJson NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id)
    );
END
GO

-- 12. BẢNG ĐÁNH GIÁ SẢN PHẨM (ProductReviews)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductReviews')
BEGIN
    CREATE TABLE ProductReviews (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProductId INT NOT NULL,
        UserId INT NOT NULL,
        Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment NVARCHAR(1000) NOT NULL,
        ImagesJson NVARCHAR(MAX) NULL,
        IsVerifiedPurchase BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ProductReviews_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE,
        CONSTRAINT FK_ProductReviews_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
END
GO

-- TẠO CÁC CHỈ MỤC TĂNG TỐC TRUY VẤN (Indexes)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_BrandId')
    CREATE INDEX IX_Products_BrandId ON Products(BrandId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_CategoryId')
    CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Products_BasePrice')
    CREATE INDEX IX_Products_BasePrice ON Products(BasePrice);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Orders_OrderCode')
    CREATE INDEX IX_Orders_OrderCode ON Orders(OrderCode);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Orders_UserId')
    CREATE INDEX IX_Orders_UserId ON Orders(UserId);
GO

