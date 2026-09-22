import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Award, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Save, 
  KeyRound, 
  Receipt,
  ChevronRight,
  CreditCard,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'info' | 'smember' | 'security';
  onOpenPaymentHistory?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'info',
  onOpenPaymentHistory
}) => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'smember' | 'security'>(initialTab);

  // Form states for profile edit
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Form states for password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      if (user.dateOfBirth) {
        try {
          const d = new Date(user.dateOfBirth);
          setDateOfBirth(d.toISOString().split('T')[0]);
        } catch {
          setDateOfBirth('');
        }
      }
    }
  }, [user]);

  useEffect(() => {
    setActiveTab(initialTab);
    setUpdateSuccess(null);
    setUpdateError(null);
    setPassSuccess(null);
    setPassError(null);
  }, [initialTab, isOpen]);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(null);
    setUpdateError(null);

    if (!fullName.trim()) {
      setUpdateError('Vui lòng nhập họ và tên!');
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined
      });
      setUpdateSuccess('Cập nhật thông tin tài khoản thành công!');
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Cập nhật thông tin thất bại, vui lòng thử lại!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess(null);
    setPassError(null);

    if (!oldPassword) {
      setPassError('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPassSuccess('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 4000);
    } catch (err: any) {
      setPassError(err.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-['Inter',system-ui,sans-serif]">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#004838] to-[#007f66] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#009981] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-emerald-300">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{user.fullName}</h2>
                <span className="bg-[#36e2b6] text-[#004838] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  {user.memberTier || 'S-New'}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5 font-medium flex items-center gap-2">
                <span>{user.phoneNumber}</span>
                <span>•</span>
                <span>Điểm Smember: <strong className="text-[#36e2b6] font-mono">{user.rewardPoints}đ</strong></span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-emerald-400/30 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'bg-white text-[#004838] shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('smember')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'smember'
                  ? 'bg-white text-[#004838] shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Đặc quyền Smember</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-white text-[#004838] shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo mật & Mật khẩu</span>
            </button>

            {onOpenPaymentHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPaymentHistory();
                }}
                className="ml-auto text-emerald-100 hover:text-white flex items-center gap-1 font-semibold text-xs py-1.5 px-2.5 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <Receipt className="w-3.5 h-3.5 text-[#36e2b6]" />
                <span>Lịch sử thanh toán</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-gray-50/60">

          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg mx-auto">
              {updateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-[#007f66] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{updateSuccess}</span>
                </div>
              )}
              {updateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.phoneNumber}
                      disabled
                      title="Số điện thoại là mã định danh tài khoản"
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-500 cursor-not-allowed font-medium"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ngày sinh (Nhận quà sinh nhật Smember)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Account Meta Card */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs text-gray-700">
                <div>
                  <p className="font-bold text-gray-900">Mã định danh thành viên:</p>
                  <p className="font-mono text-[11px] text-[#009981] font-bold">#NP-UID-00{user.id || '1'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[11px]">Trạng thái kích hoạt:</p>
                  <span className="font-bold text-[#007f66] flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#009981]" /> Đang hoạt động
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Đang lưu...' : 'Lưu thông tin'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ĐẶC QUYỀN SMEMBER */}
          {activeTab === 'smember' && (
            <div className="space-y-4 max-w-lg mx-auto">
              {/* Virtual Digital Smember Card */}
              <div className="bg-gradient-to-br from-[#0f2e24] via-[#005944] to-[#009981] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-emerald-300/30">
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-6 pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#36e2b6]" />
                    <span className="font-black tracking-wider text-sm uppercase text-emerald-100">
                      NextPhone Member Club
                    </span>
                  </div>
                  <span className="bg-[#36e2b6] text-[#004838] font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                    {user.memberTier || 'S-New'}
                  </span>
                </div>

                <div className="my-6">
                  <p className="text-[10px] text-emerald-200 uppercase font-semibold">Chủ thẻ hội viên</p>
                  <p className="text-xl font-black tracking-wide">{user.fullName}</p>
                  <p className="font-mono text-xs text-emerald-100/80 mt-0.5">NP-2026 •••• •••• {user.phoneNumber ? user.phoneNumber.slice(-4) : '8888'}</p>
                </div>

                <div className="pt-3 border-t border-emerald-400/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-200">Điểm thưởng tích lũy:</span>
                    <p className="text-lg font-black text-[#36e2b6] font-mono">{user.rewardPoints} điểm</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-200">Quy đổi giá trị:</span>
                    <p className="text-sm font-bold text-white font-mono">{(user.rewardPoints * 1000).toLocaleString('vi-VN')} ₫</p>
                  </div>
                </div>
              </div>

              {/* Member Privileges Breakdown */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3 shadow-sm">
                <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-[#009981]" />
                  Quyền lợi đặc quyền của bạn
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-[#009981] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">Chiết khấu mua sắm</p>
                      <p className="text-[11px] text-gray-600">Giảm thêm 1% - 3% giá niêm yết trên mọi sản phẩm.</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-[#009981] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">Trợ giá Thu cũ đổi mới</p>
                      <p className="text-[11px] text-gray-600">Tặng thêm 500.000 ₫ khi lên đời điện thoại mới.</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <Gift className="w-4 h-4 text-[#009981] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">Quà tặng sinh nhật</p>
                      <p className="text-[11px] text-gray-600">Voucher sinh nhật 300.000 ₫ gửi vào tháng sinh.</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <Truck className="w-4 h-4 text-[#009981] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">Giao hàng miễn phí</p>
                      <p className="text-[11px] text-gray-600">Miễn phí ship hỏa tốc 2 giờ tại Hà Nội & TP.HCM.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BẢO MẬT & MẬT KHẨU */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg mx-auto">
              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-[#007f66] font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}
              {passError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mật khẩu mới (Tối thiểu 6 ký tự) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Xác nhận lại mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#009981] transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-5 py-2 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isChangingPass ? 'Đang cập nhật...' : 'Đổi mật khẩu'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="text-red-600 hover:text-red-700 font-bold text-xs transition-colors"
          >
            Đăng xuất tài khoản
          </button>
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

