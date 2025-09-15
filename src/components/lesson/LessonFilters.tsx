import Button from '@/components/ui/button';
import type { Topic, LessonTabType, GradeLevel } from '@/types/lesson';

interface LessonFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTopic: number | null;
  onTopicChange: (topicId: number | null) => void;
  topics: Topic[];
  activeTab: LessonTabType;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function LessonFilters({
  searchQuery,
  onSearchChange,
  selectedTopic,
  onTopicChange,
  topics,
  activeTab,
  hasActiveFilters,
  onClearFilters
}: LessonFiltersProps) {
  const showTopicFilter = activeTab === 'all' || activeTab === 'draft' || activeTab === 'completed' || activeTab === 'published' || activeTab === 'archived';

  return (
    <div className="flex items-center space-x-3">
      {/* Search input */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Tìm kiếm giáo án..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        />
        <svg className="absolute right-3 top-2.5 w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      {/* Topic filter - chỉ hiển thị cho lesson plans */}
      {showTopicFilter && (
        <div className="relative">
          <select
            value={selectedTopic || ''}
            onChange={(e) => onTopicChange(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm"
          >
            <option value="" className="text-gray-900">Tất cả chủ đề</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id} className="text-gray-900">
                {topic.ten}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button 
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
