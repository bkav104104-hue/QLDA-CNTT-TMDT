import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from '../../pages/auth/components/BrandLogo';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingBag, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  LogOut, 
  Award, 
  Receipt,
  ShieldCheck,
  ChevronRight,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface MainHeaderProps {
  onOpenAuth: (mode?: 'login' | 'register', notice?: string) => void;
  onOpenCart?: () => void;
  onGoToHome?: () => void;
  onOpenPaymentHistory?: () => void;
  onOpenUserProfile?: (tab?: 'info' | 'smember' | 'security') => void;
  onOpenAdmin?: () => void;
  cartCount?: number;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ 
  onOpenAuth, 
  onOpenCart, 
  onGoToHome, 
  onOpenPaymentHistory, 
  onOpenUserProfile,
  onOpenAdmin,
  cartCount 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const displayCartCount = cartCount !== undefined ? cartCount : totalCount;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowAccountDropdown(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setShowAccountDropdown(false);
    }, 250);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Đang tìm kiếm sản phẩm: ${searchTerm}`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Logo */}
        <div
          onClick={(e) => {
            e.preventDefault();
            onGoToHome?.();
          }}
          className="flex-shrink-0 cursor-pointer"
          title="Về trang chủ NextPhone"
        >
          <BrandLogo size="md" />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <div className="flex items-center border-2 border-[#009981]/80 rounded-xl overflow-hidden focus-within:border-[#009981] focus-within:ring-2 focus-within:ring-[#009981]/15 transition-all">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hôm nay bạn muốn tìm kiếm gì?"
              className="w-full px-4 py-2 text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white hover:bg-gray-50 text-[#009981] px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors border-l border-gray-100 flex-shrink-0"
            >
              <Search className="w-4 h-4 text-[#009981]" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </div>
        </form>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Find Store */}
          <button
            type="button"
            onClick={() => alert('Hệ thống 128 cửa hàng NextPhone trên toàn quốc!')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-xs font-semibold"
          >
            <MapPin className="w-4 h-4 text-[#009981]" />
            <span className="hidden lg:inline">Tìm siêu thị</span>
          </button>

          {/* Payment History / Order Lookup Quick Button */}
          <button
            type="button"
            onClick={() => onOpenPaymentHistory?.()}
            title="Tra cứu lịch sử thanh toán"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-[#009981] transition-colors text-xs font-semibold"
          >
            <Receipt className="w-4 h-4 text-[#009981]" />
            <span className="hidden xl:inline">Lịch sử thanh toán</span>
          </button>

          {/* Quick Admin Portal Button */}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#005944] to-[#009981] hover:from-[#004838] hover:to-[#00826e] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Kênh Quản Trị & Bán Hàng"
            >
              <Store className="w-3.5 h-3.5 text-[#36e2b6]" />
              <span className="hidden sm:inline">Kênh Quản Trị</span>
            </button>
          )}

          {/* Account Dropdown Container */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setShowAccountDropdown((prev) => !prev);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all text-xs font-bold border cursor-pointer ${
                  showAccountDropdown 
                    ? 'bg-emerald-100 text-[#006650] border-[#009981] shadow-sm' 
                    : 'bg-emerald-50 text-[#007f66] hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#009981] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="font-bold text-xs truncate max-w-[110px]">{user.fullName}</span>
                  <span className="text-[10px] text-[#009981] font-semibold">{user.memberTier || 'S-New'} • {user.rewardPoints}đ</span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setShowAccountDropdown((prev) => !prev);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold border cursor-pointer ${
                  showAccountDropdown
                    ? 'bg-emerald-50 text-[#009981] border-emerald-200 shadow-sm'
                    : 'hover:bg-emerald-50 text-gray-700 hover:text-[#009981] border-transparent hover:border-emerald-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#009981] flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">Tài khoản</span>
              </button>
            )}

            {/* Hover Menu Popover with graceful hover timeout & smooth interaction */}
            {showAccountDropdown && (
              <div 
                className="absolute right-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 text-xs space-y-1">
                  {isAuthenticated && user ? (
                    <>
                      {/* Clickable Profile Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenUserProfile?.('info');
                        }}
                        className="w-full text-left p-2.5 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-2xl mb-1.5 transition-all group shadow-sm block cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-gray-900 text-xs truncate max-w-[150px]">{user.fullName}</p>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#009981] text-white">
                            {user.memberTier || 'S-New'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 font-medium">{user.phoneNumber}</p>
                        <div className="mt-2 pt-1.5 border-t border-emerald-200/70 flex items-center justify-between text-[11px]">
                          <span className="text-gray-600 font-medium">Điểm Smember:</span>
                          <span className="font-extrabold text-[#009981] font-mono">{user.rewardPoints} điểm</span>
                        </div>
                        <div className="mt-1 flex items-center justify-end text-[10px] text-[#009981] font-bold gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Xem chi tiết tài khoản</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </button>

                      {/* Sub-item 1: Thông tin tài khoản */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenUserProfile?.('info');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 font-semibold text-gray-700 hover:text-[#009981] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#009981]" />
                        <span>Thông tin cá nhân</span>
                      </button>

                      {/* Sub-item 2: Đặc quyền Smember */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenUserProfile?.('smember');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 font-semibold text-gray-700 hover:text-[#009981] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <div className="flex-1 flex items-center justify-between">
                          <span>Đặc quyền Smember</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                            Quyền lợi VIP
                          </span>
                        </div>
                      </button>

                      {/* Sub-item 3: Lịch sử thanh toán & Đơn mua */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenPaymentHistory?.();
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 font-semibold text-gray-700 hover:text-[#009981] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Receipt className="w-4 h-4 text-[#009981]" />
                        <span>Lịch sử thanh toán & Đơn hàng</span>
                      </button>

                      {/* Sub-item 4: Bảo mật & Mật khẩu */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenUserProfile?.('security');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-gray-500" />
                        <span>Bảo mật & Đổi mật khẩu</span>
                      </button>

                      {/* Sub-item 5: Kênh Quản Trị & Bán Hàng */}
                      {onOpenAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountDropdown(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 font-bold text-[#006650] flex items-center justify-between transition-colors cursor-pointer border border-emerald-200/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <Store className="w-4 h-4 text-[#009981]" />
                            <span>Kênh Quản Trị & Bán Hàng</span>
                          </div>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#009981] text-white tracking-wide">
                            ADMIN
                          </span>
                        </button>
                      )}

                      {/* Sub-item 6: Đăng xuất */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 font-semibold text-red-600 flex items-center gap-2.5 transition-colors pt-2 border-t border-gray-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl mb-1.5">
                        <p className="font-black text-gray-900 text-xs flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-[#009981]" />
                          NextPhone Member
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Tích điểm tới 2% & nhận voucher 100K khi đăng ký mới</p>
                      </div>

                      {/* Guest Sub-item 1: Đăng nhập */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenAuth('login');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-[#009981] font-semibold text-gray-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-[#009981]" />
                        <span>Đăng nhập</span>
                      </button>

                      {/* Guest Sub-item 2: Đăng ký */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenAuth('register');
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl bg-emerald-50 text-[#007f66] font-bold flex items-center gap-2.5 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-[#009981]" />
                        <span>Đăng ký tài khoản</span>
                      </button>

                      {/* Guest Sub-item 3: Tra cứu thanh toán */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountDropdown(false);
                          onOpenPaymentHistory?.();
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 font-semibold text-gray-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Receipt className="w-4 h-4 text-[#009981]" />
                        <span>Tra cứu giao dịch & Đơn hàng</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={onOpenCart || (() => alert('Giỏ hàng của bạn đang có ' + displayCartCount + ' sản phẩm'))}
            className="relative flex items-center justify-center p-2 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-[#009981] transition-colors"
            title="Xem Giỏ Hàng"
          >
            <ShoppingBag className="w-5 h-5 text-gray-800 hover:text-[#009981]" />
            <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
              {displayCartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
