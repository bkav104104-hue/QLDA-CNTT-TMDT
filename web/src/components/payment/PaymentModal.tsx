import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Zap,
  ArrowRight,
  Lock
} from 'lucide-react';
import { paymentService, QrPaymentResponse, CardPaymentResponse } from '../../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  amount: number;
  initialMethod?: 'QR_CODE' | 'CREDIT_CARD';
  onSuccess: (info: { method: string; transactionCode?: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderCode,
  amount,
  initialMethod = 'QR_CODE',
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'QR_CODE' | 'CREDIT_CARD'>(initialMethod);

  // --- VietQR States ---
  const [qrData, setQrData] = useState<QrPaymentResponse | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const [simulatingTransfer, setSimulatingTransfer] = useState(false);

  // --- Credit Card States ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2028');
  const [cvv, setCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [processingCard, setProcessingCard] = useState(false);
  
  // 3D Secure OTP State
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpTxnCode, setOtpTxnCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Global Success State
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [completedTxn, setCompletedTxn] = useState('');

  // 1. Fetch QR when opening or switching to QR tab
  useEffect(() => {
    if (isOpen && activeTab === 'QR_CODE' && !qrData) {
      loadQrData();
    }
  }, [isOpen, activeTab]);

  const loadQrData = async () => {
    setLoadingQr(true);
    try {
      const data = await paymentService.createQrPayment(orderCode);
      setQrData(data);
      setPollingActive(true);
    } catch (err: any) {
      console.error('Lỗi sinh mã QR:', err);
    } finally {
      setLoadingQr(false);
    }
  };

  // 2. Polling loop for QR Payment
  useEffect(() => {
    let interval: any;
    if (isOpen && activeTab === 'QR_CODE' && pollingActive && !paymentCompleted) {
      interval = setInterval(async () => {
        try {
          const res = await paymentService.getPaymentStatus(orderCode);
          if (res.paymentStatus === 'Đã thanh toán') {
            setPollingActive(false);
            setPaymentCompleted(true);
            setCompletedTxn(res.transactionCode || '');
            setTimeout(() => {
              onSuccess({ method: 'QR_CODE', transactionCode: res.transactionCode });
            }, 1500);
          }
        } catch {
          // Keep polling silently
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, pollingActive, paymentCompleted, orderCode]);

  // Simulate bank webhook for quick test
  const handleSimulateTransfer = async () => {
    setSimulatingTransfer(true);
    try {
      const res = await paymentService.simulateTransfer(orderCode, amount);
      if (res.paymentStatus === 'Đã thanh toán') {
        setPollingActive(false);
        setPaymentCompleted(true);
        setCompletedTxn(res.transactionCode || '');
        setTimeout(() => {
          onSuccess({ method: 'QR_CODE', transactionCode: res.transactionCode });
        }, 1500);
      }
    } catch (err: any) {
      alert('Lỗi mô phỏng: ' + (err.response?.data?.message || err.message));
    } finally {
      setSimulatingTransfer(false);
    }
  };

  // 3. Card Helpers & Formatting
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const detectBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(clean)) return 'MasterCard';
    if (/^35(2[89]|[3-8][0-9])/.test(clean)) return 'JCB';
    return '';
  };

  const handleFillTestCard = (type: 'visa' | 'mastercard') => {
    if (type === 'visa') {
      setCardNumber('4111 1111 1111 1111');
      setCardHolder('NGUYEN VAN A');
      setExpiryMonth('12');
      setExpiryYear('2028');
      setCvv('123');
    } else {
      setCardNumber('5123 4567 8901 2345');
      setCardHolder('TRAN VAN NEXTPHONE');
      setExpiryMonth('10');
      setExpiryYear('2027');
      setCvv('456');
    }
    setCardError('');
  };

  const handleProcessCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setCardError('Số thẻ phải có ít nhất 15-16 chữ số');
      return;
    }
    if (!cardHolder.trim()) {
      setCardError('Vui lòng nhập tên in trên thẻ');
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setCardError('Mã bảo mật CVV phải gồm 3 hoặc 4 chữ số');
      return;
    }

    setProcessingCard(true);
    try {
      const res = await paymentService.processCardPayment({
        orderCode,
        cardNumber: cleanCard,
        cardHolderName: cardHolder.trim(),
        expiryMonth: parseInt(expiryMonth, 10),
        expiryYear: parseInt(expiryYear, 10),
        cvv: cvv.trim(),
      });

      if (res.status === 'RequiresOtp') {
        setRequiresOtp(true);
        setOtpTxnCode(res.transactionCode);
      } else if (res.status === 'Success') {
        setPaymentCompleted(true);
        setCompletedTxn(res.transactionCode);
        setTimeout(() => {
          onSuccess({ method: 'CREDIT_CARD', transactionCode: res.transactionCode });
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Giao dịch thẻ bị từ chối.';
      setCardError(msg);
    } finally {
      setProcessingCard(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!otpCode.trim()) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await paymentService.verifyCardOtp(otpTxnCode, otpCode.trim());
      if (res.status === 'Success') {
        setPaymentCompleted(true);
        setCompletedTxn(res.transactionCode);
        setTimeout(() => {
          onSuccess({ method: 'CREDIT_CARD', transactionCode: res.transactionCode });
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn.';
      setOtpError(msg);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const copyToClipboard = (text: string, type: 'content' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'content') {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-['Inter',sans-serif]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005944] to-[#009981] p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <h2 className="text-base sm:text-lg font-bold">Cổng thanh toán bảo mật NextPhone</h2>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Đơn hàng: <strong className="font-mono text-white text-sm">{orderCode}</strong> • Tổng tiền: <strong className="text-amber-300 text-sm">{amount.toLocaleString('vi-VN')} ₫</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Success View */}
        {paymentCompleted ? (
          <div className="p-8 sm:p-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-[#009981] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Thanh toán thành công!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Đơn hàng <strong className="text-[#009981]">{orderCode}</strong> đã được hệ thống ghi nhận thanh toán hoàn tất.
            </p>
            {completedTxn && (
              <p className="text-xs text-gray-400 font-mono">
                Mã giao dịch: <strong>{completedTxn}</strong>
              </p>
            )}
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#009981] text-white font-bold rounded-xl text-xs shadow-md hover:bg-[#00826e] transition-colors"
              >
                Đóng và xem đơn hàng
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Method Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab('QR_CODE'); setRequiresOtp(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'QR_CODE'
                    ? 'bg-white text-[#009981] shadow-sm border border-emerald-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Quét mã VietQR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CREDIT_CARD')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'CREDIT_CARD'
                    ? 'bg-white text-[#009981] shadow-sm border border-emerald-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ tín dụng quốc tế (Visa/Master/JCB)</span>
              </button>
            </div>

            {/* TAB 1: VIETQR */}
            {activeTab === 'QR_CODE' && (
              <div className="p-6 sm:p-7 space-y-6">
                {loadingQr ? (
                  <div className="py-16 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#009981] mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Đang khởi tạo mã VietQR chuẩn Napas...</p>
                  </div>
                ) : qrData ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: QR Image representation */}
                    <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-emerald-50/40 rounded-3xl border border-emerald-100 space-y-3">
                      <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100">
                        <img
                          src={qrData.qrCodeUrl}
                          alt="VietQR NextPhone"
                          className="w-56 h-56 object-contain rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#007f66] font-semibold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-[#009981]"></span>
                        <span>Đang chờ bạn quét mã thanh toán...</span>
                      </div>
                    </div>

                    {/* Right: Transfer details & Auto copy */}
                    <div className="md:col-span-6 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ngân hàng thụ hưởng</span>
                        <p className="font-black text-gray-900 text-sm flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">MBBank</span>
                          <span>{qrData.bankName}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Số tài khoản</span>
                        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200 mt-1">
                          <span className="font-mono font-bold text-gray-900 text-sm">{qrData.accountNo}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(qrData.accountNo, 'account')}
                            className="text-[#009981] hover:text-[#00826e] flex items-center gap-1 font-bold text-[11px]"
                          >
                            {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedAccount ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Chủ tài khoản</span>
                        <p className="font-bold text-gray-800 mt-0.5">{qrData.accountName}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Số tiền</span>
                        <p className="font-black text-[#e11d48] text-base mt-0.5">
                          {qrData.amount.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nội dung chuyển khoản (Bắt buộc)</span>
                        <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-1">
                          <span className="font-mono font-black text-amber-900 text-xs">{qrData.transferContent}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(qrData.transferContent, 'content')}
                            className="text-amber-800 hover:text-amber-950 flex items-center gap-1 font-bold text-[11px]"
                          >
                            {copiedContent ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedContent ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Simulation Button for Web Testing */}
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleSimulateTransfer}
                          disabled={simulatingTransfer}
                          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-[#009981] hover:from-emerald-700 hover:to-[#00826e] text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                          {simulatingTransfer ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4 text-amber-300" />
                          )}
                          <span>⚡ Mô phỏng đã quét mã & chuyển khoản</span>
                        </button>
                        <p className="text-[10px] text-gray-400 text-center mt-1">
                          (Dành cho môi trường test: tự động kích hoạt webhook ngân hàng)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-red-500">
                    Không thể tạo mã QR. Vui lòng thử lại.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CREDIT CARD */}
            {activeTab === 'CREDIT_CARD' && (
              <div className="p-6 sm:p-7">
                {requiresOtp ? (
                  /* 3D-Secure OTP Screen */
                  <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto space-y-4 text-center">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">Xác thực giao dịch 3D-Secure</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngân hàng đã gửi mã xác thực OTP về số điện thoại của bạn.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 font-medium">
                      💡 <strong>Mã OTP thử nghiệm:</strong> <span className="font-mono font-bold text-blue-700">888888</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode('888888')}
                        className="ml-2 text-[11px] underline text-blue-700 font-bold cursor-pointer"
                      >
                        [Điền ngay]
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Nhập 6 số OTP"
                        className="w-full text-center tracking-[0.4em] font-mono font-black text-xl py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#009981]"
                        autoFocus
                      />
                    </div>

                    {otpError && (
                      <p className="text-xs font-bold text-red-600 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{otpError}</span>
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setRequiresOtp(false)}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        type="submit"
                        disabled={verifyingOtp}
                        className="flex-1 py-2.5 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        <span>Xác nhận thanh toán</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Card Information Form */
                  <form onSubmit={handleProcessCard} className="space-y-4">
                    {/* Visual Card Preview */}
                    <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-gray-900 via-slate-800 to-emerald-950 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-6 rounded bg-amber-400/80 border border-amber-300"></div>
                          <span className="text-[10px] font-bold text-gray-400">CREDIT CARD</span>
                        </div>
                        <span className="font-extrabold text-sm tracking-wider text-emerald-400">
                          {detectBrand(cardNumber) || 'VISA / MASTER'}
                        </span>
                      </div>

                      <div className="font-mono text-base tracking-[0.2em] font-semibold text-gray-100">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex items-end justify-between text-[10px] font-medium text-gray-300">
                        <div>
                          <span className="block text-[8px] text-gray-400">CHỦ THẺ</span>
                          <span className="font-bold uppercase tracking-wider text-white">
                            {cardHolder || 'NGUYEN VAN A'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-400">HẾT HẠN</span>
                          <span className="font-bold text-white">
                            {expiryMonth}/{expiryYear.slice(-2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Fill Test Cards */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="text-[10px] text-gray-400 font-bold">Thẻ mẫu:</span>
                      <button
                        type="button"
                        onClick={() => handleFillTestCard('visa')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200 transition-colors"
                      >
                        💳 Điền thẻ Visa Test
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillTestCard('mastercard')}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-200 transition-colors"
                      >
                        💳 Điền thẻ MasterCard Test
                      </button>
                    </div>

                    {/* Card Number Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Số thẻ tín dụng / ghi nợ
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4111 1111 1111 1111"
                          maxLength={19}
                          required
                          className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-[#009981]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#009981]">
                          {detectBrand(cardNumber)}
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Tên in trên thẻ (không dấu)
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="NGUYEN VAN A"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:bg-white focus:border-[#009981]"
                      />
                    </div>

                    {/* Expiry & CVV Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tháng hết hạn</label>
                        <select
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#009981] cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) => {
                            const m = (i + 1).toString().padStart(2, '0');
                            return <option key={m} value={m}>{m}</option>;
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Năm hết hạn</label>
                        <select
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#009981] cursor-pointer"
                        >
                          {['2026', '2027', '2028', '2029', '2030', '2031'].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Mã CVV/CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          required
                          className="w-full px-3 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:bg-white focus:border-[#009981]"
                        />
                      </div>
                    </div>

                    {cardError && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 p-2 bg-red-50 rounded-xl border border-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{cardError}</span>
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={processingCard}
                      className="w-full py-3.5 bg-[#006e57] hover:bg-[#005944] text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                    >
                      {processingCard ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>Thanh toán {amount.toLocaleString('vi-VN')} ₫</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

