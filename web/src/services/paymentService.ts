import { apiClient } from './apiClient';

export interface QrPaymentResponse {
  orderCode: string;
  amount: number;
  qrCodeUrl: string;
  qrContent: string;
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  transferContent: string;
  expiresAt: string;
  paymentStatus: string;
}

export interface CardPaymentRequest {
  orderCode: string;
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

export interface CardPaymentResponse {
  success: boolean;
  transactionCode: string;
  orderCode: string;
  amount: number;
  cardBrand: string;
  cardNumberMasked: string;
  status: string; // "Success" | "RequiresOtp" | "Failed"
  message: string;
  otpHint?: string;
  paidAt?: string;
}

export interface PaymentStatusResponse {
  orderCode: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  transactionCode?: string;
  paidAt?: string;
  transactions: Array<{
    id: number;
    transactionCode: string;
    paymentMethod: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface PaymentHistoryItem {
  id: number;
  transactionCode: string;
  orderCode: string;
  orderId: number;
  paymentMethod: string;
  amount: number;
  status: string;
  statusDisplay: string;
  receiverName: string;
  receiverPhone: string;
  methodDetails?: string;
  orderStatus?: string;
  createdAt: string;
}

export const paymentService = {
  // 1. Generate VietQR
  async createQrPayment(orderCode: string, bankCode?: string): Promise<QrPaymentResponse> {
    const res = await apiClient.post('/payment/qr/create', { orderCode, bankCode });
    return res.data.data;
  },

  // 2. Poll payment status
  async getPaymentStatus(orderCode: string): Promise<PaymentStatusResponse> {
    const res = await apiClient.get(`/payment/status/${orderCode}`);
    return res.data.data;
  },

  // 3. Simulate transfer (webhook test)
  async simulateTransfer(orderCode: string, amount?: number): Promise<PaymentStatusResponse> {
    const res = await apiClient.post('/payment/qr/simulate-transfer', { orderCode, amount });
    return res.data.data;
  },

  // 4. Process Credit Card
  async processCardPayment(data: CardPaymentRequest): Promise<CardPaymentResponse> {
    const res = await apiClient.post('/payment/card/process', data);
    return res.data.data;
  },

  // 5. Verify 3D-Secure OTP
  async verifyCardOtp(transactionCode: string, otpCode: string): Promise<CardPaymentResponse> {
    const res = await apiClient.post('/payment/card/verify-otp', { transactionCode, otpCode });
    return res.data.data;
  },

  // 6. Get Payment History
  async getPaymentHistory(params?: { orderCode?: string; userId?: number }): Promise<PaymentHistoryItem[]> {
    const res = await apiClient.get('/payment/history', { params });
    return res.data.data;
  },
};


