import { apiClient } from './apiClient';

export interface AdminDashboardStats {
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalOrders: number;
  pendingOrdersCount: number;
  shippingOrdersCount: number;
  completedOrdersCount: number;
  totalProducts: number;
  activeProductsCount: number;
  lowStockProductsCount: number;
  flaggedReviewsCount: number;
  averageOrderValue: number;
  revenueChart: { date: string; revenue: number; orderCount: number }[];
  topProducts: {
    productId: number;
    name: string;
    thumbnailUrl: string;
    soldCount: number;
    revenue: number;
    currentStock: number;
  }[];
}

export interface AdminProductItem {
  id: number;
  name: string;
  slug: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  basePrice: number;
  originalPrice?: number;
  discountPercent: number;
  memberDiscountPercent: number;
  totalStockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isHot: boolean;
  thumbnailUrl?: string;
  warrantyMonths: number;
  chipset?: string;
  ramCapacity?: string;
  storageCapacity?: string;
  batteryCapacity?: string;
  screenSpecs?: string;
  cameraSpecs?: string;
  description?: string;
  createdAt: string;
}

export interface AdminProductCreateUpdatePayload {
  name: string;
  slug?: string;
  brandId: number;
  categoryId: number;
  basePrice: number;
  originalPrice?: number;
  discountPercent: number;
  memberDiscountPercent?: number;
  warrantyMonths: number;
  description?: string;
  thumbnailUrl?: string;
  ramCapacity?: string;
  storageCapacity?: string;
  chipset?: string;
  batteryCapacity?: string;
  screenSpecs?: string;
  cameraSpecs?: string;
  isFeatured?: boolean;
  isHot?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  initialStockQuantity?: number;
}

export interface AdminOrder {
  id: number;
  orderCode: string;
  userId?: number;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  shippingAddress: string;
  subTotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  items: {
    id: number;
    productName: string;
    variantSummary?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface LowStockAlert {
  productId: number;
  productName: string;
  thumbnailUrl?: string;
  categoryName: string;
  currentStock: number;
  alertThreshold: number;
  severity: 'CRITICAL' | 'WARNING';
}

export interface InventoryLog {
  id: number;
  productId: number;
  productName: string;
  productVariantId?: number;
  type: 'IMPORT' | 'EXPORT' | 'ADJUST';
  quantity: number;
  unitPrice?: number;
  supplierOrDestination?: string;
  note?: string;
  createdBy?: string;
  createdAt: string;
}

export interface ReviewModerationItem {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  userPhone?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isFlaggedByAi: boolean;
  aiFlagReason?: string;
  aiFlagConfidence?: number;
  moderationStatus: 'Pending' | 'Approved' | 'Rejected';
  adminResponse?: string;
  createdAt: string;
}

export const adminService = {
  // 1. Dashboard Stats
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await apiClient.get<{ success: boolean; data: AdminDashboardStats }>('/admin/dashboard/stats');
    return res.data.data;
  },

  // 2. Products
  async getAllProducts(): Promise<AdminProductItem[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminProductItem[] }>('/admin/products');
    return res.data.data;
  },

  async getProductById(id: number): Promise<AdminProductItem> {
    const res = await apiClient.get<{ success: boolean; data: AdminProductItem }>(`/admin/products/${id}`);
    return res.data.data;
  },

  async createProduct(payload: AdminProductCreateUpdatePayload): Promise<AdminProductItem> {
    const res = await apiClient.post<{ success: boolean; data: AdminProductItem }>('/admin/products', payload);
    return res.data.data;
  },

  async updateProduct(id: number, payload: AdminProductCreateUpdatePayload): Promise<AdminProductItem> {
    const res = await apiClient.put<{ success: boolean; data: AdminProductItem }>(`/admin/products/${id}`, payload);
    return res.data.data;
  },

  async toggleProductStatus(id: number): Promise<boolean> {
    const res = await apiClient.patch<{ success: boolean; data: boolean }>(`/admin/products/${id}/toggle-status`);
    return res.data.data;
  },

  async deleteProduct(id: number): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean; data: boolean }>(`/admin/products/${id}`);
    return res.data.data;
  },

  // 3. Orders
  async getAllOrders(): Promise<AdminOrder[]> {
    const res = await apiClient.get<{ success: boolean; data: AdminOrder[] }>('/admin/orders');
    return res.data.data;
  },

  async updateOrderStatus(
    orderId: number, 
    payload: { 
      orderStatus: string; 
      paymentStatus?: string; 
      trackingCode?: string; 
      shippingProvider?: string; 
      adminNote?: string 
    }
  ): Promise<AdminOrder> {
    const res = await apiClient.put<{ success: boolean; data: AdminOrder }>(`/admin/orders/${orderId}/status`, payload);
    return res.data.data;
  },

  // 4. Inventory
  async getLowStockAlerts(threshold = 10): Promise<LowStockAlert[]> {
    const res = await apiClient.get<{ success: boolean; data: LowStockAlert[] }>(`/admin/inventory/alerts?threshold=${threshold}`);
    return res.data.data;
  },

  async getInventoryLogs(): Promise<InventoryLog[]> {
    const res = await apiClient.get<{ success: boolean; data: InventoryLog[] }>('/admin/inventory/logs');
    return res.data.data;
  },

  async createInventoryImport(payload: {
    productId: number;
    productVariantId?: number;
    quantity: number;
    unitPrice?: number;
    supplierOrDestination?: string;
    note?: string;
  }): Promise<InventoryLog> {
    const res = await apiClient.post<{ success: boolean; data: InventoryLog }>('/admin/inventory/import', payload);
    return res.data.data;
  },

  // 5. Moderation
  async getReviewsForModeration(onlyFlagged?: boolean): Promise<ReviewModerationItem[]> {
    const url = onlyFlagged !== undefined 
      ? `/admin/reviews/moderation?onlyFlagged=${onlyFlagged}` 
      : '/admin/reviews/moderation';
    const res = await apiClient.get<{ success: boolean; data: ReviewModerationItem[] }>(url);
    return res.data.data;
  },

  async moderateReview(
    reviewId: number, 
    payload: { moderationStatus: 'Approved' | 'Rejected' | 'Pending'; adminResponse?: string }
  ): Promise<ReviewModerationItem> {
    const res = await apiClient.put<{ success: boolean; data: ReviewModerationItem }>(`/admin/reviews/${reviewId}/moderate`, payload);
    return res.data.data;
  }
};
