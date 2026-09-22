import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Store, 
  Check, 
  ChevronDown, 
  ShieldAlert, 
  Sparkles,
  Phone,
  CheckCircle2,
  ShoppingCart,
  QrCode,
  CreditCard,
  Truck,
  Loader2,
  Receipt
} from 'lucide-react';
import { BrandLogo } from '../auth/components/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useCart, CartItemType } from '../../context/CartContext';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { PaymentHistoryModal } from '../../components/payment/PaymentHistoryModal';
import { apiClient } from '../../services/apiClient';

interface CartPageProps {
  onBackToHome: () => void;
  onOpenAuth?: (mode?: 'login' | 'register', notice?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onBackToHome, onOpenAuth }) => {
  const { cartItems: items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');

  // Keep form in sync when user logs in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName || '');
      if (!phone) setPhone(user.phoneNumber || '');
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'store'>('store');
  const [selectedCity, setSelectedCity] = useState('Hà Nội');
  const [selectedStore, setSelectedStore] = useState('122 Thái Hà, Đống Đa, Hà Nội');
  const [homeAddress, setHomeAddress] = useState('');
  const [note, setNote] = useState('');
  const [transferData, setTransferData] = useState(false);
  const [vatInvoice, setVatInvoice] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Payment Gateway states
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'COD' | 'QR_CODE' | 'CREDIT_CARD'>('QR_CODE');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderCode, setCurrentOrderCode] = useState('');
  const [paidMethodName, setPaidMethodName] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [savedOrderAmount, setSavedOrderAmount] = useState<number>(0);
  const [savedTransactionCode, setSavedTransactionCode] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  // Pricing calculations
  const subTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalPayment = Math.max(0, subTotal - discountAmount);

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'NEXT100K') {
      setDiscountAmount(100000);
      setCouponApplied('Mã NEXT100K: Giảm 100.000 ₫ thành công!');
    } else if (code === 'EDU5') {
      const disc = Math.round(subTotal * 0.05);
      setDiscountAmount(disc);
      setCouponApplied(`Mã EDU5: Giảm 5% (${formatPrice(disc)}) thành công!`);
    } else {
      alert('Mã giảm giá không hợp lệ. Hãy thử: NEXT100K hoặc EDU5');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    if (!isAuthenticated) {
      if (onOpenAuth) {
        onOpenAuth('login', 'Vui lòng đăng nhập tài khoản NextPhone để hoàn tất đặt hàng!');
      }
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại nhận hàng!');
      return;
    }
    if (deliveryMethod === 'home' && !homeAddress.trim()) {
      alert('Vui lòng nhập địa chỉ nhận hàng tận nơi!');
      return;
    }

    if (user?.roleName === 'Admin' || user?.role === 'Admin') {
      alert('Tài khoản Quản trị viên (Admin) không được phép tạo đơn đặt hàng trên sàn NextPhone. Vui lòng đăng xuất và sử dụng tài khoản Khách hàng!');
      return;
    }

    const finalAmount = totalPayment;
    setSavedOrderAmount(finalAmount);
    setSavedTransactionCode(null);

    setIsSubmittingOrder(true);
    let newOrderCode = 'NP-' + Math.floor(100000 + Math.random() * 900000);
    try {
      const orderRes = await apiClient.post('/orders', {
        receiverName: fullName.trim(),
        receiverPhone: phone.trim(),
        receiverEmail: email.trim() || undefined,
        deliveryMethod,
        shippingAddress: deliveryMethod === 'store' ? selectedStore : homeAddress.trim(),
        paymentMethod: selectedPaymentMethod,
        notes: note.trim() || undefined,
        couponCode: couponApplied ? couponCode.trim() : undefined,
        transferData,
        vatInvoice,
        items: items.map(item => ({
          productVariantId: Number(item.productId) || 1,
          quantity: item.quantity,
          customPrice: item.price,
          productName: item.name,
          variantSummary: `${item.version || ''} ${item.colorName ? `- ${item.colorName}` : ''}`.trim()
        }))
      });
      if (orderRes.data?.data?.orderCode) {
        newOrderCode = orderRes.data.data.orderCode;
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert(err.response?.data?.message || 'Tài khoản Quản trị viên không thể tạo đơn đặt hàng!');
        setIsSubmittingOrder(false);
        return;
      }
      console.warn('Backend order created fallback:', err);
    } finally {
      setIsSubmittingOrder(false);
    }

    setCurrentOrderCode(newOrderCode);

    if (selectedPaymentMethod === 'COD') {
      setOrderSuccess(newOrderCode);
      setPaidMethodName('Thanh toán khi nhận hàng (COD)');
      clearCart();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (info: { method: string; transactionCode?: string }) => {
    setShowPaymentModal(false);
    setOrderSuccess(currentOrderCode);
    setPaidMethodName(info.method === 'QR_CODE' ? 'Chuyển khoản VietQR' : 'Thẻ tín dụng quốc tế');
    if (info.transactionCode) {
      setSavedTransactionCode(info.transactionCode);
    }
    clearCart();
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6f8] text-gray-800 flex flex-col justify-between">
      {/* 1. Top Promotion Notification Strip */}
      <div className="w-full bg-white border-b border-gray-100 py-1.5 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
        <span className="text-gray-800">
          <strong>[Khuyến mại]</strong> Thu cũ giá cao toàn bộ sản phẩm - Trợ giá tốt nhất
        </span>
        <button 
          type="button" 
          onClick={() => alert('Chương trình Thu cũ lên đời: Trợ giá thêm 1.000.000 đ cho khách hàng!')}
          className="bg-[#e11d48] hover:bg-[#be123c] text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
        >
          Xem chi tiết
        </button>
      </div>

      {/* 2. Top Dark Green Sub-Nav */}
      <div className="w-full bg-[#004838] text-white text-xs py-2 px-4 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-medium text-emerald-100">
          <div className="flex items-center gap-5">
            <span className="cursor-pointer hover:text-white">Bản mobile</span>
            <span className="cursor-pointer hover:text-white">Giới thiệu</span>
            <span className="cursor-pointer hover:text-white">Sản phẩm đã xem</span>
            <span className="cursor-pointer hover:text-white">Trung tâm bảo hành</span>
            <span className="cursor-pointer hover:text-white">Hệ thống 118 siêu thị</span>
            <span className="cursor-pointer hover:text-white">Tuyển dụng</span>
            <span className="cursor-pointer hover:text-white">Tra cứu đơn hàng</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-white">
            <Phone className="w-3.5 h-3.5 text-[#36e2b6]" />
            <span>Hotline: 1900.8888</span>
          </div>
        </div>
      </div>

      {/* Main Cart & Checkout Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {/* Brand Logo & Back Link & Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200/70">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-semibold text-gray-600 hover:text-[#009981] flex items-center gap-1.5 transition-colors p-1"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div title="Về trang chủ NextPhone">
              <BrandLogo size="sm" onClick={onBackToHome} />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Giỏ hàng
          </h1>
        </div>

        {/* Admin Warning Banner */}
        {(user?.roleName === 'Admin' || user?.role === 'Admin') && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-amber-900 text-sm shadow-sm">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div className="leading-snug">
              <strong className="font-bold">Tài khoản Quản trị viên (Admin):</strong> Bạn đang đăng nhập với quyền Quản trị viên của sàn NextPhone. Quản trị viên không được phép tạo đơn đặt hàng trên sàn. Vui lòng đăng xuất và đăng nhập tài khoản Khách hàng để mua sắm!
            </div>
          </div>
        )}

        {/* Order Success Modal Simulation */}
        {orderSuccess ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-xl text-center space-y-4 border border-emerald-100 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-[#009981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Đặt hàng thành công!</h2>
            <p className="text-sm text-gray-600">
              Cảm ơn quý khách <strong>{fullName}</strong> đã đặt hàng tại <strong>NextPhone</strong>.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-left space-y-2.5">
              <div className="flex items-center justify-between border-b border-emerald-200/70 pb-2">
                <div>
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <p className="text-[#009981] font-mono text-base font-black">{orderSuccess}</p>
                </div>
                {savedTransactionCode && (
                  <div className="text-right">
                    <span className="text-gray-500">Mã giao dịch:</span>
                    <p className="text-gray-900 font-mono text-xs font-bold">{savedTransactionCode}</p>
                  </div>
                )}
              </div>
              <p>Số điện thoại: <strong>{phone}</strong></p>
              <p>Hình thức nhận hàng: <strong>{deliveryMethod === 'store' ? `Nhận tại siêu thị: ${selectedStore}` : `Giao tận nơi: ${homeAddress || 'Địa chỉ nhận hàng'}`}</strong></p>
              <p>Hình thức thanh toán: <strong className="text-gray-900">{paidMethodName || 'Thanh toán khi nhận hàng (COD)'}</strong></p>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-md text-[11px] ${
                  paidMethodName && paidMethodName !== 'Thanh toán khi nhận hàng (COD)'
                    ? 'bg-emerald-100 text-[#007f66]'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {paidMethodName && paidMethodName !== 'Thanh toán khi nhận hàng (COD)' ? '✓ ĐÃ THANH TOÁN ONLINE THÀNH CÔNG' : 'Chờ thanh toán (Thu tiền COD)'}
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-200/70 flex items-center justify-between">
                <span className="font-bold text-gray-700">Tổng thanh toán:</span>
                <strong className="text-red-600 text-base font-black">{formatPrice(savedOrderAmount || totalPayment)}</strong>
              </div>
            </div>
            {paidMethodName === 'Thanh toán khi nhận hàng (COD)' && (
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-[#009981] hover:from-emerald-700 hover:to-[#00826e] text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Thanh toán online ngay qua VietQR / Thẻ tín dụng</span>
              </button>
            )}
            <p className="text-xs text-gray-500">
              Nhân viên NextPhone sẽ liên hệ với quý khách trong vòng 15 phút để xác nhận đơn hàng.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="w-full sm:w-1/2 py-2.5 px-3 bg-white border border-[#009981] text-[#009981] hover:bg-emerald-50 font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-4 h-4" />
                <span>Xem lịch sử thanh toán</span>
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-1/2 py-2.5 px-3 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Tiếp tục mua sắm</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main 2 Columns */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Products List + Price Summary (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {items.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center shadow-sm space-y-4 border border-gray-100">
                  <div className="w-16 h-16 bg-emerald-50 text-[#009981] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingCart className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Giỏ hàng của bạn đang trống</h3>
                    <p className="text-xs text-gray-500 mt-1">Hãy khám phá các mẫu điện thoại và phụ kiện chính hãng tại NextPhone!</p>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="px-6 py-2.5 bg-[#009981] text-white text-xs font-bold rounded-xl hover:bg-[#00826e] transition-all shadow hover:shadow-md active:scale-95"
                  >
                    Khám phá sản phẩm ngay
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-md"
                  >
                    {/* Delete Item Button (Top Right Red Dot / Trash icon) */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      title="Xóa sản phẩm"
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
                    >
                      <span className="text-xs font-bold leading-none">×</span>
                    </button>

                    {/* Color Palette Dots (Left side accent as in image) */}
                    <div className="hidden sm:flex flex-col gap-1.5 justify-center pr-2">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-red-500 bg-red-100 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-purple-500 bg-gradient-to-tr from-purple-500 to-pink-500"></div>
                      <div className="w-5 h-5 rounded-full border border-gray-400 bg-gray-900"></div>
                    </div>

                    {/* Product Image Mockup */}
                    <div className="relative w-28 h-36 flex-shrink-0 flex items-center justify-center">
                      <div className="w-20 h-32 bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-700 p-1 flex flex-col justify-between">
                        <div className="w-5 h-1 bg-black rounded-full mx-auto"></div>
                        <div 
                          style={{ background: item.imageBgColor }} 
                          className="w-full h-20 rounded-lg flex items-center justify-center shadow-inner"
                        >
                          <span className="text-[7px] font-black text-gray-700">NEXT</span>
                        </div>
                        <div className="text-[5px] text-center text-gray-400 font-bold">5G</div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 w-full space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug pr-6">
                        {item.name}
                      </h3>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-[#e11d48]">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-gray-500 font-medium">Số lượng:</span>
                        <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-gray-800 min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Variant Badges (Phiên bản & Màu sắc with dark green border like image) */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {/* Phiên bản */}
                        <div className="flex items-center gap-1.5 border border-[#005944] rounded-lg px-2.5 py-1 bg-white">
                          <span className="text-gray-500 font-medium text-[11px]">Phiên bản:</span>
                          <span className="w-2 h-2 rounded-full bg-[#005944]"></span>
                          <span className="font-bold text-gray-800 text-[11px]">{item.version}</span>
                        </div>

                        {/* Màu sắc */}
                        <div className="flex items-center gap-1.5 border border-[#005944] rounded-lg px-2.5 py-1 bg-white">
                          <span className="text-gray-500 font-medium text-[11px]">Màu sắc:</span>
                          <span className="w-2 h-2 rounded-full bg-[#005944]"></span>
                          <span className="font-bold text-gray-800 text-[11px]">{item.colorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Summary Card Box (Bottom Left as in Image) */}
              {items.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-800">Tổng giá trị:</span>
                    <span className="font-bold text-gray-900">{formatPrice(subTotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#009981]">
                      <span className="font-semibold">Giảm giá voucher:</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                    <span className="text-lg font-black text-[#e11d48]">
                      {formatPrice(totalPayment)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Order Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-black text-gray-900">Thông tin đặt hàng</h2>
                <p className="text-[11px] text-gray-400 italic">
                  Bạn cần nhập đầy đủ các trường thông tin có dấu *
                </p>
              </div>

              {!isAuthenticated && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-[#005944]">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#009981] flex-shrink-0" />
                    <span>Đăng nhập để nhận ưu đãi thành viên và tích điểm Smember!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('login', 'Vui lòng đăng nhập tài khoản NextPhone để tiếp tục thanh toán và tích điểm')}
                    className="px-3 py-1.5 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-xl text-xs flex-shrink-0 transition-colors shadow-sm"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              )}

              <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                {/* Họ và tên */}
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên *"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200/80 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#009981] transition-all"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại *"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200/80 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#009981] transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200/80 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#009981] transition-all"
                  />
                </div>

                {/* Hình thức nhận hàng */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-gray-800">
                    Hình thức nhận hàng
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Nhận tại nhà */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('home')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        deliveryMethod === 'home'
                          ? 'border-[#009981] bg-emerald-50/50 text-[#007f66]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        deliveryMethod === 'home' ? 'border-[#009981]' : 'border-gray-300'
                      }`}>
                        {deliveryMethod === 'home' && <div className="w-2 h-2 rounded-full bg-[#009981]" />}
                      </div>
                      <span>Nhận hàng tại nhà</span>
                    </button>

                    {/* Nhận tại cửa hàng */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('store')}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        deliveryMethod === 'store'
                          ? 'border-[#009981] bg-emerald-50/50 text-[#007f66]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        deliveryMethod === 'store' ? 'border-[#009981]' : 'border-gray-300'
                      }`}>
                        {deliveryMethod === 'store' && <div className="w-2 h-2 rounded-full bg-[#009981]" />}
                      </div>
                      <span>Nhận hàng tại cửa hàng</span>
                    </button>
                  </div>
                </div>

                {/* Nơi nhận hàng Dropdowns */}
                {deliveryMethod === 'store' ? (
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-800">
                      Nơi nhận hàng
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Tỉnh / Thành */}
                      <div className="relative">
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:border-[#009981] cursor-pointer"
                        >
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Chi nhánh cửa hàng */}
                      <div className="relative">
                        <select
                          value={selectedStore}
                          onChange={(e) => setSelectedStore(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:border-[#009981] cursor-pointer"
                        >
                          <option value="122 Thái Hà, Đống Đa, Hà Nội">122 Thái Hà, Đống Đa *</option>
                          <option value="382 Nguyễn Văn Cừ, Long Biên">382 Nguyễn Văn Cừ *</option>
                          <option value="194 Lê Duẩn, Hoàn Kiếm">194 Lê Duẩn *</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Giao tận nhà Address input */
                  <div className="space-y-1 pt-1">
                    <label className="block text-xs font-bold text-gray-800">
                      Địa chỉ nhận hàng tận nơi
                    </label>
                    <input
                      type="text"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                      required={deliveryMethod === 'home'}
                      className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-[#009981]"
                    />
                  </div>
                )}

                {/* Ghi chú */}
                <div>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm về thời gian giao hoặc yêu cầu đặc biệt..."
                    className="w-full px-3.5 py-2.5 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#009981] resize-none"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={transferData}
                      onChange={(e) => setTransferData(e.target.checked)}
                      className="w-4 h-4 rounded text-[#009981] border-gray-300 focus:ring-[#009981]"
                    />
                    <span>Chuyển danh bạ, dữ liệu qua máy mới</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={vatInvoice}
                      onChange={(e) => setVatInvoice(e.target.checked)}
                      className="w-4 h-4 rounded text-[#009981] border-gray-300 focus:ring-[#009981]"
                    />
                    <span>Xuất hóa đơn công ty (Điền email để nhận hóa đơn VAT)</span>
                  </label>
                </div>

                {/* Voucher / Coupon Code */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã giảm giá (Nếu có)"
                      className="flex-1 px-3 py-2 bg-[#f0f2f5] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-[#009981]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#374151] hover:bg-[#1f2937] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Sử dụng
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-[#009981] font-medium mt-1">
                      ✓ {couponApplied}
                    </p>
                  )}
                </div>

                {/* Phương thức thanh toán */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-800">
                    Phương thức thanh toán
                  </label>
                  <div className="space-y-2">
                    {/* VietQR */}
                    <div
                      onClick={() => setSelectedPaymentMethod('QR_CODE')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPaymentMethod === 'QR_CODE'
                          ? 'border-[#009981] bg-emerald-50/50 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selectedPaymentMethod === 'QR_CODE' ? 'bg-[#009981] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <span>Chuyển khoản VietQR</span>
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-[#007f66] text-[9px] font-extrabold rounded">Tự động</span>
                          </p>
                          <p className="text-[10px] text-gray-500">Quét mã QR qua App Ngân hàng bất kỳ</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPaymentMethod === 'QR_CODE' ? 'border-[#009981]' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'QR_CODE' && <div className="w-2 h-2 rounded-full bg-[#009981]" />}
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div
                      onClick={() => setSelectedPaymentMethod('CREDIT_CARD')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPaymentMethod === 'CREDIT_CARD'
                          ? 'border-[#009981] bg-emerald-50/50 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selectedPaymentMethod === 'CREDIT_CARD' ? 'bg-[#009981] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            <span>Thẻ tín dụng quốc tế</span>
                            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[9px] font-extrabold rounded">Visa/Master/JCB</span>
                          </p>
                          <p className="text-[10px] text-gray-500">Bảo mật chuẩn quốc tế 3D-Secure</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPaymentMethod === 'CREDIT_CARD' ? 'border-[#009981]' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'CREDIT_CARD' && <div className="w-2 h-2 rounded-full bg-[#009981]" />}
                      </div>
                    </div>

                    {/* COD */}
                    <div
                      onClick={() => setSelectedPaymentMethod('COD')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPaymentMethod === 'COD'
                          ? 'border-[#009981] bg-emerald-50/50 shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selectedPaymentMethod === 'COD' ? 'bg-[#009981] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-[10px] text-gray-500">Tiền mặt hoặc quẹt thẻ khi nhận máy</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPaymentMethod === 'COD' ? 'border-[#009981]' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-[#009981]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Disclaimer */}
                <div className="text-[10px] text-gray-500 leading-relaxed pt-2 space-y-2">
                  <p>
                    Bằng việc đặt mua hàng, bạn đồng ý với{' '}
                    <a href="#terms" className="text-[#009981] font-medium hover:underline">
                      Điều khoản dịch vụ
                    </a>
                    ,{' '}
                    <a href="#warranty" className="text-[#009981] font-medium hover:underline">
                      Chính sách bảo hành đổi trả
                    </a>{' '}
                    và{' '}
                    <a href="#privacy" className="text-[#009981] font-medium hover:underline">
                      Chính sách xử lý dữ liệu cá nhân
                    </a>{' '}
                    của NextPhone.
                  </p>
                  <p className="bg-amber-50 border border-amber-200/80 rounded-xl p-2 text-amber-800 text-[10px]">
                    ⚠️ <strong>Quý khách lưu ý:</strong> NextPhone bảo vệ thông tin thanh toán trực tuyến 100% bằng mã hóa SSL và chuẩn PCI-DSS.
                  </p>
                </div>

                {/* Big Action Submit Button (Deep green as in image) */}
                <button
                  type="submit"
                  disabled={items.length === 0 || isSubmittingOrder || (user?.roleName === 'Admin' || user?.role === 'Admin')}
                  className={`w-full py-3.5 px-4 font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 ${
                    (user?.roleName === 'Admin' || user?.role === 'Admin')
                      ? 'bg-amber-600 text-white cursor-not-allowed opacity-90'
                      : 'bg-[#006e57] hover:bg-[#005944] text-white hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {(user?.roleName === 'Admin' || user?.role === 'Admin') ? (
                    <span>🛡️ QUẢN TRỊ VIÊN KHÔNG THỂ ĐẶT HÀNG</span>
                  ) : isSubmittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ĐANG XỬ LÝ...</span>
                    </>
                  ) : (
                    <span>
                      {selectedPaymentMethod === 'COD' ? 'XÁC NHẬN VÀ ĐẶT HÀNG' : 'TIẾP TỤC THANH TOÁN ONLINE'}
                    </span>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  {selectedPaymentMethod === 'COD' 
                    ? 'Bạn sẽ thanh toán khi nhân viên giao hàng hoặc tại siêu thị.'
                    : 'Cửa sổ thanh toán bảo mật VietQR hoặc thẻ tín dụng sẽ hiển thị ngay sau khi xác nhận.'}
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setOrderSuccess(currentOrderCode);
            setPaidMethodName('Thanh toán khi nhận hàng (COD)');
            clearCart();
          }}
          orderCode={currentOrderCode}
          amount={savedOrderAmount || totalPayment}
          initialMethod={selectedPaymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'QR_CODE'}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment History Modal */}
      {showHistoryModal && (
        <PaymentHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          initialOrderCode={orderSuccess || currentOrderCode}
        />
      )}

      {/* Floating Zalo Button on Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://zalo.me"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#0068ff] hover:bg-[#0056d6] text-white px-3.5 py-2 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white"
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#0068ff] font-black text-[9px] italic">
            Zalo
          </div>
          <span className="text-[11px] font-bold">TƯ VẤN NGAY</span>
        </a>
      </div>

      {/* Footer info */}
      <footer className="w-full bg-white border-t border-gray-200 py-4 px-4 text-center text-[10px] text-gray-400 mt-12">
        © 2026 NextPhone.vn - Hệ thống thương mại điện tử điện thoại & phụ kiện chính hãng.
      </footer>
    </div>
  );
};

