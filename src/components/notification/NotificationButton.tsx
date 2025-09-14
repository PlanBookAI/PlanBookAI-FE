'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { notificationService } from '@/services/notification';
import { NotificationFilters } from '@/types/notification';

export function NotificationButton() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const filters: NotificationFilters = {
          trang: 1,
          soLuong: 1, // We only need the total count
          trangThai: 'CHUA_DOC',
        };

        const response = await notificationService.getNotifications(filters);
        if (response.thanhCong) {
          setUnreadCount(response.duLieu.tongSo);
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    fetchUnreadCount();
    // TODO: Implement real-time updates with WebSocket
    const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={() => router.push('/notifications')}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
}