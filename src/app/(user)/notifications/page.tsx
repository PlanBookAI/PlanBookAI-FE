'use client';

import { useEffect, useState, useCallback } from 'react';
import { NotificationDto, NotificationFilter } from '@/types';
import { notificationService } from '@/services/notification';
import {
  NotificationCard,
  NotificationFilters,
  NotificationList,
} from '@/components/notification';
import { useDebounce } from '@/hooks/useDebounce';
import { useWebSocket } from '@/providers/WebSocketProvider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRetry } from '@/hooks/useRetry';
import { toast } from 'react-hot-toast';

const DEFAULT_PAGE_SIZE = 10;

export default function NotificationsPage() {
  // State
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Debounce filter changes
  const debouncedFilters = useDebounce(filters, 300);

  // Setup retry logic
  const { executeWithRetry, isRetrying } = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await executeWithRetry(
        () => notificationService.getNotifications(filters),
        undefined,
        (error) => {
          const errorMessage = error.message === 'Failed to fetch' 
            ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
            : error.message;
          
          toast.error(`Lỗi: ${errorMessage}`);
        }
      );

      if (response.thanhCong) {
        const { danhSach, tongSo, trangHienTai, soTrangToiDa } = response.duLieu;
        
        setNotifications(prev => 
          isLoadMore ? [...prev, ...danhSach] : danhSach
        );
        setHasMore(trangHienTai < soTrangToiDa);
      } else {
        setError(response.thongBao);
        toast.error(response.thongBao);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(!isRetrying);
    }
  }, [filters, executeWithRetry, isRetrying]);

  // Load more notifications
  const handleLoadMore = useCallback(() => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: NotificationFilter) => {
    setFilters({ ...newFilters, page: 1 });
  }, []);

  // Mark notification as read
  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await executeWithRetry(
        () => notificationService.markAsRead(id),
        () => {
          setNotifications(prev =>
            prev.map(notification =>
              notification.id === id
                ? { ...notification, daDoc: true, trangThai: 'Read' }
                : notification
            )
          );
          toast.success('Đã đánh dấu đã đọc');
        },
        (error) => {
          toast.error('Không thể đánh dấu đã đọc: ' + error.message);
        }
      );
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  }, [executeWithRetry]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    if (!confirm('Bạn có chắc muốn đánh dấu tất cả là đã đọc?')) {
      return;
    }

    try {
      await executeWithRetry(
        () => notificationService.markAllAsRead(),
        () => {
          setNotifications(prev =>
            prev.map(notification => ({
              ...notification,
              daDoc: true,
              trangThai: 'Read'
            }))
          );
          toast.success('Đã đánh dấu tất cả là đã đọc');
        },
        (error) => {
          toast.error('Không thể đánh dấu tất cả là đã đọc: ' + error.message);
        }
      );
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  }, [executeWithRetry]);

  // Delete notification
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa thông báo này?')) {
      return;
    }

    try {
      await executeWithRetry(
        () => notificationService.deleteNotification(id),
        () => {
          setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
          );
          toast.success('Đã xóa thông báo');
        },
        (error) => {
          toast.error('Không thể xóa thông báo: ' + error.message);
        }
      );
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  }, [executeWithRetry]);

  // WebSocket integration
  const { onNotification } = useWebSocket();

  // Handle new notifications
  const handleNewNotification = useCallback((notification: NotificationDto) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Initial load and filter changes
  useEffect(() => {
    fetchNotifications();
  }, [debouncedFilters]);

  // Subscribe to new notifications
  useEffect(() => {
    const unsubscribe = onNotification(handleNewNotification);
    return () => unsubscribe();
  }, [handleNewNotification, onNotification]);

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <NotificationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchNotifications()}
              className="text-sm font-medium hover:text-red-800 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="mt-6 relative min-h-[400px]">
          {isLoading && !notifications.length ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <LoadingSpinner size="lg" message="Đang tải thông báo..." />
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}