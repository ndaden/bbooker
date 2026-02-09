import { apiClient } from './client';

// Types
export interface User {
  id: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    address?: string;
  };
  role: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  owner: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// Types
export interface AuthResponse {
  success: boolean;
  message: string;
  payload?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  passwordAgain: string;
  accountType: "STANDARD" | "OWNER";
}

// Profile Types
export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth Services
export const authService = {
  getProfile: (): Promise<{ payload: User }> =>
    apiClient.get('/auth/profile'),

  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/auth/login', credentials),

  signup: (userData: SignupCredentials): Promise<AuthResponse> =>
    apiClient.post('/auth/signup', userData),

  logout: (): Promise<AuthResponse> =>
    apiClient.get('/auth/logout'),

  updateProfile: (data: UpdateProfileData): Promise<AuthResponse> => {
    return apiClient.patch('/auth/profile', data);
  },

  changePassword: (data: ChangePasswordData): Promise<AuthResponse> => {
    return apiClient.patch('/auth/password', data);
  },
};

// Business Services
export const businessService = {
  getAll: (): Promise<{ payload: Business[] }> =>
    apiClient.get('/business'),

  getById: (id: string): Promise<{ payload: Business }> =>
    apiClient.get(`/business/${id}`),

  getByOwner: (ownerid: string): Promise<{ payload: Business[] }> =>
    apiClient.get(`/business?ownerid=${ownerid}`),

  create: (businessData: any) =>
    apiClient.post('/business', businessData),
};

// Service Services
export const serviceService = {
  getAll: () => apiClient.get('/service'),
  
  getByBusiness: (businessId: string) =>
    apiClient.get(`/service?businessId=${businessId}`),

  create: (serviceData: any) =>
    apiClient.post('/service/create', serviceData),
};

// Appointment Services
export const appointmentService = {
  getAll: () => apiClient.get('/appointment'),

  create: (appointmentData: any) =>
    apiClient.post('/appointment', appointmentData),

  getSlots: ({
    businessId,
    startTimeInterval,
    endTimeInterval,
    slotDurationInMinutes,
  }: {
    businessId: string;
    startTimeInterval: string;
    endTimeInterval: string;
    slotDurationInMinutes: number;
  }) =>
    apiClient.get(
      `/appointment/slots/${businessId}?startTimeInterval=${startTimeInterval}&endTimeInterval=${endTimeInterval}&slotDurationInMinutes=${slotDurationInMinutes}`
    ),
};

// User & Role Services
export const userService = {
  getAll: () => apiClient.get('/user'),
  delete: (id: string) => apiClient.delete(`/user/${id}`),
};

export const roleService = {
  getAll: () => apiClient.get('/role'),
  create: (roleData: any) => apiClient.post('/role/create', roleData),
  delete: (id: string) => apiClient.delete(`/role/${id}`),
};