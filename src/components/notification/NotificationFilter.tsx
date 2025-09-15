import Button from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { NotificationFilters, NotificationType } from '@/types/notification';
import { useState } from 'react';

interface NotificationFilterProps {
  onFilterChange: (filters: Partial<NotificationFilters>) => void;
}

export function NotificationFilter({ onFilterChange }: NotificationFilterProps) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ tuKhoa: keyword });
  };

  const handleTypeChange = (type: NotificationType) => {
    onFilterChange({ loai: type });
  };

  const handleStatusChange = (status: 'TAT_CA' | 'CHUA_DOC' | 'DA_DOC') => {
    onFilterChange({ trangThai: status });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          placeholder="Tìm kiếm thông báo..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Tìm kiếm</Button>
      </form>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleTypeChange('THONG_BAO')}
        >
          Thông báo
        </Button>
        <Button
          variant="outline"
          onClick={() => handleTypeChange('CANH_BAO')}
        >
          Cảnh báo
        </Button>
        <Button
          variant="outline"
          onClick={() => handleTypeChange('LOI')}
        >
          Lỗi
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleStatusChange('TAT_CA')}
        >
          Tất cả
        </Button>
        <Button
          variant="outline"
          onClick={() => handleStatusChange('CHUA_DOC')}
        >
          Chưa đọc
        </Button>
        <Button
          variant="outline"
          onClick={() => handleStatusChange('DA_DOC')}
        >
          Đã đọc
        </Button>
      </div>
    </div>
  );
}