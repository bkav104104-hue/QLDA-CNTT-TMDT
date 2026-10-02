export interface CatalogProduct {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  memberPrice?: number;
  ram?: string;
  storage?: string;
  chipset?: string;
  battery?: string;
  installment?: string;
  phoneColor?: string;
  imageBgColor?: string;
  inStock?: boolean;
  isHot?: boolean;
}

export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

export const catalogProducts: CatalogProduct[] = [
  // 1. Điện thoại (dienthoai)
  {
    id: 'iphone-17-pro-max',
    slug: 'iphone-17-pro-max-256gb',
    name: 'iPhone 17 Pro Max 256GB Titan Tự Nhiên',
    brand: 'apple',
    category: 'dienthoai',
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
    isHot: true
  },
  {
    id: 'p1',
    slug: 'honor-x7d-5g',
    name: 'HONOR X7d 5G 8GB/256GB',
    brand: 'honor',
    category: 'dienthoai',
    ram: '8GB',
    storage: '256GB',
    price: 6490000,
    installment: '737,000 ₫ x 6T',
    memberPrice: 6313000,
    phoneColor: '#38bdf8',
    imageBgColor: '#e0f2fe',
    inStock: true
  },
  {
    id: 'p2',
    slug: 'oppo-find-x9s',
    name: 'OPPO Find X9s 12GB/256GB',
    brand: 'oppo',
    category: 'dienthoai',
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
    isHot: true
  },
  {
    id: 'p3',
    slug: 'samsung-galaxy-a37-5g',
    name: 'Samsung Galaxy A37 5G - 8GB/128GB',
    brand: 'samsung',
    category: 'dienthoai',
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
    inStock: true
  },
  {
    id: 'p4',
    slug: 'samsung-galaxy-a17-5g',
    name: 'Samsung Galaxy A17 5G 8GB/128GB',
    brand: 'samsung',
    category: 'dienthoai',
    ram: '8GB',
    storage: '128GB',
    chipset: 'Exynos 1330',
    battery: '5000mAh',
    price: 6090000,
    originalPrice: 7090000,
    discountPercent: 14,
    memberPrice: 5979000,
    phoneColor: '#bae6fd',
    imageBgColor: '#f0f9ff',
    inStock: true
  },
  {
    id: 'p5',
    slug: 'xiaomi-15-pro-ai',
    name: 'Xiaomi 15 Pro 16GB/512GB - Leica Optics',
    brand: 'xiaomi',
    category: 'dienthoai',
    ram: '16GB',
    storage: '512GB',
    chipset: 'Snapdragon 8 Elite',
    battery: '6100mAh',
    price: 24990000,
    originalPrice: 27990000,
    discountPercent: 11,
    memberPrice: 24240000,
    phoneColor: '#059669',
    imageBgColor: '#ecfdf5',
    inStock: true,
    isHot: true
  },
  {
    id: 'p6',
    slug: 'redmi-note-14-pro-plus',
    name: 'Xiaomi Redmi Note 14 Pro+ 5G 12GB/256GB',
    brand: 'xiaomi',
    category: 'dienthoai',
    ram: '12GB',
    storage: '256GB',
    chipset: 'Snapdragon 7s Gen 3',
    battery: '6200mAh',
    price: 9490000,
    originalPrice: 10490000,
    discountPercent: 10,
    memberPrice: 9205000,
    phoneColor: '#a855f7',
    imageBgColor: '#faf5ff',
    inStock: true
  },
  {
    id: 'p7',
    slug: 'oppo-reno15-f',
    name: 'OPPO Reno15 F 5G 8GB/256GB - AI Portrait',
    brand: 'oppo',
    category: 'dienthoai',
    ram: '8GB',
    storage: '256GB',
    chipset: 'Snapdragon 6 Gen 1',
    battery: '5000mAh',
    price: 9990000,
    originalPrice: 10990000,
    discountPercent: 9,
    memberPrice: 9690000,
    phoneColor: '#ec4899',
    imageBgColor: '#fdf2f8',
    inStock: true
  },

  // 2. Phụ kiện (phukien)
  {
    id: 'acc1',
    slug: 'cu-sac-nhanh-anker-prime-gan-65w',
    name: 'Củ Sạc Nhanh Anker Prime GaN 65W 3 Cổng (2C1A)',
    brand: 'anker',
    category: 'phukien',
    storage: '65W GaN',
    price: 1150000,
    originalPrice: 1450000,
    discountPercent: 21,
    memberPrice: 1115000,
    phoneColor: '#1e293b',
    imageBgColor: '#f8fafc',
    inStock: true,
    isHot: true
  },
  {
    id: 'acc2',
    slug: 'cap-sac-anker-type-c-100w',
    name: 'Cáp Sạc Nhanh Type-C to Type-C Anker 100W Dù Siêu Bền',
    brand: 'anker',
    category: 'phukien',
    storage: '100W PD',
    price: 250000,
    originalPrice: 320000,
    discountPercent: 22,
    memberPrice: 2420000,
    phoneColor: '#3b82f6',
    imageBgColor: '#eff6ff',
    inStock: true
  },
  {
    id: 'acc3',
    slug: 'airpods-pro-2-usb-c',
    name: 'Tai Nghe Bluetooth Chống Ồn AirPods Pro 2 (USB-C)',
    brand: 'apple',
    category: 'phukien',
    storage: 'H2 Chip ANC',
    price: 5690000,
    originalPrice: 6190000,
    discountPercent: 8,
    memberPrice: 5519000,
    phoneColor: '#ffffff',
    imageBgColor: '#f1f5f9',
    inStock: true,
    isHot: true
  },
  {
    id: 'acc4',
    slug: 'pin-du-phong-anker-powercore-20000',
    name: 'Pin Dự Phòng Anker PowerCore 20,000mAh 30W PD Siêu Nhanh',
    brand: 'anker',
    category: 'phukien',
    storage: '20,000mAh',
    price: 890000,
    originalPrice: 1190000,
    discountPercent: 25,
    memberPrice: 863000,
    phoneColor: '#0f172a',
    imageBgColor: '#f8fafc',
    inStock: true
  },
  {
    id: 'acc5',
    slug: 'loa-bluetooth-marshall-emberton-ii',
    name: 'Loa Bluetooth Marshall Emberton II Chính Hãng ASH',
    brand: 'marshall',
    category: 'phukien',
    storage: 'Pin 30h IP67',
    price: 3990000,
    originalPrice: 4490000,
    discountPercent: 11,
    memberPrice: 3870000,
    phoneColor: '#1c1917',
    imageBgColor: '#fafaf9',
    inStock: true
  },

  // 3. Laptop (laptop)
  {
    id: 'lap1',
    slug: 'macbook-air-13-m3-16gb',
    name: 'MacBook Air 13 inch M3 16GB / 256GB SSD Space Gray',
    brand: 'apple',
    category: 'laptop',
    ram: '16GB Unified',
    storage: '256GB SSD',
    chipset: 'Apple M3 8-Core',
    battery: 'Pin 18 giờ',
    price: 26990000,
    originalPrice: 29990000,
    discountPercent: 10,
    memberPrice: 26180000,
    phoneColor: '#4b5563',
    imageBgColor: '#f3f4f6',
    inStock: true,
    isHot: true
  },
  {
    id: 'lap2',
    slug: 'asus-rog-zephyrus-g16-oled',
    name: 'Asus ROG Zephyrus G16 OLED Ultra 9 / RTX 4070 / 32GB',
    brand: 'asus',
    category: 'laptop',
    ram: '32GB LPDDR5X',
    storage: '1TB PCIe 4.0',
    chipset: 'Intel Core Ultra 9',
    battery: 'Pin 90Wh',
    price: 54990000,
    originalPrice: 59990000,
    discountPercent: 8,
    memberPrice: 53340000,
    phoneColor: '#0f172a',
    imageBgColor: '#f1f5f9',
    inStock: true
  },

  // 4. Tablet (tablet)
  {
    id: 'tab1',
    slug: 'ipad-pro-11-m4-oled',
    name: 'iPad Pro 11 M4 OLED 256GB WiFi Silver',
    brand: 'apple',
    category: 'tablet',
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
    isHot: true
  },

  // 5. Cũ & Thu cũ đổi mới
  {
    id: 'used1',
    slug: 'iphone-15-pro-max-cu-dep',
    name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên - Cũ Đẹp 99%',
    brand: 'apple',
    category: 'hangcu',
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
    inStock: true
  },
  {
    id: 'used2',
    slug: 'samsung-s24-ultra-cu-dep',
    name: 'Samsung Galaxy S24 Ultra 12GB/256GB Cũ Đẹp 99% - Galaxy AI',
    brand: 'samsung',
    category: 'thucudoimoi',
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
    inStock: true
  }
];

