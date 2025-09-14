import axios from 'axios';
import { NotificationDto, NotificationFilters, NotificationListResponse, NotificationSettings } from '@/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const notificationService = {
  getNotifications: async (filters: NotificationFilters): Promise<NotificationListResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/thong-bao`, {
      params: filters,
    });
    return response.data;
  },

  getNotificationDetail: async (id: string): Promise<NotificationDto> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/thong-bao/${id}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axios.put(`${API_BASE_URL}/api/v1/thong-bao/${id}/danh-dau-da-doc`);
  },

  markMultipleAsRead: async (ids: string[]): Promise<void> => {
    await axios.put(`${API_BASE_URL}/api/v1/thong-bao/danh-dau-da-doc`, {
      danhSachId: ids,
    });
  },

  getSettings: async (userId: string): Promise<NotificationSettings> => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/thong-bao/cai-dat/${userId}`);
    return response.data;
  },

  updateSettings: async (userId: string, settings: Omit<NotificationSettings, 'userId'>): Promise<void> => {
    await axios.put(`${API_BASE_URL}/api/v1/thong-bao/cai-dat/${userId}`, settings);
  },
};