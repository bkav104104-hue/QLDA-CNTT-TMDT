import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Star, 
  AlertOctagon, 
  Sparkles, 
  Filter, 
  Send, 
  X,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { adminService, ReviewModerationItem } from '../../../services/adminService';

export const AdminModerationTab: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewModerationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending' | 'approved' | 'rejected'>('flagged');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Response / Action Modal
  const [selectedReview, setSelectedReview] = useState<ReviewModerationItem | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getReviewsForModeration();
      setReviews(data);
    } catch (err: any) {
      console.warn('Lỗi tải đánh giá:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (reviewId: number, status: 'Approved' | 'Rejected' | 'Pending', reply?: string) => {
    setIsProcessing(true);
    try {
      await adminService.moderateReview(reviewId, {
        moderationStatus: status,
        adminResponse: reply
      });

      const actionText = status === 'Approved' ? 'Phê duyệt hiển thị' : 'Gỡ bỏ nội dung vi phạm';
      showToast(`Đã ${actionText.toLowerCase()} thành công!`);
      setSelectedReview(null);
      await loadReviews();
    } catch (err: any) {
      alert('Lỗi xử lý: ' + (err.message || 'Thất bại'));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'flagged') return r.isFlaggedByAi && r.moderationStatus === 'Pending';
    if (filter === 'pending') return r.moderationStatus === 'Pending';
    if (filter === 'approved') return r.moderationStatus === 'Approved';
    if (filter === 'rejected') return r.moderationStatus === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-300" />
              Gemini AI Content Sentinel
            </span>
            <span className="text-xs text-purple-200/80">Giám sát tiêu chuẩn cộng đồng tự động</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Kiểm Duyệt Nội Dung & Đánh Giá Vi Phạm</h2>
          <p className="text-xs text-purple-200/90 mt-1 max-w-2xl">
            AI tự động quét phát hiện từ ngữ thô tục, công kích ác ý, link spam lừa đảo để gắn cờ cảnh báo. Admin xem xét và xử lý bảo vệ quyền lợi người tiêu dùng và uy tín sàn.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center flex-shrink-0">
          <p className="text-[10px] text-purple-200 uppercase font-bold">Cần xử lý khẩn</p>
          <p className="text-2xl font-black text-amber-300">
            {reviews.filter(r => r.isFlaggedByAi && r.moderationStatus === 'Pending').length}
          </p>
          <span className="text-[9px] text-purple-200">Đánh giá bị gắn cờ AI</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 font-bold">
          <button
            type="button"
            onClick={() => setFilter('flagged')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              filter === 'flagged' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cần xử lý cờ AI ({reviews.filter(r => r.isFlaggedByAi && r.moderationStatus === 'Pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã duyệt ({reviews.filter(r => r.moderationStatus === 'Approved').length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('rejected')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === 'rejected' ? 'bg-slate-700 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã gỡ bỏ vi phạm ({reviews.filter(r => r.moderationStatus === 'Rejected').length})
          </button>
        </div>
      </div>

      {/* Reviews Moderation List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-gray-700 text-sm">Không có đánh giá nào vi phạm tiêu chuẩn cộng đồng!</p>
            <p className="text-xs text-gray-400 mt-0.5">Sàn NextPhone đang duy trì môi trường trải nghiệm văn minh, an toàn.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isFlagged = rev.isFlaggedByAi;
            const isPending = rev.moderationStatus === 'Pending';
            const isRejected = rev.moderationStatus === 'Rejected';

            return (
              <div 
                key={rev.id}
                className={`bg-white rounded-3xl p-5 shadow-sm border transition-all space-y-3.5 ${
                  isFlagged && isPending 
                    ? 'border-red-200 bg-red-50/15' 
                    : isRejected 
                    ? 'border-gray-200 opacity-60 bg-gray-50' 
                    : 'border-gray-100'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#009981] flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900">{rev.userName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="bg-emerald-50 text-[#006650] text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                            ✓ Đã mua hàng
                          </span>
                        )}
                        <span className="text-gray-400 font-normal">đánh giá sản phẩm:</span>
                        <strong className="text-[#009981]">{rev.productName}</strong>
                      </div>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')} {new Date(rev.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars & Status Badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>

                    {isPending ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        Chờ xử lý
                      </span>
                    ) : isRejected ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        Đã gỡ bỏ khỏi sàn
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-[#006650] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        Đã duyệt hiển thị
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Warning Flag Banner if flagged */}
                {isFlagged && (
                  <div className="p-3 bg-red-100/70 border border-red-300 rounded-2xl flex items-start gap-2.5 text-red-950">
                    <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] uppercase tracking-wide text-red-800">
                          AI Cảnh Báo Vi Phạm Tiêu Chuẩn Cộng Đồng
                        </span>
                        {rev.aiFlagConfidence && (
                          <span className="font-mono font-black text-[10px] bg-red-600 text-white px-2 py-0.2 rounded-full">
                            Độ tin cậy: {rev.aiFlagConfidence}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-red-900 mt-0.5 font-medium">
                        Lý do cảnh báo: <strong>{rev.aiFlagReason}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Comment Content */}
                <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-800 font-medium leading-relaxed">
                  "{rev.comment}"
                </div>

                {/* Existing Admin Response if any */}
                {rev.adminResponse && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[#004d3d] space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#006650]">
                      Phản hồi chính thức từ Ban Quản Trị:
                    </p>
                    <p className="text-xs leading-relaxed">{rev.adminResponse}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReview(rev);
                      setAdminReplyText(rev.adminResponse || '');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#009981]" />
                    <span>{rev.adminResponse ? 'Sửa phản hồi' : 'Phản hồi khách'}</span>
                  </button>

                  {rev.moderationStatus !== 'Approved' && (
                    <button
                      type="button"
                      onClick={() => handleModerate(rev.id, 'Approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phê duyệt hiển thị</span>
                    </button>
                  )}

                  {rev.moderationStatus !== 'Rejected' && (
                    <button
                      type="button"
                      onClick={() => handleModerate(rev.id, 'Rejected')}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Gỡ bỏ vi phạm (Ẩn khỏi sàn)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: PHẢN HỒI ĐÁNH GIÁ TỪ ADMIN */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <MessageSquare className="w-5 h-5 text-[#009981]" />
              <h3 className="text-base font-black text-gray-900 tracking-tight">
                Phản Hồi Đánh Giá Của Khách Hàng
              </h3>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
              <p className="text-[11px] text-gray-400 mb-1">Đánh giá của <strong>{selectedReview.userName}</strong>:</p>
              <p className="italic font-medium">"{selectedReview.comment}"</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Nội dung phản hồi chính thức từ Admin / Người bán:
              </label>
              <textarea
                rows={4}
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="VD: Cảm ơn quý khách đã phản hồi. NextPhone chân thành xin lỗi vì sự bất tiện này..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-[#009981]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleModerate(selectedReview.id, selectedReview.moderationStatus, adminReplyText)}
                className="px-5 py-2.5 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white font-black shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isProcessing ? 'Đang gửi...' : 'Gửi Phản Hồi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
