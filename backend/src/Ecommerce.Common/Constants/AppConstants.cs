namespace Ecommerce.Common.Constants
{
    public static class AppConstants
    {
        public static class Roles
        {
            public const string Admin = "Admin";
            public const string Customer = "Customer";
            public const string Staff = "Staff";

            public const int AdminId = 1;
            public const int CustomerId = 2;
            public const int StaffId = 3;
        }

        public static class OrderStatus
        {
            public const string Pending = "Chờ xác nhận";
            public const string Confirmed = "Đã xác nhận";
            public const string Shipping = "Đang vận chuyển";
            public const string Delivered = "Đã giao hàng";
            public const string Completed = "Hoàn thành";
            public const string Cancelled = "Đã hủy";
        }

        public static class PaymentMethod
        {
            public const string COD = "COD";
            public const string VNPay = "VNPAY";
            public const string BankTransfer = "BANK_TRANSFER";
            public const string Momo = "MOMO";
            public const string QRCode = "QR_CODE";
            public const string CreditCard = "CREDIT_CARD";
        }

        public static class PaymentStatus
        {
            public const string Pending = "Chờ thanh toán";
            public const string Paid = "Đã thanh toán";
            public const string Failed = "Thanh toán thất bại";
            public const string Refunded = "Đã hoàn tiền";
        }

        public static class TransactionStatus
        {
            public const string Success = "Success";
            public const string Pending = "Pending";
            public const string RequiresOtp = "RequiresOtp";
            public const string Failed = "Failed";
            public const string Refunded = "Refunded";
        }

        public static class MemberTier
        {
            public const string New = "Thành viên Mới";
            public const string Silver = "Bạc";
            public const string Gold = "Vàng";
            public const string Diamond = "Kim Cương";
            public const string Edu = "EDU";
        }
    }
}

