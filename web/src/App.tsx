import React, { useState } from 'react';
import { HomePage } from './pages/home/HomePage';
import { CartPage } from './pages/cart/CartPage';
import { ProductDetailPage } from './pages/product/ProductDetailPage';
import { AdminPortalPage } from './pages/admin/AdminPortalPage';
import { AuthModal } from './pages/auth/AuthModal';
import { PaymentHistoryModal } from './components/payment/PaymentHistoryModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { productDetailsDatabase } from './data/productData';
import { Receipt, Store } from 'lucide-react';

function MainLayout() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'cart' | 'product-detail' | 'admin'>(() => {
    const saved = localStorage.getItem('nextphone_current_page');
    if (saved === 'home' || saved === 'cart' || saved === 'product-detail' || saved === 'admin') {
      return saved as 'home' | 'cart' | 'product-detail' | 'admin';
    }
    return 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return localStorage.getItem('nextphone_selected_product_id') || 'iphone-17-pro-max';
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [paymentHistoryOrderCode, setPaymentHistoryOrderCode] = useState<string | undefined>(undefined);

  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [userProfileTab, setUserProfileTab] = useState<'info' | 'smember' | 'security'>('info');

  const handleOpenPaymentHistory = (orderCode?: string) => {
    setPaymentHistoryOrderCode(orderCode);
    setIsPaymentHistoryOpen(true);
  };

  const handleOpenUserProfile = (tab: 'info' | 'smember' | 'security' = 'info') => {
    setUserProfileTab(tab);
    setIsUserProfileOpen(true);
  };

  // Sync hash routing so selecting #cat-... from anywhere returns to home
  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash && window.location.hash.startsWith('#cat-')) {
        setCurrentPage('home');
        localStorage.setItem('nextphone_current_page', 'home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToPage = (page: 'home' | 'cart' | 'product-detail' | 'admin') => {
    setCurrentPage(page);
    localStorage.setItem('nextphone_current_page', page);
    if (page === 'home') {
      // Clear hash to reset URL to http://localhost:3000/
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', notice?: string) => {
    setAuthMode(mode);
    setAuthNotice(notice || null);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setAuthNotice(null);
  };

  const handleSelectProduct = (product?: any) => {
    if (product) {
      const mappedId = Object.keys(productDetailsDatabase).find(k => 
        k === product.id || 
        productDetailsDatabase[k].id === product.id ||
        productDetailsDatabase[k].slug === product.slug
      ) || product.id || 'iphone-17-pro-max';

      setSelectedProductId(mappedId);
      localStorage.setItem('nextphone_selected_product_id', mappedId);
    }
    navigateToPage('product-detail');
  };

  const handleOpenAdmin = () => {
    if (!isAuthenticated) {
      handleOpenAuth('login', 'Vui lòng đăng nhập tài khoản Quản trị viên (Admin) để sử dụng Kênh Quản trị!');
      return;
    }
    navigateToPage('admin');
  };

  return (
    <div className="w-full min-h-screen relative font-['Inter',sans-serif]">
      {/* Dynamic View Routing */}
      {currentPage === 'home' && (
        <HomePage 
          onOpenAuth={handleOpenAuth} 
          onOpenCart={() => navigateToPage('cart')}
          onSelectProduct={handleSelectProduct}
          onGoToHome={() => navigateToPage('home')}
          onOpenPaymentHistory={() => handleOpenPaymentHistory()}
          onOpenUserProfile={handleOpenUserProfile}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {currentPage === 'cart' && (
        <CartPage 
          onBackToHome={() => navigateToPage('home')}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {currentPage === 'product-detail' && (
        <ProductDetailPage
          productId={selectedProductId}
          onBackToHome={() => navigateToPage('home')}
          onOpenCart={() => navigateToPage('cart')}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={handleOpenAdmin}
          onOpenPaymentHistory={() => handleOpenPaymentHistory()}
          onOpenUserProfile={handleOpenUserProfile}
          onSelectOtherProduct={(id) => {
            setSelectedProductId(id);
            localStorage.setItem('nextphone_selected_product_id', id);
          }}
        />
      )}

      {currentPage === 'admin' && (
        <AdminPortalPage
          onBackToStorefront={() => navigateToPage('home')}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-5xl my-auto">
            <AuthModal
              initialMode={authMode}
              notice={authNotice}
              onClose={handleCloseAuth}
            />
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {isPaymentHistoryOpen && (
        <PaymentHistoryModal
          isOpen={isPaymentHistoryOpen}
          onClose={() => setIsPaymentHistoryOpen(false)}
          initialOrderCode={paymentHistoryOrderCode}
        />
      )}

      {/* User Profile Modal */}
      {isUserProfileOpen && (
        <UserProfileModal
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          initialTab={userProfileTab}
          onOpenPaymentHistory={() => handleOpenPaymentHistory()}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
