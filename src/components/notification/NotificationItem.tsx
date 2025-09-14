import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: string;
    tieuDe: string;
    noiDung: string;
    loai: 'THONG_BAO' | 'CANH_BAO' | 'LOI';
    trangThai: 'CHUA_DOC' | 'DA_DOC';
    thoiGianTao: string;
    thoiGianDoc: string | null;
    duLieuBoSung?: Record<string, any>;
  };
  onClick: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'THONG_BAO':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'CANH_BAO':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'LOI':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div 
      onClick={() => onClick(notification.id)}
      className={cn(
        "p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0",
        notification.trangThai === 'CHUA_DOC' ? 'bg-blue-50' : 'bg-white'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getIcon(notification.loai)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={cn(
              "text-sm font-medium text-gray-900 truncate",
              notification.trangThai === 'CHUA_DOC' && "font-bold"
            )}>
              {notification.tieuDe}
            </p>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {formatDate(notification.thoiGianTao)}
              </span>
              {notification.trangThai === 'CHUA_DOC' && (
                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {notification.noiDung}
          </p>
        </div>
      </div>
    </div>
  );
}