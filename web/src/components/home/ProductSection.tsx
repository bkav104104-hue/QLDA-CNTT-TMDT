import React, { useState, useMemo } from 'react';
import { ProductCard, ProductItem } from './ProductCard';
import { Flame, Cable, Laptop, Tablet, Sparkles, RotateCcw, Monitor, Headphones } from 'lucide-react';

interface ProductSectionProps {
  onAddToCart?: (product: ProductItem) => void;
  onSelectProduct?: (product: ProductItem) => void;
  selectedCategory?: string;
  onResetCategory?: () => void;
}

interface ExtendedProductItem extends ProductItem {
  brand: string;
  category: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ 
  onAddToCart, 
  onSelectProduct,
  selectedCategory = 'dienthoai',
  onResetCategory
}) => {
  const [activeBrand, setActiveBrand] = useState('all');

  const allProducts: ExtendedProductItem[] = [
    // 1. Phones (dienthoai)
    {
      id: 'iphone-17-pro-max',
      name: 'iPhone 17 Pro Max 256GB Titan Tự Nhiên',
      ram: '12GB',
      storage: '256GB',
      chipset: 'Apple A19 Pro',
      battery: '4685mAh',
      price: 34990000,
      originalPrice: 37990000,
      discountPercent: 8,
      memberPrice: 33940000,
      phoneColor: '#9ca3af',
      imageBgColor: '#f3f4f6',
      inStock: true,
      brand: 'apple',
      category: 'dienthoai'
    },
    {
      id: 'p1',
      name: 'HONOR X7d 5G 8GB/256GB',
      ram: '8GB',
      storage: '256GB',
      price: 6490000,
      installment: '737,000 ₫ x 6T',
      memberPrice: 6313000,
      phoneColor: '#38bdf8',
      imageBgColor: '#e0f2fe',
      inStock: true,
      brand: 'honor',
      category: 'dienthoai'
    },
    {
      id: 'p2',
      name: 'OPPO Find X9s 12GB/256GB',
      ram: '12GB',
      storage: '256GB',
      chipset: 'Dimensity 9400',
      battery: '5800mAh',
      price: 21090000,
      originalPrice: 24990000,
      discountPercent: 16,
      memberPrice: 20837000,
      phoneColor: '#e2e8f0',
      imageBgColor: '#f8fafc',
      inStock: true,
      brand: 'oppo',
      category: 'dienthoai'
    },
    {
      id: 'p3',
      name: 'Samsung Galaxy A37 5G - 8GB/128GB',
      ram: '8GB',
      storage: '128GB',
      chipset: 'Exynos 1480',
      battery: '5000mAh',
      price: 9290000,
      originalPrice: 10790000,
      discountPercent: 14,
      memberPrice: 9179000,
      phoneColor: '#fbcfe8',
      imageBgColor: '#fdf2f8',
      inStock: true,
      brand: 'samsung',
      category: 'dienthoai'
    },
    {
      id: 'p4',
      name: 'Samsung Galaxy A17 5G 8GB/128GB',
      ram: '8GB',
      storage: '128GB',
      chipset: 'Exynos 1330',
      battery: '5000mAh',
      price: 6090000,
      originalPrice: 7090000,
      discountPercent: 14,
      installment: '702,000 ₫ x 6T',
      memberPrice: 6017000,
      phoneColor: '#93c5fd',
      imageBgColor: '#eff6ff',
      inStock: true,
      brand: 'samsung',
      category: 'dienthoai'
    },
    {
      id: 'p5',
      name: 'OPPO Reno15 F 5G 8GB+256GB',
      ram: '8GB',
      storage: '256GB',
      chipset: 'Snapdragon 6 Gen 1',
      battery: '7000mAh',
      price: 10990000,
      installment: '1,267,000 ₫ x 6T',
      memberPrice: 10858000,
      phoneColor: '#fed7aa',
      imageBgColor: '#fff7ed',
      inStock: true,
      brand: 'oppo',
      category: 'dienthoai'
    },
    {
      id: 'p6',
      name: 'OSCAL TIGER 12 (8GB/128GB) NFC',
      ram: '8GB',
      storage: '128GB',
      chipset: 'Helio G99',
      battery: '5000mAh',
      price: 3990000,
      originalPrice: 4490000,
      discountPercent: 11,
      memberPrice: 3942000,
      phoneColor: '#475569',
      imageBgColor: '#f1f5f9',
      inStock: true,
      brand: 'xiaomi',
      category: 'dienthoai'
    },

    // 2. Accessories (phukien)
    {
      id: 'cu-sac-nhanh-anker-prime-gan-65w',
      name: 'Củ Sạc Nhanh Anker Prime GaN 65W 3 Cổng',
      ram: 'GaN III',
      storage: '65W Max',
      chipset: 'PowerIQ 4.0',
      battery: '3 Cổng Sạc',
      price: 1190000,
      originalPrice: 1450000,
      discountPercent: 18,
      memberPrice: 1130000,
      phoneColor: '#0f172a',
      imageBgColor: '#f1f5f9',
      inStock: true,
      brand: 'anker',
      category: 'phukien'
    },
    {
      id: 'cap-sac-nhanh-type-c-to-c-anker-100w',
      name: 'Cáp Sạc Nhanh Type-C to C Anker 100W Dù Siêu Bền',
      ram: '100W',
      storage: 'Dài 1.8m',
      chipset: 'E-Marker IC',
      battery: 'Uốn gập 25K lần',
      price: 250000,
      originalPrice: 350000,
      discountPercent: 28,
      memberPrice: 237500,
      phoneColor: '#334155',
      imageBgColor: '#f8fafc',
      inStock: true,
      brand: 'anker',
      category: 'phukien'
    },
    {
      id: 'tai-nghe-airpods-pro-2-usbc',
      name: 'Tai Nghe Bluetooth Apple AirPods Pro 2 (USB-C)',
      ram: 'Chip H2',
      storage: 'MagSafe USB-C',
      chipset: 'ANC Chống Ồn',
      battery: 'Pin 30 Giờ',
      price: 5690000,
      originalPrice: 6190000,
      discountPercent: 8,
      memberPrice: 5519000,
      phoneColor: '#f8fafc',
      imageBgColor: '#f1f5f9',
      inStock: true,
      brand: 'apple',
      category: 'phukien'
    },
    {
      id: 'pin-du-phong-anker-maggo-10000mah',
      name: 'Pin Dự Phòng Anker MagGo Qi2 10000mAh Không Dây 15W',
      ram: 'Qi2 15W',
      storage: '10000mAh',
      chipset: 'Màn hình LED',
      battery: 'Sạc 2 thiết bị',
      price: 1390000,
      originalPrice: 1690000,
      discountPercent: 17,
      memberPrice: 1320000,
      phoneColor: '#0284c7',
      imageBgColor: '#e0f2fe',
      inStock: true,
      brand: 'anker',
      category: 'phukien'
    },

    // 3. Laptop (laptop)
    {
      id: 'macbook-pro-14-m3-pro',
      name: 'Apple MacBook Pro 14 M3 Pro 18GB/512GB Space Black',
      ram: '18GB Unified',
      storage: '512GB SSD',
      chipset: 'Apple M3 Pro',
      battery: 'Liquid Retina XDR',
      price: 48990000,
      originalPrice: 52990000,
      discountPercent: 7,
      memberPrice: 47520000,
      phoneColor: '#1e293b',
      imageBgColor: '#f8fafc',
      inStock: true,
      brand: 'apple',
      category: 'laptop'
    },
    {
      id: 'asus-rog-zephyrus-g16',
      name: 'Laptop Gaming ASUS ROG Zephyrus G16 OLED Core Ultra 9',
      ram: '32GB DDR5',
      storage: '1TB NVMe',
      chipset: 'RTX 4070 8GB',
      battery: 'OLED 2.5K 240Hz',
      price: 54990000,
      originalPrice: 59990000,
      discountPercent: 8,
      memberPrice: 53340000,
      phoneColor: '#0f172a',
      imageBgColor: '#f1f5f9',
      inStock: true,
      brand: 'asus',
      category: 'laptop'
    },

    // 4. Tablet (tablet)
    {
      id: 'ipad-pro-11-m4-oled',
      name: 'iPad Pro 11 M4 OLED 256GB WiFi Silver',
      ram: '8GB RAM',
      storage: '256GB',
      chipset: 'Apple M4 AI',
      battery: 'Tandem OLED',
      price: 27990000,
      originalPrice: 29990000,
      discountPercent: 6,
      memberPrice: 27150000,
      phoneColor: '#e2e8f0',
      imageBgColor: '#f8fafc',
      inStock: true,
      brand: 'apple',
      category: 'tablet'
    },

    // 5. Certified Pre-Owned / Trade-in (hangcu / thucudoimoi)
    {
      id: 'iphone-15-pro-max-cu-dep',
      name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên - Cũ Đẹp 99%',
      ram: '8GB',
      storage: '256GB',
      chipset: 'A17 Pro 3nm',
      battery: 'Pin 95%+',
      price: 23990000,
      originalPrice: 29990000,
      discountPercent: 20,
      installment: 'Trợ giá 100K Smember',
      memberPrice: 23270000,
      phoneColor: '#78716c',
      imageBgColor: '#f5f5f4',
      inStock: true,
      brand: 'apple',
      category: 'hangcu'
    },
    {
      id: 'samsung-s24-ultra-cu-dep',
      name: 'Samsung Galaxy S24 Ultra 12GB/256GB Cũ Đẹp 99% - Galaxy AI',
      ram: '12GB',
      storage: '256GB',
      chipset: 'Snapdragon 8 Gen 3',
      battery: 'Pin 5000mAh',
      price: 20490000,
      originalPrice: 26990000,
      discountPercent: 24,
      installment: 'Thu cũ đổi mới trợ giá 2TR',
      memberPrice: 19875000,
      phoneColor: '#1e1b4b',
      imageBgColor: '#eef2ff',
      inStock: true,
      brand: 'samsung',
      category: 'thucudoimoi'
    }
  ];

  // Normalized category slug
  const normalizedCategory = useMemo(() => {
    const raw = (selectedCategory || 'dienthoai').toLowerCase().replace('-', '');
    return raw;
  }, [selectedCategory]);

  const categoryMeta = useMemo(() => {
    switch (normalizedCategory) {
      case 'phukien':
        return {
          title: 'PHỤ KIỆN CÔNG NGHỆ CHÍNH HÃNG',
          subtitle: 'Củ sạc GaN, Cáp sạc siêu bền, Tai nghe Bluetooth, Pin dự phòng chính hãng Anker, Apple',
          icon: <Cable className="w-5 h-5 text-orange-500" />,
          filterCategories: ['phukien']
        };
      case 'laptop':
        return {
          title: 'LAPTOP CHÍNH HÃNG - ĐỒ HỌA & GAMING',
          subtitle: 'MacBook Pro M3, Asus ROG, Dell XPS cấu hình khủng, trả góp 0%',
          icon: <Laptop className="w-5 h-5 text-blue-600" />,
          filterCategories: ['laptop']
        };
      case 'tablet':
        return {
          title: 'MÁY TÍNH BẢNG - IPAD & GALAXY TAB',
          subtitle: 'Màn hình OLED sắc nét, hỗ trợ bút cảm ứng, hiệu năng đỉnh cao',
          icon: <Tablet className="w-5 h-5 text-purple-600" />,
          filterCategories: ['tablet']
        };
      case 'hangcu':
        return {
          title: 'MÁY CŨ CHÍNH HÃNG - GIÁ RẺ NGUYÊN BẢN 99%',
          subtitle: 'Kiểm định 30 bước nghiêm ngặt, bảo hành 12 tháng 1 đổi 1 trong 30 ngày',
          icon: <RotateCcw className="w-5 h-5 text-amber-600" />,
          filterCategories: ['hangcu', 'thucudoimoi']
        };
      case 'thucudoimoi':
        return {
          title: 'THU CŨ ĐỔI MỚI - TRỢ GIÁ LÊN ĐỜI ĐẾN 5 TRIỆU',
          subtitle: 'Định giá tự động bằng AI trong 3 phút, trợ giá độc quyền cho thành viên Smember',
          icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
          filterCategories: ['thucudoimoi', 'hangcu']
        };
      case 'manhinh':
      case 'pclinhkien':
      case 'amthanh':
      case 'dongho':
      case 'tividienmay':
      case 'smarthome':
      case 'suachua':
      case 'dichvu':
        return {
          title: `DANH MỤC: ${selectedCategory.toUpperCase()}`,
          subtitle: 'Sản phẩm chính hãng, bảo hành toàn quốc 12 - 24 tháng',
          icon: <Monitor className="w-5 h-5 text-indigo-600" />,
          filterCategories: [normalizedCategory, 'dienthoai', 'phukien']
        };
      case 'dienthoai':
      default:
        return {
          title: 'ĐIỆN THOẠI NỔI BẬT NHẤT',
          subtitle: 'Giá tốt nhất thị trường - Bảo hành 1 đổi 1 chính hãng',
          icon: <Flame className="w-5 h-5 fill-red-500 text-red-500" />,
          filterCategories: ['dienthoai']
        };
    }
  }, [normalizedCategory, selectedCategory]);

  const displayedProducts = useMemo(() => {
    let list = allProducts.filter(p => {
      const pCat = p.category.toLowerCase().replace('-', '');
      return categoryMeta.filterCategories.some(c => pCat.includes(c));
    });

    // Fallback if category has no specific item: show general phone products
    if (list.length === 0) {
      list = allProducts.filter(p => p.category === 'dienthoai');
    }

    if (activeBrand !== 'all') {
      list = list.filter(p => p.brand.toLowerCase() === activeBrand.toLowerCase());
    }

    return list;
  }, [allProducts, categoryMeta, activeBrand]);

  const brands = [
    { id: 'all', label: 'Tất cả' },
    { id: 'apple', label: 'Apple' },
    { id: 'samsung', label: 'Samsung' },
    { id: 'oppo', label: 'OPPO' },
    { id: 'anker', label: 'Anker' },
    { id: 'honor', label: 'HONOR' },
    { id: 'asus', label: 'ASUS' },
  ];

  return (
    <div id="home-main-section" className="w-full space-y-4">
      {/* Section Header with Category Title & Brand Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
            {categoryMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">
                {categoryMeta.title}
              </h2>
              {selectedCategory && selectedCategory !== 'dienthoai' && (
                <span className="bg-emerald-100 text-[#009981] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                  #{selectedCategory}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              {categoryMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Brand Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {brands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBrand(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeBrand === b.id
                  ? 'bg-[#009981] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {displayedProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
export default ProductSection;
