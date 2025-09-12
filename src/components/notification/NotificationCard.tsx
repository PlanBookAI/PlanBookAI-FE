'use client';

import React from 'react';
import { NotificationDto, NotificationPriority } from '@/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface NotificationCardProps {
  notification: NotificationDto;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: NotificationPriority): string => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-500';
    case 'High':
      return 'bg-orange-500';
    case 'Normal':
      return 'bg-blue-500';
    case 'Low':
      return 'bg-gray-500';
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const {
    id,
    tieuDe,
    noiDung,
    loai,
    trangThai,
    doUuTien,
    daDoc,
    thoiGianGui,
  } = notification;

  return (
    <div className={`p-4 border rounded-lg shadow-sm mb-4 ${!daDoc ? 'bg-blue-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs text-white rounded ${getPriorityColor(doUuTien)}`}>
              {doUuTien}
            </span>
            <span className="text-sm text-gray-500">{loai}</span>
          </div>
          <h3 className="font-medium mb-1">{tieuDe}</h3>
          <p className="text-sm text-gray-600 mb-2">{noiDung}</p>
          <div className="text-xs text-gray-500">
            {format(new Date(thoiGianGui), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>
        <div className="flex gap-2">
          {!daDoc && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(id)}
            >
              Đánh dấu đã đọc
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(id)}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};