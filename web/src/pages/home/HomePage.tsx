import React, { useState, useEffect } from 'react';
import { HeaderTopBar } from '../../components/layout/HeaderTopBar';
import { MainHeader } from '../../components/layout/MainHeader';
import { TrendingKeywords } from '../../components/layout/TrendingKeywords';
import { CategorySidebar } from '../../components/home/CategorySidebar';
import { HeroBanner } from '../../components/home/HeroBanner';
import { ProductSection } from '../../components/home/ProductSection';
import { TechNewsSection } from '../../components/home/TechNewsSection';
import { FloatingChatWidget } from '../../components/home/FloatingChatWidget';
import { ProductItem } from '../../components/home/ProductCard';
import { useCart, CartItemType } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onOpenAuth: (mode?: 'login' | 'register', notice?: string) => void;
  onOpenCart?: () => void;
  onSelectProduct?: (product?: ProductItem) => void;
  onGoToHome?: () => void;
  onOpenPaymentHistory?: () => void;
  onOpenUserProfile?: (tab?: 'info' | 'smember' | 'security') => void;
  onOpenAdmin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onOpenAuth, 
  onOpenCart, 
  onSelectProduct, 
  onGoToHome, 
  onOpenPaymentHistory,
  onOpenUserProfile,
  onOpenAdmin 
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('dienthoai');

  // Listen to browser hash changes (e.g. #cat-dienthoai, #cat-phukien, #cat-tinhotcongnghe)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#cat-')) {
        const slug = hash.replace('#cat-', '');
        if (slug) {
          setActiveCategory(slug);
        }
      } else if (!hash || hash === '#') {
        setActiveCategory('dienthoai');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = (product: ProductItem) => {
    const item: CartItemType = {
      id: `np-item-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      quantity: 1,
      version: product.storage || 'Tiêu chuẩn',
      colorName: 'Mặc định',
      colorHex: product.phoneColor || '#009981',
      phoneColor: product.phoneColor || '#1e293b',
      imageBgColor: product.imageBgColor || '#e0f2fe'
    };

    const added = addToCart(item, () => {
      onOpenAuth('login', 'Vui lòng đăng nhập tài khoản NextPhone để thêm sản phẩm vào giỏ hàng!');
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
    });

    if (added) {
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  const handleLogoClick = () => {
    // Clean URL: remove any hash e.g. #cat-dienthoai and restore clean root path /
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
    setActiveCategory('dienthoai');
    if (onGoToHome) {
      onGoToHome();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6f8] flex flex-col justify-between relative font-['Inter',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Sections */}
      <div>
        <HeaderTopBar />
        <MainHeader 
          onOpenAuth={onOpenAuth} 
          onOpenCart={onOpenCart} 
          onGoToHome={handleLogoClick}
          onOpenPaymentHistory={onOpenPaymentHistory}
          onOpenUserProfile={onOpenUserProfile}
          onOpenAdmin={onOpenAdmin}
        />
        <TrendingKeywords />

        {/* 2. Main Body Grid */}
        <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-5">
            {/* Left Sidebar: Categories with URL Hashes + NextPhone Member Box */}
            <CategorySidebar 
              onOpenAuth={onOpenAuth}
              selectedCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />

            {/* Right Main Content Area */}
            <div className="flex-1 w-full space-y-4 min-w-0">
              {/* Hero Big Banner */}
              <HeroBanner />

              {/* Dynamic Section: Tech News OR Products Section */}
              {activeCategory === 'tinhotcongnghe' || activeCategory === 'tin-hot-cong-nghe' ? (
                <TechNewsSection 
                  onBackToProducts={() => {
                    setActiveCategory('dienthoai');
                    window.location.hash = '#cat-dienthoai';
                  }}
                />
              ) : (
                <ProductSection 
                  selectedCategory={activeCategory}
                  onAddToCart={handleAddToCart} 
                  onSelectProduct={onSelectProduct}
                  onResetCategory={() => {
                    setActiveCategory('dienthoai');
                    window.history.pushState(null, '', window.location.pathname);
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="w-full bg-white border-t border-gray-200 mt-12 py-8 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Hỗ trợ khách hàng</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Hotline mua hàng: <strong className="text-[#009981]">1900.8888</strong></li>
              <li>Hotline bảo hành: <strong className="text-[#009981]">1900.8889</strong></li>
              <li>Chính sách bảo hành 1 đổi 1</li>
              <li>Chính sách vận chuyển toàn quốc</li>
              <li>Hướng dẫn mua hàng trả góp 0%</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Về NextPhone</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Giới thiệu hệ thống NextPhone</li>
              <li>Tuyển dụng nhân tài công nghệ</li>
              <li>Chính sách bảo mật thông tin cá nhân</li>
              <li>Hệ thống 128 cửa hàng toàn quốc</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">Thanh toán & Đối tác</h4>
            <p className="text-[11px] leading-relaxed mb-2">
              Hỗ trợ thanh toán qua VNPay, MoMo, ZaloPay, Thẻ tín dụng Visa/Mastercard và Trả góp thẻ ngân hàng.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-blue-700">VIB</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-red-600">ShopeePay</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-purple-700">TPBank</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-green-700">VPBank</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[11px]">NextPhone Member</h4>
            <p className="text-[11px] leading-relaxed mb-3">
              Đăng ký thành viên để nhận ngay voucher 100K và tích điểm chiết khấu lên đến 5% cho mỗi đơn hàng.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl transition-colors text-xs shadow-sm cursor-pointer"
              >
                Đăng ký thành viên
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-xs cursor-pointer"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
          © 2026 NextPhone.vn - Hệ thống thương mại điện tử điện thoại & phụ kiện công nghệ chính hãng tích hợp AI.
        </div>
      </footer>

      {/* 4. Floating AI Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};
export default HomePage;
