import React, { useState } from 'react';
import { Calendar, Eye, EyeOff, Check, Info, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = 'Số điện thoại không hợp lệ (Ví dụ: 0912345678)';
      }
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Email không đúng định dạng';
      }
    }

    if (!password) {
      newErrors.password = 'Vui lòng tạo mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Bạn cần đồng ý với điều khoản dịch vụ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      let formattedDate: string | undefined = undefined;
      if (birthDate.trim()) {
        // Support yyyy-mm-dd or dd/mm/yyyy
        if (birthDate.includes('/')) {
          const parts = birthDate.split('/');
          if (parts.length === 3) {
            formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        } else {
          formattedDate = birthDate;
        }
      }

      await register({
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        email: email.trim() ? email.trim() : undefined,
        password: password,
        dateOfBirth: formattedDate,
      });

      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      console.error('Register error:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response?.data?.errors[0]) ||
        err.message ||
        'Đăng ký tài khoản không thành công. Vui lòng thử lại.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-100 text-[#009981] rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">Đăng ký thành công!</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Chào mừng <strong>{fullName}</strong> đã gia nhập <strong>NextPhone Member</strong>! 
          Hệ thống đã tặng ngay <span className="text-[#009981] font-bold">50 điểm thưởng Smember</span> và Voucher 100K vào tài khoản của bạn.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="py-3 px-6 bg-[#009981] hover:bg-[#00826e] text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            ĐĂNG NHẬP NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div>
        {/* Header Prompt as in image */}
        <p className="text-center text-xs font-semibold text-gray-500 mb-4 tracking-wide uppercase">
          Hoặc điền thông tin sau
        </p>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium animate-in fade-in duration-150">
            {serverError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* SECTION 1: Thông tin cá nhân */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <span>Thông tin cá nhân</span>
            </h3>

            <div className="space-y-2.5">
              {/* Row 1: Họ và tên & Ngày sinh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Họ và tên */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Nhập họ và tên"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#009981] focus:ring-[#009981]/15'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#009981] focus:ring-2 focus:ring-[#009981]/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Số điện thoại & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Số điện thoại */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="Nhập số điện thoại (09...)"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#009981] focus:ring-[#009981]/15'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>

                {/* Email (Không bắt buộc) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email <span className="text-gray-400 font-normal">(Không bắt buộc)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="Nhập email nhận hóa đơn VAT"
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#009981] focus:ring-[#009981]/15'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Tạo mật khẩu */}
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-2.5">
              Tạo mật khẩu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full px-3 py-2 pr-9 border rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#009981] focus:ring-[#009981]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
              </div>

              {/* Nhập lại mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nhập lại mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Xác nhận mật khẩu"
                    className={`w-full px-3 py-2 pr-9 border rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#009981] focus:ring-[#009981]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#009981] border-gray-300 rounded focus:ring-[#009981]"
            />
            <label htmlFor="terms" className="text-[11px] text-gray-600 leading-tight">
              Tôi đồng ý với{' '}
              <a href="#terms" className="text-[#0068ff] hover:underline font-medium">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#privacy" className="text-[#0068ff] hover:underline font-medium">
                Chính sách bảo mật
              </a>{' '}
              của NextPhone
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-[10px]">{errors.terms}</p>}

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8b2336] via-[#9e273e] to-[#ba2f48] hover:from-[#7a1e2f] hover:to-[#a7293f] text-white font-bold text-xs sm:text-sm tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG XỬ LÝ ĐĂNG KÝ...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>ĐĂNG KÝ TÀI KHOẢN</span>
              </>
            )}
          </button>
        </form>

        {/* Switch back to Login */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Bạn đã có tài khoản? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs font-bold text-[#009981] hover:underline"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-2.5 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">
          Mua sắm và sửa chữa chính hãng tại hệ thống NextPhone
        </p>
      </div>
    </div>
  );
};
