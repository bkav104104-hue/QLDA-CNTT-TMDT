import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  Cpu, 
  Watch, 
  Headphones, 
  Tv, 
  Camera, 
  Cable, 
  Wrench, 
  FileText,
  RotateCcw,
  Sparkles,
  Flame,
  ChevronRight,
  Gift
} from 'lucide-react';
import { categoryService, defaultHomeCatalog, CategoryItem } from '../../services/categoryService';

interface CategorySidebarProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  onOpenAuth,
  selectedCategory,
  onSelectCategory
}) => {
  const [catalog, setCatalog] = useState(defaultHomeCatalog);

  useEffect(() => {
    let isMounted = true;
    categoryService.getHomeCatalog().then((data) => {
      if (isMounted && data) {
        setCatalog(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (iconName?: string, slug?: string) => {
    switch (iconName?.toLowerCase() || slug?.toLowerCase()) {
      case 'smartphone':
      case 'dienthoai':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-purple-600" />;
      case 'monitor':
      case 'manhinh':
        return <Monitor className="w-4 h-4 text-indigo-600" />;
      case 'cpu':
      case 'pclinhkien':
        return <Cpu className="w-4 h-4 text-gray-700" />;
      case 'watch':
      case 'dongho':
        return <Watch className="w-4 h-4 text-amber-600" />;
      case 'headphones':
      case 'amthanh':
        return <Headphones className="w-4 h-4 text-rose-600" />;
      case 'tv':
      case 'tividienmay':
        return <Tv className="w-4 h-4 text-cyan-600" />;
      case 'camera':
      case 'smarthome':
        return <Camera className="w-4 h-4 text-teal-600" />;
      case 'cable':
      case 'phukien':
        return <Cable className="w-4 h-4 text-orange-600" />;
      case 'wrench':
      case 'suachua':
        return <Wrench className="w-4 h-4 text-slate-600" />;
      case 'filetext':
      case 'dichvu':
        return <FileText className="w-4 h-4 text-emerald-700" />;
      case 'rotateccw':
      case 'hangcu':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'sparkles':
      case 'thucudoimoi':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'flame':
      case 'tinhotcongnghe':
        return <Flame className="w-4 h-4 text-red-500 fill-red-500" />;
      default:
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, cat: CategoryItem) => {
    e.preventDefault();
    const hash = cat.urlHash || `#cat-${cat.slug}`;
    window.location.hash = hash;
    onSelectCategory?.(cat.slug);

    // Smooth scroll to product or news section
    const targetElement = document.getElementById('home-main-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderCategoryItem = (cat: CategoryItem) => {
    const isSelected = selectedCategory === cat.slug;

    return (
      <li key={cat.id || cat.slug}>
        <a
          href={cat.urlHash || `#cat-${cat.slug}`}
          onClick={(e) => handleCategoryClick(e, cat)}
          className={`flex items-center justify-between px-3.5 py-2.5 transition-all group cursor-pointer ${
            isSelected 
              ? 'bg-emerald-50 text-[#009981] font-bold border-l-4 border-[#009981]' 
              : 'hover:bg-emerald-50/70 hover:text-[#009981] text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="group-hover:scale-110 transition-transform flex-shrink-0">
              {getCategoryIcon(cat.iconName, cat.slug)}
            </span>
            <span className="truncate">{cat.name}</span>
            {cat.isHot && (
              <span className="bg-red-500 text-white text-[9px] font-extrabold px-1 rounded uppercase scale-90 flex-shrink-0">
                HOT
              </span>
            )}
            {cat.badge && (
              <span className="bg-emerald-100 text-[#009981] text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                {cat.badge}
              </span>
            )}
          </div>
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-all flex-shrink-0 ${
            isSelected ? 'opacity-100 text-[#009981] translate-x-0.5' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
          }`} />
        </a>
      </li>
    );
  };

  return (
    <aside className="w-full lg:w-56 flex-shrink-0 space-y-3">
      {/* Box Member Special Promotion */}
      {onOpenAuth && (
        <div className="bg-gradient-to-br from-[#005944] to-[#003d2e] rounded-2xl p-3 text-white shadow-md text-xs relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <Gift className="w-4 h-4 text-[#36e2b6]" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-200">
              NextPhone Member
            </span>
          </div>
          <p className="text-[10px] text-gray-200 leading-tight mb-2.5">
            Đăng ký thành viên nhận ngay <strong>Voucher 100K</strong> và tích điểm!
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="flex-1 py-1.5 px-2 bg-[#009981] hover:bg-[#00826e] text-white font-bold rounded-lg text-[10px] text-center transition-colors shadow-sm cursor-pointer"
            >
              Đăng ký ngay
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-[10px] text-center transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}

      {/* Box 1: Danh mục chính */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center justify-between">
          <span>Danh mục</span>
          <span className="text-[10px] text-emerald-600 lowercase font-medium">12 mục</span>
        </div>
        <ul className="divide-y divide-gray-50 text-xs font-medium">
          {catalog.mainCategories.map(renderCategoryItem)}
        </ul>
      </div>

      {/* Box 2: Hàng cũ & Thu cũ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider">
          Hàng cũ & Thu cũ
        </div>
        <ul className="divide-y divide-gray-50 text-xs font-medium">
          {catalog.secondaryCategories.map(renderCategoryItem)}
        </ul>
      </div>

      {/* Box 3: Tin tức công nghệ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center justify-between">
          <span>Tin tức</span>
          <span className="bg-red-100 text-red-600 text-[9px] font-extrabold px-1 rounded uppercase">Mới</span>
        </div>
        <ul className="divide-y divide-gray-50 text-xs font-medium">
          {catalog.newsCategories.map(renderCategoryItem)}
        </ul>
      </div>
    </aside>
  );
};
export default CategorySidebar;
