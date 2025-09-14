'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { NotificationFilter } from "@/components/notification/NotificationFilter";
import { NotificationSearch } from "@/components/notification/NotificationSearch";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { NotificationSettings } from "@/components/notification/NotificationSettings";

interface Notification {
  id: string;
  tieuDe: string;
  noiDung: string;
  loai: 'THONG_BAO' | 'CANH_BAO' | 'LOI';
  trangThai: 'CHUA_DOC' | 'DA_DOC';
  thoiGianTao: string;
  thoiGianDoc: string | null;
  duLieuBoSung?: Record<string, any>;
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("TAT_CA");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: true,
    preferences: {
      thongBaoKhoaHoc: true,
      thongBaoBaiTap: true,
      thongBaoKetQua: true,
      thongBaoHoatDong: true
    }
  });

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/v1/thong-bao?' + new URLSearchParams({
        trang: '1',
        soLuong: '10',
        trangThai: filter
      }));
      const data = await response.json();
      setNotifications(data.duLieu.danhSach);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    // TODO: Implement search
  };

  const handleTypeFilter = async (type: string) => {
    // TODO: Implement type filter
  };

  const handleDateFilter = async (startDate: string, endDate: string) => {
    // TODO: Implement date filter
  };

  const handleNotificationClick = async (id: string) => {
    // TODO: Implement notification click and mark as read
  };

  const handleMarkAllAsRead = async () => {
    // TODO: Implement mark all as read
  };

  const handleSaveSettings = async (newSettings: any) => {
    // TODO: Implement save settings
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => n.trangThai === 'CHUA_DOC').length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} chưa đọc
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="text-sm"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NotificationFilter
            selectedFilter={filter}
            onFilterChange={setFilter}
            unreadCount={unreadCount}
          />
          <NotificationSearch
            onSearch={handleSearch}
            onTypeFilter={handleTypeFilter}
            onDateFilter={handleDateFilter}
          />
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tất cả thông báo của bạn sẽ xuất hiện ở đây.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {showSettings && (
          <div className="lg:col-span-1">
            <NotificationSettings
              settings={settings}
              onSave={handleSaveSettings}
            />
          </div>
        )}
      </div>
    </div>
  );
}