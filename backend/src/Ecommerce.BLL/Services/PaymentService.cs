using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Ecommerce.BLL.Interfaces;
using Ecommerce.Common.Constants;
using Ecommerce.Common.DTOs;
using Ecommerce.Common.Entities;
using Ecommerce.DAL.Interfaces;

namespace Ecommerce.BLL.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public PaymentService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<QrPaymentResponseDto> CreateQrPaymentAsync(string orderCode, string? bankCode = null)
        {
            var code = orderCode.Trim();
            var order = await _unitOfWork.Orders.Query()
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderCode == code);

            if (order == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng với mã '{orderCode}'.");
            }

            var merchantName = _configuration["PaymentGateway:MerchantName"] ?? "CONG TY CP CONG NGHE NEXTPHONE VIET NAM";
            var bankBin = _configuration["PaymentGateway:VietQR:BankBin"] ?? "970422"; // MBBank
            var bankName = _configuration["PaymentGateway:VietQR:BankName"] ?? "MBBank";
            var accountNo = _configuration["PaymentGateway:VietQR:AccountNo"] ?? "0988776655";

            var transferContent = $"NP {order.OrderCode}";
            var qrCodeUrl = $"https://img.vietqr.io/image/{bankBin}-{accountNo}-compact2.png?amount={(long)order.TotalAmount}&addInfo={Uri.EscapeDataString(transferContent)}&accountName={Uri.EscapeDataString(merchantName)}";
            var qrRawContent = $"00020101021238540010A00000072701240006{bankBin}01{accountNo.Length:D2}{accountNo}0208QRIBFTTA530370454{order.TotalAmount:F0}5802VN62{transferContent.Length + 4:D2}08{transferContent.Length:D2}{transferContent}6304";

            var transactionCode = $"TXN-QR-{DateTime.UtcNow:yyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";

            var paymentMeta = new
            {
                Type = "VietQR",
                BankBin = bankBin,
                BankName = bankName,
                AccountNo = accountNo,
                AccountName = merchantName,
                TransferContent = transferContent,
                QrCodeUrl = qrCodeUrl
            };

            var payment = new Payment
            {
                OrderId = order.Id,
                PaymentMethod = AppConstants.PaymentMethod.QRCode,
                TransactionCode = transactionCode,
                Amount = order.TotalAmount,
                Status = order.PaymentStatus == AppConstants.PaymentStatus.Paid ? AppConstants.TransactionStatus.Success : AppConstants.TransactionStatus.Pending,
                ResponseJson = JsonSerializer.Serialize(paymentMeta),
                CreatedAt = DateTime.UtcNow
            };

            order.PaymentMethod = AppConstants.PaymentMethod.QRCode;
            await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            return new QrPaymentResponseDto
            {
                OrderCode = order.OrderCode,
                Amount = order.TotalAmount,
                QrCodeUrl = qrCodeUrl,
                QrContent = qrRawContent,
                BankBin = bankBin,
                BankName = bankName,
                AccountNo = accountNo,
                AccountName = merchantName,
                TransferContent = transferContent,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                PaymentStatus = order.PaymentStatus
            };
        }

        public async Task<CheckPaymentStatusResponseDto> CheckPaymentStatusAsync(string orderCode)
        {
            var code = orderCode.Trim();
            var order = await _unitOfWork.Orders.Query()
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderCode == code);

            if (order == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng với mã '{orderCode}'.");
            }

            var successfulPayment = order.Payments.FirstOrDefault(p => p.Status == AppConstants.TransactionStatus.Success);
            var latestPayment = order.Payments.OrderByDescending(p => p.CreatedAt).FirstOrDefault();

            return new CheckPaymentStatusResponseDto
            {
                OrderCode = order.OrderCode,
                PaymentStatus = order.PaymentStatus,
                OrderStatus = order.OrderStatus,
                TotalAmount = order.TotalAmount,
                PaidAmount = successfulPayment != null ? successfulPayment.Amount : 0,
                PaymentMethod = order.PaymentMethod,
                TransactionCode = successfulPayment?.TransactionCode ?? latestPayment?.TransactionCode,
                PaidAt = successfulPayment?.CreatedAt,
                Transactions = order.Payments.Select(p => new PaymentTransactionDto
                {
                    Id = p.Id,
                    TransactionCode = p.TransactionCode ?? string.Empty,
                    PaymentMethod = p.PaymentMethod,
                    Amount = p.Amount,
                    Status = p.Status,
                    CreatedAt = p.CreatedAt
                }).ToList()
            };
        }

        public async Task<CardPaymentResponseDto> ProcessCardPaymentAsync(ProcessCardPaymentRequestDto request)
        {
            var code = request.OrderCode.Trim();
            var order = await _unitOfWork.Orders.Query()
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderCode == code);

            if (order == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng với mã '{request.OrderCode}'.");
            }

            if (order.PaymentStatus == AppConstants.PaymentStatus.Paid)
            {
                return new CardPaymentResponseDto
                {
                    Success = true,
                    OrderCode = order.OrderCode,
                    Amount = order.TotalAmount,
                    Status = AppConstants.TransactionStatus.Success,
                    Message = "Đơn hàng này đã được thanh toán thành công trước đó."
                };
            }

            var cleanCardNumber = request.CardNumber.Replace(" ", "").Replace("-", "");
            var cardBrand = DetectCardBrand(cleanCardNumber);
            var maskedNumber = MaskCardNumber(cleanCardNumber);
            var transactionCode = $"TXN-CC-{DateTime.UtcNow:yyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";

            var enable3DSecure = !string.Equals(_configuration["PaymentGateway:CreditCard:Enable3DSecure"], "false", StringComparison.OrdinalIgnoreCase);
            var testOtp = _configuration["PaymentGateway:CreditCard:TestOtp"] ?? "888888";

            if (enable3DSecure)
            {
                var cardMeta = new
                {
                    CardBrand = cardBrand,
                    CardNumberMasked = maskedNumber,
                    CardHolderName = request.CardHolderName.Trim().ToUpperInvariant(),
                    ExpiryMonth = request.ExpiryMonth,
                    ExpiryYear = request.ExpiryYear,
                    Otp = testOtp,
                    AuthMode = "3D-Secure"
                };

                var pendingPayment = new Payment
                {
                    OrderId = order.Id,
                    PaymentMethod = AppConstants.PaymentMethod.CreditCard,
                    TransactionCode = transactionCode,
                    Amount = order.TotalAmount,
                    Status = AppConstants.TransactionStatus.RequiresOtp,
                    ResponseJson = JsonSerializer.Serialize(cardMeta),
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Payments.AddAsync(pendingPayment);
                await _unitOfWork.SaveChangesAsync();

                return new CardPaymentResponseDto
                {
                    Success = false,
                    TransactionCode = transactionCode,
                    OrderCode = order.OrderCode,
                    Amount = order.TotalAmount,
                    CardBrand = cardBrand,
                    CardNumberMasked = maskedNumber,
                    Status = AppConstants.TransactionStatus.RequiresOtp,
                    Message = "Giao dịch yêu cầu xác thực 3D-Secure OTP từ ngân hàng phát hành thẻ.",
                    OtpHint = $"Mã OTP xác thực thử nghiệm là: {testOtp}"
                };
            }
            else
            {
                // Direct Capture without OTP
                var cardMeta = new
                {
                    CardBrand = cardBrand,
                    CardNumberMasked = maskedNumber,
                    CardHolderName = request.CardHolderName.Trim().ToUpperInvariant(),
                    AuthMode = "DirectCapture"
                };

                var payment = new Payment
                {
                    OrderId = order.Id,
                    PaymentMethod = AppConstants.PaymentMethod.CreditCard,
                    TransactionCode = transactionCode,
                    Amount = order.TotalAmount,
                    Status = AppConstants.TransactionStatus.Success,
                    ResponseJson = JsonSerializer.Serialize(cardMeta),
                    CreatedAt = DateTime.UtcNow
                };

                order.PaymentStatus = AppConstants.PaymentStatus.Paid;
                order.OrderStatus = AppConstants.OrderStatus.Confirmed;
                order.PaymentMethod = AppConstants.PaymentMethod.CreditCard;

                await _unitOfWork.Payments.AddAsync(payment);
                _unitOfWork.Orders.Update(order);
                await _unitOfWork.SaveChangesAsync();

                return new CardPaymentResponseDto
                {
                    Success = true,
                    TransactionCode = transactionCode,
                    OrderCode = order.OrderCode,
                    Amount = order.TotalAmount,
                    CardBrand = cardBrand,
                    CardNumberMasked = maskedNumber,
                    Status = AppConstants.TransactionStatus.Success,
                    Message = "Thanh toán thẻ tín dụng thành công!",
                    PaidAt = DateTime.UtcNow
                };
            }
        }

        public async Task<CardPaymentResponseDto> VerifyCardOtpAsync(VerifyCardOtpRequestDto request)
        {
            var txnCode = request.TransactionCode.Trim();
            var payment = await _unitOfWork.Payments.Query()
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.TransactionCode == txnCode);

            if (payment == null || payment.Order == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy thông tin giao dịch '{request.TransactionCode}'.");
            }

            if (payment.Status == AppConstants.TransactionStatus.Success)
            {
                return new CardPaymentResponseDto
                {
                    Success = true,
                    TransactionCode = payment.TransactionCode ?? string.Empty,
                    OrderCode = payment.Order.OrderCode,
                    Amount = payment.Amount,
                    Status = AppConstants.TransactionStatus.Success,
                    Message = "Giao dịch này đã được xác thực thành công trước đó."
                };
            }

            var testOtp = _configuration["PaymentGateway:CreditCard:TestOtp"] ?? "888888";
            string? expectedOtp = testOtp;

            if (!string.IsNullOrEmpty(payment.ResponseJson))
            {
                try
                {
                    using var doc = JsonDocument.Parse(payment.ResponseJson);
                    if (doc.RootElement.TryGetProperty("Otp", out var otpProp))
                    {
                        expectedOtp = otpProp.GetString() ?? testOtp;
                    }
                }
                catch
                {
                    // Fallback to configured testOtp
                }
            }

            if (request.OtpCode.Trim() != expectedOtp)
            {
                payment.Status = AppConstants.TransactionStatus.Failed;
                _unitOfWork.Payments.Update(payment);
                await _unitOfWork.SaveChangesAsync();

                throw new InvalidOperationException("Mã OTP xác thực không chính xác hoặc đã hết hạn.");
            }

            // OTP is valid -> Transition to Success
            payment.Status = AppConstants.TransactionStatus.Success;
            var order = payment.Order;
            order.PaymentStatus = AppConstants.PaymentStatus.Paid;
            order.OrderStatus = AppConstants.OrderStatus.Confirmed;
            order.PaymentMethod = AppConstants.PaymentMethod.CreditCard;

            _unitOfWork.Payments.Update(payment);
            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync();

            string cardBrand = "Credit Card";
            string maskedNumber = "****";
            if (!string.IsNullOrEmpty(payment.ResponseJson))
            {
                try
                {
                    using var doc = JsonDocument.Parse(payment.ResponseJson);
                    if (doc.RootElement.TryGetProperty("CardBrand", out var b)) cardBrand = b.GetString() ?? cardBrand;
                    if (doc.RootElement.TryGetProperty("CardNumberMasked", out var m)) maskedNumber = m.GetString() ?? maskedNumber;
                }
                catch { }
            }

            return new CardPaymentResponseDto
            {
                Success = true,
                TransactionCode = payment.TransactionCode ?? string.Empty,
                OrderCode = order.OrderCode,
                Amount = payment.Amount,
                CardBrand = cardBrand,
                CardNumberMasked = maskedNumber,
                Status = AppConstants.TransactionStatus.Success,
                Message = "Xác thực OTP thành công! Đơn hàng đã được thanh toán.",
                PaidAt = DateTime.UtcNow
            };
        }

        public async Task<CheckPaymentStatusResponseDto> SimulateBankTransferWebhookAsync(SimulateBankWebhookDto request)
        {
            var code = request.OrderCode.Trim();
            var order = await _unitOfWork.Orders.Query()
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.OrderCode == code);

            if (order == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đơn hàng với mã '{request.OrderCode}'.");
            }

            if (request.Amount.HasValue && request.Amount.Value < order.TotalAmount)
            {
                throw new InvalidOperationException($"Số tiền thanh toán ({request.Amount.Value:N0} đ) không đủ so với tổng giá trị đơn hàng ({order.TotalAmount:N0} đ).");
            }

            var transactionCode = $"TXN-BANK-{DateTime.UtcNow:yyMMddHHmmss}-{request.BankTransactionId ?? Guid.NewGuid().ToString("N")[..6].ToUpper()}";

            var payment = order.Payments.FirstOrDefault(p => p.PaymentMethod == AppConstants.PaymentMethod.QRCode && p.Status == AppConstants.TransactionStatus.Pending);

            if (payment == null)
            {
                payment = new Payment
                {
                    OrderId = order.Id,
                    PaymentMethod = AppConstants.PaymentMethod.QRCode,
                    TransactionCode = transactionCode,
                    Amount = request.Amount ?? order.TotalAmount,
                    Status = AppConstants.TransactionStatus.Success,
                    ResponseJson = JsonSerializer.Serialize(new { Source = "BankWebhookSimulation", BankTransactionId = request.BankTransactionId }),
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.Payments.AddAsync(payment);
            }
            else
            {
                payment.Status = AppConstants.TransactionStatus.Success;
                payment.TransactionCode = transactionCode;
                _unitOfWork.Payments.Update(payment);
            }

            order.PaymentStatus = AppConstants.PaymentStatus.Paid;
            order.OrderStatus = AppConstants.OrderStatus.Confirmed;
            order.PaymentMethod = AppConstants.PaymentMethod.QRCode;
            _unitOfWork.Orders.Update(order);

            await _unitOfWork.SaveChangesAsync();

            return await CheckPaymentStatusAsync(order.OrderCode);
        }

        public async Task<List<PaymentHistoryItemDto>> GetPaymentHistoryAsync(int? userId, string? orderCode = null)
        {
            var query = _unitOfWork.Payments.Query()
                .Include(p => p.Order)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(orderCode))
            {
                var trimmed = orderCode.Trim();
                query = query.Where(p => p.Order != null && p.Order.OrderCode == trimmed);
            }
            else if (userId.HasValue && userId.Value > 0)
            {
                query = query.Where(p => p.Order != null && p.Order.UserId == userId.Value);
            }

            var payments = await query
                .OrderByDescending(p => p.CreatedAt)
                .Take(50)
                .ToListAsync();

            var result = new List<PaymentHistoryItemDto>();
            foreach (var p in payments)
            {
                string statusDisplay = p.Status switch
                {
                    AppConstants.TransactionStatus.Success => "Thành công",
                    AppConstants.TransactionStatus.Pending => "Đang chờ xử lý",
                    AppConstants.TransactionStatus.RequiresOtp => "Chờ xác thực OTP",
                    AppConstants.TransactionStatus.Failed => "Thất bại",
                    _ => p.Status
                };

                string methodDetails = p.PaymentMethod switch
                {
                    AppConstants.PaymentMethod.QRCode => "Chuyển khoản VietQR",
                    AppConstants.PaymentMethod.CreditCard => "Thẻ tín dụng quốc tế",
                    _ => p.PaymentMethod
                };

                try
                {
                    if (!string.IsNullOrWhiteSpace(p.ResponseJson))
                    {
                        using var doc = JsonDocument.Parse(p.ResponseJson);
                        var root = doc.RootElement;
                        if (root.TryGetProperty("BankName", out var bankNameProp) && root.TryGetProperty("AccountNo", out var accountNoProp))
                        {
                            methodDetails = $"VietQR - {bankNameProp.GetString()} ({accountNoProp.GetString()})";
                        }
                        else if (root.TryGetProperty("CardBrand", out var brandProp) && root.TryGetProperty("CardNumberMasked", out var maskProp))
                        {
                            methodDetails = $"{brandProp.GetString()} ({maskProp.GetString()})";
                        }
                    }
                }
                catch
                {
                    // Ignore JSON parsing fallback
                }

                result.Add(new PaymentHistoryItemDto
                {
                    Id = p.Id,
                    TransactionCode = p.TransactionCode ?? $"TXN-{p.Id}",
                    OrderCode = p.Order?.OrderCode ?? "N/A",
                    OrderId = p.OrderId,
                    PaymentMethod = p.PaymentMethod,
                    Amount = p.Amount,
                    Status = p.Status,
                    StatusDisplay = statusDisplay,
                    ReceiverName = p.Order?.ReceiverName ?? string.Empty,
                    ReceiverPhone = p.Order?.ReceiverPhone ?? string.Empty,
                    MethodDetails = methodDetails,
                    OrderStatus = p.Order?.OrderStatus ?? "N/A",
                    CreatedAt = p.CreatedAt
                });
            }

            return result;
        }

        private static string DetectCardBrand(string cleanCardNumber)
        {
            if (cleanCardNumber.StartsWith("4")) return "Visa";
            if (cleanCardNumber.StartsWith("51") || cleanCardNumber.StartsWith("52") || 
                cleanCardNumber.StartsWith("53") || cleanCardNumber.StartsWith("54") || cleanCardNumber.StartsWith("55") ||
                (cleanCardNumber.Length >= 4 && int.TryParse(cleanCardNumber[..4], out int prefix) && prefix >= 2221 && prefix <= 2720))
            {
                return "MasterCard";
            }
            if (cleanCardNumber.StartsWith("3528") || cleanCardNumber.StartsWith("3529") || 
                (cleanCardNumber.Length >= 4 && string.Compare(cleanCardNumber[..4], "3530") >= 0 && string.Compare(cleanCardNumber[..4], "3589") <= 0))
            {
                return "JCB";
            }
            if (cleanCardNumber.StartsWith("34") || cleanCardNumber.StartsWith("37")) return "American Express";
            return "International Card";
        }

        private static string MaskCardNumber(string cleanCardNumber)
        {
            if (cleanCardNumber.Length <= 8) return cleanCardNumber;
            var first4 = cleanCardNumber[..4];
            var last4 = cleanCardNumber[^4..];
            return $"{first4}-XXXX-XXXX-{last4}";
        }
    }
}
