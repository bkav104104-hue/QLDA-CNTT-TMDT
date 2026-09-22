import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light'; // dark for light backgrounds, light for dark/emerald backgrounds
  badgeText?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'dark',
  badgeText = '.VN',
  onClick 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-13 h-13 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isLight = variant === 'light';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      window.history.pushState(null, '', window.location.pathname);
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a 
      href="/"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="NextPhone.vn - Hệ thống bán lẻ công nghệ hàng đầu"
      className={`inline-flex items-center gap-2.5 font-['Inter',system-ui,sans-serif] select-none cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all no-underline ${className}`}
    >
      {/* NextPhone Futuristic Tech Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-200 flex-shrink-0 ${
        isLight 
          ? 'bg-gradient-to-br from-emerald-400 via-[#00b094] to-[#006650] text-white ring-1 ring-white/30 shadow-emerald-500/20' 
          : 'bg-gradient-to-br from-[#00b094] via-[#009981] to-[#005944] text-white ring-1 ring-emerald-500/20 shadow-emerald-900/15'
      }`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-3/5 h-3/5 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 6H10.5L21.5 21.5V6H27V26H21.5L10.5 10.5V26H5V6Z" fill="currentColor" />
          <circle cx="24" cy="8" r="2.5" fill="#38ef7d" />
        </svg>
        {/* Subtle shine highlight */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none" />
      </div>

      {/* Brand Text */}
      <div className={`flex items-baseline ${textSizes[size]} leading-none font-['Inter',system-ui,sans-serif] tracking-tight`}>
        <span className={`font-black tracking-tight ${
          isLight 
            ? 'text-white drop-shadow-sm' 
            : 'text-[#009981]'
        }`}>
          NEXT
        </span>
        <span className={`font-black tracking-tight ml-1 ${
          isLight 
            ? 'text-emerald-100/95 drop-shadow-sm' 
            : 'text-gray-900'
        }`}>
          PHONE
        </span>
        <span className={`text-[10px] font-black ml-1.5 px-1.5 py-0.5 rounded-md tracking-wider uppercase transition-all ${
          isLight 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm' 
            : 'text-[#00826e] bg-emerald-50 border border-emerald-200/80'
        }`}>
          {badgeText}
        </span>
      </div>
    </a>
  );
};
