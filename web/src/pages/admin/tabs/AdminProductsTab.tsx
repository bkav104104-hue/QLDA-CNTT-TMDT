import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Power, 
  PowerOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  Package, 
  Image as ImageIcon,
  Flame,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { adminService, AdminProductItem, AdminProductCreateUpdatePayload } from '../../../services/adminService';

interface AdminProductsTabProps {
  products: AdminProductItem[];
  onRefresh: () => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({ products, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [viewingProduct, setViewingProduct] = useState<AdminProductItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<AdminProductCreateUpdatePayload>({
    name: '',
    brandId: 1, // Apple
    categoryId: 1, // Điện thoại
    basePrice: 0,
    originalPrice: 0,
    discountPercent: 0,
    warrantyMonths: 12,
    initialStockQuantity: 20,
    description: '',
    thumbnailUrl: '',
    chipset: '',
    ramCapacity: '8GB',
    storageCapacity: '128GB',
    batteryCapacity: '5000mAh',
    screenSpecs: '',
    cameraSpecs: '',
    isFeatured: false,
    isHot: false,
    isActive: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'active' ? p.isActive : !p.isActive;

      const matchCat = selectedCategory === 'all' 
        ? true 
        : p.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchSearch && matchStatus && matchCat;
    });
  }, [products, searchTerm, statusFilter, selectedCategory]);

  const openAddModal = () => {
    setFormData({
      name: '',
      brandId: 1,
      categoryId: 1,
      basePrice: 15000000,
      originalPrice: 18000000,
      discountPercent: 15,
      warrantyMonths: 12,
      initialStockQuantity: 25,
      description: 'Sản phẩm chính hãng phân phối bởi NextPhone Việt Nam, bảo hành 12 tháng 1 đổi 1.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      chipset: 'Apple A18 Bionic',
      ramCapacity: '8GB',
      storageCapacity: '256GB',
      batteryCapacity: '4500mAh',
      screenSpecs: 'Super AMOLED 6.7 inch 120Hz',
      cameraSpecs: 'Chính 48MP + Tele 12MP zoom 5x',
      isFeatured: true,
      isHot: true,
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod: AdminProductItem) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      brandId: prod.brandId,
      categoryId: prod.categoryId,
      basePrice: prod.basePrice,
      originalPrice: prod.originalPrice || prod.basePrice * 1.15,
      discountPercent: prod.discountPercent,
      warrantyMonths: prod.warrantyMonths,
      initialStockQuantity: prod.totalStockQuantity,
      description: prod.description || '',
      thumbnailUrl: prod.thumbnailUrl || '',
      chipset: prod.chipset || '',
      ramCapacity: prod.ramCapacity || '',
      storageCapacity: prod.storageCapacity || '',
      batteryCapacity: prod.batteryCapacity || '',
      screenSpecs: prod.screenSpecs || '',
      cameraSpecs: prod.cameraSpecs || '',
      isFeatured: prod.isFeatured,
      isHot: prod.isHot,
      isActive: prod.isActive
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.basePrice <= 0) {
      alert('Vui lòng nhập tên sản phẩm và giá bán hợp lệ!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, formData);
        showToast(`Đã cập nhật sản phẩm "${formData.name}" thành công!`);
        setEditingProduct(null);
      } else {
        await adminService.createProduct(formData);
        showToast(`Đã thêm sản phẩm "${formData.name}" mới lên sàn thành công!`);
        setIsAddModalOpen(false);
      }
      onRefresh();
    } catch (err: any) {
      alert('Lỗi khi lưu sản phẩm: ' + (err.message || 'Thất bại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (prod: AdminProductItem) => {
    const actionName = prod.isActive ? 'Ngừng bán' : 'Mở bán lại';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionName} sản phẩm "${prod.name}" không?`)) {
      return;
    }

    try {
      await adminService.toggleProductStatus(prod.id);
      showToast(`Đã ${actionName.toLowerCase()} sản phẩm "${prod.name}" thành công!`);
      onRefresh();
    } catch (err: any) {
      alert('Không thể thay đổi trạng thái: ' + err.message);
    }
  };

  const handleDeleteProduct = async (prod: AdminProductItem) => {
    if (!window.confirm(`Gỡ sản phẩm "${prod.name}" khỏi sàn? (Sản phẩm sẽ bị ngừng kinh doanh và ẩn khỏi gian hàng)`)) {
      return;
    }

    try {
      await adminService.deleteProduct(prod.id);
      showToast(`Đã gỡ sản phẩm "${prod.name}" khỏi sàn thành công!`);
      onRefresh();
    } catch (err: any) {
      alert('Không thể gỡ sản phẩm: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Controls Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Danh Sách Hàng Hóa Cung Cấp Trên Sàn</span>
            <span className="text-xs font-bold text-[#009981] bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} sản phẩm
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý đăng tải, cập nhật giá niêm yết, tồn kho và kiểm soát mở/ngừng bán trên sàn NextPhone.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#009981] hover:bg-[#00826e] text-white rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, hãng, danh mục..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#009981] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filter Buttons */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tất cả ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Đang bán ({products.filter(p => p.isActive).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'inactive' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ngừng bán ({products.filter(p => !p.isActive).length})
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 text-[10px]">
              <tr>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Danh Mục / Hãng</th>
                <th className="p-4">Giá Niêm Yết</th>
                <th className="p-4 text-center">Tồn Kho</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={prod.thumbnailUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100"} 
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-extrabold text-gray-900 truncate hover:text-[#009981] transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Mã: <strong className="font-mono text-gray-600">NP-{prod.id}</strong> • Bảo hành {prod.warrantyMonths}T
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-800 block">{prod.categoryName}</span>
                      <span className="text-[11px] text-gray-500">{prod.brandName}</span>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-[#009981] text-sm">
                        {prod.basePrice.toLocaleString('vi-VN')} ₫
                      </p>
                      {prod.originalPrice && (
                        <p className="text-[10px] text-gray-400 line-through">
                          {prod.originalPrice.toLocaleString('vi-VN')} ₫
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-block font-mono font-black text-xs px-2.5 py-1 rounded-lg ${
                        prod.totalStockQuantity <= 3 ? 'bg-red-100 text-red-700' :
                        prod.totalStockQuantity <= 10 ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {prod.totalStockQuantity}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {prod.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#006650] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          <PowerOff className="w-3 h-3" /> Ngừng bán
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewingProduct(prod)}
                          title="Xem chi tiết thông số kỹ thuật"
                          className="p-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          title="Sửa thông tin sản phẩm"
                          className="p-1.5 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Toggle Active / Ngừng bán */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prod)}
                          title={prod.isActive ? "Gỡ khỏi sàn (Ngừng bán)" : "Mở bán lại sản phẩm"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prod.isActive 
                              ? 'text-gray-600 hover:text-red-600 hover:bg-red-50' 
                              : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {prod.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod)}
                          title="Xóa sản phẩm"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* MODAL 1: XEM CHI TIẾT SẢN PHẨM */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setViewingProduct(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <img 
                src={viewingProduct.thumbnailUrl} 
                alt={viewingProduct.name}
                className="w-24 h-24 rounded-2xl object-cover border border-gray-200 flex-shrink-0"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-[#009981]">
                  {viewingProduct.categoryName} • {viewingProduct.brandName}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-1">{viewingProduct.name}</h3>
                <p className="text-sm font-extrabold text-[#009981] mt-0.5">
                  {viewingProduct.basePrice.toLocaleString('vi-VN')} ₫
                </p>
                <p className="text-xs text-gray-500">Tồn kho hiện tại: <strong className="font-mono text-gray-800">{viewingProduct.totalStockQuantity} chiếc</strong></p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
              <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-[11px]">Thông số kỹ thuật sản phẩm</h4>
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div><span className="text-gray-400">Chipset:</span> <strong>{viewingProduct.chipset || 'Đang cập nhật'}</strong></div>
                <div><span className="text-gray-400">RAM:</span> <strong>{viewingProduct.ramCapacity || '8GB'}</strong></div>
                <div><span className="text-gray-400">Bộ nhớ trong:</span> <strong>{viewingProduct.storageCapacity || '128GB'}</strong></div>
                <div><span className="text-gray-400">Pin & Sạc:</span> <strong>{viewingProduct.batteryCapacity || '5000mAh'}</strong></div>
                <div><span className="text-gray-400">Màn hình:</span> <strong>{viewingProduct.screenSpecs || 'OLED / Super AMOLED'}</strong></div>
                <div><span className="text-gray-400">Camera:</span> <strong>{viewingProduct.cameraSpecs || '48MP Quad Camera'}</strong></div>
                <div><span className="text-gray-400">Bảo hành:</span> <strong>{viewingProduct.warrantyMonths} Tháng chính hãng</strong></div>
                <div><span className="text-gray-400">Chiết khấu Smember:</span> <strong>{viewingProduct.memberDiscountPercent}%</strong></div>
              </div>
            </div>

            {viewingProduct.description && (
              <div className="text-xs text-gray-600 leading-relaxed p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <strong className="text-[#005944] block mb-1">Mô tả sản phẩm:</strong>
                {viewingProduct.description}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM MỚI HOẶC SỬA SẢN PHẨM */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#009981]" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                {editingProduct ? `Chỉnh Sửa Thông Tin Sản Phẩm #${editingProduct.id}` : 'Thêm Sản Phẩm Mới Lên Sàn NextPhone'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Tên & Giá */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: iPhone 17 Pro Max 256GB"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Đường dẫn Slug (Tùy chọn)</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Tự động tạo theo tên nếu để trống"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none"
                  />
                </div>
              </div>

              {/* Danh mục & Hãng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Danh mục sản phẩm</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none"
                  >
                    <option value={1}>Điện thoại (dienthoai)</option>
                    <option value={4}>Phụ kiện (phukien)</option>
                    <option value={2}>Laptop (laptop)</option>
                    <option value={3}>Tablet (tablet)</option>
                    <option value={13}>Hàng cũ (hangcu)</option>
                    <option value={14}>Thu cũ đổi mới (thucudoimoi)</option>
                    <option value={5}>Âm thanh (amthanh)</option>
                    <option value={6}>Đồng hồ (dongho)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Thương hiệu / Hãng</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: parseInt(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none"
                  >
                    <option value={1}>Apple</option>
                    <option value={2}>Samsung</option>
                    <option value={3}>Xiaomi</option>
                    <option value={4}>OPPO</option>
                    <option value={5}>HONOR</option>
                    <option value={6}>Anker</option>
                    <option value={7}>ASUS</option>
                  </select>
                </div>
              </div>

              {/* Giá niêm yết & Giá khuyến mãi & Tồn kho */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giá bán niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={10000}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Giá gốc gạch ngang</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số lượng tồn kho ban đầu</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.initialStockQuantity}
                    onChange={(e) => setFormData({ ...formData, initialStockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#009981] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Thông số kỹ thuật */}
              <div className="p-3.5 bg-gray-50 rounded-2xl space-y-3">
                <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] block">
                  Thông số phần cứng kỹ thuật
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-0.5">Vi xử lý (Chipset)</label>
                    <input
                      type="text"
                      value={formData.chipset || ''}
                      onChange={(e) => setFormData({ ...formData, chipset: e.target.value })}
                      placeholder="VD: Snapdragon 8 Gen 3"
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Dung lượng RAM</label>
                    <input
                      type="text"
                      value={formData.ramCapacity || ''}
                      onChange={(e) => setFormData({ ...formData, ramCapacity: e.target.value })}
                      placeholder="VD: 12GB"
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Bộ nhớ trong (ROM)</label>
                    <input
                      type="text"
                      value={formData.storageCapacity || ''}
                      onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })}
                      placeholder="VD: 256GB"
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-0.5">Màn hình</label>
                    <input
                      type="text"
                      value={formData.screenSpecs || ''}
                      onChange={(e) => setFormData({ ...formData, screenSpecs: e.target.value })}
                      placeholder="VD: 6.8 inch AMOLED 120Hz"
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Dung lượng Pin & Sạc</label>
                    <input
                      type="text"
                      value={formData.batteryCapacity || ''}
                      onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                      placeholder="VD: 5000mAh, Sạc nhanh 67W"
                      className="w-full bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail URL & Mô tả */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ảnh đại diện sản phẩm (URL)</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 outline-none"
                />
              </div>

              {/* Trạng thái mở bán */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#009981] rounded focus:ring-0"
                  />
                  <span>Mở bán trên sàn ngay (Hiển thị tới khách hàng)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="w-4 h-4 text-[#009981] rounded focus:ring-0"
                  />
                  <span>Gắn huy hiệu HOT</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#009981] hover:bg-[#00826e] text-white font-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang lưu...' : editingProduct ? 'Lưu Thay Đổi' : 'Đăng Bán Sản Phẩm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

