import React, { useState } from 'react';
import { SocialAuth } from './SocialAuth';
import { Phone, Mail, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSuccess }) => {
  const { login } = useAuth();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rawVal = identifier.trim();
    if (!rawVal) {
      setError(authMethod === 'phone' ? 'Vui lòng nhập số điện thoại' : 'Vui lòng nhập email');
      return;
    }

    let finalUsername = rawVal;
    if (authMethod === 'phone') {
      // Remove spaces, dots, dashes, and normalize +84 to 0
      const cleanPhone = rawVal.replace(/[\s.-]/g, '').replace(/^\+84/, '0');
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(cleanPhone)) {
        setError('Số điện thoại không đúng định dạng (Ví dụ: 0901234567 hoặc 0912345678)');
        return;
      }
      finalUsername = cleanPhone;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawVal)) {
        setError('Địa chỉ email không đúng định dạng');
        return;
      }
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      await login({
        username: finalUsername,
        password: password,
      });

      setLoginSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (err: any) {
      console.error('Login error:', err);
      const serverMsg =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response?.data?.errors[0]) ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-emerald-100 text-[#009981] rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-black text-gray-900">Đăng nhập thành công!</h3>
        <p className="text-xs text-gray-600">Đang đồng bộ quyền lợi thành viên và chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div>
        {/* Welcome Heading */}
        <h2 className="text-2xl md:text-[26px] font-extrabold text-gray-900 mb-4">
          Chào mừng bạn tới <span className="text-[#009981]">NextPhone</span>
        </h2>

        {/* Tabs: Phone vs Email */}
        <div className="bg-[#f0f4f3] p-1 rounded-xl flex mb-4 border border-gray-200/60">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setError('');
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-white text-[#007f66] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Số điện thoại
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError('');
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-white text-[#007f66] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </button>
        </div>

        {/* Prompt Subtext */}
        <p className="text-xs text-gray-600 mb-2 font-medium">
          Bạn đã từng mua sắm tại NextPhone? Đăng nhập xem hạng thẻ ngay
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {authMethod === 'phone' ? 'Số điện thoại' : 'Email'} <span className="text-red-500">*</span>
            </label>
            <input
              type={authMethod === 'phone' ? 'tel' : 'email'}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              placeholder={authMethod === 'phone' ? 'Nhập số điện thoại của bạn (VD: 0912345678)' : 'Nhập địa chỉ email của bạn'}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#009981] focus:ring-2 focus:ring-[#009981]/15 transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ tổng đài 1900.2091 để cấp lại mật khẩu.'); }} className="text-[11px] text-[#009981] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Nhập mật khẩu"
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#009981] focus:ring-2 focus:ring-[#009981]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Fill Test Accounts */}
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-bold text-[#006650]">Đăng nhập nhanh:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setIdentifier('0901234567');
                  setPassword('NextPhone@2026');
                  setError('');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#009981] hover:bg-[#00826e] text-white text-[10px] font-black transition-all shadow-sm cursor-pointer"
              >
                Admin (0901234567)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setIdentifier('0912345678');
                  setPassword('NextPhone@2026');
                  setError('');
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[10px] font-bold transition-all cursor-pointer"
              >
                Khách hàng (0912345678)
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium animate-in fade-in duration-150">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#005944] via-[#009981] to-[#007a63] hover:from-[#004838] hover:to-[#00826e] text-white font-black text-xs tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG XÁC THỰC...</span>
              </>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register link */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Chưa có tài khoản NextPhone? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-xs font-bold text-[#009981] hover:underline"
          >
            Đăng ký tài khoản mới (+50 điểm)
          </button>
        </div>

        {/* Social Logins */}
        <SocialAuth onSocialClick={(p) => alert(`Đăng nhập bằng ${p} (Demo)`)} />
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-center space-y-1">
        <p className="text-[11px] text-gray-500">
          Mua sắm tại{' '}
          <span className="text-[#009981] font-bold">Nextphone.vn</span> - Tích điểm hội viên lên đến 5%
        </p>
        <p className="text-[10px] text-gray-400 leading-tight">
          Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của NextPhone
        </p>
      </div>
    </div>
  );
};
