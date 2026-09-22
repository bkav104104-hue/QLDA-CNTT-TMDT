import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Package, 
  CheckCircle2, 
  X, 
  Save,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { adminService, LowStockAlert, InventoryLog, AdminProductItem } from '../../../services/adminService';

interface AdminInventoryTabProps {
  products: AdminProductItem[];
  onRefreshProducts: () => void;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({ products, onRefreshProducts }) => {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logFilter, setLogFilter] = useState<'all' | 'IMPORT' | 'EXPORT'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1);
  const [importQty, setImportQty] = useState<number>(50);
  const [importPrice, setImportPrice] = useState<number>(10000000);
  const [supplier, setSupplier] = useState<string>('Công ty CP Phân phối FPT Synnex');
  const [importNote, setImportNote] = useState<string>('Nhập bổ sung lô hàng mới');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alertsData, logsData] = await Promise.all([
        adminService.getLowStockAlerts(10),
        adminService.getInventoryLogs()
      ]);
      setAlerts(alertsData);
      setLogs(logsData);
    } catch (err: any) {
      console.warn('Lỗi tải kho hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openImportForProduct = (prodId: number) => {
    setSelectedProductId(prodId);
    setImportQty(30);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setImportPrice(Math.round(prod.basePrice * 0.8));
    }
    setIsImportModalOpen(true);
  };

  const handleCreateImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (importQty <= 0) {
      alert('Số lượng nhập phải lớn hơn 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.createInventoryImport({
        productId: selectedProductId,
        quantity: importQty,
        unitPrice: importPrice,
        supplierOrDestination: supplier.trim(),
        note: importNote.trim()
      });

      showToast(`Đã nhập thêm +${importQty} sản phẩm vào kho thành công!`);
      setIsImportModalOpen(false);
      await loadData();
      onRefreshProducts();
    } catch (err: any) {
      alert('Lỗi khi nhập hàng: ' + (err.message || 'Thất bại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(l => logFilter === 'all' ? true : l.type === logFilter);

  return (
    <div className="space-y-6 text-xs">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Quick Import Button */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Giám Sát Xuất / Nhập Kho & Cảnh Báo Tồn Kho</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {alerts.length} cảnh báo cạn hàng
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Theo dõi chính xác luồng hàng hóa lưu chuyển, tự động phát hiện hàng sắp hết để bổ sung kịp thời.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (products.length > 0) setSelectedProductId(products[0].id);
            setIsImportModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#009981] hover:bg-[#00826e] text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phiếu Nhập Hàng (Thêm Kho)</span>
        </button>
      </div>

      {/* 1. KHỐI CẢNH BÁO SẮP CẠN KHO */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-200 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight uppercase">
                Hệ Thống Cảnh Báo Sắp Cạn Kho (Low Stock Detection)
              </h3>
              <p className="text-[11px] text-amber-800 font-medium">
                Các sản phẩm có tồn kho $\le 10$ chiếc hoặc $\le 3$ chiếc cần được người bán nhập bổ sung ngay để không gián đoạn kinh doanh.
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3 py-1 bg-amber-200 text-amber-900 rounded-xl">
            {alerts.length} Mặt hàng cần nhập
          </span>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {alerts.map((al) => (
            <div 
              key={al.productId}
              className={`p-3.5 rounded-2xl bg-white border flex items-center justify-between gap-3 shadow-sm transition-all ${
                al.severity === 'CRITICAL' 
                  ? 'border-red-300 hover:border-red-400 bg-red-50/30' 
                  : 'border-amber-200 hover:border-amber-300'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md mb-1 ${
                  al.severity === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-100 text-amber-800'
                }`}>
                  {al.severity === 'CRITICAL' ? 'CỰC KỲ KHẨN CẤP (≤ 3)' : 'SẮP HẾT HÀNG (≤ 10)'}
                </span>
                <p className="font-extrabold text-gray-900 truncate text-xs">{al.productName}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Tồn kho còn: <strong className={`font-mono text-sm ${al.currentStock <= 3 ? 'text-red-600' : 'text-amber-700'}`}>{al.currentStock} cái</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => openImportForProduct(al.productId)}
                className="px-3 py-1.5 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl text-[11px] whitespace-nowrap shadow-sm cursor-pointer"
              >
                + Nhập kho
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BẢNG NHẬT KÝ XUẤT / NHẬP HÀNG (STOCK LOGS) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-gray-900 tracking-tight">
              Nhật Ký Xuất / Nhập Kho Gần Đây
            </h3>
            <p className="text-xs text-gray-400">Lịch sử biến động số lượng hàng hóa trên hệ thống</p>
          </div>

          {/* Filter Types */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center font-bold text-xs">
            <button
              type="button"
              onClick={() => setLogFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                logFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tất cả ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setLogFilter('IMPORT')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                logFilter === 'IMPORT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Nhập kho (+{logs.filter(l => l.type === 'IMPORT').length})
            </button>
            <button
              type="button"
              onClick={() => setLogFilter('EXPORT')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                logFilter === 'EXPORT' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Xuất bán (-{logs.filter(l => l.type === 'EXPORT').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Mã Phiếu / Thời Gian</th>
                <th className="p-3">Loại Biến Động</th>
                <th className="p-3">Sản Phẩm</th>
                <th className="p-3 text-center">Số Lượng</th>
                <th className="p-3">Đơn Giá / Thành Tiền</th>
                <th className="p-3">Đối Tác / Nhà Cung Cấp</th>
                <th className="p-3">Người Thực Hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Chưa có nhật ký xuất nhập nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isImport = log.type === 'IMPORT';
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-gray-800 block">
                          #LOG-{log.id.toString().padStart(5, '0')}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(log.createdAt).toLocaleDateString('vi-VN')} {new Date(log.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-3">
                        {isImport ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#006650] font-black text-[10px] px-2.5 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3 text-[#009981]" /> NHẬP KHO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 text-blue-600" /> XUẤT HÀNG
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-bold text-gray-900 max-w-xs truncate">
                        {log.productName}
                      </td>

                      <td className="p-3 text-center">
                        <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                          isImport ? 'bg-emerald-50 text-[#009981]' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {isImport ? `+${log.quantity}` : `-${log.quantity}`}
                        </span>
                      </td>

                      <td className="p-3">
                        {log.unitPrice ? (
                          <>
                            <p className="font-extrabold text-gray-800">
                              {(log.unitPrice * log.quantity).toLocaleString('vi-VN')} ₫
                            </p>
                            <p className="text-[10px] text-gray-400">Đơn giá: {log.unitPrice.toLocaleString('vi-VN')} ₫</p>
                          </>
                        ) : (
                          <span className="text-gray-400">Theo giá vốn</span>
                        )}
                      </td>

                      <td className="p-3 text-gray-600">
                        <p className="font-semibold text-gray-800 truncate max-w-xs">{log.supplierOrDestination || 'Nội bộ sàn'}</p>
                        {log.note && <p className="text-[10px] text-gray-400 truncate max-w-xs">{log.note}</p>}
                      </td>

                      <td className="p-3 text-gray-500 font-medium">
                        {log.createdBy || 'Admin'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TẠO PHIẾU NHẬP HÀNG */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Package className="w-5 h-5 text-[#009981]" />
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">Tạo Phiếu Nhập Hàng Vào Kho</h3>
                <p className="text-[11px] text-gray-500">Bổ sung số lượng tồn kho cho sản phẩm trên sàn</p>
              </div>
            </div>

            <form onSubmit={handleCreateImport} className="space-y-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Chọn sản phẩm cần nhập *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setSelectedProductId(id);
                    const prod = products.find(p => p.id === id);
                    if (prod) setImportPrice(Math.round(prod.basePrice * 0.8));
                  }}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 font-bold text-gray-800 focus:ring-2 focus:ring-[#009981] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Tồn kho hiện tại: {p.totalStockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng nhập thêm *</label>
                  <input
                    type="number"
                    min={1}
                    value={importQty}
                    onChange={(e) => setImportQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-mono font-bold text-base text-[#009981] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đơn giá nhập vốn (VNĐ)</label>
                  <input
                    type="number"
                    step={10000}
                    value={importPrice}
                    onChange={(e) => setImportPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nhà phân phối / Nguồn hàng</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="VD: Apple Distribution VN, Synnex FPT, Digiworld..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú phiếu nhập</label>
                <input
                  type="text"
                  value={importNote}
                  onChange={(e) => setImportNote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              {/* Tóm tắt phiếu */}
              <div className="p-3 bg-emerald-50 rounded-2xl flex justify-between font-bold text-gray-800">
                <span>Tổng giá trị vốn lô hàng:</span>
                <span className="text-[#005944] font-black font-mono text-sm">
                  {(importQty * importPrice).toLocaleString('vi-VN')} ₫
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white font-black shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang lưu...' : 'Xác Nhận Nhập Hàng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

