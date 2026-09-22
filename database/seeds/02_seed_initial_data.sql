-- ============================================================================
-- Hệ Thống Thương Mại Điện Tử NextPhone
-- DỮ LIỆU KHỞI TẠO (SEED DATA) CHO MICROSOFT SQL SERVER
-- ============================================================================

USE NextPhoneDb;
GO

SET NOCOUNT ON;

-- 1. SEED ROLES
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Name = 'Admin')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES 
    ('Admin', N'Quản trị viên toàn quyền hệ thống'),
    ('Customer', N'Khách hàng thành viên NextPhone Member'),
    ('Staff', N'Nhân viên bán hàng & chăm sóc khách hàng');
END
GO

-- 2. SEED SAMPLE USERS
-- Mật khẩu mặc định hash BCrypt: 'NextPhone@2026'
IF NOT EXISTS (SELECT 1 FROM Users WHERE PhoneNumber = '0901234567')
BEGIN
    INSERT INTO Users (FullName, Email, PhoneNumber, PasswordHash, DateOfBirth, RoleId, MemberTier, RewardPoints)
    VALUES 
    (N'Quản Trị Viên NextPhone', 'admin@nextphone.vn', '0901234567', '$2a$11$eYx5qHfZ8qAevgKkPvKZZOaH4F98E1qC.k31PZkGjUvBqjC9.aX12', '1995-05-15', 1, N'Kim Cương', 1500),
    (N'Huy Hoàng', 'huyhoang@gmail.com', '0987654321', '$2a$11$eYx5qHfZ8qAevgKkPvKZZOaH4F98E1qC.k31PZkGjUvBqjC9.aX12', '2002-10-20', 2, N'Thành viên Mới', 200),
    (N'Nguyễn Văn A', 'nguyenvana@gmail.com', '0912345678', '$2a$11$eYx5qHfZ8qAevgKkPvKZZOaH4F98E1qC.k31PZkGjUvBqjC9.aX12', '1998-03-12', 2, N'Vàng', 850);
END
GO

-- 3. SEED BRANDS (Thương Hiệu)
IF NOT EXISTS (SELECT 1 FROM Brands WHERE Slug = 'apple')
BEGIN
    INSERT INTO Brands (Name, Slug, Country, LogoUrl) VALUES
    ('Apple', 'apple', N'Hoa Kỳ', '/assets/brands/apple.png'),
    ('Samsung', 'samsung', N'Hàn Quốc', '/assets/brands/samsung.png'),
    ('Xiaomi', 'xiaomi', N'Trung Quốc', '/assets/brands/xiaomi.png'),
    ('OPPO', 'oppo', N'Trung Quốc', '/assets/brands/oppo.png'),
    ('HONOR', 'honor', N'Trung Quốc', '/assets/brands/honor.png'),
    ('Anker', 'anker', N'Hoa Kỳ', '/assets/brands/anker.png'),
    ('Sony', 'sony', N'Nhật Bản', '/assets/brands/sony.png');
END
GO

-- 4. SEED CATEGORIES (Danh Mục)
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Slug = 'dien-thoai')
BEGIN
    INSERT INTO Categories (Name, Slug, Description, DisplayOrder, IconName) VALUES
    (N'Điện thoại', 'dien-thoai', N'Smartphone chính hãng Apple, Samsung, Xiaomi...', 1, 'Smartphone'),
    (N'Laptop', 'laptop', N'Laptop văn phòng, gaming đồ họa cao cấp', 2, 'Laptop'),
    (N'Tablet', 'tablet', N'Máy tính bảng iPad, Samsung Tab...', 3, 'Tablet'),
    (N'Phụ kiện', 'phu-kien', N'Cáp sạc GaN, ốp lưng, pin dự phòng', 4, 'Cable'),
    (N'Âm thanh', 'am-thanh', N'Tai nghe không dây TWS, loa bluetooth', 5, 'Headphones'),
    (N'Đồng hồ thông minh', 'dong-ho', N'Smartwatch theo dõi sức khỏe, Apple Watch', 6, 'Watch');
END
GO

-- 5. SEED PRODUCTS (Sản Phẩm Khớp Giao Diện Frontend)
DECLARE @BrandHonor INT = (SELECT Id FROM Brands WHERE Slug = 'honor');
DECLARE @BrandOppo INT = (SELECT Id FROM Brands WHERE Slug = 'oppo');
DECLARE @BrandSamsung INT = (SELECT Id FROM Brands WHERE Slug = 'samsung');
DECLARE @BrandXiaomi INT = (SELECT Id FROM Brands WHERE Slug = 'xiaomi');
DECLARE @BrandApple INT = (SELECT Id FROM Brands WHERE Slug = 'apple');
DECLARE @BrandAnker INT = (SELECT Id FROM Brands WHERE Slug = 'anker');

DECLARE @CatPhone INT = (SELECT Id FROM Categories WHERE Slug = 'dien-thoai');
DECLARE @CatAccessory INT = (SELECT Id FROM Categories WHERE Slug = 'phu-kien');

IF NOT EXISTS (SELECT 1 FROM Products WHERE Slug = 'honor-x7d-5g-8gb-256gb')
BEGIN
    INSERT INTO Products (
        Name, Slug, BrandId, CategoryId, BasePrice, OriginalPrice, DiscountPercent, MemberDiscountPercent,
        RamCapacity, StorageCapacity, Chipset, BatteryCapacity, ScreenSpecs, CameraSpecs,
        IsFeatured, IsHot, InStock, Description
    ) VALUES
    (
        N'HONOR X7d 5G 8GB/256GB', 'honor-x7d-5g-8gb-256gb', @BrandHonor, @CatPhone,
        6490000, 6990000, 7, 2.73,
        '8GB', '256GB', 'Snapdragon 6 Gen 1', '6000mAh', 'TFT LCD 6.8 inch 90Hz', '108MP + 2MP',
        1, 1, 1, N'Điện thoại HONOR X7d 5G pin trâu 6000mAh, camera 108MP sắc nét, độ bền chuẩn quân đội.'
    ),
    (
        N'OPPO Find X9s 12GB/256GB', 'oppo-find-x9s-12gb-256gb', @BrandOppo, @CatPhone,
        21090000, 24990000, 16, 1.20,
        '12GB', '256GB', 'Dimensity 9400', '5630mAh', 'AMOLED 1.5K 120Hz', '50MP + 50MP + 50MP Hasselblad',
        1, 1, 1, N'Flagship cao cấp OPPO Find X9s thiết kế sang trọng, camera Hasselblad hàng đầu.'
    ),
    (
        N'Samsung Galaxy A37 5G - 8GB/128GB', 'samsung-galaxy-a37-5g-8gb-128gb', @BrandSamsung, @CatPhone,
        9290000, 10790000, 14, 1.19,
        '8GB', '128GB', 'Exynos 1480', '5000mAh', 'Super AMOLED 120Hz', '50MP OIS + 12MP + 5MP',
        1, 0, 1, N'Samsung Galaxy A37 5G màn hình Super AMOLED rực rỡ, kháng nước kháng bụi chuẩn IP67.'
    ),
    (
        N'Samsung Galaxy A17 5G 8GB/128GB', 'samsung-galaxy-a17-5g-8gb-128gb', @BrandSamsung, @CatPhone,
        6090000, 7090000, 14, 1.20,
        '8GB', '128GB', 'Exynos 1330', '5000mAh', 'Super AMOLED 90Hz', '50MP + 5MP + 2MP',
        0, 1, 1, N'Samsung Galaxy A17 5G kết nối tốc độ cao, thiết kế Key Island thời thượng.'
    ),
    (
        N'OPPO Reno15 F 5G 8GB+256GB', 'oppo-reno15-f-5g-8gb-256gb', @BrandOppo, @CatPhone,
        10990000, 11990000, 8, 1.20,
        '8GB', '256GB', 'Snapdragon 6 Gen 1', '7000mAh', 'AMOLED 120Hz 6.67 inch', '50MP AI Portrait',
        1, 1, 1, N'Chuyên gia chân dung thế hệ mới OPPO Reno15 F pin khủng 7000mAh siêu mỏng nhẹ.'
    ),
    (
        N'OSCAL TIGER 12 (8GB/128GB) NFC', 'oscal-tiger-12-8gb-128gb-nfc', @BrandXiaomi, @CatPhone,
        3990000, 4490000, 11, 1.20,
        '8GB', '128GB', 'Helio G99', '5000mAh', 'FHD+ 120Hz 6.78 inch', '64MP Samsung ISOCELL',
        0, 0, 1, N'Smartphone quốc dân giá mềm, màn hình 120Hz mượt mà, hỗ trợ NFC tiện lợi.'
    ),
    (
        N'iPhone 16 Pro Max 256GB', 'iphone-16-pro-max-256gb', @BrandApple, @CatPhone,
        34990000, 36990000, 5, 2.00,
        '8GB', '256GB', 'Apple A18 Pro', '4685mAh', 'Super Retina XDR OLED 6.9 inch', '48MP Fusion + 48MP Ultra Wide + 12MP 5x',
        1, 1, 1, N'Siêu phẩm iPhone 16 Pro Max khung viền Titan sa mạc, Camera Control độc đáo, Apple Intelligence.'
    ),
    (
        N'Củ Sạc Nhanh Anker Prime GaN 65W 3 Cổng', 'cu-sac-nhanh-anker-prime-gan-65w', @BrandAnker, @CatAccessory,
        890000, 1150000, 23, 5.00,
        NULL, NULL, 'GaN Technology', NULL, NULL, NULL,
        1, 0, 1, N'Củ sạc công nghệ GaN siêu nhỏ gọn, công suất 65W hỗ trợ sạc nhanh cho Laptop và Smartphone.'
    );
END
GO

-- 6. SEED PRODUCT VARIANTS (Biến thể màu sắc & SKU)
DECLARE @ProdHonor INT = (SELECT Id FROM Products WHERE Slug = 'honor-x7d-5g-8gb-256gb');
DECLARE @ProdIPhone INT = (SELECT Id FROM Products WHERE Slug = 'iphone-16-pro-max-256gb');
DECLARE @ProdOppoF INT = (SELECT Id FROM Products WHERE Slug = 'oppo-reno15-f-5g-8gb-256gb');

IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE Sku = 'HONOR-X7D-BLU')
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, StockQuantity) VALUES
    (@ProdHonor, 'HONOR-X7D-BLU', N'Xanh Dương Pha Lê', '#38bdf8', '256GB', '8GB', 6490000, 50),
    (@ProdHonor, 'HONOR-X7D-BLK', N'Đen Bóng Đêm', '#111827', '256GB', '8GB', 6490000, 45),
    
    (@ProdIPhone, 'IP16PM-256-DES', N'Titan Sa Mạc', '#c4a482', '256GB', '8GB', 34990000, 30),
    (@ProdIPhone, 'IP16PM-256-NAT', N'Titan Tự Nhiên', '#9ca3af', '256GB', '8GB', 34990000, 25),
    (@ProdIPhone, 'IP16PM-256-WHT', N'Titan Trắng', '#f3f4f6', '256GB', '8GB', 34990000, 20),
    
    (@ProdOppoF, 'OPPO-R15F-ORG', N'Cam Ánh Kim', '#fed7aa', '256GB', '8GB', 10990000, 40),
    (@ProdOppoF, 'OPPO-R15F-GRN', N'Xanh Khổng Tước', '#009981', '256GB', '8GB', 10990000, 35);
END
GO

-- 7. SEED COUPONS (Voucher Ưu Đãi Hội Viên)
IF NOT EXISTS (SELECT 1 FROM Coupons WHERE Code = 'NEXT100K')
BEGIN
    INSERT INTO Coupons (Code, Title, DiscountType, DiscountValue, MinOrderAmount, StartDate, EndDate, UsageLimit) VALUES
    ('NEXT100K', N'Tặng voucher 100K cho thành viên NextPhone mới', 'FIXED', 100000, 1000000, '2026-01-01', '2026-12-31', 5000),
    ('EDU5', N'Đặc quyền hạng EDU giảm thêm 5% cho học sinh - sinh viên', 'PERCENT', 5.00, 2000000, '2026-01-01', '2026-12-31', 2000),
    ('FREESHIP', N'Miễn phí vận chuyển toàn quốc cho đơn từ 500K', 'FIXED', 30000, 500000, '2026-01-01', '2026-12-31', 10000);
END
GO

-- 8. SEED SAMPLE ORDERS & ORDER ITEMS
IF NOT EXISTS (SELECT 1 FROM Orders WHERE OrderCode = 'NP-20260901-001')
BEGIN
    DECLARE @CustomerHuyHoang INT = (SELECT Id FROM Users WHERE PhoneNumber = '0987654321');
    DECLARE @Coupon100K INT = (SELECT Id FROM Coupons WHERE Code = 'NEXT100K');
    DECLARE @VariantHonor INT = (SELECT Id FROM ProductVariants WHERE Sku = 'HONOR-X7D-BLU');
    DECLARE @ProdHonorId INT = (SELECT Id FROM Products WHERE Slug = 'honor-x7d-5g-8gb-256gb');

    INSERT INTO Orders (
        OrderCode, UserId, ReceiverName, ReceiverPhone, ShippingAddress,
        SubTotal, DiscountAmount, ShippingFee, TotalAmount,
        OrderStatus, PaymentMethod, PaymentStatus, CouponId
    ) VALUES (
        'NP-20260901-001', @CustomerHuyHoang, N'Huy Hoàng', '0987654321', N'Số 18 Đại Cồ Việt, Phường Bách Khoa, Quận Hai Bà Trưng, Hà Nội',
        6490000, 100000, 0, 6390000,
        N'Đã giao thành công', N'VNPAY', N'Đã thanh toán', @Coupon100K
    );

    DECLARE @NewOrderId INT = SCOPE_IDENTITY();

    INSERT INTO OrderItems (OrderId, ProductVariantId, ProductName, VariantSummary, Quantity, UnitPrice, TotalPrice)
    VALUES (@NewOrderId, @VariantHonor, N'HONOR X7d 5G 8GB/256GB', N'Màu Xanh Dương Pha Lê / 256GB', 1, 6490000, 6490000);

    INSERT INTO Payments (OrderId, PaymentMethod, TransactionCode, Amount, Status)
    VALUES (@NewOrderId, 'VNPAY', 'VNP1482910384', 6390000, 'Success');

    -- Đánh giá sản phẩm mẫu
    INSERT INTO ProductReviews (ProductId, UserId, Rating, Comment, IsVerifiedPurchase)
    VALUES (@ProdHonorId, @CustomerHuyHoang, 5, N'Máy đẹp mượt mà, pin trâu đúng như quảng cáo, giao hàng trong 2 tiếng rất nhanh!', 1);
END
GO

PRINT N'✅ Đã khởi tạo hoàn tất toàn bộ dữ liệu mẫu (Seed Data) cho hệ thống NextPhoneDb!';
GO

