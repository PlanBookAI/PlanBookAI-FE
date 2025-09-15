import Button from '@/components/ui/button';
import type { Topic } from '@/types/lesson';

interface TopicCardProps {
  topic: Topic;
  lessonCount?: number;
  onSelect?: () => void;
  onFilter?: (topic: Topic) => void;
  onEdit?: (topic: Topic) => void;
  onDelete?: (topic: Topic) => void;
  onView?: (topic: Topic) => void;
}

export function TopicCard({ 
  topic, 
  lessonCount = 0,
  onSelect,
  onFilter, 
  onEdit, 
  onDelete,
  onView 
}: TopicCardProps) {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
      {/* Header với icon và count */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-indigo-500 bg-opacity-20 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
        </div>
        <span className="text-xs bg-indigo-400 bg-opacity-80 text-indigo-900 px-2 py-1 rounded">
          {lessonCount} giáo án
        </span>
      </div>
      
      {/* Nội dung chính */}
      <h3 className="text-lg font-semibold text-white mb-2">{topic.ten}</h3>
      {topic.moTa && (
        <p className="text-blue-200 text-sm mb-4">{topic.moTa}</p>
      )}
      
      {/* Thông tin thời gian */}
      <div className="text-xs text-blue-300 mb-4">
        Tạo: {new Date(topic.ngayTao).toLocaleDateString('vi-VN')}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {onSelect && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={onSelect}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
            </svg>
            Chọn
          </Button>
        )}

        {onFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onFilter(topic)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"/>
            </svg>
            Lọc theo chủ đề
          </Button>
        )}

        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onView(topic)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Xem
          </Button>
        )}
        
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onEdit(topic)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            Sửa
          </Button>
        )}
      </div>
    </div>
  );
}

// Component đặc biệt cho "Tạo chủ đề mới"
export function CreateTopicCard({ onCreate }: { onCreate?: () => void }) {
  return (
    <div 
      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border-2 border-dashed border-white border-opacity-30 hover:bg-opacity-20 transition-all cursor-pointer flex flex-col items-center justify-center text-center"
      onClick={onCreate}
    >
      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Tạo chủ đề mới</h3>
      <p className="text-blue-200 text-sm">Thêm chủ đề để phân loại giáo án</p>
    </div>
  );
}
