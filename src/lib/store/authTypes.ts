export interface User {
  id: number;
  name?: string;
  username?: string;
  email: string;
  phone?: string;
  role?: string;
  permissions?: string[];
  status?: string;
  avatar?: string;
  image?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  about?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string;
  userPermissions: string[];
  isFetchingUser: boolean;
  lastFetchTime: number;
  isInitialized: boolean;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  sendOtpRegister: (email: string) => Promise<AuthResult>;
  sendOtpForgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  fetchUserInfo: (force?: boolean) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshUserInfo: () => Promise<void>;
  refreshToken: () => Promise<AuthResult>;
  initFromStorage: () => Promise<boolean>;
  clearAuthState: () => void;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  setUser: (user: User) => void;
}

/** Empty auth state fields - dùng để reset state, tránh lặp code */
export const EMPTY_AUTH_STATE: Pick<AuthState, 'isAuthenticated' | 'user' | 'userRole' | 'userPermissions'> = {
  isAuthenticated: false,
  user: null,
  userRole: "",
  userPermissions: [],
};
