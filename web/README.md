# Web Frontend (React + TypeScript)

Ứng dụng web thương mại điện tử thời trang dành cho người dùng và quản trị viên, xây dựng bằng **React**, **TypeScript**, **Tailwind CSS**.

## Cấu trúc thư mục:

```text
web/
`-- src/
    |-- assets/              # Ảnh sản phẩm, logo, banner thời trang, css/icons
    |-- components/          # Các component tái sử dụng
    |   |-- common/          # Button, Input, Modal, Loading, Pagination...
    |   |-- layout/          # Header, Footer, Sidebar, Navbar...
    |   |-- product/         # ProductCard, ProductGrid, SizeSelector, ColorPicker...
    |   `-- cart/            # CartItem, CartDrawer, MiniCart...
    |-- pages/               # Các trang giao diện
    |   |-- home/            # Trang chủ, banner khuyến mãi, BST mới
    |   |-- shop/            # Danh sách sản phẩm, bộ lọc (size, màu, giá, danh mục)
    |   |-- product-detail/  # Chi tiết trang phục, chọn size/màu, AI gợi ý phối đồ
    |   |-- cart/            # Giỏ hàng
    |   |-- checkout/        # Trang thanh toán & chọn phương thức thanh toán
    |   |-- auth/            # Đăng nhập, Đăng ký, Quên mật khẩu
    |   `-- admin/           # Dashboard quản lý sản phẩm, đơn hàng, người dùng
    |-- services/            # Gọi API Backend (Axios / Fetch)
    |-- hooks/               # Custom hooks (useAuth, useCart, useDebounce...)
    |-- context/             # State management toàn cục (AuthContext, CartContext)
    |-- types/               # Khai báo TypeScript types / interfaces
    `-- utils/               # Hàm tiện ích (format tiền tệ VND, tính giảm giá...)
```
