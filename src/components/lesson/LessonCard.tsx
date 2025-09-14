import { Button } from '@/components/ui/button';
import type { LessonPlan, LessonStatus } from '@/types/lesson';

interface LessonCardProps {
  lesson: LessonPlan;
  onEdit?: (lesson: LessonPlan) => void;
  onView?: (lesson: LessonPlan) => void;
  onDelete?: (lesson: LessonPlan) => void;
  onCopy?: (lesson: LessonPlan) => void;
}

export function LessonCard({ lesson, onEdit, onView, onDelete, onCopy }: LessonCardProps) {
  const getStatusInfo = (status: LessonStatus) => {
    const statusMap: Record<LessonStatus, { label: string; className: string }> = {
      DRAFT: { label: 'Bản nháp', className: 'bg-yellow-100 text-yellow-800' },
      COMPLETED: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
      PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-800' },
      ARCHIVED: { label: 'Lưu trữ', className: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(lesson.trangThai);

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
      {/* Header với badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          {lesson.suDungAI && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              AI
            </span>
          )}
        </div>
        <span className="text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-2 py-1 rounded">
          Khối {lesson.khoi}
        </span>
      </div>
      
      {/* Nội dung chính */}
      <h3 className="text-lg font-semibold text-white mb-2">{lesson.tieuDe}</h3>
      {lesson.moTa && (
        <p className="text-blue-200 text-sm mb-2">{lesson.moTa}</p>
      )}
      {lesson.chuDeTen && (
        <p className="text-blue-300 text-xs mb-4 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          {lesson.chuDeTen}
        </p>
      )}
      
      {/* Thông tin thời gian */}
      <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
        <span>Tạo: {new Date(lesson.ngayTao).toLocaleDateString('vi-VN')}</span>
        <span>Sửa: {new Date(lesson.ngayCapNhat).toLocaleDateString('vi-VN')}</span>
      </div>

      {/* Thông tin bổ sung */}
      <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
        <span>{lesson.thoiLuongTiet} tiết</span>
        {lesson.lopHoc && <span>Lớp: {lesson.lopHoc}</span>}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onView(lesson)}
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
            onClick={() => onEdit(lesson)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            Sửa
          </Button>
        )}

        {onCopy && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onCopy(lesson)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Copy
          </Button>
        )}
      </div>
    </div>
  );
}
