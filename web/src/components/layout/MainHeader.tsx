import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Store,
  X,
  TrendingUp,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { catalogProducts, CatalogProduct, normalizeSearchText } from '../../data/catalogProducts';

interface MainHeaderProps {
  onOpenAuth: (mode?: 'login' | 'register', notice?: string) => void;
  onOpenCart?: () => void;
  onGoToHome?: () => void;
  onOpenPaymentHistory?: () => void;
  onOpenUserProfile?: (tab?: 'info' | 'smember' | 'security') => void;
  onOpenAdmin?: () => void;
  onSearch?: (query: string) => void;
  onSelectProduct?: (product: any) => void;
  currentSearchTerm?: string;
  cartCount?: number;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ 
  onOpenAuth, 
  onOpenCart, 
  onGoToHome, 
  onOpenPaymentHistory, 
  onOpenUserProfile, 
  onOpenAdmin,
  onSearch,
  onSelectProduct,
  currentSearchTerm,
  cartCount 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const displayCartCount = cartCount !== undefined ? cartCount : totalCount;
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external search term
  useEffect(() => {
    if (currentSearchTerm !== undefined) {
      setSearchTerm(currentSearchTerm);
    }
  }, [currentSearchTerm]);

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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAccountDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Filter matching products for live autocomplete
  const normalizedQuery = normalizeSearchText(searchTerm);
  const matchingProducts = useMemo(() => {
    if (!normalizedQuery || normalizedQuery.length < 1) return [];
    return catalogProducts.filter(p => {
      const nameNorm = normalizeSearchText(p.name);
      const brandNorm = normalizeSearchText(p.brand);
      const catNorm = normalizeSearchText(p.category);
      const chipNorm = normalizeSearchText(p.chipset || '');
      const storageNorm = normalizeSearchText(p.storage || '');
      return nameNorm.includes(normalizedQuery) ||
             brandNorm.includes(normalizedQuery) ||
             catNorm.includes(normalizedQuery) ||
             chipNorm.includes(normalizedQuery) ||
             storageNorm.includes(normalizedQuery);
    }).slice(0, 6);
  }, [normalizedQuery]);

  const popularKeywords = [
    'iPhone 17 Pro Max',
    'Samsung Galaxy A37',
    'OPPO Find X9s',
    'Xiaomi 15',
    'Củ sạc Anker 65W',
    'Tai nghe AirPods',
    'MacBook Air M3'
  ];

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSelectSuggestedProduct = (product: CatalogProduct) => {
    setShowSearchDropdown(false);
    setSearchTerm(product.name);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSearch) {
      onSearch(product.name);
    }
  };

  const handleSelectKeyword = (kw: string) => {
    setSearchTerm(kw);
    setShowSearchDropdown(false);
    if (onSearch) {
      onSearch(kw);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
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

        {/* Search Bar with Live Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex items-center border-2 border-[#009981]/80 rounded-xl overflow-hidden focus-within:border-[#009981] focus-within:ring-2 focus-within:ring-[#009981]/15 transition-all bg-white">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowSearchDropdown(true);
                }}
                placeholder="Hôm nay bạn muốn tìm kiếm gì? (ví dụ: iPhone, Samsung, sạc Anker...)"
                className="w-full px-4 py-2 text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />

              {/* Clear button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="bg-[#009981] hover:bg-[#00826e] text-white px-4 py-2.5 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors flex-shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Search Dropdown / Autocomplete Panel */}
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-gray-100 max-h-[80vh] overflow-y-auto">
              {/* Case 1: Has query and matching products */}
              {normalizedQuery.length > 0 && matchingProducts.length > 0 && (
                <div className="space-y-2 pb-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                    <span className="flex items-center gap-1.5 text-[#009981]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Sản phẩm gợi ý ({matchingProducts.length})
                    </span>
                    <span className="text-[11px] text-gray-400">Nhấn để xem chi tiết</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectSuggestedProduct(p)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors group border border-transparent hover:border-emerald-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div 
                            style={{ backgroundColor: p.phoneColor || '#009981' }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[10px] font-black uppercase flex-shrink-0 shadow-sm"
                          >
                            {p.brand.slice(0, 3)}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#009981] transition-colors truncate">
                              {p.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                              <span className="uppercase font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded text-[10px]">
                                {p.brand}
                              </span>
                              {p.storage && <span>{p.storage}</span>}
                              {p.chipset && <span>• {p.chipset}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="text-xs md:text-sm font-black text-[#e11d48]">
                            {formatPrice(p.price)}
                          </div>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <div className="text-[10px] text-gray-400 line-through">
                              {formatPrice(p.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View all search button */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#007f66] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Xem tất cả kết quả cho <strong>"{searchTerm}"</strong></span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: Has query but NO matches */}
              {normalizedQuery.length > 0 && matchingProducts.length === 0 && (
                <div className="py-4 text-center space-y-3">
                  <p className="text-xs text-gray-500">
                    Không tìm thấy sản phẩm nào khớp với <strong>"{searchTerm}"</strong>
                  </p>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block mb-2">
                      Gợi ý thử tìm kiếm:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {['iPhone', 'Samsung', 'Xiaomi', 'Anker', 'Tai nghe', 'MacBook'].map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleSelectKeyword(kw)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-[#009981] text-gray-600 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Case 3: Empty query - Show popular searches */}
              {normalizedQuery.length === 0 && (
                <div className="space-y-3 py-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <TrendingUp className="w-4 h-4 text-[#009981]" />
                    <span>Tìm kiếm phổ biến hôm nay</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleSelectKeyword(kw)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-[#009981] hover:border-emerald-200 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium transition-all flex items-center gap-1 group"
                      >
                        <Tag className="w-3 h-3 text-gray-400 group-hover:text-[#009981]" />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
