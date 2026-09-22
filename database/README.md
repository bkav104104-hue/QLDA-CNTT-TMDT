# Database (Cơ Sở Dữ Liệu)

Quản lý lược đồ CSDL quan hệ (SQL Server / PostgreSQL) cho hệ thống thương mại điện tử thời trang.

## Cấu trúc:
```text
database/
|-- schemas/     # Script tạo bảng (Users, Categories, Products, Variants, Orders, Payments...)
|-- seeds/       # Dữ liệu mẫu (Danh mục thời trang Nam/Nữ, kích thước S/M/L/XL, màu sắc...)
|-- migrations/  # Script migration theo phiên bản
`-- erd/         # Sơ đồ thiết kế thực thể quan hệ (ERD Diagram)
```
