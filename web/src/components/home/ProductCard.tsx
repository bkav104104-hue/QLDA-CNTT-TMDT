import React from 'react';
import { ShoppingCart, Check, PhoneCall } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  ram: string;
  storage?: string;
  chipset?: string;
  battery?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  installment?: string;
  memberPrice: number;
  imageBgColor?: string;
  inStock?: boolean;
  phoneColor?: string;
}

interface ProductCardProps {
  product: ProductItem;
  onAddToCart?: (product: ProductItem) => void;
  onSelectProduct?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelectProduct }) => {
  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-gray-200/75 hover:border-[#009981] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative">
      {/* Top Specs Badges */}
      <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-gray-500 mb-2">
        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
          {product.ram}
        </span>
        {product.storage && (
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            {product.storage}
          </span>
        )}
        {product.battery && (
          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 hidden sm:inline">
            {product.battery}
          </span>
        )}
      </div>

      {/* Product Image Representation */}
      <div 
        onClick={() => onSelectProduct?.(product)}
        className="relative w-full h-40 flex items-center justify-center my-2 select-none cursor-pointer"
      >
        {/* Styled Phone Render with dual preview (front & back) */}
        <div className="relative flex items-center justify-center">
          {/* Back body preview */}
          <div
            style={{ backgroundColor: product.phoneColor || '#1e293b' }}
            className="w-20 h-36 rounded-2xl shadow-md border-2 border-gray-200 flex flex-col items-start p-1.5 transform -translate-x-3 -rotate-6 transition-transform group-hover:-translate-x-4 group-hover:-rotate-12 duration-300"
          >
            {/* Camera module */}
            <div className="w-6 h-10 bg-black/80 rounded-xl p-1 flex flex-col items-center justify-around shadow-inner">
              <div className="w-3 h-3 rounded-full bg-blue-400/80 border border-white"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div>
            </div>
          </div>

          {/* Front screen preview */}
          <div className="w-20 h-36 bg-gray-900 rounded-2xl shadow-xl border-2 border-gray-700 p-1 flex flex-col justify-between transform translate-x-2 transition-transform group-hover:translate-x-3 duration-300 z-10">
            {/* Notch / Dynamic Island */}
            <div className="w-5 h-1.5 bg-black rounded-full mx-auto"></div>
            {/* Screen Wallpaper */}
            <div
              style={{
                background: `linear-gradient(135deg, ${product.imageBgColor || '#e0f2fe'} 0%, #ffffff 100%)`
              }}
              className="w-full h-24 rounded-lg flex items-center justify-center text-[7px] font-bold text-gray-700 shadow-inner"
            >
              <div className="text-center">
                <span className="block text-[6px] text-gray-400">AMOLED</span>
                <span className="font-extrabold text-[#009981]">120Hz</span>
              </div>
            </div>
            <div className="text-[5px] text-center text-gray-400 font-bold">NEXTPHONE</div>
          </div>
        </div>

        {/* Discount Badge */}
        {product.discountPercent && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Name */}
      <h3 
        onClick={() => onSelectProduct?.(product)}
        className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 mt-1 min-h-[38px] group-hover:text-[#009981] transition-colors cursor-pointer"
      >
        {product.name}
      </h3>

      {/* Main Pricing & Installment */}
      <div className="mt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm md:text-base font-extrabold text-[#e11d48]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {product.installment ? (
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Hoặc <span className="font-semibold text-gray-700">{product.installment}</span>
          </p>
        ) : (
          <div className="h-4"></div>
        )}
      </div>

      {/* Member Price Box */}
      <div className="mt-2 bg-[#f0f9f6] border border-[#009981]/30 rounded-xl p-2">
        <p className="text-[10px] font-semibold text-[#007f66]">
          NextPhone Member chỉ từ
        </p>
        <p className="text-xs md:text-sm font-black text-[#009981]">
          {formatPrice(product.memberPrice)}
        </p>
      </div>

      {/* Bank & Payment Incentives */}
      <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-1">
          <span className="px-1 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-bold rounded border border-blue-200">
            VIB
          </span>
          <span className="px-1 py-0.5 bg-orange-50 text-orange-700 text-[8px] font-bold rounded border border-orange-200">
            ShopeePay
          </span>
          <span className="px-1 py-0.5 bg-purple-50 text-purple-700 text-[8px] font-bold rounded border border-purple-200">
            TPBank
          </span>
          <span className="px-1 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded border border-green-200">
            VPBank
          </span>
        </div>
        <p className="text-[10px] text-gray-500 line-clamp-1">
          Mở thẻ Max Card nhận ưu đãi hoàn tiền tới 18 triệu...
        </p>
        <p className="text-[9px] font-bold text-[#e11d48]">
          + 2 Ưu đãi khác
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[#009981] font-semibold text-[11px]">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Sẵn hàng</span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="flex items-center gap-1 text-[#e11d48] hover:text-white hover:bg-[#e11d48] px-2 py-1 rounded-lg border border-[#e11d48]/40 hover:border-[#e11d48] font-bold text-[11px] transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Mua ngay</span>
        </button>
      </div>
    </div>
  );
};

