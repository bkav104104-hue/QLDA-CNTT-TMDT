-- 1. Ensure all existing product variants have plenty of stock
UPDATE ProductVariants 
SET StockQuantity = 100, IsActive = 1;

-- 2. Add variants for products that currently have 0 variants
-- Product 2: OPPO Find X9s
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 2)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (2, 'OPPO-FX9S-SLV', N'Bạc Ánh Trăng', '#e2e8f0', '256GB', '12GB', 21090000, 24990000, 100, 1);
END

-- Product 3: Samsung Galaxy A37
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 3)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (3, 'SAM-A37-PNK', N'Hồng Pastel', '#fbcfe8', '128GB', '8GB', 9290000, 10790000, 100, 1);
END

-- Product 4: Samsung Galaxy A17
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 4)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (4, 'SAM-A17-BLU', N'Xanh Hy Vọng', '#93c5fd', '128GB', '8GB', 6090000, 7090000, 100, 1);
END

-- Product 6: OSCAL TIGER 12
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 6)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (6, 'OSCAL-T12-PUR', N'Tím Thiên Hà', '#c084fc', '128GB', '8GB', 3990000, 4490000, 100, 1);
END

-- Product 8: Củ Sạc Anker GaN 65W
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 8)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (8, 'ANK-GAN-65W', N'Đen Titan', '#1e293b', N'65W GaN', N'3 Cổng', 890000, 1150000, 100, 1);
END

-- Product 9: Cáp Sạc Anker Type-C 100W
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 9)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (9, 'ANK-CAB-100W', N'Đen Dù Bền', '#334155', N'1.8m', N'100W', 250000, 350000, 100, 1);
END

-- Product 10: AirPods Pro 2 USB-C
IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = 10)
BEGIN
    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (10, 'APP-PRO2-USBC', N'Trắng Tinh Khôi', '#ffffff', N'Type-C MagSafe', N'H2 ANC', 5690000, 6190000, 100, 1);
END

-- Product 11: iPhone 17 Pro Max
IF NOT EXISTS (SELECT 1 FROM Products WHERE Slug = 'iphone-17-pro-max' OR Slug = 'iphone-17-pro-max-256gb')
BEGIN
    INSERT INTO Products (BrandId, CategoryId, Name, Slug, Description, BasePrice, OriginalPrice, MemberDiscountPercent, WarrantyMonths, IsFeatured, IsActive, CreatedAt)
    VALUES (1, 1, N'iPhone 17 Pro Max 256GB Titan Tự Nhiên', 'iphone-17-pro-max', N'Flagship đỉnh cao 2026 với chip Apple A19 Pro 2nm, khung titan cao cấp.', 34990000, 37990000, 3, 12, 1, 1, GETUTCDATE());
    
    DECLARE @NewProdId INT = SCOPE_IDENTITY();

    INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
    VALUES (@NewProdId, 'IP17PM-256-NAT', N'Titan Tự Nhiên', '#9ca3af', '256GB', '12GB', 34990000, 37990000, 100, 1);
END
ELSE
BEGIN
    DECLARE @ExistingProdId INT = (SELECT TOP 1 Id FROM Products WHERE Slug = 'iphone-17-pro-max' OR Slug = 'iphone-17-pro-max-256gb');
    IF NOT EXISTS (SELECT 1 FROM ProductVariants WHERE ProductId = @ExistingProdId)
    BEGIN
        INSERT INTO ProductVariants (ProductId, Sku, ColorName, ColorHex, StorageCapacity, RamCapacity, Price, OriginalPrice, StockQuantity, IsActive)
        VALUES (@ExistingProdId, 'IP17PM-256-NAT', N'Titan Tự Nhiên', '#9ca3af', '256GB', '12GB', 34990000, 37990000, 100, 1);
    END
END

SELECT COUNT(*) AS TotalVariantsAfterFix FROM ProductVariants;

