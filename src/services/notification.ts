import { api } from '@/config/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private static instance: NotificationService;
  private unreadCount: number = 0;
  private listeners: ((count: number) => void)[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications');
      this.setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      this.decrementUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  private setUnreadCount(count: number) {
    this.unreadCount = count;
    this.notifyListeners();
  }

  private decrementUnreadCount() {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    this.notifyListeners();
  }

  addListener(listener: (count: number) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (count: number) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.unreadCount));
  }
}

export const notificationService = NotificationService.getInstance();