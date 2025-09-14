'use client';

import { useState, useEffect } from 'react';
import { NotificationFilter } from '@/components/notification/NotificationFilter';
import { NotificationCard } from '@/components/notification/NotificationCard';
import { NotificationSettingsForm } from '@/components/notification/NotificationSettingsForm';
import { notificationService } from '@/services/notification';
import { NotificationDto, NotificationFilters, NotificationSettings } from '@/types/notification';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({
    trang: 1,
    soLuong: ITEMS_PER_PAGE,
    trangThai: 'TAT_CA',
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(filters);
      if (response.thanhCong) {
        setNotifications(response.duLieu.danhSach);
        setTotalItems(response.duLieu.tongSo);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      const userSettings = await notificationService.getSettings(userId);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  const handleNotificationClick = async (notification: NotificationDto) => {
    if (notification.trangThai === 'CHUA_DOC') {
      try {
        await notificationService.markAsRead(notification.id);
        // Update the local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id
              ? { ...n, trangThai: 'DA_DOC' as const }
              : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    // TODO: Show notification detail modal
  };

  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      trang: 1, // Reset page when filters change
    }));
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications
        .filter(n => n.trangThai === 'CHUA_DOC')
        .map(n => n.id);

      if (unreadNotifications.length > 0) {
        await notificationService.markMultipleAsRead(unreadNotifications);
        setNotifications(prev =>
          prev.map(n => ({ ...n, trangThai: 'DA_DOC' as const }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const loadMore = () => {
    setFilters(prev => ({
      ...prev,
      trang: prev.trang + 1,
    }));
  };

  if (showSettings && settings) {
    return (
      <div className="container max-w-3xl py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cài đặt thông báo</h1>
          <Button onClick={() => setShowSettings(false)}>
            Quay lại
          </Button>
        </div>
        <NotificationSettingsForm
          initialSettings={settings}
          onSave={() => {
            setShowSettings(false);
            fetchSettings();
          }}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <div className="space-x-4">
          <Button onClick={handleMarkAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowSettings(true)}
          >
            Cài đặt
          </Button>
        </div>
      </div>

      <NotificationFilter onFilterChange={handleFilterChange} />

      <div className="mt-8 space-y-4">
        {loading && <div className="text-center">Đang tải...</div>}
        
        {!loading && notifications.length === 0 && (
          <div className="text-center text-gray-500">
            Không có thông báo nào
          </div>
        )}

        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
          />
        ))}

        {!loading && notifications.length < totalItems && (
          <div className="text-center mt-4">
            <Button onClick={loadMore}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}