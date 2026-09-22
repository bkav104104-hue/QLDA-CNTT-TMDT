import { apiClient } from './apiClient';

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  iconName?: string;
  badge?: string;
  isHot?: boolean;
  group?: 'main' | 'secondary' | 'news';
  urlHash: string;
  productCount?: number;
}

export interface HomeCatalogData {
  mainCategories: CategoryItem[];
  secondaryCategories: CategoryItem[];
  newsCategories: CategoryItem[];
}

export interface TechNewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  author: string;
  category: string;
  publishedAt: string;
  viewCount: number;
  aiSummary: string;
}

export const categoryService = {
  async getHomeCatalog(): Promise<HomeCatalogData> {
    try {
      const response = await apiClient.get<{ success: boolean; data: HomeCatalogData }>('/categories/home-catalog');
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Không có dữ liệu danh mục');
    } catch (err) {
      console.warn('Sử dụng danh mục dự phòng:', err);
      return defaultHomeCatalog;
    }
  },

  async getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: CategoryItem }>(`/categories/by-slug/${slug}`);
      return response.data?.data || null;
    } catch (err) {
      console.warn(`Không thể lấy danh mục ${slug}:`, err);
      return null;
    }
  },

  async getHotNews(): Promise<TechNewsArticle[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: TechNewsArticle[] }>('/news/hot');
      return response.data?.data || [];
    } catch (err) {
      console.warn('Lấy tin tức dự phòng:', err);
      return fallbackNews;
    }
  },

  async getAllNews(): Promise<TechNewsArticle[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: TechNewsArticle[] }>('/news');
      return response.data?.data || [];
    } catch (err) {
      console.warn('Lấy tin tức dự phòng:', err);
      return fallbackNews;
    }
  }
};

export const defaultHomeCatalog: HomeCatalogData = {
  mainCategories: [
    { id: 1, name: 'Điện thoại', slug: 'dienthoai', iconName: 'Smartphone', isHot: true, group: 'main', urlHash: '#cat-dienthoai' },
    { id: 2, name: 'Laptop', slug: 'laptop', iconName: 'Laptop', group: 'main', urlHash: '#cat-laptop' },
    { id: 3, name: 'Tablet', slug: 'tablet', iconName: 'Tablet', group: 'main', urlHash: '#cat-tablet' },
    { id: 7, name: 'Màn hình', slug: 'manhinh', iconName: 'Monitor', group: 'main', urlHash: '#cat-manhinh' },
    { id: 8, name: 'PC, Linh kiện máy tính', slug: 'pclinhkien', iconName: 'Cpu', group: 'main', urlHash: '#cat-pclinhkien' },
    { id: 6, name: 'Đồng hồ', slug: 'dongho', iconName: 'Watch', group: 'main', urlHash: '#cat-dongho' },
    { id: 5, name: 'Âm thanh', slug: 'amthanh', iconName: 'Headphones', group: 'main', urlHash: '#cat-amthanh' },
    { id: 9, name: 'Tivi, Điện máy', slug: 'tividienmay', iconName: 'Tv', group: 'main', urlHash: '#cat-tividienmay' },
    { id: 10, name: 'Smart home, Camera', slug: 'smarthome', iconName: 'Camera', group: 'main', urlHash: '#cat-smarthome' },
    { id: 4, name: 'Phụ kiện', slug: 'phukien', iconName: 'Cable', isHot: true, group: 'main', urlHash: '#cat-phukien' },
    { id: 11, name: 'Sửa chữa', slug: 'suachua', iconName: 'Wrench', group: 'main', urlHash: '#cat-suachua' },
    { id: 12, name: 'Dịch vụ', slug: 'dichvu', iconName: 'FileText', group: 'main', urlHash: '#cat-dichvu' },
  ],
  secondaryCategories: [
    { id: 13, name: 'Hàng cũ', slug: 'hangcu', iconName: 'RotateCcw', group: 'secondary', urlHash: '#cat-hangcu' },
    { id: 14, name: 'Thu cũ đổi mới', slug: 'thucudoimoi', iconName: 'Sparkles', badge: 'Trợ giá 100K', group: 'secondary', urlHash: '#cat-thucudoimoi' },
  ],
  newsCategories: [
    { id: 15, name: 'Tin hot công nghệ', slug: 'tinhotcongnghe', iconName: 'Flame', isHot: true, group: 'news', urlHash: '#cat-tinhotcongnghe' }
  ]
};

const fallbackNews: TechNewsArticle[] = [
  {
    id: 1,
    title: 'Đánh giá chi tiết iPhone 17 Pro Max: Khung viền Titan bóng, chip A19 Pro và tản nhiệt buồng hơi vượt trội',
    slug: 'danh-gia-chi-tiet-iphone-17-pro-max-titan-a19-pro',
    summary: 'Apple tiếp tục khẳng định vị thế dẫn đầu phân khúc smartphone cao cấp với iPhone 17 Pro Max trang bị chip A19 Pro.',
    content: 'iPhone 17 Pro Max là bước chuyển mình mạnh mẽ của Apple...',
    thumbnailUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    author: 'NextPhone Reviewer',
    category: 'Đánh giá công nghệ',
    publishedAt: new Date().toISOString(),
    viewCount: 4820,
    aiSummary: 'iPhone 17 Pro Max nâng cấp tản nhiệt graphene, chip A19 Pro mạnh hơn 25%, camera zoom 10x quang học.'
  },
  {
    id: 2,
    title: 'So sánh sạc nhanh GaN 65W và sạc truyền thống: Tại sao bạn nên đổi củ sạc ngay hôm nay?',
    slug: 'so-sanh-sac-nhanh-gan-65w-va-sac-truyen-thong',
    summary: 'Công nghệ bán dẫn GaN giúp giảm kích thước củ sạc tới 50% trong khi tăng gấp đôi hiệu suất.',
    content: 'Củ sạc GaN 65W cho phép sạc đồng thời 3 thiết bị...',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    author: 'NextPhone Lab',
    category: 'Tư vấn phụ kiện',
    publishedAt: new Date().toISOString(),
    viewCount: 2950,
    aiSummary: 'Sạc GaN 65W nhỏ gọn hơn 50%, sạc nhanh 3 thiết bị cùng lúc, tỏa ít nhiệt hơn.'
  }
];

