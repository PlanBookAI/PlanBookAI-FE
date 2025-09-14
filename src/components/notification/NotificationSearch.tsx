import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface NotificationSearchProps {
  onSearch: (keyword: string) => void;
  onTypeFilter: (type: string) => void;
  onDateFilter: (startDate: string, endDate: string) => void;
}

export function NotificationSearch({ onSearch, onTypeFilter, onDateFilter }: NotificationSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("TAT_CA");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Bộ lọc
        </Button>
      </div>

      {showFilters && (
        <div className="p-4 bg-white rounded-lg shadow border space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại thông báo</label>
            <div className="flex gap-2">
              {['TAT_CA', 'THONG_BAO', 'CANH_BAO', 'LOI'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "primary" : "ghost"}
                  onClick={() => {
                    setSelectedType(type);
                    onTypeFilter(type);
                  }}
                  className="text-sm"
                >
                  {type === 'TAT_CA' ? 'Tất cả' :
                   type === 'THONG_BAO' ? 'Thông báo' :
                   type === 'CANH_BAO' ? 'Cảnh báo' : 'Lỗi'}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.start}
                onChange={(e) => {
                  const newRange = { ...dateRange, start: e.target.value };
                  setDateRange(newRange);
                  onDateFilter(newRange.start, newRange.end);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.end}
                onChange={(e) => {
                  const newRange = { ...dateRange, end: e.target.value };
                  setDateRange(newRange);
                  onDateFilter(newRange.start, newRange.end);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}