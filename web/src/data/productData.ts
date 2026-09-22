export interface ProductDetailData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  price: number;
  originalPrice: number;
  installmentText: string;
  memberDiscountPercent: number;
  tradeInDiscount: number;
  rating: number;
  reviewCount: number;
  starBreakdown: { star: number; pct: number }[];
  
  versions: {
    id: string;
    storage: string;
    price: number;
    originalPrice: number;
  }[];

  colors: {
    id: string;
    name: string;
    hex: string;
    phoneColor: string;
    imageBg: string;
  }[];

  specs: {
    camera: string;
    os: string;
    storage: string;
    network: string;
    sim: string;
    chipset: string;
    screenTech: string;
    resolution: string;
    screenSize: string;
    batteryAndCharging: string;
    material: string;
    ports: string;
  };

  article: {
    toc: string[];
    paragraphs: string[];
  };

  reviews: {
    id: string;
    author: string;
    avatarColor: string;
    timeAgo: string;
    rating: number;
    comment: string;
    reply?: {
      author: string;
      role: string;
      content: string;
      timeAgo: string;
    };
  }[];

  comparisons: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    tradeInPrice: number;
    saved?: string;
    phoneColor: string;
  }[];
}

export const productDetailsDatabase: Record<string, ProductDetailData> = {
  // 1. iPhone 17 Pro Max
  'iphone-17-pro-max': {
    id: 'iphone-17-pro-max',
    slug: 'iphone-17-pro-max-256gb',
    name: 'iPhone 17 Pro Max 256GB - Chính hãng Apple Việt Nam',
    brand: 'Apple',
    category: 'Điện thoại',
    sku: 'MFYP4ZP',
    price: 34290000,
    originalPrice: 37990000,
    installmentText: 'Trả góp 0% chỉ từ 4,001,000 ₫ x 6 tháng >',
    memberDiscountPercent: 2.0,
    tradeInDiscount: 4000000,
    rating: 4.8,
    reviewCount: 21,
    starBreakdown: [
      { star: 5, pct: 85 },
      { star: 4, pct: 14 },
      { star: 3, pct: 0 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-256', storage: '256GB', price: 34290000, originalPrice: 37990000 },
      { id: 'v-512', storage: '512GB', price: 40490000, originalPrice: 44990000 },
      { id: 'v-1tb', storage: '1TB', price: 46990000, originalPrice: 51990000 },
      { id: 'v-2tb', storage: '2TB', price: 59990000, originalPrice: 65990000 }
    ],
    colors: [
      { id: 'c-blue', name: 'Xanh đậm', hex: '#1e3a8a', phoneColor: '#1e293b', imageBg: '#fed7aa' },
      { id: 'c-orange', name: 'Cam vũ trụ', hex: '#ea580c', phoneColor: '#7c2d12', imageBg: '#ffedd5' },
      { id: 'c-silver', name: 'Bạc', hex: '#94a3b8', phoneColor: '#e2e8f0', imageBg: '#f1f5f9' }
    ],
    specs: {
      camera: '48MP (f/1.78) x 12MP (f/1.78) x 48MP (f/2.2) x 48MP (f/2.8) x 12MP (f/2.8) Camera trước 18MP, khẩu độ f/1.9',
      os: 'iOS 18 / Hỗ trợ trọn bộ Apple Intelligence',
      storage: '256GB NVMe siêu tốc',
      network: '5G Siêu tốc độ (Sub-6GHz và mmWave)',
      sim: 'SIM kép (nano SIM và eSIM) - Hỗ trợ eSIM kép',
      chipset: 'Apple A19 Pro (Tiến trình 2nm, 6 nhân CPU, 6 nhân GPU)',
      screenTech: 'Super Retina XDR OLED 120Hz ProMotion',
      resolution: '2868 x 1320 pixels',
      screenSize: '6.9 inch viền siêu mỏng',
      batteryAndCharging: '4685mAh, Sạc nhanh 35W, MagSafe 25W không dây',
      material: 'Khung viền Titanium Grade 5 chống bám vân tay',
      ports: 'USB-C hỗ trợ chuẩn USB 3 (Tốc độ truyền dữ liệu 10Gbps)'
    },
    article: {
      toc: [
        'iPhone 17 Pro Max ra mắt khi nào?',
        'iPhone 17 Pro Max giá bao nhiêu?',
        'iPhone 17 Pro Max có thông số kỹ thuật chi tiết như thế nào?',
        'Điện thoại iPhone 17 Pro Max có gì nổi bật?',
        'So sánh iPhone 17 Pro Max và iPhone 16 Pro Max - Có đáng nâng cấp?'
      ],
      paragraphs: [
        'iPhone 17 Pro Max được ra mắt với thiết kế nguyên khối bằng nhôm và titanium cao cấp, kết hợp cùng mặt kính cường lực thế hệ mới và khả năng chống nước chuẩn IP68.',
        'Màn hình Super Retina XDR OLED 6.9 inch hỗ trợ tần số quét 120Hz ProMotion mang lại trải nghiệm chạm vuốt cực kỳ mượt mà, độ sáng đỉnh ngoài trời lên đến 2500 nits.',
        'Trái tim của máy là chip Apple A19 Pro 2nm, tối ưu hoàn hảo cho các tác vụ trí tuệ nhân tạo Apple Intelligence và đồ họa game AAA thời gian thực.'
      ]
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Hà Đặng',
        avatarColor: 'bg-slate-600',
        timeAgo: '4 giờ trước',
        rating: 5,
        comment: 'Gần phường Cầu Giấy, cơ sở nào còn Ip 17 Pro Max màu bạc 256GB ạ?',
        reply: {
          author: 'NextPhone Quản Trị Viên',
          role: 'QTV',
          content: 'Dạ NextPhone chào bạn! Chi nhánh 122 Thái Hà và 194 Lê Duẩn đang có sẵn hàng nguyên seal màu Bạc 256GB bạn nhé.',
          timeAgo: '3 giờ trước'
        }
      },
      {
        id: 'rev-2',
        author: 'Quốc Bảo',
        avatarColor: 'bg-emerald-600',
        timeAgo: '1 ngày trước',
        rating: 5,
        comment: 'Máy cầm rất đầm tay, viền titan bo tròn cầm không bị cấn như đời cũ. Camera zoom quang 5x rất nét!'
      }
    ],
    comparisons: [
      { id: 'cp-1', name: 'Xiaomi 17 Ultra 16GB/512GB', price: 29490000, originalPrice: 39990000, tradeInPrice: 24490000, saved: '10.500.000 ₫', phoneColor: '#166534' },
      { id: 'cp-2', name: 'Samsung Galaxy S26 - 12GB/512GB', price: 25890000, originalPrice: 31990000, tradeInPrice: 21890000, saved: '6.100.000 ₫', phoneColor: '#3b82f6' },
      { id: 'cp-3', name: 'Samsung Galaxy S26 Ultra - 16GB/1TB', price: 41990000, originalPrice: 51990000, tradeInPrice: 37990000, saved: '10.000.000 ₫', phoneColor: '#6d28d9' }
    ]
  },

  // 2. HONOR X7d 5G
  'honor-x7d-5g': {
    id: 'p1',
    slug: 'honor-x7d-5g-8gb-256gb',
    name: 'HONOR X7d 5G 8GB/256GB - Chính Hãng',
    brand: 'HONOR',
    category: 'Điện thoại',
    sku: 'HNR-X7D-256',
    price: 6490000,
    originalPrice: 6990000,
    installmentText: 'Trả góp 0% chỉ từ 737,000 ₫ x 6 tháng >',
    memberDiscountPercent: 2.73,
    tradeInDiscount: 1000000,
    rating: 4.9,
    reviewCount: 42,
    starBreakdown: [
      { star: 5, pct: 90 },
      { star: 4, pct: 10 },
      { star: 3, pct: 0 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-128', storage: '128GB', price: 5890000, originalPrice: 6390000 },
      { id: 'v-256', storage: '256GB', price: 6490000, originalPrice: 6990000 }
    ],
    colors: [
      { id: 'c-blue', name: 'Xanh Dương Pha Lê', hex: '#38bdf8', phoneColor: '#0284c7', imageBg: '#e0f2fe' },
      { id: 'c-black', name: 'Đen Bóng Đêm', hex: '#111827', phoneColor: '#0f172a', imageBg: '#f1f5f9' },
      { id: 'c-silver', name: 'Bạc Ánh Trăng', hex: '#cbd5e1', phoneColor: '#94a3b8', imageBg: '#f8fafc' }
    ],
    specs: {
      camera: '108MP (f/1.75) Cảm biến lớn + 2MP (f/2.4) Xóa phông, Camera trước 8MP',
      os: 'Android 14 với giao diện MagicOS 8.0 mượt mà',
      storage: '256GB (Mở rộng thẻ nhớ MicroSD lên đến 1TB)',
      network: '5G Kép Dual SIM Standby',
      sim: '2 Nano SIM',
      chipset: 'Qualcomm Snapdragon 6 Gen 1 (Tiến trình 4nm, 8 nhân 2.2GHz)',
      screenTech: 'TFT LCD 90Hz, Chứng nhận chống mỏi mắt TÜV Rheinland',
      resolution: '2412 x 1080 pixels (Full HD+)',
      screenSize: '6.8 inch viền mỏng giọt nước',
      batteryAndCharging: '6000mAh Siêu bền (Dùng 3 ngày), Sạc nhanh 35W SuperCharge',
      material: 'Mặt lưng nhám ánh kim, độ bền chuẩn SGS Thụy Sĩ',
      ports: 'USB Type-C, Giắc cắm tai nghe 3.5mm tiện dụng'
    },
    article: {
      toc: [
        'HONOR X7d 5G có gì nổi bật trong phân khúc tầm trung?',
        'Thời lượng pin 6000mAh dùng thực tế được bao lâu?',
        'Độ bền chống va đập 5 sao SGS Thụy Sĩ',
        'Camera 108MP chụp ảnh sắc nét đến mức nào?'
      ],
      paragraphs: [
        'HONOR X7d 5G gây ấn tượng mạnh với viên pin dung lượng khủng 6000mAh nhưng vẫn giữ được thân máy thanh mảnh, cho phép xem video liên tục 22 giờ không cần sạc.',
        'Sở hữu camera chính 108MP, máy cho phép bạn zoom crop ảnh mà không bị nhòe vỡ chi tiết, kết hợp chế độ chụp đêm AI bắt trọn khoảnh khắc lung linh.',
        'Độ bền chuẩn 5 sao từ tổ chức SGS Thụy Sĩ giúp máy chống chịu va đập cực tốt khi rơi rớt ở độ cao 1.5 mét.'
      ]
    },
    reviews: [
      {
        id: 'rev-hn1',
        author: 'Trần Văn Mạnh',
        avatarColor: 'bg-blue-600',
        timeAgo: '2 ngày trước',
        rating: 5,
        comment: 'Pin 6000mAh trâu thực sự anh em ạ, mình chạy xe công nghệ cả ngày từ sáng tới tối về vẫn còn 35% pin.'
      },
      {
        id: 'rev-hn2',
        author: 'Phạm Thị Thùy',
        avatarColor: 'bg-purple-600',
        timeAgo: '3 ngày trước',
        rating: 5,
        comment: 'Màu xanh dương nhìn rất sang, máy cầm chắc tay. Tặng kèm cả ốp lưng và sạc nhanh trong hộp rất ưng bụng.'
      }
    ],
    comparisons: [
      { id: 'cp-hn1', name: 'Samsung Galaxy A17 5G 8GB/128GB', price: 6090000, originalPrice: 7090000, tradeInPrice: 5190000, saved: '1.000.000 ₫', phoneColor: '#fbcfe8' },
      { id: 'cp-hn2', name: 'OSCAL TIGER 12 8GB/128GB', price: 3990000, originalPrice: 4490000, tradeInPrice: 3200000, saved: '500.000 ₫', phoneColor: '#1e293b' }
    ]
  },

  // 3. OPPO Find X9s
  'oppo-find-x9s': {
    id: 'p2',
    slug: 'oppo-find-x9s-12gb-256gb',
    name: 'OPPO Find X9s 12GB/256GB - Nhiếp Ảnh Hasselblad',
    brand: 'OPPO',
    category: 'Điện thoại',
    sku: 'OPPO-FX9S-256',
    price: 21090000,
    originalPrice: 24990000,
    installmentText: 'Trả góp 0% chỉ từ 2,343,000 ₫ x 6 tháng >',
    memberDiscountPercent: 1.20,
    tradeInDiscount: 3000000,
    rating: 4.9,
    reviewCount: 18,
    starBreakdown: [
      { star: 5, pct: 92 },
      { star: 4, pct: 8 },
      { star: 3, pct: 0 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-256', storage: '256GB', price: 21090000, originalPrice: 24990000 },
      { id: 'v-512', storage: '512GB', price: 23990000, originalPrice: 27990000 }
    ],
    colors: [
      { id: 'c-gray', name: 'Titan Xám', hex: '#64748b', phoneColor: '#334155', imageBg: '#f8fafc' },
      { id: 'c-blue', name: 'Xanh Biển Sâu', hex: '#0284c7', phoneColor: '#0369a1', imageBg: '#e0f2fe' },
      { id: 'c-pearl', name: 'Trắng Ngọc Trai', hex: '#f1f5f9', phoneColor: '#e2e8f0', imageBg: '#ffffff' }
    ],
    specs: {
      camera: 'Bộ ba 50MP Hasselblad (50MP Sony LYT-808 OIS + 50MP Góc rộng 120° + 50MP Tiềm vọng Zoom quang 3X)',
      os: 'ColorOS 15 trên nền tảng Android 15 mới nhất',
      storage: '256GB UFS 4.0 chuẩn flagship',
      network: '5G Toàn dải băng tần quốc tế',
      sim: '2 Nano SIM hoặc 1 Nano SIM + eSIM',
      chipset: 'MediaTek Dimensity 9400 (3nm, Điểm Antutu hơn 2.8 triệu)',
      screenTech: 'AMOLED 1.5K LTPO 1-120Hz, Độ sáng tối đa 4500 nits',
      resolution: '2780 x 1264 pixels',
      screenSize: '6.78 inch cong nhẹ 4 cạnh viền',
      batteryAndCharging: '5630mAh Glacier Battery Siêu mỏng, Sạc có dây 80W SuperVOOC, Không dây 50W AIRVOOC',
      material: 'Mặt lưng kính nhám mờ AG chống trầy, viền hợp kim hàng không',
      ports: 'USB Type-C 3.2 Gen 1'
    },
    article: {
      toc: [
        'Đẳng cấp nhiếp ảnh di động cùng hệ thống Hasselblad thế hệ mới',
        'Sức mạnh vượt trội từ vi xử lý Dimensity 9400 tiến trình 3nm',
        'Màn hình 1.5K siêu sáng 4500 nits hiển thị rõ dưới nắng gắt',
        'Pin Glacier dung lượng cao cùng sạc nhanh 80W'
      ],
      paragraphs: [
        'OPPO Find X9s là kiệt tác công nghệ cao cấp nhất của OPPO, trang bị cụm 3 camera 50MP cùng ống kính tiềm vọng mang chất ảnh màu sắc chuẩn xác từ Thụy Điển.',
        'Màn hình cong nhẹ 4 cạnh mang lại cảm giác vuốt chạm trơn tru không gờ cấn, kết hợp công nghệ bảo vệ mắt AI thế hệ mới.',
        'Chipset Dimensity 9400 mang đến sức mạnh xử lý game mượt mà tuyệt đối ở mức thiết lập đồ họa tối đa mà máy vẫn luôn mát mẻ.'
      ]
    },
    reviews: [
      {
        id: 'rev-op1',
        author: 'Đặng Tuấn Anh',
        avatarColor: 'bg-emerald-700',
        timeAgo: '1 ngày trước',
        rating: 5,
        comment: 'Camera chụp người màu da tự nhiên đẹp xuất sắc, sạc pin nửa tiếng là đầy ắp dùng cả ngày.'
      }
    ],
    comparisons: [
      { id: 'cp-op1', name: 'Samsung Galaxy S26 - 12GB/512GB', price: 25890000, originalPrice: 31990000, tradeInPrice: 21890000, saved: '6.100.000 ₫', phoneColor: '#3b82f6' }
    ]
  },

  // 4. Samsung Galaxy A37 5G
  'samsung-galaxy-a37-5g': {
    id: 'p3',
    slug: 'samsung-galaxy-a37-5g-8gb-128gb',
    name: 'Samsung Galaxy A37 5G - 8GB/128GB - Chính Hãng',
    brand: 'Samsung',
    category: 'Điện thoại',
    sku: 'SS-A37-128',
    price: 9290000,
    originalPrice: 10790000,
    installmentText: 'Trả góp 0% chỉ từ 1,032,000 ₫ x 6 tháng >',
    memberDiscountPercent: 1.19,
    tradeInDiscount: 1500000,
    rating: 4.7,
    reviewCount: 35,
    starBreakdown: [
      { star: 5, pct: 80 },
      { star: 4, pct: 18 },
      { star: 3, pct: 2 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-128', storage: '128GB', price: 9290000, originalPrice: 10790000 },
      { id: 'v-256', storage: '256GB', price: 10290000, originalPrice: 11990000 }
    ],
    colors: [
      { id: 'c-lilac', name: 'Tím Lilac', hex: '#c084fc', phoneColor: '#a855f7', imageBg: '#fdf2f8' },
      { id: 'c-navy', name: 'Xanh Navy', hex: '#1e3a8a', phoneColor: '#1e293b', imageBg: '#e0f2fe' },
      { id: 'c-lemon', name: 'Vàng Chanh', hex: '#fef08a', phoneColor: '#ca8a04', imageBg: '#fefce8' }
    ],
    specs: {
      camera: '50MP (f/1.8 OIS Chống rung quang học) + 12MP (Góc siêu rộng) + 5MP (Macro), Camera trước 32MP',
      os: 'One UI 7.0 trên nền Android 15 (Cam kết cập nhật 4 năm)',
      storage: '128GB / 256GB UFS 3.1',
      network: '5G Kép thông minh',
      sim: 'SIM kép (nano SIM + nano SIM hoặc thẻ nhớ MicroSD)',
      chipset: 'Samsung Exynos 1480 (4nm, GPU Xclipse 530 hợp tác với AMD)',
      screenTech: 'Super AMOLED 120Hz Vision Booster sắc nét',
      resolution: '2340 x 1080 pixels (FHD+)',
      screenSize: '6.6 inch viền đều thanh thoát',
      batteryAndCharging: '5000mAh, Sạc nhanh siêu tốc 25W',
      material: 'Khung viền kim loại chắc chắn, Mặt lưng kính Gorilla Glass Victus+',
      ports: 'USB Type-C, Chuẩn kháng nước kháng bụi chuẩn IP67'
    },
    article: {
      toc: [
        'Samsung Galaxy A37 5G: Nâng tầm trải nghiệm phân khúc cận cao cấp',
        'Thiết kế khung kim loại sang trọng cùng chuẩn kháng nước IP67',
        'Camera 50MP chống rung OIS bắt nét sắc sảo trong đêm',
        'Màn hình Super AMOLED 120Hz rực rỡ ngoài trời'
      ],
      paragraphs: [
        'Galaxy A37 5G tiếp nối thành công vang dội của dòng Galaxy A với thiết kế Key Island bo cong nhẹ cùng khung viền kim loại sang trọng.',
        'Khả năng kháng nước chuẩn IP67 giúp bạn yên tâm sử dụng dưới trời mưa hay môi trường bụi bặm.',
        'GPU kiến trúc đồ họa AMD mang lại trải nghiệm chiến mượt các tựa game hot như Liên Quân, Tốc Chiến ở khung hình ổn định 60-120fps.'
      ]
    },
    reviews: [
      {
        id: 'rev-ss1',
        author: 'Lê Hoàng Nam',
        avatarColor: 'bg-purple-700',
        timeAgo: '1 ngày trước',
        rating: 5,
        comment: 'Màu tím nhìn rất tươi và trẻ trung, màn hình Samsung thì màu sắc khỏi chê rồi, xem phim cực kỳ đã mắt.'
      }
    ],
    comparisons: [
      { id: 'cp-ss1', name: 'HONOR X7d 5G 8GB/256GB', price: 6490000, originalPrice: 6990000, tradeInPrice: 5490000, saved: '500.000 ₫', phoneColor: '#0284c7' }
    ]
  },

  // 5. OPPO Reno15 F 5G
  'oppo-reno15-f': {
    id: 'p5',
    slug: 'oppo-reno15-f-5g-8gb-256gb',
    name: 'OPPO Reno15 F 5G 8GB+256GB - Chân Dung AI',
    brand: 'OPPO',
    category: 'Điện thoại',
    sku: 'OPPO-R15F-256',
    price: 10990000,
    originalPrice: 11990000,
    installmentText: 'Trả góp 0% chỉ từ 1,221,000 ₫ x 6 tháng >',
    memberDiscountPercent: 1.20,
    tradeInDiscount: 2000000,
    rating: 4.8,
    reviewCount: 29,
    starBreakdown: [
      { star: 5, pct: 86 },
      { star: 4, pct: 14 },
      { star: 3, pct: 0 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-256', storage: '256GB', price: 10990000, originalPrice: 11990000 },
      { id: 'v-512', storage: '512GB', price: 12490000, originalPrice: 13990000 }
    ],
    colors: [
      { id: 'c-orange', name: 'Cam Ánh Kim', hex: '#fed7aa', phoneColor: '#ea580c', imageBg: '#ffedd5' },
      { id: 'c-green', name: 'Xanh Khổng Tước', hex: '#009981', phoneColor: '#047857', imageBg: '#ecfdf5' },
      { id: 'c-black', name: 'Đen Thạch Anh', hex: '#18181b', phoneColor: '#09090b', imageBg: '#f4f4f5' }
    ],
    specs: {
      camera: '50MP AI Portrait Cảm biến lớn + 8MP Góc siêu rộng + 2MP Macro, Camera trước 32MP Tự sướng thông minh',
      os: 'ColorOS 15 (Android 15)',
      storage: '256GB (Hỗ trợ mở rộng RAM ảo lên đến 16GB)',
      network: '5G Dual SIM',
      sim: '2 Nano SIM',
      chipset: 'Qualcomm Snapdragon 6 Gen 1 5G (4nm)',
      screenTech: 'AMOLED 120Hz 1 tỷ màu, Độ sáng 1200 nits',
      resolution: '2400 x 1080 pixels (Full HD+)',
      screenSize: '6.67 inch viền cong 3D sang trọng',
      batteryAndCharging: '7000mAh Siêu khủng (Mỏng nhẹ bất ngờ), Sạc nhanh 67W SuperVOOC',
      material: 'Mặt lưng phản chiếu ánh sáng gradient, chống bám dấu vân tay',
      ports: 'USB Type-C, Loa kép Stereo siêu lớn 300%'
    },
    article: {
      toc: [
        'OPPO Reno15 F: Thiết kế mỏng nhẹ đẳng cấp thời trang',
        'Dung lượng pin kỷ lục 7000mAh thách thức mọi giới hạn sử dụng',
        'Camera chân dung xóa phông AI chuyên nghiệp như studio',
        'Sạc siêu tốc 67W nạp đầy pin chỉ trong 45 phút'
      ],
      paragraphs: [
        'Reno15 F 5G tiếp tục khẳng định vị thế của dòng điện thoại chuyên gia chân dung với các thuật toán làm đẹp tự nhiên và xóa phông bồ đề mịn màng.',
        'Điểm đột phá lớn nhất là viên pin 7000mAh nhưng độ dày thân máy chỉ vỏn vẹn 7.6mm, đem đến cảm giác cầm nắm nhẹ nhàng thoải mái.',
        'Màn hình AMOLED 120Hz 1 tỷ màu tái tạo hình ảnh rực rỡ, sắc nét cho mọi trải nghiệm giải trí.'
      ]
    },
    reviews: [
      {
        id: 'rev-rf1',
        author: 'Nguyễn Thị Ngọc',
        avatarColor: 'bg-pink-600',
        timeAgo: '4 ngày trước',
        rating: 5,
        comment: 'Màu cam ánh kim bên ngoài lấp lánh đẹp mê ly. Camera selfie chụp nét từng sợi tóc mà da vẫn mịn màng tự nhiên!'
      }
    ],
    comparisons: [
      { id: 'cp-rf1', name: 'HONOR X7d 5G 8GB/256GB', price: 6490000, originalPrice: 6990000, tradeInPrice: 5490000, saved: '500.000 ₫', phoneColor: '#0284c7' }
    ]
  },

  // 6. Củ Sạc Anker GaN 65W
  'cu-sac-nhanh-anker-prime-gan-65w': {
    id: 'p8',
    slug: 'cu-sac-nhanh-anker-prime-gan-65w',
    name: 'Củ Sạc Nhanh Anker Prime GaN 65W 3 Cổng - Chính Hãng',
    brand: 'Anker',
    category: 'Phụ kiện',
    sku: 'ANK-GAN-65W',
    price: 890000,
    originalPrice: 1150000,
    installmentText: 'Hỗ trợ thanh toán thẻ tín dụng & Ví trả sau',
    memberDiscountPercent: 5.0,
    tradeInDiscount: 100000,
    rating: 5.0,
    reviewCount: 56,
    starBreakdown: [
      { star: 5, pct: 98 },
      { star: 4, pct: 2 },
      { star: 3, pct: 0 },
      { star: 2, pct: 0 },
      { star: 1, pct: 0 }
    ],
    versions: [
      { id: 'v-65w', storage: 'Công suất 65W', price: 890000, originalPrice: 1150000 },
      { id: 'v-100w', storage: 'Công suất 100W', price: 1390000, originalPrice: 1690000 }
    ],
    colors: [
      { id: 'c-carbon', name: 'Đen Carbon', hex: '#111827', phoneColor: '#18181b', imageBg: '#f4f4f5' },
      { id: 'c-titan', name: 'Bạc Titanium', hex: '#9ca3af', phoneColor: '#71717a', imageBg: '#e4e4e7' }
    ],
    specs: {
      camera: 'Không áp dụng (Thiết bị sạc công nghệ GaN)',
      os: 'Tương thích mọi hệ điều hành: iOS, Android, macOS, Windows',
      storage: 'Hỗ trợ PowerIQ 4.0 thông minh phân bổ nguồn điện',
      network: 'Bảo vệ quá dòng, chống quá nhiệt ActiveShield 2.0',
      sim: '3 Cổng ra: 2 x USB-C và 1 x USB-A',
      chipset: 'Vi xử lý GaN III thế hệ mới hiệu suất 95%',
      screenTech: 'Vỏ chống cháy cao cấp, kích thước thu gọn 53%',
      resolution: 'Nguồn vào: 100-240V ~ 50/60Hz',
      screenSize: 'Kích thước siêu nhỏ bỏ túi quần: 43 x 38 x 50 mm',
      batteryAndCharging: 'Công suất tối đa 65W, sạc cùng lúc MacBook Air, iPhone và iPad',
      material: 'Hợp kim nhôm và nhựa PC chống cháy',
      ports: '2 cổng USB-C 65W Max + 1 cổng USB-A 22.5W Max'
    },
    article: {
      toc: [
        'Công nghệ GaN III thu nhỏ kích thước củ sạc đến 53%',
        'Sạc nhanh đồng thời 3 thiết bị với công nghệ PowerIQ 4.0',
        'Hệ thống an toàn ActiveShield 2.0 kiểm soát nhiệt 3 triệu lần/ngày'
      ],
      paragraphs: [
        'Củ sạc Anker Prime GaN 65W là phụ kiện không thể thiếu cho người dùng công nghệ, hỗ trợ sạc nhanh cho cả laptop, tablet và smartphone chỉ với 1 củ sạc duy nhất.',
        'Sử dụng bán dẫn Gallium Nitride thế hệ thứ 3 giúp giảm nhiệt độ tỏa ra đáng kể và tiết kiệm điện năng.',
        'Hệ thống ActiveShield 2.0 liên tục giám sát nhiệt độ 3 triệu lần mỗi ngày để bảo vệ tối đa pin của thiết bị.'
      ]
    },
    reviews: [
      {
        id: 'rev-ak1',
        author: 'Vũ Quốc Huy',
        avatarColor: 'bg-emerald-600',
        timeAgo: '1 ngày trước',
        rating: 5,
        comment: 'Củ sạc nhỏ gọn bằng quả trứng mà sạc được cả MacBook Air lẫn iPhone 16 Pro Max, cắm không bị nóng.'
      }
    ],
    comparisons: [
      { id: 'cp-ak1', name: 'Củ Sạc Apple 20W USB-C', price: 520000, tradeInPrice: 450000, phoneColor: '#f3f4f6' }
    ]
  }
};

