using System;
using System.Collections.Generic;

namespace Ecommerce.Common.DTOs
{
    // --- QR Code Payment DTOs ---
    public class CreateQrPaymentRequestDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public string? BankCode { get; set; }
    }

    public class QrPaymentResponseDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string QrCodeUrl { get; set; } = string.Empty;
        public string QrContent { get; set; } = string.Empty;
        public string BankBin { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string AccountNo { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string TransferContent { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
    }

    // --- Credit Card Payment DTOs ---
    public class ProcessCardPaymentRequestDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
        public int ExpiryMonth { get; set; }
        public int ExpiryYear { get; set; }
        public string Cvv { get; set; } = string.Empty;
    }

    public class CardPaymentResponseDto
    {
        public bool Success { get; set; }
        public string TransactionCode { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string CardBrand { get; set; } = string.Empty; // Visa, MasterCard, JCB...
        public string CardNumberMasked { get; set; } = string.Empty; // 4111-XXXX-XXXX-1111
        public string Status { get; set; } = string.Empty; // "Success", "RequiresOtp", "Failed"
        public string Message { get; set; } = string.Empty;
        public string? OtpHint { get; set; } // Test hint for dev/sandbox environment
        public DateTime? PaidAt { get; set; }
    }

    public class VerifyCardOtpRequestDto
    {
        public string TransactionCode { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
    }

    // --- Status and Webhook Simulation DTOs ---
    public class CheckPaymentStatusResponseDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty; // Chờ thanh toán, Đã thanh toán, ...
        public string OrderStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TransactionCode { get; set; }
        public DateTime? PaidAt { get; set; }
        public List<PaymentTransactionDto> Transactions { get; set; } = new();
    }

    public class PaymentTransactionDto
    {
        public int Id { get; set; }
        public string TransactionCode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class SimulateBankWebhookDto
    {
        public string OrderCode { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public string? BankTransactionId { get; set; }
    }

    public class PaymentHistoryItemDto
    {
        public int Id { get; set; }
        public string TransactionCode { get; set; } = string.Empty;
        public string OrderCode { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusDisplay { get; set; } = string.Empty;
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string? MethodDetails { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

