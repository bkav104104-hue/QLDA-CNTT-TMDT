import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Warehouse, 
  ShieldAlert, 
  ArrowLeft, 
  Bell, 
  User, 
  Store, 
  RefreshCw,
  LogOut,
  Sparkles,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { BrandLogo } from '../auth/components/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { adminService, AdminDashboardStats, AdminProductItem, AdminOrder } from '../../services/adminService';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminInventoryTab } from './tabs/AdminInventoryTab';
import { AdminModerationTab } from './tabs/AdminModerationTab';

interface AdminPortalPageProps {
  onBackToStorefront: () => void;
  onOpenAuth?: (mode?: 'login' | 'register', notice?: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ 
  onBackToStorefront,
  onOpenAuth 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'moderation'>('overview');

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statsData, productsData, ordersData] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getAllProducts().catch(() => []),
        adminService.getAllOrders().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu admin portal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // LOGIN REQUIRED GUARD: If user is not authenticated, require login before using admin portal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020b08] text-gray-100 flex flex-col justify-between items-center p-4 sm:p-6 relative font-['Inter',system-ui,sans-serif] overflow-hidden selection:bg-[#009981] selection:text-white">
        {/* 1. Subtle High-Tech Dot Matrix & Ambient Radial Glows */}
        <div 
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #00b094 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-950/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Mini-Nav */}
        <div className="w-full max-w-5xl flex items-center justify-between relative z-10 pt-2 pb-4">
          <BrandLogo variant="light" size="md" badgeText="ADMIN" />
          <button
            type="button"
            onClick={onBackToStorefront}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-emerald-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về gian hàng NextPhone</span>
          </button>
        </div>

        {/* 2. Main Executive Glass Card */}
        <div className="relative z-10 w-full max-w-lg my-auto bg-gradient-to-b from-[#09221b]/95 via-[#061914]/95 to-[#04120e]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 sm:p-9 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(0,176,148,0.15)] ring-1 ring-white/10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Prominent High-Contrast Brand Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/40 border border-emerald-500/20 shadow-inner">
              <BrandLogo variant="light" size="lg" badgeText="PORTAL" />
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wide shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>KÊNH QUẢN TRỊ & BÁN HÀNG BẢO MẬT</span>
            </div>
          </div>

          {/* Security Shield & Title */}
          <div className="space-y-2">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-lg animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500/30 via-[#006650]/40 to-slate-900 border border-emerald-400/40 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8 text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Xác Thực Quyền Quản Trị
            </h1>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
              Vui lòng đăng nhập bằng tài khoản được cấp quyền để truy cập trung tâm điều hành sản phẩm, giám sát kho hàng, tiếp nhận đơn và phân tích doanh thu.
            </p>
          </div>

          {/* 3. Executive Credential Pass (VIP Demo Box) */}
          <div className="bg-gradient-to-br from-black/50 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Tài khoản mẫu Quản trị viên
                </span>
              </div>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ROLE: ADMIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Phone item */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Số điện thoại</p>
                  <p className="font-mono font-black text-white text-xs mt-0.5">0901234567</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('0901234567', 'phone')}
                  title="Sao chép số điện thoại"
                  className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {copiedField === 'phone' ? (
                    <span className="text-[9px] font-bold text-emerald-400">Đã chép</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Password item */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Mật khẩu</p>
                  <p className="font-mono font-black text-white text-xs mt-0.5">NextPhone@2026</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('NextPhone@2026', 'pass')}
                  title="Sao chép mật khẩu"
                  className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {copiedField === 'pass' ? (
                    <span className="text-[9px] font-bold text-emerald-400">Đã chép</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => onOpenAuth?.('login', 'Vui lòng đăng nhập tài khoản Quản trị viên để truy cập Kênh Quản trị!')}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#009981] via-[#00b094] to-[#009981] hover:from-[#00826e] hover:to-[#00826e] text-white text-sm font-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/40"
            >
              <Store className="w-4 h-4 text-emerald-100" />
              <span>Đăng Nhập Quản Trị Viên</span>
            </button>

            <button
              type="button"
              onClick={onBackToStorefront}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Sàn Mua Sắm NextPhone</span>
            </button>
          </div>

          {/* Security Guarantee Badges */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Bảo mật SSL 256-bit
            </span>
            <span>•</span>
            <span>Phân quyền RBAC</span>
            <span>•</span>
            <span>AI Moderation Active</span>
          </div>
        </div>

        {/* Subtle Footer Copyright */}
        <div className="relative z-10 text-[11px] text-gray-500 text-center py-2 font-medium">
          © {new Date().getFullYear()} NextPhone Technology Marketplace. Toàn quyền quản trị được bảo lưu.
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Tổng quan & Báo cáo', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'products', 
      label: 'Quản lý sản phẩm', 
      icon: <Package className="w-4 h-4" />,
      badge: products.length ? `${products.length}` : undefined 
    },
    { 
      id: 'orders', 
      label: 'Đơn hàng & Vận chuyển', 
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: stats?.pendingOrdersCount ? `${stats.pendingOrdersCount} mới` : undefined,
      badgeColor: 'bg-blue-600 text-white'
    },
    { 
      id: 'inventory', 
      label: 'Kho hàng & Xuất nhập', 
      icon: <Warehouse className="w-4 h-4" />,
      badge: stats?.lowStockProductsCount ? `${stats.lowStockProductsCount} cảnh báo` : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    { 
      id: 'moderation', 
      label: 'Kiểm duyệt đánh giá AI', 
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: stats?.flaggedReviewsCount ? `${stats.flaggedReviewsCount} cờ AI` : undefined,
      badgeColor: 'bg-purple-600 text-white'
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-gray-800 flex flex-col font-['Inter',system-ui,sans-serif]">
      {/* 1. TOP EXECUTIVE HEADER BAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" onClick={onBackToStorefront} />
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
              <span className="bg-gradient-to-r from-[#005944] to-[#009981] text-white font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Store className="w-3 h-3 text-[#36e2b6]" />
                Kênh Người Bán & Quản Trị Sàn
              </span>
            </div>
          </div>

          {/* Quick Actions & Profile info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadAllData}
              title="Làm mới số liệu"
              className="p-2 rounded-xl text-gray-500 hover:text-[#009981] hover:bg-emerald-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Back to Client Storefront */}
            <button
              type="button"
              onClick={onBackToStorefront}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xem gian hàng khách</span>
            </button>

            {/* Admin Avatar Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#009981] text-white font-black text-xs flex items-center justify-center shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="font-extrabold text-xs text-gray-900 truncate max-w-[120px]">
                  {user?.fullName || 'Quản Trị Viên'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Admin Sàn</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN PORTAL BODY (Sidebar + Tab View) */}
      <div className="max-w-7xl mx-auto w-full px-4 py-5 flex-1 flex flex-col md:flex-row items-start gap-6">
        {/* Left Vertical Nav Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex-shrink-0 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Danh Mục Điều Hành
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#009981] text-white shadow-md shadow-emerald-700/20'
                    : 'text-gray-600 hover:bg-emerald-50/70 hover:text-[#009981]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-gray-100 mt-3 space-y-1">
            <button
              type="button"
              onClick={onBackToStorefront}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Store className="w-4 h-4 text-gray-400" />
              <span>Gian hàng mua sắm</span>
            </button>
          </div>
        </aside>

        {/* Right Tab Content View */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === 'overview' && (
            <AdminOverviewTab stats={stats} onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'products' && (
            <AdminProductsTab products={products} onRefresh={loadAllData} />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab orders={orders} onRefresh={loadAllData} />
          )}

          {activeTab === 'inventory' && (
            <AdminInventoryTab products={products} onRefreshProducts={loadAllData} />
          )}

          {activeTab === 'moderation' && (
            <AdminModerationTab />
          )}
        </main>
      </div>
    </div>
  );
};

