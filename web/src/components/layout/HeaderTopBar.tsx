import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Headphones, 
  Truck, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const HeaderTopBar: React.FC = () => {
  return (
    <div className="w-full bg-[#dcf3ee] text-[#006e57] text-xs font-semibold border-b border-[#c2ece3] py-1.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left arrow */}
        <button 
          type="button" 
          aria-label="Previous promo"
          className="text-[#008f72] hover:text-[#005944] p-0.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 4 Core USPs */}
        <div className="flex items-center justify-around flex-1 px-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#009981] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#009981]" />
            </div>
            <span className="tracking-tight uppercase font-bold text-[11px]">SẢN PHẨM CHÍNH HÃNG</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#009981] flex items-center justify-center">
              <RefreshCw className="w-3 h-3 text-[#009981]" />
            </div>
            <span className="tracking-tight uppercase font-bold text-[11px]">CAM KẾT LỖI ĐỔI LIỀN (*)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#009981] flex items-center justify-center">
              <Headphones className="w-3 h-3 text-[#009981]" />
            </div>
            <span className="tracking-tight uppercase font-bold text-[11px]">HOTLINE 1900.8888</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#009981] flex items-center justify-center">
              <Truck className="w-3.5 h-3.5 text-[#009981]" />
            </div>
            <span className="tracking-tight uppercase font-bold text-[11px]">MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC</span>
          </div>
        </div>

        {/* Right arrow */}
        <button 
          type="button" 
          aria-label="Next promo"
          className="text-[#008f72] hover:text-[#005944] p-0.5 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

