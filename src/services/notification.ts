import { NotificationDto, NotificationFilter, NotificationListResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const notificationService = {
  // Get notifications list with filters
  async getNotifications(filter: NotificationFilter): Promise<NotificationListResponse> {
    const queryParams = new URLSearchParams({
      page: filter.page.toString(),
      pageSize: filter.pageSize.toString(),
      ...(filter.loai && { loai: filter.loai }),
      ...(filter.trangThai && { trangThai: filter.trangThai }),
      ...(filter.doUuTien && { doUuTien: filter.doUuTien }),
      ...(filter.tuNgay && { tuNgay: filter.tuNgay }),
      ...(filter.denNgay && { denNgay: filter.denNgay }),
    });

    const response = await fetch(`${API_BASE_URL}/notifications?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  // Mark single notification as read
  async markAsRead(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/mark-as-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  // Delete a notification
  async deleteNotification(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },
};