import axios from 'axios';
import type {
  User,
  Complaint,
  AnalyticsOverview,
  RoadAnalytics,
  PublicSpending,
  Notification,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('roadwatch_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('roadwatch_token');
      localStorage.removeItem('roadwatch_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>(
      '/auth/login',
      { email, password }
    );
    return data;
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    role: 'citizen' | 'authority';
    phone?: string;
  }) => {
    const { data } = await api.post<{ token: string; user: User }>(
      '/auth/register',
      payload
    );
    return data;
  },

  me: async () => {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data;
  },
};

// ─── Complaints API ───
export const complaintsAPI = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    category?: string;
    sortBy?: string;
    order?: string;
  }) => {
    const { data } = await api.get<{
      complaints: Complaint[];
      total: number;
      page: number;
      totalPages: number;
    }>('/complaints', { params });
    return data;
  },

  my: async () => {
    const { data } = await api.get<{
      data: Complaint[];
    }>('/complaints/my');
    return data;
  },

  create: async (formData: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('roadwatch_token') : null;
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw { response: { data: err } };
    }
    
    const data = await response.json();
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ complaint: Complaint }>(
      `/complaints/${id}`
    );
    return data;
  },

  updateStatus: async (
    id: string,
    payload: { status: string; note?: string }
  ) => {
    const { data } = await api.patch<{ complaint: Complaint }>(
      `/complaints/${id}/status`,
      payload
    );
    return data;
  },

  updatePriority: async (id: string, priority: number) => {
    const { data } = await api.patch<{ complaint: Complaint }>(
      `/complaints/${id}/priority`,
      { priority }
    );
    return data;
  },
};

// ─── Analytics API ───
export const analyticsAPI = {
  overview: async () => {
    const { data } = await api.get<AnalyticsOverview>('/analytics/overview');
    return data;
  },

  roadHealth: async (area?: string) => {
    const { data } = await api.get<RoadAnalytics[]>('/analytics/road-health', {
      params: area ? { area } : undefined,
    });
    return data;
  },

  trends: async (params?: { period?: string; area?: string }) => {
    const { data } = await api.get<
      Array<{ date: string; complaints: number; resolved: number }>
    >('/analytics/trends', { params });
    return data;
  },

  heatmap: async () => {
    const { data } = await api.get<
      Array<{ lat: number; lng: number; intensity: number }>
    >('/analytics/heatmap');
    return data;
  },
};

// ─── Spending API ───
export const spendingAPI = {
  list: async (params?: { area?: string; fiscalYear?: string }) => {
    const { data } = await api.get<{ spending: PublicSpending[] }>(
      '/spending',
      { params }
    );
    return data;
  },

  summary: async () => {
    const { data } = await api.get<{
      totalAllocated: number;
      totalReleased: number;
      totalSpent: number;
      averageTransparencyScore: number;
    }>('/spending/summary');
    return data;
  },
};

// ─── Notifications API ───
export const notificationsAPI = {
  list: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<{
      notifications: Notification[];
      total: number;
    }>('/notifications', { params });
    return data;
  },

  unreadCount: async () => {
    const { data } = await api.get<{ count: number }>(
      '/notifications/unread-count'
    );
    return data;
  },

  markRead: async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllRead: async () => {
    const { data } = await api.patch('/notifications/read-all');
    return data;
  },
};

export default api;
