import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import type { DeThiFilter, MonHoc, TrangThai } from '@/types/exam';

interface ExamFiltersProps {
  filters: DeThiFilter;
  onFilterChange: (filters: DeThiFilter) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ExamFilters({ filters, onFilterChange, activeTab, onTabChange }: ExamFiltersProps) {
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'draft', label: 'Bản nháp' },
    { id: 'published', label: 'Đã xuất bản' },
    { id: 'archived', label: 'Lưu trữ' }
  ];

  const grades = [
    '6', '7', '8', '9', '10', '11', '12'
  ];

  const subjects = [
    { id: 'HOA_HOC', label: 'Hóa Học' },
    { id: 'TOAN', label: 'Toán' },
    { id: 'VAT_LY', label: 'Vật Lý' },
    { id: 'SINH_HOC', label: 'Sinh Học' },
    { id: 'TIENG_ANH', label: 'Tiếng Anh' },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            className={`whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 bg-opacity-10 text-blue-300 hover:bg-opacity-20'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <Input
        type="text"
        placeholder="Tìm kiếm đề thi..."
        value={filters.keyword || ''}
        onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
        className="bg-blue-50 bg-opacity-10 text-blue-300 placeholder-blue-400 placeholder-opacity-50 border-blue-600 focus:border-blue-500"
      />

      {/* Grade and Subject Filters */}
      <div className="flex space-x-4">
        <select
          value={String(filters.khoiLop || '')}
          onChange={(e) => onFilterChange({ ...filters, khoiLop: parseInt(e.target.value) || undefined })}
          className="bg-blue-50 bg-opacity-10 text-blue-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
        >
          <option value="">Tất cả khối</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              Khối {grade}
            </option>
          ))}
        </select>

        <select
          value={filters.monHoc || ''}
          onChange={(e) => onFilterChange({ ...filters, monHoc: e.target.value as MonHoc || undefined })}
          className="bg-blue-50 bg-opacity-10 text-blue-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600"
        >
          <option value="">Tất cả môn học</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
