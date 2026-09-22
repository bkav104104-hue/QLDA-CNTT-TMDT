using System;
using System.Linq;
using FluentValidation;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Validators
{
    public class CreateQrPaymentRequestValidator : AbstractValidator<CreateQrPaymentRequestDto>
    {
        public CreateQrPaymentRequestValidator()
        {
            RuleFor(x => x.OrderCode)
                .NotEmpty().WithMessage("Mã đơn hàng không được để trống");
        }
    }

    public class ProcessCardPaymentRequestValidator : AbstractValidator<ProcessCardPaymentRequestDto>
    {
        public ProcessCardPaymentRequestValidator()
        {
            RuleFor(x => x.OrderCode)
                .NotEmpty().WithMessage("Mã đơn hàng không được để trống");

            RuleFor(x => x.CardHolderName)
                .NotEmpty().WithMessage("Tên chủ thẻ không được để trống")
                .MinimumLength(3).WithMessage("Tên chủ thẻ phải có ít nhất 3 ký tự")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("Tên chủ thẻ chỉ chứa chữ cái không dấu và khoảng trắng");

            RuleFor(x => x.CardNumber)
                .NotEmpty().WithMessage("Số thẻ tín dụng không được để trống")
                .Must(BeValidCardNumber).WithMessage("Số thẻ không hợp lệ hoặc sai định dạng theo thuật toán Luhn");

            RuleFor(x => x.ExpiryMonth)
                .InclusiveBetween(1, 12).WithMessage("Tháng hết hạn phải từ 1 đến 12");

            RuleFor(x => x.ExpiryYear)
                .GreaterThanOrEqualTo(DateTime.UtcNow.Year).WithMessage("Năm hết hạn không thể ở quá khứ");

            RuleFor(x => x)
                .Must(NotBeExpiredCard).WithMessage("Thẻ tín dụng đã hết hạn sử dụng");

            RuleFor(x => x.Cvv)
                .NotEmpty().WithMessage("Mã bảo mật CVV/CVC không được để trống")
                .Matches(@"^[0-9]{3,4}$").WithMessage("Mã CVV/CVC phải gồm 3 hoặc 4 chữ số");
        }

        private bool BeValidCardNumber(string cardNumber)
        {
            if (string.IsNullOrWhiteSpace(cardNumber)) return false;
            var clean = cardNumber.Replace(" ", "").Replace("-", "");
            if (!clean.All(char.IsDigit) || clean.Length < 13 || clean.Length > 19) return false;

            // Luhn Algorithm Validation (Mod 10)
            int sum = 0;
            bool alternate = false;
            for (int i = clean.Length - 1; i >= 0; i--)
            {
                int n = clean[i] - '0';
                if (alternate)
                {
                    n *= 2;
                    if (n > 9) n -= 9;
                }
                sum += n;
                alternate = !alternate;
            }
            return (sum % 10 == 0);
        }

        private bool NotBeExpiredCard(ProcessCardPaymentRequestDto request)
        {
            if (request.ExpiryYear < DateTime.UtcNow.Year) return false;
            if (request.ExpiryYear == DateTime.UtcNow.Year && request.ExpiryMonth < DateTime.UtcNow.Month) return false;
            return true;
        }
    }

    public class VerifyCardOtpRequestValidator : AbstractValidator<VerifyCardOtpRequestDto>
    {
        public VerifyCardOtpRequestValidator()
        {
            RuleFor(x => x.TransactionCode)
                .NotEmpty().WithMessage("Mã giao dịch không được để trống");

            RuleFor(x => x.OtpCode)
                .NotEmpty().WithMessage("Mã OTP không được để trống")
                .Matches(@"^[0-9]{6}$").WithMessage("Mã OTP phải gồm 6 chữ số");
        }
    }
}

