import React, { useState, useEffect } from 'react';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  ShoppingCart,
  Search,
  Camera,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Phone,
  Send,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Award,
  Zap,
  Tag,
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';
import { BrandLogo } from '../auth/components/BrandLogo';
import { HeaderTopBar } from '../../components/layout/HeaderTopBar';
import { MainHeader } from '../../components/layout/MainHeader';
import { TrendingKeywords } from '../../components/layout/TrendingKeywords';
import { AiProductSummary } from '../../components/product/AiProductSummary';
import { productDetailsDatabase, ProductDetailData } from '../../data/productData';
import { useAuth } from '../../context/AuthContext';
import { useCart, CartItemType } from '../../context/CartContext';

export interface ProductDetailProps {
  productId?: string;
  onBackToHome: () => void;
  onOpenCart: () => void;
  onAddToCart?: (item: any) => void;
  onOpenAuth?: (mode: 'login' | 'register', notice?: string) => void;
  onSelectOtherProduct?: (slugOrId: string) => void;
  onOpenAdmin?: () => void;
  onOpenPaymentHistory?: () => void;
  onOpenUserProfile?: (tab?: 'info' | 'smember' | 'security') => void;
}

export const ProductDetailPage: React.FC<ProductDetailProps> = ({
  productId = 'iphone-17-pro-max',
  onBackToHome,
  onOpenCart,
  onAddToCart,
  onOpenAuth,
  onSelectOtherProduct,
  onOpenAdmin,
  onOpenPaymentHistory,
  onOpenUserProfile
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { addToCart } = useCart();

  // 1. Resolve Product Data based on productId or fallback
  const productKey = Object.keys(productDetailsDatabase).find(k => 
    k === productId || 
    productDetailsDatabase[k].id === productId || 
    productDetailsDatabase[k].slug === productId
  ) || 'iphone-17-pro-max';

  const productData: ProductDetailData = productDetailsDatabase[productKey] || productDetailsDatabase['iphone-17-pro-max'];

  // 2. Interactive States
  const [selectedVersion, setSelectedVersion] = useState(productData.versions[0]);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullArticle, setShowFullArticle] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [reviewsList, setReviewsList] = useState(productData.reviews);

  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [activeReviewFilter, setActiveReviewFilter] = useState<'all' | 'photo' | '5' | '4' | '3' | '2' | '1'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state whenever the viewed product changes
  useEffect(() => {
    setSelectedVersion(productData.versions[0]);
    setSelectedColor(productData.colors[0]);
    setReviewsList(productData.reviews);
    setActiveImageIndex(0);
    setShowFullArticle(false);
    setShowFullSpecs(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleAddToCart = () => {
    const item: CartItemType = {
      id: `np-item-${Date.now()}`,
      productId: productData.id,
      name: `${productData.name}`,
      price: selectedVersion.price,
      originalPrice: selectedVersion.originalPrice,
      quantity: 1,
      version: selectedVersion.storage,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      phoneColor: selectedColor.phoneColor,
      imageBgColor: selectedColor.imageBg
    };

    const added = addToCart(item, () => {
      if (onOpenAuth) {
        onOpenAuth('login', 'Vui lòng đăng nhập tài khoản NextPhone để thêm sản phẩm vào giỏ hàng và tích điểm Smember!');
      }
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
    });

    if (added) {
      if (onAddToCart) {
        onAddToCart(item);
      }
      showToast(`Đã thêm ${productData.name} (${selectedVersion.storage}, ${selectedColor.name}) vào giỏ hàng!`);
    }
  };

  const handleBuyNow = () => {
    const item: CartItemType = {
      id: `np-item-${Date.now()}`,
      productId: productData.id,
      name: `${productData.name}`,
      price: selectedVersion.price,
      originalPrice: selectedVersion.originalPrice,
      quantity: 1,
      version: selectedVersion.storage,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      phoneColor: selectedColor.phoneColor,
      imageBgColor: selectedColor.imageBg
    };

    const added = addToCart(item, () => {
      if (onOpenAuth) {
        onOpenAuth('login', 'Vui lòng đăng nhập tài khoản NextPhone để tiến hành mua ngay!');
      }
      showToast('Vui lòng đăng nhập để tiến hành mua ngay!');
    });

    if (added) {
      if (onAddToCart) {
        onAddToCart(item);
      }
      onOpenCart();
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: 'Khách hàng NextPhone',
      avatarColor: 'bg-[#009981]',
      timeAgo: 'Vừa xong',
      rating: selectedRating,
      comment: newComment.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewComment('');
    showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!');
    setShowReviewModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800 flex flex-col font-['Inter',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005944] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Global Header Sections (Matches Home Page & Reference Mockup) */}
      <HeaderTopBar />
      <MainHeader 
        onOpenAuth={(mode?: 'login' | 'register', notice?: string) => onOpenAuth?.(mode || 'login', notice)} 
        onOpenCart={onOpenCart} 
        onGoToHome={onBackToHome}
        onOpenAdmin={onOpenAdmin}
        onOpenPaymentHistory={onOpenPaymentHistory}
        onOpenUserProfile={onOpenUserProfile}
      />
      <TrendingKeywords />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-4 space-y-6 flex-1 w-full">
        {/* Dynamic Breadcrumb based on productData */}
        <nav className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
          <button onClick={onBackToHome} className="hover:text-[#009981] px-2 py-1 bg-white border border-gray-200 rounded-lg">
            Trang chủ
          </button>
          <span>›</span>
          <span className="hover:text-[#009981] cursor-pointer px-2 py-1 bg-white border border-gray-200 rounded-lg">
            {productData.category}
          </span>
          <span>›</span>
          <span className="hover:text-[#009981] cursor-pointer px-2 py-1 bg-white border border-gray-200 rounded-lg">
            {productData.brand}
          </span>
          <span>›</span>
          <span className="px-2 py-1 bg-[#009981] text-white rounded-lg font-bold truncate max-w-sm">
            {productData.name}
          </span>
        </nav>

        {/* Dynamic Product Title */}
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {productData.name.replace(/256GB|128GB|Công suất 65W/g, selectedVersion.storage)}
        </h1>

        {/* HERO SECTION: Gallery (Left) & Pricing/Variants (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Media Viewer & Color Swatches */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow hover:scale-110 active:scale-95 flex items-center justify-center transition-all"
                title="Thêm vào yêu thích"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
              </button>

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : productData.colors.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:bg-[#009981] hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev < productData.colors.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-600 hover:bg-[#009981] hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Interactive Phone Render customized with selected color & product attributes */}
              <div className="relative w-56 h-80 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div 
                  style={{ backgroundColor: selectedColor.phoneColor }} 
                  className="w-48 h-72 rounded-[40px] shadow-2xl border-4 border-slate-700/50 p-2 flex flex-col justify-between relative"
                >
                  {/* Camera Plateau */}
                  <div className="w-24 h-24 bg-black/40 backdrop-blur-md rounded-3xl p-2 grid grid-cols-2 gap-1.5 shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-900"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-900"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-900"></div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-white/70 shadow-sm mx-auto my-auto"></div>
                  </div>

                  {/* Brand signature */}
                  <div className="text-center">
                    <span className="text-xs font-black tracking-wider text-white/70 uppercase">
                      {productData.brand}
                    </span>
                  </div>

                  <div className="text-center text-[8px] font-mono tracking-widest text-white/40 font-bold">
                    NEXTPHONE 5G
                  </div>
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="text-center py-2 text-xs font-semibold text-gray-500">
              <span className="text-[#009981] font-bold cursor-pointer hover:underline">
                Xem tất cả hình ảnh
              </span>{' '}
              (1/{productData.colors.length + 5})
            </div>

            {/* Color Thumbnails matching specific product */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-2">
              {productData.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                    selectedColor.id === color.id
                      ? 'border-[#009981] bg-emerald-50/50 ring-1 ring-[#009981]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    style={{ backgroundColor: color.hex }} 
                    className="w-7 h-7 rounded-lg shadow-sm mx-auto border border-white"
                  />
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">
                    {color.name}
                  </span>
                </button>
              ))}

              {/* Quick Jump Buttons */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById('ai-summary-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-center transition-all shadow-sm group"
                title="Xem tóm tắt nhanh bằng AI"
              >
                <Sparkles className="w-5 h-5 text-[#009981] group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-extrabold text-[#007f66] leading-tight">AI Tóm tắt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('specs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-center transition-all"
              >
                <Layers className="w-5 h-5 text-gray-600" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Thông số</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('article-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-center transition-all"
              >
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Bài viết</span>
              </button>
            </div>

            {/* Cam kết sản phẩm */}
            <div className="w-full mt-5 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black text-red-600 uppercase tracking-wider text-center mb-3">
                CAM KẾT CHẤT LƯỢNG NEXTPHONE
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#009981] flex-shrink-0" />
                  <span>Chính hãng {productData.brand} 100% nguyên seal</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-[#009981] flex-shrink-0" />
                  <span>1 đổi 1 trong 30 ngày nếu lỗi NSX</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <Award className="w-4 h-4 text-[#009981] flex-shrink-0" />
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <Truck className="w-4 h-4 text-[#009981] flex-shrink-0" />
                  <span>Miễn phí giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Price, Versions, Trade-in & Action Buttons */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-5">
            {/* Price Bar */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#e11d48]">
                    {formatPrice(selectedVersion.price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through font-medium">
                    {formatPrice(selectedVersion.originalPrice)}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#009981] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{productData.installmentText}</span>
                </p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <span>SKU: <strong className="text-gray-700 font-mono">{productData.sku}</strong></span>
              </div>
            </div>

            {/* 1. Dynamic Version Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                Lựa chọn phiên bản
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {productData.versions.map((ver) => {
                  const isSelected = selectedVersion.id === ver.id;
                  return (
                    <button
                      key={ver.id}
                      type="button"
                      onClick={() => setSelectedVersion(ver)}
                      className={`relative p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#009981] bg-emerald-50/40 ring-1 ring-[#009981]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#009981] rounded-full text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="font-extrabold text-xs text-gray-900">{ver.storage}</div>
                      <div className="text-[11px] font-bold text-red-600 mt-0.5">
                        {formatPrice(ver.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dynamic Color Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                Lựa chọn màu và xem địa chỉ còn hàng
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {productData.colors.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#009981] bg-emerald-50/40 ring-1 ring-[#009981]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#009981] rounded-full text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div 
                        style={{ backgroundColor: color.hex }} 
                        className="w-5 h-7 rounded shadow-inner border border-black/10 flex-shrink-0"
                      />
                      <div className="text-left leading-tight">
                        <div className="text-xs font-bold text-gray-800">{color.name}</div>
                        <div className="text-[10px] font-bold text-red-600">{formatPrice(selectedVersion.price)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Member Price & Trade-in Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-200/60">
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                  <span>Mức giá dành riêng cho <strong>MEMBER</strong></span>
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-xl font-black text-[#009981]">
                  {formatPrice(Math.round(selectedVersion.price * (1 - productData.memberDiscountPercent / 100)))}
                </div>
                <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span>+{Math.round(selectedVersion.price * 0.002).toLocaleString('vi-VN')} đ Điểm thưởng</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-0 sm:pl-4 space-y-1">
                <div className="text-[11px] font-semibold text-gray-600">
                  Hoặc Thu cũ lên đời chỉ từ
                </div>
                <div className="text-xl font-black text-gray-900">
                  {formatPrice(Math.max(0, selectedVersion.price - productData.tradeInDiscount))}
                </div>
                <div className="text-[11px] font-semibold text-red-600">
                  Trợ giá đến <strong>{formatPrice(productData.tradeInDiscount)}</strong>
                </div>
                <button 
                  type="button" 
                  onClick={() => showToast(`Thẩm định máy cũ: Trợ giá thêm ${formatPrice(productData.tradeInDiscount)} khi lên đời ${productData.name}!`)}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Định giá ngay</span>
                  <span>︾</span>
                </button>
              </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  title="Thêm vào giỏ hàng"
                  className="w-14 h-14 rounded-2xl border-2 border-red-500 text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm transition-all active:scale-95 flex-shrink-0"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99] flex flex-col items-center justify-center"
                >
                  <span className="text-base font-black uppercase tracking-wide">MUA NGAY</span>
                  <span className="text-[10px] text-rose-100 font-medium">(Giao tận nhà hoặc nhận tại cửa hàng)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => showToast('Đang mở cổng đăng ký Trả góp 0% duyệt hồ sơ trong 10 phút!')}
                  className="py-2.5 px-3 bg-[#00826e] hover:bg-[#005944] text-white rounded-xl shadow transition-all active:scale-95 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-xs font-black uppercase">TRẢ GÓP 0%</span>
                  <span className="text-[9px] text-emerald-100">Không phí - Duyệt nhanh 10p</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Đang mở cổng Trả góp thẻ Visa/Mastercard/JCB!')}
                  className="py-2.5 px-3 bg-[#00826e] hover:bg-[#005944] text-white rounded-xl shadow transition-all active:scale-95 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-xs font-black uppercase">TRẢ GÓP QUA THẺ</span>
                  <span className="text-[9px] text-emerald-100">(Visa, Mastercard, JCB)</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              💳 <strong>Ưu đãi thanh toán độc quyền NextPhone:</strong> Giảm thêm 500.000 ₫ qua VNPAY / Hoàn tiền tới 18 triệu qua thẻ Max Card.
            </div>
          </div>
        </div>

        {/* AI PRODUCT HIGHLIGHTS SUMMARY WIDGET */}
        <div id="ai-summary-section" className="w-full">
          <AiProductSummary product={productData} />
        </div>

        {/* SECTION 2: THÔNG TIN SẢN PHẨM & BẢNG THÔNG SỐ KỸ THUẬT (Dynamic per product) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: THÔNG TIN BÀI VIẾT (7 Cols) */}
          <div id="article-section" className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#009981]" />
              <span>THÔNG TIN CHI TIẾT SẢN PHẨM</span>
            </h2>

            {/* Table of Contents */}
            <div className="bg-[#f8fafc] border border-gray-200/80 rounded-2xl p-4 text-xs space-y-2">
              <h3 className="font-extrabold text-gray-900">Nội dung chính</h3>
              <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
                {productData.article.toc.map((heading, idx) => (
                  <li key={idx} className="hover:text-[#009981] cursor-pointer">
                    {heading}
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Content */}
            <div className={`text-xs text-gray-700 leading-relaxed space-y-3 relative ${!showFullArticle ? 'max-h-60 overflow-hidden' : ''}`}>
              {productData.article.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {!showFullArticle && (
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFullArticle(!showFullArticle)}
              className="w-full py-2.5 border border-gray-200 hover:border-[#009981] text-[#009981] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{showFullArticle ? 'THU GỌN BÀI VIẾT' : 'XEM TOÀN BỘ BÀI VIẾT'}</span>
              {showFullArticle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* RIGHT: THÔNG SỐ KỸ THUẬT (5 Cols) */}
          <div id="specs-section" className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#009981]" />
              <span>THÔNG SỐ KỸ THUẬT</span>
            </h2>

            <div className="border border-gray-100 rounded-2xl overflow-hidden text-xs">
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <span className="font-bold text-gray-700">Độ phân giải camera</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.camera}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-gray-700">Hệ điều hành</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.os}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <span className="font-bold text-gray-700">Bộ nhớ trong</span>
                  <span className="col-span-2 text-gray-800 font-semibold">{selectedVersion.storage}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-gray-700">Mạng di động</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.network}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <span className="font-bold text-gray-700">Số khe SIM</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.sim}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-gray-700">Vi xử lý</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.chipset}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <span className="font-bold text-gray-700">Công nghệ màn hình</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.screenTech}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-bold text-gray-700">Độ phân giải</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.resolution}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                  <span className="font-bold text-gray-700">Kích thước màn hình</span>
                  <span className="col-span-2 text-gray-800">{productData.specs.screenSize}</span>
                </div>

                {showFullSpecs && (
                  <>
                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-bold text-gray-700">Pin & Sạc</span>
                      <span className="col-span-2 text-gray-800">{productData.specs.batteryAndCharging}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 bg-gray-50/50">
                      <span className="font-bold text-gray-700">Chất liệu khung</span>
                      <span className="col-span-2 text-gray-800">{productData.specs.material}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 bg-white">
                      <span className="font-bold text-gray-700">Cổng kết nối</span>
                      <span className="col-span-2 text-gray-800">{productData.specs.ports}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullSpecs(!showFullSpecs)}
              className="w-full py-2.5 border border-gray-200 hover:border-[#009981] text-[#009981] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{showFullSpecs ? 'THU GỌN CẤU HÌNH' : 'XEM CẤU HÌNH CHI TIẾT'}</span>
              {showFullSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* SECTION 3: SO SÁNH SẢN PHẨM TƯƠNG TỰ */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
              SO SÁNH SẢN PHẨM TƯƠNG TỰ
            </h2>

            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm cần so sánh..."
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#009981]"
              />
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#009981] text-white p-1 rounded-lg hover:bg-[#00826e]">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {productData.comparisons.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-3 border border-gray-100 hover:border-[#009981] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="h-36 flex items-center justify-center bg-gray-50 rounded-xl p-2 mb-2">
                  <div 
                    style={{ backgroundColor: prod.phoneColor }} 
                    className="w-20 h-32 rounded-2xl shadow border-2 border-slate-700/50 flex flex-col justify-between p-1"
                  >
                    <div className="w-6 h-1 bg-black rounded-full mx-auto" />
                    <div className="w-4 h-4 rounded-full bg-white/30 mx-auto" />
                    <div className="text-[6px] text-center text-white/50 font-bold">5G</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                    {prod.name}
                  </h4>

                  <div className="space-y-0.5">
                    <div className="text-sm font-black text-red-600">
                      {formatPrice(prod.price)}
                    </div>
                    {prod.originalPrice && (
                      <div className="text-[10px] text-gray-400 line-through">
                        {formatPrice(prod.originalPrice)}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-500">
                      Giá lên đời từ: <strong className="text-red-600">{formatPrice(prod.tradeInPrice)}</strong>
                    </div>
                  </div>

                  {prod.saved && (
                    <div className="bg-emerald-50 text-[#009981] text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block">
                      Đã tiết kiệm {prod.saved}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectOtherProduct) {
                      onSelectOtherProduct(prod.name.toLowerCase().includes('samsung') ? 'samsung-galaxy-a37-5g' : 'oppo-find-x9s');
                    }
                    showToast(`Chuyển sang so sánh chi tiết: ${prod.name}`);
                  }}
                  className="mt-3 w-full py-1.5 border border-dashed border-red-400 text-red-600 hover:bg-red-50 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Xem chi tiết máy này</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: ĐÁNH GIÁ VỀ SẢN PHẨM & BÌNH LUẬN KHÁCH HÀNG */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-6">
          <div className="border-l-4 border-[#009981] pl-3">
            <h2 className="text-lg font-black text-gray-900">
              Đánh giá thực tế về {productData.name}
            </h2>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-[#fafafa] p-6 rounded-2xl border border-gray-100">
            <div className="sm:col-span-4 text-center sm:border-r border-gray-200 sm:pr-6 space-y-2">
              <div className="text-5xl font-black text-gray-900 tracking-tight">{productData.rating}</div>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <div className="text-xs text-gray-500 font-medium">{productData.reviewCount} người đã đánh giá</div>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="mt-2 px-5 py-2 bg-[#009981] hover:bg-[#00826e] text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Đánh giá sản phẩm này
              </button>
            </div>

            <div className="sm:col-span-8 space-y-2 text-xs">
              {productData.starBreakdown.map((row) => (
                <div key={row.star} className="flex items-center gap-3">
                  <span className="w-8 flex items-center gap-1 font-bold text-gray-700">
                    {row.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${row.pct}%` }} 
                      className="h-full bg-[#009981] rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="w-10 text-right font-semibold text-gray-500">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Comment Form */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#009981]" />
              <span>Bình luận & Đặt câu hỏi về {productData.name}</span>
            </h3>

            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Nhập câu hỏi hoặc cảm nhận của bạn về ${productData.name}...`}
                className="w-full p-3.5 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs focus:outline-none focus:bg-white focus:border-[#009981] transition-all resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => showToast('Tính năng đính kèm ảnh: Bạn có thể tải lên tối đa 5 hình chụp thực tế.')}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#009981] font-semibold p-1"
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span>📷 Thêm tối đa 5 ảnh chụp thực tế</span>
                </button>

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-6 py-2.5 bg-[#009981] hover:bg-[#00826e] disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Gửi bình luận</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Reviews Thread List */}
          <div className="divide-y divide-gray-100 space-y-4 pt-2">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${rev.avatarColor || 'bg-slate-600'} text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm`}>
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{rev.author}</div>
                      <div className="text-[10px] text-gray-400">{rev.timeAgo}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-800 pl-10 leading-relaxed font-medium">
                  {rev.comment}
                </p>

                {rev.reply && (
                  <div className="ml-10 mt-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#009981] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        {rev.reply.role}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{rev.reply.author}</span>
                      <span className="text-[10px] text-gray-400">· {rev.reply.timeAgo}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {rev.reply.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Left "So sánh" Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => showToast(`Đang mở bảng so sánh cho ${productData.name}!`)}
          className="flex items-center gap-2 bg-[#00826e] hover:bg-[#005944] text-white px-4 py-2.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-emerald-300"
        >
          <Layers className="w-4 h-4 text-emerald-200" />
          <span className="text-xs font-bold">So sánh ({productData.comparisons.length})</span>
        </button>
      </div>

      {/* Floating Bottom Right "CHAT NGAY" Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => showToast(`NextPhone AI: Bạn cần tư vấn về cấu hình ${productData.name} hay chương trình trả góp?`)}
          className="flex items-center gap-2.5 bg-[#006e57] hover:bg-[#005944] text-white px-4 py-2.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 border-2 border-white/90"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#006e57] font-black text-xs">
            🤖
          </div>
          <span className="text-xs font-black tracking-wide">CHAT NGAY</span>
        </button>
      </div>

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">Đánh giá {productData.name}</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-600">Bạn đánh giá trải nghiệm sản phẩm này bao nhiêu sao?</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= selectedRating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nhận xét của bạn về camera, thời lượng pin, tốc độ máy..."
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:bg-white focus:border-[#009981]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#009981] hover:bg-[#00826e] text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-400 mt-12">
        © 2026 NextPhone.vn - Hệ thống bán lẻ công nghệ & điện thoại chính hãng hàng đầu Việt Nam.
      </footer>
    </div>
  );
};
