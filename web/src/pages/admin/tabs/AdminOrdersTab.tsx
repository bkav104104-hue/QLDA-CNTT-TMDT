import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  X,
  Send,
  Calendar
} from 'lucide-react';
import { adminService, AdminOrder } from '../../../services/adminService';

interface AdminOrdersTabProps {
  orders: AdminOrder[];
  onRefresh: () => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Update Status Modal
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('Đang vận chuyển');
  const [trackingCode, setTrackingCode] = useState('');
  const [shippingProvider, setShippingProvider] = useState('Giao Hàng Nhanh (GHN)');
  const [adminNote, setAdminNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = o.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.receiverPhone.includes(searchTerm);

      const matchStatus = statusFilter === 'all' ? true : o.orderStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleOpenStatusModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingCode(`NP-SHIP-${Date.now().toString().slice(-6)}`);
    setAdminNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdatingStatus(true);
    try {
      await adminService.updateOrderStatus(selectedOrder.id, {
        orderStatus: newStatus,
        trackingCode: newStatus === 'Đang vận chuyển' ? trackingCode : undefined,
        shippingProvider: newStatus === 'Đang vận chuyển' ? shippingProvider : undefined,
        adminNote: adminNote.trim() || undefined
      });

      showToast(`Đã cập nhật trạng thái đơn ${selectedOrder.orderCode} sang "${newStatus}"!`);
      setSelectedOrder(null);
      onRefresh();
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + (err.message || 'Thất bại'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xác nhận</span>;
      case 'Đã xác nhận & Đang đóng gói':
        return <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1"><Package className="w-3 h-3" /> Đang đóng gói</span>;
      case 'Đang vận chuyển':
        return <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Đang giao hàng</span>;
      case 'Giao hàng thành công':
        return <span className="bg-emerald-100 text-[#006650] font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Giao thành công</span>;
      case 'Đã hủy':
        return <span className="bg-gray-100 text-gray-500 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Tiếp Nhận & Xử Lý Đơn Đặt Hàng</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {filteredOrders.length} đơn hàng
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Xem thông tin người mua, duyệt đơn và cập nhật trạng thái vận chuyển qua các hãng liên kết.
          </p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn (NP-XXXX), tên, SĐT..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#009981]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Chờ xác nhận', label: 'Chờ duyệt' },
            { id: 'Đang vận chuyển', label: 'Đang giao' },
            { id: 'Giao hàng thành công', label: 'Đã hoàn tất' },
            { id: 'Đã hủy', label: 'Đã hủy' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-[#009981] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 text-[10px]">
              <tr>
                <th className="p-4">Mã Đơn / Ngày Đặt</th>
                <th className="p-4">Khách Hàng & Địa Chỉ</th>
                <th className="p-4">Sản Phẩm Đặt</th>
                <th className="p-4">Tổng Tiền / Thanh Toán</th>
                <th className="p-4 text-center">Trạng Thái Vận Chuyển</th>
                <th className="p-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Không có đơn đặt hàng nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-blue-700 text-sm block">
                        {order.orderCode}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="font-extrabold text-gray-900">{order.receiverName}</p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" /> {order.receiverPhone}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5" title={order.shippingAddress}>
                        <MapPin className="w-3 h-3 text-gray-400 inline mr-0.5" />
                        {order.shippingAddress}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        {order.items && order.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-gray-800 text-[11px] truncate max-w-xs">
                            • <strong>{item.quantity}x</strong> {item.productName}
                          </p>
                        ))}
                        {order.items && order.items.length > 2 && (
                          <span className="text-[10px] text-[#009981] font-bold">
                            +{order.items.length - 2} sản phẩm khác
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-gray-900 text-sm">
                        {order.totalAmount.toLocaleString('vi-VN')} ₫
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                        <span className="font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {order.paymentMethod}
                        </span>
                        <span className={order.paymentStatus === 'Đã thanh toán' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-medium'}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {getStatusBadge(order.orderStatus)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(order)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Cập nhật</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CẬP NHẬT TIẾN ĐỘ VẬN CHUYỂN */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  Cập Nhật Tiến Độ Vận Chuyển: {selectedOrder.orderCode}
                </h3>
                <p className="text-[11px] text-gray-500">Khách hàng: <strong>{selectedOrder.receiverName}</strong> ({selectedOrder.receiverPhone})</p>
              </div>
            </div>

            {/* Chi tiết sản phẩm trong đơn */}
            <div className="p-3.5 bg-gray-50 rounded-2xl space-y-2">
              <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px] block">
                Sản phẩm trong đơn hàng
              </span>
              <div className="divide-y divide-gray-200/60">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{item.productName}</p>
                      <p className="text-[10px] text-gray-500">Số lượng: {item.quantity} x {item.unitPrice.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">
                      {item.totalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-gray-900">
                <span>Tổng giá trị đơn:</span>
                <span className="text-sm text-[#009981]">{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3 pt-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Chọn trạng thái mới:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 font-bold text-gray-800 focus:ring-2 focus:ring-[#009981] outline-none"
                >
                  <option value="Chờ xác nhận">Chờ xác nhận (Mới tiếp nhận)</option>
                  <option value="Đã xác nhận & Đang đóng gói">Đã xác nhận & Đang đóng gói</option>
                  <option value="Đang vận chuyển">Đang vận chuyển (Giao cho đơn vị vận chuyển)</option>
                  <option value="Giao hàng thành công">Giao hàng thành công (Đã thu tiền & hoàn tất)</option>
                  <option value="Đã hủy">Hủy đơn hàng</option>
                </select>
              </div>

              {/* Nếu chọn Đang vận chuyển -> hiện mã vận đơn và đơn vị */}
              {newStatus === 'Đang vận chuyển' && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2.5 animate-in fade-in duration-200">
                  <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px] block">
                    Thông tin gửi hàng qua đơn vị liên kết
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-gray-600 mb-1">Đơn vị vận chuyển</label>
                      <select
                        value={shippingProvider}
                        onChange={(e) => setShippingProvider(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none font-medium"
                      >
                        <option value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</option>
                        <option value="Viettel Post">Viettel Post</option>
                        <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
                        <option value="NextPhone Hỏa Tốc (2h)">NextPhone Hỏa Tốc (2h)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Mã vận đơn (Tracking Code)</label>
                      <input
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-mono font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ghi chú tiến độ gửi khách hàng (Tùy chọn)</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="VD: Kiện hàng đã được giao cho shipper Nguyễn Văn B..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isUpdatingStatus ? 'Đang cập nhật...' : 'Lưu Trạng Thái'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
function Package(props: any) {
  return <ShoppingBag {...props} />;
}

