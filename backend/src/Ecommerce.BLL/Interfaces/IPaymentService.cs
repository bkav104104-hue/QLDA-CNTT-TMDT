using System.Threading.Tasks;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        /// Tạo mã QR động chuẩn VietQR cho đơn hàng
        /// </summary>
        Task<QrPaymentResponseDto> CreateQrPaymentAsync(string orderCode, string? bankCode = null);

        /// <summary>
        /// Kiểm tra trạng thái thanh toán hiện tại của đơn hàng (dùng cho client polling)
        /// </summary>
        Task<CheckPaymentStatusResponseDto> CheckPaymentStatusAsync(string orderCode);

        /// <summary>
        /// Xử lý thanh toán thẻ tín dụng (Visa, MasterCard, JCB) với thuật toán Luhn và 3D-Secure
        /// </summary>
        Task<CardPaymentResponseDto> ProcessCardPaymentAsync(ProcessCardPaymentRequestDto request);

        /// <summary>
        /// Xác thực mã OTP 3D-Secure để hoàn tất giao dịch thẻ tín dụng
        /// </summary>
        Task<CardPaymentResponseDto> VerifyCardOtpAsync(VerifyCardOtpRequestDto request);

        /// <summary>
        /// Mô phỏng webhook nhận tiền từ ngân hàng (dùng cho dev/test và kiểm thử tự động)
        /// </summary>
        Task<CheckPaymentStatusResponseDto> SimulateBankTransferWebhookAsync(SimulateBankWebhookDto request);

        /// <summary>
        /// Lấy danh sách lịch sử giao dịch thanh toán theo người dùng hoặc theo mã đơn hàng
        /// </summary>
        Task<List<PaymentHistoryItemDto>> GetPaymentHistoryAsync(int? userId, string? orderCode = null);
    }
}

