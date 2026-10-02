# TÀI LIỆU THIẾT KẾ KIẾN TRÚC & BIỂU ĐỒ HỆ THỐNG NEXTPHONE (ECOMMERCE)

> **Dự án**: Sàn Thương Mại Điện Tử Thiết Bị Di Động & Phụ Kiện NextPhone  
> **Kiến trúc**: 3-Tier Architecture (.NET 10 Web API + Entity Framework Core + SQL Server + React 18 / TypeScript / Tailwind CSS)  
> **Ngày cập nhật**: 2026-10-02  

---

## MỤC LỤC
1. [TỔNG QUAN HỆ THỐNG & CÁC TÁC NHÂN (ACTORS)](#1-tổng-quan-hệ-thống--các-tác-nhân-actors)
2. [PHẦN 1: CÁC BIỂU ĐỒ USE CASE CHÍNH](#phần-1-các-biểu-đồ-use-case-chính)
   - [2.1. Biểu đồ Use Case Tổng Quan Toàn Hệ Thống](#21-biểu-đồ-use-case-tổng-quan-toàn-hệ-thống)
   - [2.2. Biểu đồ Use Case Phân Hệ Khách Hàng (Customer & Guest Subsystem)](#22-biểu-đồ-use-case-phân-hệ-khách-hàng-customer--guest-subsystem)
   - [2.3. Biểu đồ Use Case Phân Hệ Quản Trị & Người Bán (Admin & Seller Subsystem)](#23-biểu-đồ-use-case-phân-hệ-quản-trị--người-bán-admin--seller-subsystem)
3. [PHẦN 2: CÁC BIỂU ĐỒ SEQUENCE (TUẦN TỰ NGHIỆP VỤ)](#phần-2-các-biểu-đồ-sequence-tuần-tự-nghiệp-vụ)
   - [3.1. Sequence: Đăng Ký, Đăng Nhập & Cấp Phát JWT Bearer Token](#31-sequence-đăng-ký-đăng-nhập--cấp-phát-jwt-bearer-token)
   - [3.2. Sequence: Quy Trình Đặt Hàng & Kiểm Soát Nghiệp Vụ Chặt Chẽ](#32-sequence-quy-trình-đặt-hàng--kiểm-soát-nghiệp-vụ-chặt-chẽ)
   - [3.3. Sequence: Thanh Toán Trực Tuyến VietQR & Xác Nhận Webhook](#33-sequence-thanh-toán-trực-tuyến-vietqr--xác-nhận-webhook)
   - [3.4. Sequence: Thanh Toán Thẻ Tín Dụng Quốc Tế & Xác Thực OTP 3D-Secure](#34-sequence-thanh-toán-thẻ-tín-dụng-quốc-tế--xác-thực-otp-3d-secure)
   - [3.5. Sequence: Xử Lý Đơn Hàng & Tự Động Hoàn Trả Tồn Kho Khi Hủy Đơn](#35-sequence-xử-lý-đơn-hàng--tự-động-hoàn-trả-tồn-kho-khi-hủy-đơn)
   - [3.6. Sequence: Kiểm Duyệt Đánh Giá Sản Phẩm Do AI Gắn Cờ Vi Phạm](#36-sequence-kiểm-duyệt-đánh-giá-sản-phẩm-do-ai-gắn-cờ-vi-phạm)
4. [PHẦN 3: CÁC BIỂU ĐỒ LỚP (CLASS DIAGRAMS)](#phần-3-các-biểu-đồ-lớp-class-diagrams)
   - [4.1. Biểu Đồ Lớp Thực Thể CSDL (Domain Entity Model)](#41-biểu-đồ-lớp-thực-thể-csdl-domain-entity-model)
   - [4.2. Biểu Đồ Lớp Kiến Trúc 3 Tầng (3-Tier Layered Architecture)](#42-biểu-đồ-lớp-kiến-trúc-3-tầng-3-tier-layered-architecture)

---

## 1. TỔNG QUAN HỆ THỐNG & CÁC TÁC NHÂN (ACTORS)

Hệ thống NextPhone phục vụ các tác nhân chính sau:

| Tác Nhân (Actor) | Mô Tả Vai Trò | Phạm Vi Quyền Hạn |
|---|---|---|
| **Khách Vãng Lai (Guest)** | Người dùng chưa đăng nhập tài khoản | Duyệt sản phẩm, tra cứu tin tức, tìm kiếm, tra cứu đơn hàng công khai (bị che dữ liệu riêng tư). |
| **Khách Hàng (Customer)** | Người dùng đã đăng ký & đăng nhập | Quản lý giỏ hàng, đặt hàng, áp mã giảm giá, thanh toán trực tuyến, đánh giá sản phẩm, quản lý điểm Smember. |
| **Quản Trị Viên (Admin/Seller)** | Chủ sàn kiêm đơn vị cung cấp hàng hóa | Quản lý sản phẩm, giám sát xuất nhập kho, tiếp nhận và điều phối vận chuyển, duyệt báo cáo kinh doanh, kiểm duyệt đánh giá AI. *(Bị chặn tuyệt đối không được mua hàng trên sàn)*. |
| **Hệ Thống Ngoài (External Services)** | Cổng thanh toán (VietQR, Ngân hàng, Visa/MasterCard) và Dịch vụ AI (Google Gemini / Content Moderation AI) | Sinh mã QR thanh toán, gửi Webhook xác nhận giao dịch ngân hàng, phân tích nội dung đánh giá gắn cờ tiêu chuẩn cộng đồng. |

---

## PHẦN 1: CÁC BIỂU ĐỒ USE CASE CHÍNH

### 2.1. Biểu đồ Use Case Tổng Quan Toàn Hệ Thống

```mermaid
flowchart LR
    %% Actors
    ActorGuest["fa:fa-user Khách Vãng Lai"]
    ActorCustomer["fa:fa-user-check Khách Hàng (Member)"]
    ActorAdmin["fa:fa-user-shield Quản Trị Viên (Admin/Seller)"]
    ActorBank["fa:fa-university Cổng Thanh Toán / Ngân Hàng"]
    ActorAI["fa:fa-robot AI Moderation Service"]

    %% Boundaries
    subgraph StorefrontBoundary ["Phân Hệ Sàn Giao Dịch Khách Hàng (Storefront)"]
        UC_Browse(["Duyệt & Tìm kiếm sản phẩm"])
        UC_Auth(["Đăng ký / Đăng nhập"])
        UC_Cart(["Quản lý giỏ hàng"])
        UC_Checkout(["Đặt hàng & Thanh toán"])
        UC_Track(["Tra cứu hành trình đơn hàng"])
        UC_Review(["Gửi bài đánh giá sản phẩm"])
    end

    subgraph AdminBoundary ["Phân Hệ Cổng Quản Trị & Người Bán (Admin Portal)"]
        UC_Dashboard(["Xem báo cáo doanh thu KPI"])
        UC_ManageProduct(["Quản lý sản phẩm & Ngừng bán"])
        UC_Inventory(["Giám sát kho & Nhập hàng"])
        UC_ManageOrder(["Xử lý đơn hàng & Vận chuyển"])
        UC_ModerateReview(["Kiểm duyệt đánh giá (AI gắn cờ)"])
    end

    %% Actor Relationships
    ActorGuest --> UC_Browse
    ActorGuest --> UC_Auth
    ActorGuest --> UC_Track

    ActorCustomer --> UC_Browse
    ActorCustomer --> UC_Auth
    ActorCustomer --> UC_Cart
    ActorCustomer --> UC_Checkout
    ActorCustomer --> UC_Track
    ActorCustomer --> UC_Review

    ActorAdmin --> UC_Dashboard
    ActorAdmin --> UC_ManageProduct
    ActorAdmin --> UC_Inventory
    ActorAdmin --> UC_ManageOrder
    ActorAdmin --> UC_ModerateReview

    %% External Systems
    UC_Checkout <--> ActorBank
    UC_ModerateReview <--> ActorAI
    UC_Review -.-> ActorAI
```

---

### 2.2. Biểu đồ Use Case Phân Hệ Khách Hàng (Customer & Guest Subsystem)

```mermaid
flowchart TB
    %% Actors
    ActorCust["Khách Hàng (Customer)"]
    ActorGuest["Khách Vãng Lai (Guest)"]

    subgraph CustomerUseCases ["Use Cases - Mua Sắm & Tài Khoản"]
        UC_Register(["Đăng ký tài khoản mới"])
        UC_Login(["Đăng nhập hệ thống"])
        UC_Profile(["Cập nhật hồ sơ & Đổi mật khẩu"])
        UC_Smember(["Xem tích điểm & Hạng Smember"])

        UC_ViewDetail(["Xem chi tiết cấu hình & Giá"])
        UC_AddToCart(["Thêm sản phẩm vào giỏ"])
        UC_ApplyCoupon(["Nhập mã khuyến mại (Coupon)"])
        UC_PlaceOrder(["Xác nhận đặt hàng"])
        
        UC_PayCOD(["Thanh toán khi nhận hàng (COD)"])
        UC_PayQR(["Chuyển khoản VietQR Online"])
        UC_PayCard(["Thanh toán Thẻ tín dụng quốc tế"])
        
        UC_OrderHistory(["Xem lịch sử đơn mua"])
        UC_PublicTrack(["Tra cứu đơn hàng bằng Mã (NP-XXXXXX)"])
        UC_WriteReview(["Viết bình luận & Đánh giá sao"])
    end

    %% Guest actions
    ActorGuest --> UC_Register
    ActorGuest --> UC_Login
    ActorGuest --> UC_ViewDetail
    ActorGuest --> UC_PublicTrack

    %% Customer inheritance
    ActorCust --> UC_Profile
    ActorCust --> UC_Smember
    ActorCust --> UC_ViewDetail
    ActorCust --> UC_AddToCart
    ActorCust --> UC_PlaceOrder
    ActorCust --> UC_OrderHistory
    ActorCust --> UC_WriteReview

    %% Includes & Extends
    UC_AddToCart -.->|<<extend>>| UC_Login
    UC_PlaceOrder -.->|<<include>>| UC_ApplyCoupon
    UC_PlaceOrder -.->|<<include>>| UC_PayCOD
    UC_PlaceOrder -.->|<<extend>>| UC_PayQR
    UC_PlaceOrder -.->|<<extend>>| UC_PayCard
```

---

### 2.3. Biểu đồ Use Case Phân Hệ Quản Trị & Người Bán (Admin & Seller Subsystem)

```mermaid
flowchart TB
    %% Actor
    ActorAdmin["Quản Trị Viên / Người Bán (Admin)"]

    subgraph AdminUseCases ["Use Cases - Quản Trị & Vận Hành Sàn"]
        UC_AdminLogin(["Đăng nhập quyền Admin (RBAC)"])

        %% Module 1
        UC_ViewStats(["Xem thống kê KPI & Doanh thu 7 ngày"])
        UC_ExportReport(["Xuất file báo cáo kinh doanh CSV"])

        %% Module 2
        UC_AddProduct(["Thêm mới sản phẩm & Biến thể"])
        UC_EditProduct(["Sửa giá bán, mô tả, thông số"])
        UC_ToggleSale(["Chuyển trạng thái Đang bán / Ngừng bán"])
        UC_DeleteProduct(["Gỡ sản phẩm khỏi sàn"])

        %% Module 3
        UC_LowStockAlert(["Nhận cảnh báo tồn kho sắp cạn"])
        UC_ViewInventoryLogs(["Xem nhật ký xuất / nhập kho"])
        UC_ImportStock(["Lập phiếu nhập thêm hàng vào kho"])

        %% Module 4
        UC_ProcessOrders(["Xem danh sách đơn đặt hàng"])
        UC_UpdateOrderStatus(["Cập nhật tiến độ vận chuyển"])
        UC_CancelOrder(["Hủy đơn & Tự động hoàn kho"])

        %% Module 5
        UC_AiFlaggedReview(["Xem danh sách đánh giá vi phạm AI"])
        UC_ApproveReview(["Phê duyệt hiển thị lại"])
        UC_RejectReview(["Xóa bỏ đánh giá vi phạm"])
        UC_ReplyReview(["Gửi phản hồi chính thức từ Admin"])
    end

    %% Connections
    ActorAdmin --> UC_AdminLogin
    UC_AdminLogin -.->|<<include>>| UC_ViewStats
    UC_ViewStats -.->|<<extend>>| UC_ExportReport

    ActorAdmin --> UC_AddProduct
    ActorAdmin --> UC_EditProduct
    ActorAdmin --> UC_ToggleSale
    ActorAdmin --> UC_DeleteProduct

    ActorAdmin --> UC_LowStockAlert
    ActorAdmin --> UC_ViewInventoryLogs
    ActorAdmin --> UC_ImportStock

    ActorAdmin --> UC_ProcessOrders
    UC_ProcessOrders -.->|<<include>>| UC_UpdateOrderStatus
    UC_UpdateOrderStatus -.->|<<extend>>| UC_CancelOrder

    ActorAdmin --> UC_AiFlaggedReview
    UC_AiFlaggedReview -.->|<<extend>>| UC_ApproveReview
    UC_AiFlaggedReview -.->|<<extend>>| UC_RejectReview
    UC_AiFlaggedReview -.->|<<extend>>| UC_ReplyReview
```

---

## PHẦN 2: CÁC BIỂU ĐỒ SEQUENCE (TUẦN TỰ NGHIỆP VỤ)

### 3.1. Sequence: Đăng Ký, Đăng Nhập & Cấp Phát JWT Bearer Token

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách Hàng / Quản Trị Viên
    participant Web as Giao Diện Web (React UI)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant UoW as UnitOfWork
    participant DB as SQL Server Database

    %% Luồng Đăng Nhập
    User ->> Web: Nhập Số điện thoại & Mật khẩu
    Web ->> AuthCtrl: POST /api/auth/login { username, password }
    AuthCtrl ->> AuthSvc: LoginAsync(request)
    AuthSvc ->> UoW: Users.FirstOrDefaultAsync(u => Phone == username)
    UoW ->> DB: SELECT * FROM Users WHERE PhoneNumber = @username
    DB -->> UoW: Trả về User Entity (kèm Role)
    UoW -->> AuthSvc: User Entity

    alt Người dùng không tồn tại hoặc bị khóa
        AuthSvc -->> AuthCtrl: Throw UnauthorizedAccessException
        AuthCtrl -->> Web: 401 Unauthorized ("Tài khoản không tồn tại / bị khóa")
        Web -->> User: Hiển thị thông báo lỗi
    else Tài khoản hợp lệ
        AuthSvc ->> AuthSvc: BCrypt.Verify(password, user.PasswordHash)
        alt Mật khẩu không khớp
            AuthSvc -->> AuthCtrl: Throw UnauthorizedAccessException
            AuthCtrl -->> Web: 401 Unauthorized ("Mật khẩu không chính xác")
            Web -->> User: Báo lỗi sai mật khẩu
        else Mật khẩu hợp lệ
            AuthSvc ->> AuthSvc: GenerateJwtToken(user, Role, Claims)
            AuthSvc -->> AuthCtrl: AuthResponseDto (Token, ExpiresAt, UserProfile)
            AuthCtrl -->> Web: 200 OK (JWT Token + UserProfile)
            Web ->> Web: Lưu token vào localStorage & cập nhật AuthContext
            Web -->> User: Đăng nhập thành công, chuyển hướng trang tương ứng
        end
    end
```

---

### 3.2. Sequence: Quy Trình Đặt Hàng & Kiểm Soát Nghiệp Vụ Chặt Chẽ

Biểu đồ này mô tả chi tiết các chốt chặn nghiệp vụ đã được hoàn thiện: **Chặn Admin mua hàng**, **Chặn thao túng giá**, **Kiểm tra tồn kho chống bán âm**, **Áp dụng Coupon**, và **Giao dịch Database Transaction an toàn**.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng (Customer)
    participant Web as CartPage (React)
    participant OrdersCtrl as OrdersController
    participant OrderSvc as OrderService
    participant CouponSvc as CouponService
    participant UoW as UnitOfWork
    participant DB as SQL Server

    Customer ->> Web: Nhấn "Xác nhận và đặt hàng"
    Web ->> OrdersCtrl: POST /api/orders (Authorization: Bearer Token)

    %% 1. Kiểm tra quyền Admin
    alt Caller có quyền Admin (User.IsInRole("Admin"))
        OrdersCtrl -->> Web: 403 Forbidden ("Quản trị viên không được phép đặt hàng")
        Web -->> Customer: Cảnh báo Quản trị viên chỉ có quyền quản lý
    else Caller là Customer hoặc Khách hợp lệ
        OrdersCtrl ->> OrderSvc: CreateOrderAsync(request, userId)
        
        %% 2. Bắt đầu Database Transaction
        OrderSvc ->> UoW: BeginTransactionAsync()

        %% 3. Thẩm định kho & lấy giá gốc từ DB
        loop Duyệt từng sản phẩm trong giỏ hàng
            OrderSvc ->> UoW: ProductVariants.GetByIdAsync(variantId)
            UoW ->> DB: SELECT * FROM ProductVariants WHERE Id = @id
            DB -->> UoW: Trả về Variant (StockQuantity, Price)
            
            alt StockQuantity < Quantity (Hết kho / Đặt vượt tồn)
                OrderSvc ->> UoW: RollbackAsync()
                OrderSvc -->> OrdersCtrl: Throw InvalidOperationException
                OrdersCtrl -->> Web: 400 Bad Request ("Không đủ số lượng trong kho")
                Web -->> Customer: Báo sản phẩm đã hết hàng
            else Đủ tồn kho
                OrderSvc ->> OrderSvc: Trừ tồn kho (StockQuantity -= Quantity)
                OrderSvc ->> OrderSvc: Lấy UnitPrice từ DB (Khóa chặn thao túng giá)
                OrderSvc ->> UoW: ProductVariants.Update(variant)
            end
        end

        %% 4. Xử lý Coupon
        opt Có mã khuyến mại CouponCode
            OrderSvc ->> CouponSvc: ApplyCouponAsync(code, subTotal)
            CouponSvc ->> UoW: Coupons.FirstOrDefaultAsync(c => Code == code)
            DB -->> UoW: Trả về Coupon Entity
            CouponSvc -->> OrderSvc: DiscountAmount (Giảm giá hợp lệ)
            OrderSvc ->> UoW: Tăng Coupon.UsedCount += 1
        end

        %% 5. Tạo Order & OrderItems
        OrderSvc ->> OrderSvc: Tính TotalAmount = SubTotal - Discount + ShippingFee
        OrderSvc ->> UoW: Orders.AddAsync(order)
        OrderSvc ->> UoW: OrderItems.AddRangeAsync(items)
        OrderSvc ->> UoW: SaveChangesAsync()
        OrderSvc ->> UoW: CommitAsync()

        OrderSvc -->> OrdersCtrl: OrderResponseDto (OrderCode: NP-XXXXXX)
        OrdersCtrl -->> Web: 201 Created (OrderCode, TotalAmount)
        Web ->> Web: Xóa giỏ hàng (ClearCart)
        Web -->> Customer: Mở Modal thanh toán / Báo đặt hàng thành công
    end
```

---

### 3.3. Sequence: Thanh Toán Trực Tuyến VietQR & Xác Nhận Webhook

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant Web as PaymentModal (React)
    participant PayCtrl as PaymentController
    participant PaySvc as PaymentService
    participant UoW as UnitOfWork
    participant BankGateway as Ngân Hàng / VietQR Gateway
    participant DB as SQL Server

    Customer ->> Web: Chọn phương thức "Chuyển khoản VietQR"
    Web ->> PayCtrl: POST /api/payment/qr/create { orderCode, bankCode }
    PayCtrl ->> PaySvc: CreateQrPaymentAsync(orderCode, bankCode)
    PaySvc ->> UoW: Lấy thông tin đơn hàng & số tiền
    PaySvc ->> PaySvc: Tạo chuỗi VietQR chuẩn NAPAS + TransactionCode
    PaySvc ->> UoW: Tạo bản ghi Payment (Status: Pending)
    PaySvc -->> PayCtrl: QrPaymentResponseDto (QrImageUrl, PaymentContent, Amount)
    PayCtrl -->> Web: 200 OK (Hiển thị mã QR và nội dung chuyển khoản)

    Customer ->> BankGateway: Quét mã QR bằng App Ngân Hàng & Chuyển tiền
    
    %% Polling trạng thái từ Web
    loop Polling mỗi 3 giây
        Web ->> PayCtrl: GET /api/payment/status/{orderCode}
        PayCtrl ->> PaySvc: CheckPaymentStatusAsync(orderCode)
        PaySvc -->> PayCtrl: CheckPaymentStatusResponseDto
        PayCtrl -->> Web: Status: Pending
    end

    %% Webhook ngân hàng xác nhận
    BankGateway ->> PayCtrl: POST /api/payment/qr/simulate-transfer { orderCode, amount, bankTxnId }
    PayCtrl ->> PaySvc: SimulateBankTransferWebhookAsync(request)
    
    alt Số tiền thanh toán < Tổng tiền đơn hàng
        PaySvc -->> PayCtrl: 400 Bad Request ("Số tiền không đủ")
    else Số tiền hợp lệ
        PaySvc ->> UoW: Cập nhật Payment.Status = "Success"
        PaySvc ->> UoW: Cập nhật Order.PaymentStatus = "Đã thanh toán"
        PaySvc ->> UoW: Cập nhật Order.OrderStatus = "Đã xác nhận"
        PaySvc ->> UoW: SaveChangesAsync()
        PaySvc -->> PayCtrl: 200 OK ("Xác nhận thanh toán thành công")
    end

    %% Web nhận trạng thái thành công ở lần poll tiếp theo
    Web ->> PayCtrl: GET /api/payment/status/{orderCode}
    PayCtrl -->> Web: Status: "Paid" (Đã thanh toán)
    Web -->> Customer: Hiển thị thông báo "Thanh toán thành công!", chuyển sang trang chi tiết đơn
```

---

### 3.4. Sequence: Thanh Toán Thẻ Tín Dụng Quốc Tế & Xác Thực OTP 3D-Secure

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant Web as PaymentModal (Card Tab)
    participant PayCtrl as PaymentController
    participant PaySvc as PaymentService
    participant UoW as UnitOfWork
    participant DB as SQL Server

    Customer ->> Web: Nhập Số thẻ (Visa/Master/JCB), Hạn dùng, CVV
    Web ->> PayCtrl: POST /api/payment/card/process { orderCode, cardNumber, expiry, cvv }
    PayCtrl ->> PaySvc: ProcessCardPaymentAsync(request)
    PaySvc ->> PaySvc: Thẩm định thuật toán Luhn, nhận diện Card Brand
    PaySvc ->> PaySvc: Khởi tạo giao dịch 3D-Secure, sinh mã TransactionCode
    PaySvc ->> UoW: Lưu Payment (Status: "PendingOtp")
    PaySvc -->> PayCtrl: CardPaymentResponseDto (RequiresOtp: true, TransactionCode)
    PayCtrl -->> Web: 200 OK (Mở hộp thoại nhập mã OTP 3D-Secure)

    Customer ->> Web: Nhập mã OTP xác thực ngân hàng (Ví dụ: 888888)
    Web ->> PayCtrl: POST /api/payment/card/verify-otp { transactionCode, otp }
    PayCtrl ->> PaySvc: VerifyCardOtpAsync(transactionCode, otp)

    alt Mã OTP sai
        PaySvc -->> PayCtrl: 400 Bad Request ("Mã OTP không chính xác")
        PayCtrl -->> Web: Báo lỗi OTP sai
    else Mã OTP chính xác
        PaySvc ->> UoW: Cập nhật Payment.Status = "Success"
        PaySvc ->> UoW: Cập nhật Order.PaymentStatus = "Đã thanh toán"
        PaySvc ->> UoW: Cập nhật Order.OrderStatus = "Đã xác nhận"
        PaySvc ->> UoW: SaveChangesAsync()
        PaySvc -->> PayCtrl: CardPaymentResponseDto (Success: true)
        PayCtrl -->> Web: 200 OK
        Web -->> Customer: Báo thanh toán thẻ tín dụng thành công!
    end
```

---

### 3.5. Sequence: Xử Lý Đơn Hàng & Tự Động Hoàn Trả Tồn Kho Khi Hủy Đơn

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản Trị Viên (Admin)
    participant AdminUI as AdminPortalPage (Orders Tab)
    participant AdminCtrl as AdminController
    participant AdminSvc as AdminService
    participant UoW as UnitOfWork
    participant DB as SQL Server

    Admin ->> AdminUI: Chọn đơn hàng cần xử lý, đổi trạng thái sang "Đã hủy"
    AdminUI ->> AdminCtrl: PUT /api/admin/orders/{id}/status { orderStatus: "Đã hủy", adminNote: "Khách đổi ý" }
    AdminCtrl ->> AdminSvc: UpdateOrderStatusAsync(orderId, dto)
    
    AdminSvc ->> UoW: Orders.Query().Include(Items).FirstOrDefaultAsync(o => o.Id == orderId)
    UoW ->> DB: SELECT Order kèm OrderItems
    DB -->> AdminSvc: Order Entity

    %% Kiểm tra điều kiện hoàn kho
    alt Trạng thái cũ chưa hủy VÀ trạng thái mới là "Đã hủy"
        loop Lặp qua từng OrderItem trong đơn hàng
            AdminSvc ->> UoW: ProductVariants.GetByIdAsync(item.ProductVariantId)
            AdminSvc ->> AdminSvc: variant.StockQuantity += item.Quantity (Cộng hoàn tồn kho)
            AdminSvc ->> UoW: ProductVariants.Update(variant)
            AdminSvc ->> UoW: InventoryLogs.AddAsync(Loại: "ADJUST", Note: "Hoàn tồn kho từ đơn hủy")
        end
    end

    %% Cập nhật trạng thái đơn
    AdminSvc ->> AdminSvc: order.OrderStatus = "Đã hủy"
    AdminSvc ->> UoW: Orders.Update(order)
    AdminSvc ->> UoW: SaveChangesAsync()

    AdminSvc -->> AdminCtrl: OrderResponseDto (OrderStatus: "Đã hủy")
    AdminCtrl -->> AdminUI: 200 OK
    AdminUI -->> Admin: Cập nhật giao diện: Đơn hàng đã hủy & kho hàng đã được cộng bù chính xác
```

---

### 3.6. Sequence: Kiểm Duyệt Đánh Giá Sản Phẩm Do AI Gắn Cờ Vi Phạm

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng Đăng Đánh Giá
    actor Admin as Quản Trị Viên Kiểm Duyệt
    participant Web as Web Client / ProductDetailPage
    participant ProductCtrl as ProductsController
    participant AISvc as AI Content Moderation Service
    participant AdminUI as AdminPortalPage (Reviews Tab)
    participant AdminCtrl as AdminController
    participant AdminSvc as AdminService
    participant DB as SQL Server

    Customer ->> Web: Gửi bình luận đánh giá kèm số sao
    Web ->> ProductCtrl: POST /api/products/{id}/reviews { rating, comment }
    ProductCtrl ->> AISvc: AnalyzeComment(comment)
    
    alt AI phát hiện từ ngữ thô tục / spam link cá cược
        AISvc -->> ProductCtrl: IsViolation = true, Reason = "Từ ngữ xúc phạm", Confidence = 98.5%
        ProductCtrl ->> DB: INSERT INTO ProductReviews (IsFlaggedByAi=1, ModerationStatus='Pending')
        ProductCtrl -->> Web: 200 OK ("Đánh giá của bạn đang được kiểm duyệt")
    else Nội dung chuẩn mực
        AISvc -->> ProductCtrl: IsViolation = false
        ProductCtrl ->> DB: INSERT INTO ProductReviews (IsFlaggedByAi=0, ModerationStatus='Approved')
        ProductCtrl -->> Web: 200 OK ("Đánh giá đã được đăng thành công")
    end

    %% Quản trị viên xử lý đánh giá bị gắn cờ
    Admin ->> AdminUI: Mở tab "Kiểm Duyệt Đánh Giá (AI)"
    AdminUI ->> AdminCtrl: GET /api/admin/reviews/moderation?onlyFlagged=true
    AdminCtrl ->> AdminSvc: GetReviewsForModerationAsync()
    AdminSvc ->> DB: SELECT * FROM ProductReviews WHERE IsFlaggedByAi = 1
    DB -->> AdminSvc: Danh sách đánh giá vi phạm kèm AI Confidence Score
    AdminSvc -->> AdminCtrl: List<ReviewModerationDto>
    AdminCtrl -->> AdminUI: 200 OK

    Admin ->> AdminUI: Nhấn "Gỡ bỏ vi phạm" (Reject) hoặc "Phê duyệt" (Approve)
    AdminUI ->> AdminCtrl: PUT /api/admin/reviews/{id}/moderate { moderationStatus: "Rejected", adminResponse: "Đã gỡ vì vi phạm TCCĐ" }
    AdminCtrl ->> AdminSvc: ModerateReviewAsync(id, dto)
    AdminSvc ->> DB: UPDATE ProductReviews SET ModerationStatus = 'Rejected'
    AdminSvc -->> AdminCtrl: ReviewModerationDto
    AdminCtrl -->> AdminUI: 200 OK
    AdminUI -->> Admin: Bài đánh giá vi phạm đã bị gỡ khỏi sàn
```

---

## PHẦN 3: CÁC BIỂU ĐỒ LỚP (CLASS DIAGRAMS)

### 4.1. Biểu Đồ Lớp Thực Thể CSDL (Domain Entity Model)

```mermaid
classDiagram
    %% Base Entity
    class BaseEntity {
        +int Id
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }

    %% User & Authorization
    class User {
        +string FullName
        +string PhoneNumber
        +string Email
        +string PasswordHash
        +DateTime DateOfBirth
        +string AvatarUrl
        +int RoleId
        +string MemberTier
        +int RewardPoints
        +bool IsActive
    }

    class Role {
        +int Id
        +string Name
        +string Description
    }

    class UserAddress {
        +int Id
        +int UserId
        +string ReceiverName
        +string ReceiverPhone
        +string Province
        +string District
        +string Ward
        +string DetailedAddress
        +bool IsDefault
        +DateTime CreatedAt
    }

    %% Catalog & Product
    class Brand {
        +int Id
        +string Name
        +string Slug
        +string LogoUrl
        +string Country
        +bool IsActive
    }

    class Category {
        +int Id
        +string Name
        +string Slug
        +string Description
        +int ParentId
        +string IconName
        +int DisplayOrder
        +bool IsActive
    }

    class Product {
        +string Name
        +string Slug
        +int BrandId
        +int CategoryId
        +string Description
        +string ThumbnailUrl
        +decimal BasePrice
        +decimal OriginalPrice
        +int DiscountPercent
        +decimal MemberDiscountPercent
        +int WarrantyMonths
        +string RamCapacity
        +string StorageCapacity
        +string Chipset
        +string BatteryCapacity
        +string ScreenSpecs
        +string CameraSpecs
        +bool IsFeatured
        +bool IsHot
        +bool InStock
        +bool IsActive
    }

    class ProductVariant {
        +int Id
        +int ProductId
        +string Sku
        +string ColorName
        +string ColorHex
        +string StorageCapacity
        +string RamCapacity
        +decimal Price
        +decimal OriginalPrice
        +int StockQuantity
        +string ImageUrl
        +bool IsActive
    }

    %% Ordering & Coupons
    class Coupon {
        +int Id
        +string Code
        +string Title
        +string DiscountType
        +decimal DiscountValue
        +decimal MinOrderAmount
        +decimal MaxDiscountAmount
        +DateTime StartDate
        +DateTime EndDate
        +int UsageLimit
        +int UsedCount
        +bool IsActive
    }

    class Order {
        +string OrderCode
        +int UserId
        +string ReceiverName
        +string ReceiverPhone
        +string ReceiverEmail
        +string ShippingAddress
        +decimal SubTotal
        +decimal DiscountAmount
        +decimal ShippingFee
        +decimal TotalAmount
        +string OrderStatus
        +string PaymentMethod
        +string PaymentStatus
        +string Notes
        +int CouponId
    }

    class OrderItem {
        +int Id
        +int OrderId
        +int ProductVariantId
        +string ProductName
        +string VariantSummary
        +int Quantity
        +decimal UnitPrice
        +decimal TotalPrice
    }

    %% Payments
    class Payment {
        +int Id
        +int OrderId
        +string PaymentMethod
        +string TransactionCode
        +decimal Amount
        +string Status
        +string ResponseJson
        +DateTime CreatedAt
    }

    %% Reviews & Inventory
    class ProductReview {
        +int Id
        +int ProductId
        +int UserId
        +int Rating
        +string Comment
        +string ImagesJson
        +bool IsVerifiedPurchase
        +bool IsFlaggedByAi
        +string AiFlagReason
        +decimal AiFlagConfidence
        +string ModerationStatus
        +string AdminResponse
        +DateTime CreatedAt
    }

    class InventoryLog {
        +int Id
        +int ProductId
        +int ProductVariantId
        +string Type
        +int Quantity
        +decimal UnitPrice
        +string SupplierOrDestination
        +string Note
        +string CreatedBy
        +DateTime CreatedAt
    }

    %% Relationships
    BaseEntity <|-- User
    BaseEntity <|-- Product
    BaseEntity <|-- Order

    Role "1" <-- "*" User : has role
    User "1" --> "*" UserAddress : has addresses
    User "1" --> "*" Order : places
    User "1" --> "*" ProductReview : writes

    Category "1" --> "*" Category : subcategories
    Category "1" --> "*" Product : classifies
    Brand "1" --> "*" Product : manufactures
    Product "1" --> "*" ProductVariant : has variants
    Product "1" --> "*" ProductReview : receives
    Product "1" --> "*" InventoryLog : tracked in

    ProductVariant "1" --> "*" OrderItem : ordered as
    ProductVariant "1" --> "*" InventoryLog : logged in

    Coupon "1" <-- "0..1" Order : applies
    Order "1" --> "*" OrderItem : contains
    Order "1" --> "*" Payment : paid via
```

---

### 4.2. Biểu Đồ Lớp Kiến Trúc 3 Tầng (3-Tier Layered Architecture)

Biểu đồ dưới đây mô tả sự phân tách rõ ràng giữa **Presentation Layer (Controllers)**, **Business Logic Layer (Services)** và **Data Access Layer (UnitOfWork & Repository)** theo mẫu thiết kế Dependency Injection.

```mermaid
classDiagram
    %% API Controllers Layer
    class AuthController {
        -IAuthService _authService
        +Register(dto) Task~IActionResult~
        +Login(dto) Task~IActionResult~
        +GetProfile() Task~IActionResult~
        +UpdateProfile(dto) Task~IActionResult~
        +ChangePassword(dto) Task~IActionResult~
    }

    class OrdersController {
        -IOrderService _orderService
        +CreateOrder(dto) Task~IActionResult~
        +GetOrderByCode(code) Task~IActionResult~
        +GetMyOrders() Task~IActionResult~
    }

    class AdminController {
        -IAdminService _adminService
        +GetDashboardStats() Task~IActionResult~
        +GetAllProducts() Task~IActionResult~
        +CreateProduct(dto) Task~IActionResult~
        +UpdateProduct(id, dto) Task~IActionResult~
        +ToggleProductStatus(id) Task~IActionResult~
        +DeleteProduct(id) Task~IActionResult~
        +GetAllOrders() Task~IActionResult~
        +UpdateOrderStatus(id, dto) Task~IActionResult~
        +GetLowStockAlerts(threshold) Task~IActionResult~
        +GetInventoryLogs() Task~IActionResult~
        +CreateInventoryImport(dto) Task~IActionResult~
        +GetReviewsForModeration(flagged) Task~IActionResult~
        +ModerateReview(id, dto) Task~IActionResult~
    }

    class PaymentController {
        -IPaymentService _paymentService
        +CreateQrPayment(dto) Task~IActionResult~
        +GetPaymentStatus(orderCode) Task~IActionResult~
        +SimulateTransfer(dto) Task~IActionResult~
        +ProcessCardPayment(dto) Task~IActionResult~
        +VerifyCardOtp(dto) Task~IActionResult~
    }

    %% Business Logic Interfaces
    class IAuthService {
        <<interface>>
        +RegisterAsync(dto) Task~AuthResponseDto~
        +LoginAsync(dto) Task~AuthResponseDto~
        +GetUserProfileAsync(id) Task~UserProfileDto~
        +UpdateUserProfileAsync(id, dto) Task~UserProfileDto~
        +ChangePasswordAsync(id, dto) Task~bool~
    }

    class IOrderService {
        <<interface>>
        +CreateOrderAsync(dto, userId) Task~OrderResponseDto~
        +GetOrderByCodeAsync(orderCode) Task~OrderResponseDto~
        +GetUserOrdersAsync(userId) Task~IEnumerable~OrderResponseDto~~
    }

    class IAdminService {
        <<interface>>
        +GetDashboardStatsAsync() Task~AdminDashboardStatsDto~
        +GetAllProductsAsync() Task~IEnumerable~AdminProductListItemDto~~
        +CreateProductAsync(dto) Task~AdminProductListItemDto~
        +UpdateProductAsync(id, dto) Task~AdminProductListItemDto~
        +ToggleProductStatusAsync(id) Task~bool~
        +DeleteProductAsync(id) Task~bool~
        +GetAllOrdersAsync() Task~IEnumerable~OrderResponseDto~~
        +UpdateOrderStatusAsync(id, dto) Task~OrderResponseDto~
        +GetLowStockAlertsAsync(threshold) Task~IEnumerable~LowStockAlertDto~~
        +GetInventoryLogsAsync() Task~IEnumerable~InventoryLogDto~~
        +CreateInventoryImportAsync(dto, user) Task~InventoryLogDto~
        +GetReviewsForModerationAsync(onlyFlagged) Task~IEnumerable~ReviewModerationDto~~
        +ModerateReviewAsync(id, dto) Task~ReviewModerationDto~
    }

    class IPaymentService {
        <<interface>>
        +CreateQrPaymentAsync(orderCode, bankCode) Task~QrPaymentResponseDto~
        +CheckPaymentStatusAsync(orderCode) Task~CheckPaymentStatusResponseDto~
        +SimulateBankTransferWebhookAsync(dto) Task~CheckPaymentStatusResponseDto~
        +ProcessCardPaymentAsync(dto) Task~CardPaymentResponseDto~
        +VerifyCardOtpAsync(dto) Task~CardPaymentResponseDto~
    }

    %% Service Implementations
    class AuthService {
        -IUnitOfWork _unitOfWork
        -IConfiguration _config
        -IMapper _mapper
    }

    class OrderService {
        -IUnitOfWork _unitOfWork
        -ICouponService _couponService
        -IMapper _mapper
    }

    class AdminService {
        -IUnitOfWork _unitOfWork
        -IMapper _mapper
    }

    class PaymentService {
        -IUnitOfWork _unitOfWork
        -IConfiguration _config
        -IMapper _mapper
    }

    %% Data Access Layer
    class IUnitOfWork {
        <<interface>>
        +IRepository~User~ Users
        +IRepository~Product~ Products
        +IRepository~ProductVariant~ ProductVariants
        +IRepository~Order~ Orders
        +IRepository~OrderItem~ OrderItems
        +IRepository~Coupon~ Coupons
        +IRepository~Payment~ Payments
        +IRepository~ProductReview~ ProductReviews
        +IRepository~InventoryLog~ InventoryLogs
        +SaveChangesAsync() Task~int~
        +BeginTransactionAsync() Task
        +CommitAsync() Task
        +RollbackAsync() Task
    }

    class UnitOfWork {
        -ApplicationDbContext _context
    }

    class ApplicationDbContext {
        +DbSet~User~ Users
        +DbSet~Product~ Products
        +DbSet~Order~ Orders
        +DbSet~Payment~ Payments
        +DbSet~InventoryLog~ InventoryLogs
    }

    %% Wiring / Dependencies
    AuthController ..> IAuthService : depends on
    OrdersController ..> IOrderService : depends on
    AdminController ..> IAdminService : depends on
    PaymentController ..> IPaymentService : depends on

    IAuthService <|.. AuthService : implements
    IOrderService <|.. OrderService : implements
    IAdminService <|.. AdminService : implements
    IPaymentService <|.. PaymentService : implements

    AuthService ..> IUnitOfWork : uses
    OrderService ..> IUnitOfWork : uses
    AdminService ..> IUnitOfWork : uses
    PaymentService ..> IUnitOfWork : uses

    IUnitOfWork <|.. UnitOfWork : implements
    UnitOfWork ..> ApplicationDbContext : manages
```

---

## 5. TỔNG KẾT & HƯỚNG DẪN SỬ DỤNG
- Tập tin Markdown này chứa toàn bộ các biểu đồ chuẩn UML được diễn giải bằng cú pháp Mermaid tương thích 100% với GitHub, GitLab, VS Code Markdown Preview, và Antigravity Markdown Viewer.
- Các biểu đồ đã phản ánh chính xác cấu trúc thực tế của mã nguồn hiện tại trong repository:
  1. Phân quyền chặt chẽ `[Authorize(Roles = "Admin")]` cho Kênh Quản trị.
  2. Cơ chế khóa chống thao túng giá bán và kiểm tra tồn kho chống bán âm khi tạo đơn.
  3. Cơ chế tự động hoàn trả tồn kho và ghi nhật ký kiểm kê khi hủy đơn hàng.
  4. Hai cổng thanh toán trực tuyến VietQR (NAPAS 24/7) và Thẻ tín dụng quốc tế (OTP 3D-Secure).
  5. Cơ chế che giấu dữ liệu cá nhân (Data Masking) chống tấn công IDOR khi tra cứu đơn hàng công khai.
