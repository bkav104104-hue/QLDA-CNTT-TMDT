# Payment Gateway (Cổng Thanh Toán)

Module tích hợp và xử lý thanh toán trực tuyến cho hệ thống thời trang.

## Các cổng hỗ trợ:
- **VNPay**: Cổng thanh toán qua thẻ nội địa ATM, QR Code ngân hàng.
- **MoMo**: Ví điện tử MoMo (App-to-App, QR Code).
- **ZaloPay**: Ví điện tử ZaloPay.
- **Stripe**: Thanh toán quốc tế qua thẻ Visa / MasterCard.

## Cấu trúc thư mục:
```text
payment-gateway/
`-- src/
    |-- vnpay/       # Cấu hình mã hóa SHA512, URL tạo thanh toán, xử lý IPN/Return
    |-- momo/        # Tạo payment request HMAC-SHA256, verify callback
    |-- zalopay/     # Tích hợp ZaloPay SDK / Rest API
    |-- stripe/      # Stripe Payment Intents, Webhooks
    `-- common/      # Giao diện chung IPaymentGateway, DTO kết quả thanh toán
```
