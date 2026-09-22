import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Package, 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  ArrowUpRight, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AdminDashboardStats } from '../../../services/adminService';

interface AdminOverviewTabProps {
  stats: AdminDashboardStats | null;
  onNavigateTab: (tab: 'products' | 'orders' | 'inventory' | 'moderation') => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ stats, onNavigateTab }) => {
  const formatCurrency = (val?: number) => {
    return (val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const handleExportReport = () => {
    if (!stats) return;
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + "CHỈ SỐ BÁO CÁO KINH DOANH SÀN NEXTPHONE\n"
      + `Thời gian xuất,${new Date().toLocaleString('vi-VN')}\n`
      + `Tổng doanh thu,${stats.totalRevenue}\n`
      + `Doanh thu hôm nay,${stats.revenueToday}\n`
      + `Doanh thu tháng này,${stats.revenueThisMonth}\n`
      + `Tổng số đơn hàng,${stats.totalOrders}\n`
      + `Đơn chờ duyệt,${stats.pendingOrdersCount}\n`
      + `Đơn đang giao,${stats.shippingOrdersCount}\n`
      + `Đơn hoàn thành,${stats.completedOrdersCount}\n`
      + `Tổng sản phẩm,${stats.totalProducts}\n`
      + `Sản phẩm cạn kho,${stats.lowStockProductsCount}\n`
      + `Đánh giá cảnh báo AI,${stats.flaggedReviewsCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BaoCao_KinhDoanh_NextPhone_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#009981] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-xs font-semibold">Đang tải số liệu thống kê kinh doanh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Export */}
      <div className="bg-gradient-to-r from-[#003d2e] via-[#005944] to-[#009981] rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#36e2b6] text-[#004838] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Báo Cáo Thời Gian Thực
            </span>
            <span className="text-xs text-emerald-200">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Trung Tâm Giám Sát & Điều Hành Sàn NextPhone</h1>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
            Giám sát toàn diện doanh thu kinh doanh, tình trạng kho bãi, tiến độ vận đơn và kiểm duyệt tiêu chuẩn cộng đồng tích hợp AI.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportReport}
          className="px-4 py-2.5 bg-white text-[#005944] hover:bg-emerald-50 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Download className="w-4 h-4 text-[#009981]" />
          <span>Xuất Báo Cáo Kinh Doanh (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng Doanh Thu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#009981] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#009981] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tháng này: {formatCurrency(stats.revenueThisMonth)}</span>
          </div>
        </div>

        {/* Card 2: Đơn hàng & Tiếp nhận */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đơn Hàng Sàn</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {stats.totalOrders} <span className="text-xs font-normal text-gray-500">đơn</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
              {stats.pendingOrdersCount} chờ xác nhận
            </span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
              Xem đơn →
            </span>
          </div>
        </div>

        {/* Card 3: Cảnh báo sắp cạn kho */}
        <div 
          onClick={() => onNavigateTab('inventory')}
          className={`bg-white rounded-2xl p-5 shadow-sm border transition-all cursor-pointer group ${
            stats.lowStockProductsCount > 0 
              ? 'border-red-200 bg-red-50/20 hover:border-red-300' 
              : 'border-gray-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cảnh Báo Tồn Kho</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              stats.lowStockProductsCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {stats.lowStockProductsCount} <span className="text-xs font-normal text-gray-500">mặt hàng</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={stats.lowStockProductsCount > 0 ? 'text-red-600 font-black' : 'text-gray-500 font-medium'}>
              {stats.lowStockProductsCount > 0 ? 'Cần nhập hàng khẩn cấp!' : 'Tồn kho ổn định'}
            </span>
            <span className="text-[#009981] font-bold group-hover:translate-x-0.5 transition-transform">
              Xem kho →
            </span>
          </div>
        </div>

        {/* Card 4: Kiểm duyệt AI */}
        <div 
          onClick={() => onNavigateTab('moderation')}
          className={`bg-white rounded-2xl p-5 shadow-sm border transition-all cursor-pointer group ${
            stats.flaggedReviewsCount > 0 
              ? 'border-purple-200 bg-purple-50/20 hover:border-purple-300' 
              : 'border-gray-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cảnh Báo AI Kiểm Duyệt</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {stats.flaggedReviewsCount} <span className="text-xs font-normal text-gray-500">vi phạm</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-purple-700 font-bold">
              {stats.flaggedReviewsCount > 0 ? 'AI đã gắn cờ nghi vấn' : 'Không có vi phạm'}
            </span>
            <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform">
              Xử lý →
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 7-Day Revenue Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7 Days Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900 tracking-tight">Biểu Đồ Doanh Thu 7 Ngày Gần Nhất</h3>
              <p className="text-xs text-gray-400">Số liệu đơn hàng thành công và đang giao</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-medium">Giá trị đơn TB (AOV):</span>
              <p className="text-sm font-black text-[#009981]">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 pt-6 flex items-end justify-between gap-3 border-b border-gray-100">
            {stats.revenueChart.map((p, idx) => {
              const maxRev = Math.max(...stats.revenueChart.map(x => x.revenue), 1000000);
              const heightPct = Math.max(12, Math.round((p.revenue / maxRev) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    {formatCurrency(p.revenue)} ({p.orderCount} đơn)
                  </div>

                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      p.revenue > 0 
                        ? 'bg-gradient-to-t from-[#009981] to-[#36e2b6] group-hover:brightness-110 shadow-sm' 
                        : 'bg-gray-100'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-gray-500">{p.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Selling Products */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 tracking-tight">Top Sản Phẩm Bán Chạy</h3>
            <span className="text-[10px] font-extrabold text-[#009981] bg-emerald-50 px-2 py-0.5 rounded-full">
              Sản Lượng
            </span>
          </div>

          <div className="space-y-3">
            {stats.topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                  idx === 0 ? 'bg-amber-100 text-amber-800' :
                  idx === 1 ? 'bg-slate-200 text-slate-800' :
                  idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  #{idx + 1}
                </span>

                <img 
                  src={prod.thumbnailUrl} 
                  alt={prod.name}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                  <p className="text-[11px] text-[#009981] font-extrabold">{formatCurrency(prod.revenue)}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-gray-800">{prod.soldCount} đã bán</span>
                  <p className="text-[10px] text-gray-400">Kho: {prod.currentStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

