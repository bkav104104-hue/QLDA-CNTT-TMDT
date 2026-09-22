import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Receipt, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  CreditCard, 
  QrCode,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { paymentService, PaymentHistoryItem } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderCode?: string;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  initialOrderCode = ''
}) => {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialOrderCode);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = useCallback(async (codeToSearch?: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const code = (codeToSearch !== undefined ? codeToSearch : searchTerm).trim();
      const params: { orderCode?: string; userId?: number } = {};

      if (code) {
        params.orderCode = code;
      } else if (isAuthenticated && user?.id) {
        params.userId = Number(user.id) || undefined;
      }

      const data = await paymentService.getPaymentHistory(params);
      setHistory(data || []);
    } catch (err: any) {
      console.error('Failed to load payment history:', err);
      setErrorMessage('Không thể tải lịch sử giao dịch. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, isAuthenticated, user]);

  useEffect(() => {
    if (isOpen) {
      if (initialOrderCode) {
        setSearchTerm(initialOrderCode);
        fetchHistory(initialOrderCode);
      } else {
        fetchHistory();
      }
    }
  }, [isOpen, initialOrderCode, fetchHistory]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatPrice = (val: number) => {
    return (val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredHistory = history.filter(item => {
    if (selectedStatus === 'SUCCESS' && item.status !== 'Success') return false;
    if (selectedStatus === 'PENDING' && item.status !== 'Pending' && item.status !== 'RequiresOtp') return false;
    if (selectedStatus === 'FAILED' && item.status !== 'Failed') return false;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      const matchOrder = item.orderCode.toLowerCase().includes(term);
      const matchTxn = item.transactionCode.toLowerCase().includes(term);
      const matchPhone = item.receiverPhone.includes(term);
      return matchOrder || matchTxn || matchPhone;
    }
    return true;
  });

  const totalSuccessfulAmount = filteredHistory
    .filter(i => i.status === 'Success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#004838] to-[#007f66] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-inner">
              <Receipt className="w-6 h-6 text-[#36e2b6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Lịch sử thanh toán</h2>
                <span className="bg-[#36e2b6] text-[#004838] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  NextPhone Gateway
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Tra cứu chi tiết các giao dịch thanh toán online (VietQR, Thẻ tín dụng) trên hệ thống
              </p>
            </div>
          </div>

          {/* Quick User / Stats Banner */}
          <div className="mt-4 pt-3 border-t border-emerald-400/30 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {isAuthenticated && user 
                  ? `Khách hàng: ${user.fullName} (${user.phoneNumber})` 
                  : 'Chế độ tra cứu đơn hàng'}
              </span>
            </div>
            <div className="flex items-center gap-3 font-semibold">
              <span>Tổng giao dịch: <strong className="text-white font-mono">{filteredHistory.length}</strong></span>
              <span>Đã thanh toán: <strong className="text-[#36e2b6] font-mono">{formatPrice(totalSuccessfulAmount)}</strong></span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form 
            onSubmit={(e) => { e.preventDefault(); fetchHistory(); }}
            className="relative w-full sm:w-80"
          >
            <input
              type="text"
              placeholder="Nhập mã đơn NP-... hoặc mã giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] focus:border-transparent transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); fetchHistory(''); }}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Status Filter Chips & Refresh Button */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === 'ALL'
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('SUCCESS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === 'SUCCESS'
                  ? 'bg-[#009981] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#009981]'
              }`}
            >
              Thành công
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedStatus === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              Đang chờ
            </button>

            <button
              type="button"
              onClick={() => fetchHistory()}
              disabled={loading}
              title="Tải lại dữ liệu"
              className="p-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-[#009981] rounded-lg transition-colors ml-auto sm:ml-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#009981]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#f8fafc]">
          {loading && history.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#009981]" />
              <p className="text-sm font-medium">Đang tải lịch sử giao dịch...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-bold text-red-700">{errorMessage}</p>
              <button
                type="button"
                onClick={() => fetchHistory()}
                className="mt-2 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Receipt className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-700">Chưa có giao dịch nào</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {searchTerm 
                    ? `Không tìm thấy giao dịch nào phù hợp với từ khóa "${searchTerm}".`
                    : 'Các giao dịch thanh toán online (VietQR, Thẻ quốc tế) của bạn sẽ xuất hiện tại đây.'}
                </p>
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); fetchHistory(''); }}
                  className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSuccess = item.status === 'Success';
              const isPending = item.status === 'Pending' || item.status === 'RequiresOtp';
              const isQr = item.paymentMethod === 'QR_CODE';

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isSuccess ? 'bg-[#009981]' : isPending ? 'bg-amber-500' : 'bg-red-500'
                  }`} />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isQr ? 'bg-emerald-50 text-[#009981]' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {isQr ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">Mã đơn:</span>
                          <span className="font-mono font-black text-gray-900 text-sm">{item.orderCode}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] font-semibold text-gray-600">{item.orderStatus}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                          <span className="font-mono text-gray-600">{item.transactionCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.transactionCode)}
                            title="Sao chép mã giao dịch"
                            className="p-1 hover:text-[#009981] transition-colors rounded"
                          >
                            {copiedCode === item.transactionCode ? (
                              <Check className="w-3.5 h-3.5 text-[#009981]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Status Badge */}
                    <div className="text-right sm:self-center flex sm:flex-col justify-between items-center sm:items-end gap-1">
                      <span className="text-base font-black text-[#009981] font-mono">
                        {formatPrice(item.amount)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                        isSuccess 
                          ? 'bg-emerald-100 text-[#007f66]' 
                          : isPending 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {item.statusDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Details Footer */}
                  <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#009981]" />
                        <span>{item.methodDetails || item.paymentMethod}</span>
                      </div>
                      {item.receiverName && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <User className="w-3.5 h-3.5" />
                          <span>{item.receiverName} {item.receiverPhone ? `(${item.receiverPhone})` : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#009981]" />
            <span>Mọi giao dịch thanh toán được bảo mật theo tiêu chuẩn quốc tế PCI-DSS & Napas</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
