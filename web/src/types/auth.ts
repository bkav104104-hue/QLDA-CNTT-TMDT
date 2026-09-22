export interface UserProfile {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  role: string;
  memberTier: string;
  rewardPoints: number;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
  statusCode: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  dateOfBirth?: string;
}
