'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  NotificationFilter,
  NotificationType,
  NotificationStatus,
  NotificationPriority
} from '@/types';

interface NotificationFiltersProps {
  filters: NotificationFilter;
  onFilterChange: (filters: NotificationFilter) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFilterChange,
  onMarkAllAsRead,
}) => {
  const handleFilterChange = (key: keyof NotificationFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Thông Báo</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onFilterChange({ ...filters, trangThai: undefined })}
          >
            Tất cả
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleFilterChange('trangThai', 'Sent')}
          >
            Chưa đọc
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleFilterChange('doUuTien', 'Urgent')}
          >
            Quan trọng
          </Button>
          <Button
            variant="primary"
            onClick={onMarkAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="border rounded-md p-2"
          value={filters.loai || ''}
          onChange={(e) => handleFilterChange('loai', e.target.value || undefined)}
        >
          <option value="">Loại thông báo</option>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="InApp">InApp</option>
          <option value="Push">Push</option>
        </select>

        <select
          className="border rounded-md p-2"
          value={filters.trangThai || ''}
          onChange={(e) => handleFilterChange('trangThai', e.target.value || undefined)}
        >
          <option value="">Trạng thái</option>
          <option value="Created">Created</option>
          <option value="Sent">Sent</option>
          <option value="Read">Read</option>
          <option value="Expired">Expired</option>
        </select>

        <select
          className="border rounded-md p-2"
          value={filters.doUuTien || ''}
          onChange={(e) => handleFilterChange('doUuTien', e.target.value || undefined)}
        >
          <option value="">Độ ưu tiên</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <div className="flex gap-2">
          <Input
            type="date"
            value={filters.tuNgay || ''}
            onChange={(e) => handleFilterChange('tuNgay', e.target.value)}
            placeholder="Từ ngày"
          />
          <Input
            type="date"
            value={filters.denNgay || ''}
            onChange={(e) => handleFilterChange('denNgay', e.target.value)}
            placeholder="Đến ngày"
          />
        </div>
      </div>
    </div>
  );
};