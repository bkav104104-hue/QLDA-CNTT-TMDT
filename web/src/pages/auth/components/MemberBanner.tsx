import React from 'react';
import { 
  Ticket, 
  GraduationCap, 
  Wallet, 
  Crown, 
  Sparkles, 
  Gift, 
  Truck, 
  RefreshCw, 
  Headphones,
  QrCode,
  Play
} from 'lucide-react';

export const MemberBanner: React.FC = () => {
  const benefits = [
    {
      icon: <Ticket className="w-5 h-5 text-[#009981]" />,
      title: 'Tặng voucher',
      highlight: '100K',
      sub: 'Cho thành viên mới',
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-[#009981]" />,
      title: 'Đặc quyền hạng',
      highlight: 'EDU',
      sub: 'Lên đến 5% giá trị sản phẩm',
    },
    {
      icon: <Wallet className="w-5 h-5 text-[#009981]" />,
      title: 'Trợ giá thu cũ lên đời đến',
      highlight: '100K',
      sub: 'Cho khách hàng mới',
    },
    {
      icon: <Crown className="w-5 h-5 text-[#009981]" />,
      title: 'Hạng thành viên càng cao',
      highlight: 'Chiết khấu',
      sub: 'Sản phẩm càng nhiều',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#009981]" />,
      title: 'Sự kiện riêng dành cho',
      highlight: 'Hội viên',
      sub: 'NextPhone',
    },
    {
      icon: <Gift className="w-5 h-5 text-[#009981]" />,
      title: 'Và vô vàn',
      highlight: 'Ưu đãi',
      sub: 'đang chờ bạn',
    },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#005f4a] via-[#004d3b] to-[#00382b] text-white p-6 md:p-8 flex flex-col justify-between overflow-hidden">
      {/* Decorative background lighting circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#009981]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#00a88c]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-[#003d2e]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-green-200 mb-2">
              NHẬP HỘI
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              NextPhone <span className="text-[#36e2b6]">Member</span>
            </h1>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-[#004737] border border-[#007a5f] px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-emerald-100 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36e2b6] animate-pulse"></span>
              ĐẶC QUYỀN DÀNH RIÊNG CHO BẠN
            </div>
          </div>

          {/* Mascot & Tech Smartphone Illustration */}
          <div className="relative flex-shrink-0 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
            {/* Phone Mockup Frame */}
            <div className="relative w-24 h-40 bg-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl p-1.5 flex flex-col justify-between transform -rotate-6 transition-transform hover:rotate-0 duration-300">
              {/* Dynamic Island */}
              <div className="w-8 h-2 bg-black rounded-full mx-auto mb-1"></div>
              {/* Screen Content */}
              <div className="bg-[#00392c] rounded-xl flex-1 p-1 flex flex-col items-center justify-center text-[7px] text-center font-bold text-emerald-200">
                <span className="text-[6px] tracking-tighter text-gray-300 mb-0.5">NEXTPHONE STORE</span>
                <span className="bg-[#009981] text-white px-1 py-0.5 rounded text-[6px]">SMARTPHONE</span>
                <span className="text-[6px] text-gray-300 mt-0.5">PHỤ KIỆN AI</span>
                <span className="text-[6px] text-emerald-300 font-extrabold mt-1">GIẢM 50%</span>
              </div>
            </div>

            {/* Squirrel Mascot Character */}
            <div className="absolute -left-2 bottom-0 w-28 h-28 flex flex-col items-center select-none filter drop-shadow-xl animate-bounce-subtle">
              <div className="relative w-24 h-24 bg-gradient-to-b from-[#25ba95] to-[#007f66] rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg">
                {/* Mascot Face */}
                <div className="flex flex-col items-center">
                  {/* Cute Ears */}
                  <div className="absolute -top-3 left-2 w-5 h-6 bg-[#006e57] border border-white/40 rounded-t-full transform -rotate-12"></div>
                  <div className="absolute -top-3 right-2 w-5 h-6 bg-[#006e57] border border-white/40 rounded-t-full transform rotate-12"></div>
                  {/* Big Eyes */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-gray-900 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full translate-x-0.5 -translate-y-0.5"></div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-gray-900 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full translate-x-0.5 -translate-y-0.5"></div>
                      </div>
                    </div>
                  </div>
                  {/* Cute Snout & Smile */}
                  <div className="w-6 h-3 bg-emerald-100 rounded-full flex flex-col items-center justify-center -mt-0.5">
                    <div className="w-1.5 h-1 bg-gray-900 rounded-full"></div>
                  </div>
                  {/* Member Card Held by Mascot */}
                  <div className="mt-1 bg-gradient-to-r from-emerald-200 to-white text-[#005944] text-[8px] font-black px-2 py-0.5 rounded shadow border border-emerald-400 flex items-center gap-1">
                    <span>👑</span>
                    <span>NEXT MEMBER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mt-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e8f7f4] flex items-center justify-center mb-1.5">
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">{item.title}</p>
                <p className="text-sm font-extrabold text-[#009981] my-0.5">{item.highlight}</p>
                <p className="text-[10px] text-gray-600 leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/90">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-3.5 h-3.5 text-[#36e2b6]" />
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">Miễn Phí Giao Hàng</p>
              <p className="text-[9px] text-white/70">Toàn quốc nhanh chóng</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-3.5 h-3.5 text-[#36e2b6]" />
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">Ưu Đãi Đổi Trả</p>
              <p className="text-[9px] text-white/70">Trong 30 ngày đầu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-3.5 h-3.5 text-[#36e2b6]" />
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">Hỗ Trợ 1900.8888</p>
              <p className="text-[9px] text-white/70">Tận tâm phục vụ 24/7</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white text-gray-900 rounded-lg px-2.5 py-1.5 shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#009981]" />
              <div className="text-left">
                <p className="text-[9px] font-extrabold text-gray-800 leading-tight">XEM CHI TIẾT</p>
                <p className="text-[8px] font-bold text-[#009981] leading-tight">ƯU ĐÃI NGAY</p>
              </div>
            </div>
            <Play className="w-2.5 h-2.5 text-[#009981] fill-[#009981] transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
