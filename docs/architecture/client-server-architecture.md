# Kiến trúc Hệ thống: Client - Server Architecture

Dự án Hệ thống Thương mại Điện tử Thời trang được thiết kế theo mô hình **Client - Server** phân tán:

```
+-----------------------------------------------------------------------+
|                            CLIENT TIER                                |
|                                                                       |
|   +--------------------------+          +--------------------------+  |
|   |         Web App          |          |        Mobile App        |  |
|   |   (React + TypeScript)   |          |  (React Native / Expo)   |  |
|   +-------------+------------+          +------------+-------------+  |
+-----------------|------------------------------------|----------------+
                  |                                    |
                  | HTTPS / RESTful API / JSON         |
                  v                                    v
+-----------------------------------------------------------------------+
|                            SERVER TIER                                |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                     ASP.NET Core Web API                      |   |
|   |              (Backend Layered N-Tier Architecture)            |   |
|   +------------------------------+--------------------------------+   |
+----------------------------------|------------------------------------+
                                   |
            +----------------------+----------------------+
            |                                             |
            v                                             v
+-----------------------+                     +-----------------------+
|     DATA TIER         |                     |   PAYMENT GATEWAY     |
|  (SQL Server / Postgre|                     | (VNPay, MoMo, ZaloPay,|
|   Redis Caching)      |                     |      Stripe)          |
+-----------------------+                     +-----------------------+
```

### 1. Client Tier (Tầng giao diện người dùng)
- **Web Client**: Xây dựng bằng React, TypeScript, Tailwind CSS, Vite. Phục vụ khách hàng trên máy tính và quản trị viên (Admin Portal).
- **Mobile Client**: Xây dựng bằng React Native / Expo. Mang đến trải nghiệm mua sắm mượt mà trên cả iOS và Android.

### 2. Server Tier (Tầng máy chủ xử lý)
- **ASP.NET Core Web API**: Đóng vai trò trung tâm xử lý logic nghiệp vụ, bảo mật, xác thực (JWT), phân quyền và điều phối dữ liệu.
- Được tổ chức theo mô hình **N-Tier (Layered Architecture)** để đảm bảo tính phân tách trách nhiệm (Separation of Concerns).

### 3. Data Tier & Integration
- **Database**: Lưu trữ quan hệ (SQL Server / PostgreSQL) kết hợp Redis Cache để tăng tốc truy vấn giỏ hàng & sản phẩm hot.
- **Payment Gateway**: Kết nối các cổng thanh toán phổ biến tại Việt Nam (VNPay, MoMo, ZaloPay) và quốc tế (Stripe).
