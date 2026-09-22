# Mobile App (React Native / Expo + TypeScript)

Ứng dụng di động đa nền tảng (iOS & Android) phục vụ trải nghiệm mua sắm thời trang tiện lợi.

## Cấu trúc thư mục:

```text
mobile/
`-- src/
    |-- assets/          # Hình ảnh, font chữ, icons di động
    |-- components/      # UI components tái sử dụng trên mobile
    |-- screens/         # Màn hình ứng dụng
    |   |-- home/        # Màn hình chính
    |   |-- shop/        # Khám phá danh mục thời trang
    |   |-- product-detail/ # Xem chi tiết, chọn size/màu
    |   |-- cart/        # Giỏ hàng di động
    |   |-- checkout/    # Đặt hàng & thanh toán
    |   `-- profile/     # Tài khoản, lịch sử đơn hàng, địa chỉ giao hàng
    |-- navigation/      # React Navigation (BottomTab, StackNavigator)
    |-- services/        # Kết nối API Backend .NET
    |-- hooks/           # Custom hooks cho mobile
    `-- types/           # Type definitions
```
