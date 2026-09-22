using FluentValidation;
using Ecommerce.Common.DTOs;

namespace Ecommerce.BLL.Validators
{
    public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequestDto>
    {
        public CreateOrderRequestValidator()
        {
            RuleFor(x => x.ReceiverName)
                .NotEmpty().WithMessage("Họ và tên người nhận không được để trống")
                .MaximumLength(150).WithMessage("Họ và tên không quá 150 ký tự");

            RuleFor(x => x.ReceiverPhone)
                .NotEmpty().WithMessage("Số điện thoại người nhận không được để trống")
                .Matches(@"^(0|\+84)[3|5|7|8|9][0-9]{8}$").WithMessage("Số điện thoại không hợp lệ");

            RuleFor(x => x.ShippingAddress)
                .NotEmpty().WithMessage("Địa chỉ nhận hàng không được để trống");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Giỏ hàng không có sản phẩm nào");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductVariantId)
                    .GreaterThan(0).WithMessage("Mã biến thể sản phẩm không hợp lệ");
                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0");
            });
        }
    }
}

