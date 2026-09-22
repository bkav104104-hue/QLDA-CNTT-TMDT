import React from 'react';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0b0f19] via-[#111827] to-[#1e293b] rounded-2xl overflow-hidden shadow-md text-white relative min-h-[220px] md:min-h-[260px] flex items-center justify-between p-6 md:p-8 border border-gray-800">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#009981]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Banner Text Info */}
      <div className="relative z-10 max-w-md space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
          <Zap className="w-3 h-3 fill-white" />
          SIÊU PHẨM MỚI RA MẮT
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Redmi Note 14
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 font-semibold">
          8GB/128GB • Camera 108MP Siêu Nét • Sạc nhanh 45W
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-xs text-gray-400">Giá chỉ từ:</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#36e2b6]">
            4.790.000 ₫
          </span>
          <span className="text-xs text-gray-400 line-through">5.490.000 ₫</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => alert('Chi tiết sản phẩm Redmi Note 14')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#009981] to-[#00b094] hover:from-[#00826e] hover:to-[#009981] text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            MUA NGAY
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <div className="text-[10px] text-gray-400 border border-gray-700 px-2.5 py-2 rounded-xl flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#36e2b6]" />
            Bảo hành 18 tháng chính hãng
          </div>
        </div>
      </div>

      {/* Right Hero Image (Smartphone Mockup with glowing dynamic back) */}
      <div className="relative z-10 hidden sm:flex items-center justify-center pr-2">
        <div className="relative w-44 h-56 flex items-center justify-center">
          {/* Main phone front */}
          <div className="w-28 h-52 bg-white rounded-3xl p-1.5 shadow-2xl border border-gray-400 transform -rotate-12 transition-transform hover:rotate-0 duration-300">
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 rounded-2xl flex flex-col justify-between p-2 overflow-hidden relative">
              <div className="w-8 h-2 bg-black rounded-full mx-auto"></div>
              <div className="text-center my-auto">
                <p className="text-[8px] font-black text-gray-800">Redmi Note 14</p>
                <p className="text-[10px] font-black text-[#009981]">108MP</p>
              </div>
              <div className="text-[6px] text-gray-400 text-center">NEXTPHONE</div>
            </div>
          </div>

          {/* Secondary phone back side */}
          <div className="absolute right-0 w-28 h-52 bg-gradient-to-b from-gray-900 to-black rounded-3xl p-2 shadow-2xl border border-gray-700 transform rotate-12 transition-transform hover:rotate-6 duration-300">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/50 bg-gray-800 mx-auto mt-2 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-blue-400/80 border border-white"></div>
            </div>
            <div className="w-5 h-5 rounded-full border border-gray-600 bg-gray-800 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

