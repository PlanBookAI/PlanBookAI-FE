import { NotificationDto } from '@/types/notification';
import { formatRelativeTime } from '@/lib/utils';
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: NotificationDto;
  onClick: (notification: NotificationDto) => void;
}

const notificationIcons = {
  'THONG_BAO': Bell,
  'CANH_BAO': AlertTriangle,
  'LOI': AlertCircle,
};

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const Icon = notificationIcons[notification.loai];

  return (
    <div
      className={cn(
        'p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50',
        notification.trangThai === 'CHUA_DOC' ? 'bg-blue-50' : 'bg-white',
      )}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-2 rounded-full',
          notification.loai === 'THONG_BAO' && 'bg-blue-100 text-blue-600',
          notification.loai === 'CANH_BAO' && 'bg-yellow-100 text-yellow-600',
          notification.loai === 'LOI' && 'bg-red-100 text-red-600',
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{notification.tieuDe}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{notification.noiDung}</p>
          <p className="text-gray-400 text-xs mt-2">
            {formatRelativeTime(new Date(notification.thoiGianTao))}
          </p>
        </div>
      </div>
    </div>
  );
}