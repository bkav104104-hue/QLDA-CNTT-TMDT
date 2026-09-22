using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.DTOs.Responses;

namespace Ecommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IValidator<ProcessCardPaymentRequestDto> _cardValidator;
        private readonly IValidator<VerifyCardOtpRequestDto> _otpValidator;
        private readonly IValidator<CreateQrPaymentRequestDto> _qrValidator;

        public PaymentController(
            IPaymentService paymentService,
            IValidator<ProcessCardPaymentRequestDto> cardValidator,
            IValidator<VerifyCardOtpRequestDto> otpValidator,
            IValidator<CreateQrPaymentRequestDto> qrValidator)
        {
            _paymentService = paymentService;
            _cardValidator = cardValidator;
            _otpValidator = otpValidator;
            _qrValidator = qrValidator;
        }

        /// <summary>
        /// Tạo mã QR Code thanh toán online (chuẩn VietQR) cho đơn hàng
        /// </summary>
        [HttpPost("qr/create")]
        public async Task<IActionResult> CreateQrPayment([FromBody] CreateQrPaymentRequestDto request)
        {
            var valResult = await _qrValidator.ValidateAsync(request);
            if (!valResult.IsValid)
            {
                return BadRequest(ApiResponse<QrPaymentResponseDto>.ErrorResult("Thông tin yêu cầu không hợp lệ", valResult.Errors.ConvertAll(e => e.ErrorMessage)));
            }

            var response = await _paymentService.CreateQrPaymentAsync(request.OrderCode, request.BankCode);
            return Ok(ApiResponse<QrPaymentResponseDto>.SuccessResult(response, "Khởi tạo mã VietQR thành công!"));
        }

        /// <summary>
        /// Tra cứu trạng thái thanh toán đơn hàng thời gian thực (Polling endpoint)
        /// </summary>
        [HttpGet("status/{orderCode}")]
        public async Task<IActionResult> GetPaymentStatus(string orderCode)
        {
            if (string.IsNullOrWhiteSpace(orderCode))
            {
                return BadRequest(ApiResponse<CheckPaymentStatusResponseDto>.ErrorResult("Mã đơn hàng không được để trống"));
            }

            var response = await _paymentService.CheckPaymentStatusAsync(orderCode);
            return Ok(ApiResponse<CheckPaymentStatusResponseDto>.SuccessResult(response, "Tra cứu trạng thái thanh toán thành công"));
        }

        /// <summary>
        /// Mô phỏng webhook nhận tiền từ ngân hàng (chuyển khoản qua QR thành công)
        /// </summary>
        [HttpPost("qr/simulate-transfer")]
        public async Task<IActionResult> SimulateTransfer([FromBody] SimulateBankWebhookDto request)
        {
            if (string.IsNullOrWhiteSpace(request.OrderCode))
            {
                return BadRequest(ApiResponse<CheckPaymentStatusResponseDto>.ErrorResult("Mã đơn hàng không được để trống"));
            }

            var response = await _paymentService.SimulateBankTransferWebhookAsync(request);
            return Ok(ApiResponse<CheckPaymentStatusResponseDto>.SuccessResult(response, "Xác nhận chuyển khoản ngân hàng thành công!"));
        }

        /// <summary>
        /// Xử lý thanh toán thẻ tín dụng quốc tế (Visa, MasterCard, JCB)
        /// </summary>
        [HttpPost("card/process")]
        public async Task<IActionResult> ProcessCardPayment([FromBody] ProcessCardPaymentRequestDto request)
        {
            var valResult = await _cardValidator.ValidateAsync(request);
            if (!valResult.IsValid)
            {
                return BadRequest(ApiResponse<CardPaymentResponseDto>.ErrorResult("Thông tin thẻ không hợp lệ", valResult.Errors.ConvertAll(e => e.ErrorMessage)));
            }

            var response = await _paymentService.ProcessCardPaymentAsync(request);
            return Ok(ApiResponse<CardPaymentResponseDto>.SuccessResult(response, response.Message));
        }

        /// <summary>
        /// Xác thực mã OTP 3D-Secure để hoàn tất giao dịch thẻ tín dụng
        /// </summary>
        [HttpPost("card/verify-otp")]
        public async Task<IActionResult> VerifyCardOtp([FromBody] VerifyCardOtpRequestDto request)
        {
            var valResult = await _otpValidator.ValidateAsync(request);
            if (!valResult.IsValid)
            {
                return BadRequest(ApiResponse<CardPaymentResponseDto>.ErrorResult("Mã xác thực không hợp lệ", valResult.Errors.ConvertAll(e => e.ErrorMessage)));
            }

            var response = await _paymentService.VerifyCardOtpAsync(request);
            return Ok(ApiResponse<CardPaymentResponseDto>.SuccessResult(response, response.Message));
        }

        /// <summary>
        /// Tra cứu lịch sử giao dịch thanh toán (theo đơn hàng hoặc theo tài khoản)
        /// </summary>
        [HttpGet("history")]
        public async Task<IActionResult> GetPaymentHistory([FromQuery] string? orderCode = null, [FromQuery] int? userId = null)
        {
            if (!userId.HasValue)
            {
                var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(idClaim, out int tokenUserId))
                {
                    userId = tokenUserId;
                }
            }

            var history = await _paymentService.GetPaymentHistoryAsync(userId, orderCode);
            return Ok(ApiResponse<List<PaymentHistoryItemDto>>.SuccessResult(history, "Tra cứu lịch sử thanh toán thành công!"));
        }
    }
}

