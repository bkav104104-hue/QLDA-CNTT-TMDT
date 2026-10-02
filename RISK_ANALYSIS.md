# BẢNG PHÂN TÍCH RỦI RO DỰ ÁN
## Hệ thống Thương mại Điện tử NextPhone

---

### Bảng 1: Phân tích rủi ro R01

| Mã rủi ro: R01 | Mức độ ưu tiên: Cao | Ngày báo cáo: 22/02/2026 |
| :--- | :--- | :--- |
| **Mô tả:** Nguy cơ rò rỉ dữ liệu cá nhân khách hàng (mật khẩu, số điện thoại, địa chỉ nhận hàng, lịch sử giao dịch) do lỗ hổng bảo mật IDOR hoặc các cuộc tấn công mạng trái phép. | | |
| **Xác suất: 5%** | **Mức độ ảnh hưởng: Cao** | |
| **Dấu hiệu nhận biết đầu tiên:** Lượng yêu cầu HTTP lỗi 401/403/404 tăng đột biến, nhật ký truy cập máy chủ (server logs) ghi nhận các mẫu quét tự động bất thường trên API tra cứu đơn hàng `/api/orders/by-code/{orderCode}`. | | |
| **Phương pháp giảm thiểu:** Mã hóa mật khẩu một chiều an toàn bằng PBKDF2/Argon2; áp dụng kiểm soát phân quyền nghiêm ngặt theo vai trò (RBAC); triển khai cơ chế che dấu dữ liệu nhạy cảm (Data Masking) số điện thoại và email khi tra cứu đơn hàng công khai; cấu hình giao thức bảo mật HTTPS/TLS 1.3. | | |
| **Ngày bắt đầu: 01/03/2026** | **Ngày hoàn thành: 06/03/2026** | **Người phụ trách: Phạm Hoàng Dương** |
| **Trạng thái hiện tại:** Đã kích hoạt cơ chế Data Masking trên API tra cứu đơn hàng. Xác thực mã thông báo bảo mật JWT kèm kiểm soát phiên đã được triển khai hoàn chỉnh. Chưa ghi nhận sự cố an ninh nào. | | |
| **Kế hoạch dự phòng:** Ngay lập tức thu hồi và vô hiệu hóa toàn bộ Token phiên đăng nhập bị ảnh hưởng; tạm thời cô lập các endpoint bị tấn công; gửi cảnh báo cho người dùng đổi mật khẩu; triển khai bản vá bảo mật khẩn cấp. | | |
| **Điều kiện kích hoạt kế hoạch dự phòng:** Khi phát hiện hành vi quét vét dữ liệu tự động hoặc có dấu hiệu truy cập trái phép vào cơ sở dữ liệu trên môi trường thực tế. | | |

*Bảng 1 Phân tích rủi ro R01*

---

### Bảng 2: Phân tích rủi ro R02

| Mã rủi ro: R02 | Mức độ ưu tiên: Cao | Ngày báo cáo: 22/02/2026 |
| :--- | :--- | :--- |
| **Mô tả:** Nguy cơ cổng thanh toán trực tuyến (chuyển khoản ngân hàng VietQR Napas 24/7 và Thẻ tín dụng quốc tế) bị gián đoạn kết nối, dẫn đến lỗi giao dịch, trễ webhook ngân hàng hoặc hết thời gian chờ xử lý thanh toán (timeout). | | |
| **Xác suất: 8%** | **Mức độ ảnh hưởng: Cao** | |
| **Dấu hiệu nhận biết đầu tiên:** Khách hàng phản hồi đã chuyển khoản thành công nhưng đơn hàng chưa chuyển trạng thái "Đã thanh toán", hoặc API `/api/payment/qr/create` phản hồi chậm bất thường. | | |
| **Phương pháp giảm thiểu:** Xây dựng cơ chế tự động sinh mã VietQR dự phòng trực tiếp tại Client; duy trì tiến trình kiểm tra trạng thái thanh toán thời gian thực (polling); cung cấp phương thức thanh toán thay thế khi nhận hàng (COD). | | |
| **Ngày bắt đầu: 01/03/2026** | **Ngày hoàn thành: 06/03/2026** | **Người phụ trách: Nguyễn Quốc Việt** |
| **Trạng thái hiện tại:** Đã triển khai bộ sinh mã VietQR chuẩn Napas với tài khoản MBBank. Tích hợp sẵn bộ mô phỏng webhook ngân hàng để kiểm thử tự động. Vòng lặp đối soát đơn hàng hoạt động ổn định. | | |
| **Kế hoạch dự phòng:** Chuyển luồng thanh toán sang hướng dẫn chuyển khoản thủ công kèm tính năng tải ảnh biên lai giao dịch; kích hoạt đường dây nóng đối soát khẩn cấp với ngân hàng đối tác. | | |
| **Điều kiện kích hoạt kế hoạch dự phòng:** Khi cổng thanh toán ngân hàng mất kết nối liên tục quá 5 phút hoặc tỷ lệ giao dịch thất bại vượt quá 3 lần liên tiếp. | | |

*Bảng 2 Phân tích rủi ro R02*

---

### Bảng 3: Phân tích rủi ro R03

| Mã rủi ro: R03 | Mức độ ưu tiên: Cao | Ngày báo cáo: 25/02/2026 |
| :--- | :--- | :--- |
| **Mô tả:** Lưu lượng truy cập tăng vọt trong các chương trình Flash Sale hoặc đợt mở bán sản phẩm mới gây xung đột tranh chấp dữ liệu (Race Condition), dẫn đến hiện tượng bán vượt số lượng tồn kho thực tế (Overselling). | | |
| **Xác suất: 12%** | **Mức độ ảnh hưởng: Cao** | |
| **Dấu hiệu nhận biết đầu tiên:** Số lượng tồn kho của biến thể sản phẩm trong cơ sở dữ liệu bị giảm xuống dưới 0, hoặc có nhiều đơn hàng cùng ghi nhận đặt mua thành công đơn vị sản phẩm cuối cùng tại cùng một mili-giây. | | |
| **Phương pháp giảm thiểu:** Sử dụng cơ chế khóa dữ liệu cấp cơ sở dữ liệu (Pessimistic Locking / EF Core Execution Strategy) khi kiểm tra và trừ tồn kho; thực hiện trừ kho nguyên tử (atomic update); tự động bù tồn kho khi có sự cố. | | |
| **Ngày bắt đầu: 03/03/2026** | **Ngày hoàn thành: 09/03/2026** | **Người phụ trách: Huy Hoàng** |
| **Trạng thái hiện tại:** Đã bổ sung kiểm tra tồn kho nghiêm ngặt và cơ chế tự động bù kho trong `OrderService.cs`. Toàn bộ thao tác tạo đơn và trừ tồn kho được bao bọc trong Transaction của UnitOfWork. | | |
| **Kế hoạch dự phòng:** Tạm dừng ngay việc đặt mua đối với mã sản phẩm bị xung đột; kích hoạt quy trình nhập hàng khẩn cấp; liên hệ khách hàng để đề xuất nâng cấp phiên bản tương đương hoặc hoàn tiền ưu tiên kèm mã giảm giá đền bù. | | |
| **Điều kiện kích hoạt kế hoạch dự phòng:** Khi phát hiện bất kỳ biến thể sản phẩm nào có số lượng tồn kho âm (< 0) hoặc có sự chênh lệch giữa số lượng hàng thực tế và hệ thống. | | |

*Bảng 3 Phân tích rủi ro R03*
