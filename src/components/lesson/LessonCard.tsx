import Button from '@/components/ui/button';
import type { LessonPlan, LessonStatus } from '@/types/lesson';

interface LessonCardProps {
  lesson: LessonPlan;
  onEdit?: (lesson: LessonPlan) => void;
  onView?: (lesson: LessonPlan) => void;
  onDelete?: (lesson: LessonPlan) => void;
  onCopy?: (lesson: LessonPlan) => void; // sẽ dùng như nút Xóa theo yêu cầu mới
  onApprove?: (lesson: LessonPlan) => void;
  onPublish?: (lesson: LessonPlan) => void;
  onArchive?: (lesson: LessonPlan) => void;
}

export function LessonCard({ lesson, onEdit, onView, onDelete, onCopy, onApprove, onPublish, onArchive }: LessonCardProps) {
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
      {/* Mô tả (nếu backend có trường này, bổ sung vào types để hiển thị) */}
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
            className="text-red-200 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => onCopy(lesson)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M10 11v6m4-6v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/>
            </svg>
            Xóa
          </Button>
        )}

        {/* Trạng thái */}
        {lesson.trangThai === 'DRAFT' && onApprove && (
          <Button variant="secondary" size="sm" onClick={() => onApprove(lesson)} className="bg-white/80 text-blue-700 hover:bg-white">
            Phê duyệt
          </Button>
        )}
        {lesson.trangThai === 'COMPLETED' && onPublish && (
          <Button variant="secondary" size="sm" onClick={() => onPublish(lesson)} className="bg-white/80 text-blue-700 hover:bg-white">
            Xuất bản
          </Button>
        )}
        {lesson.trangThai === 'PUBLISHED' && onArchive && (
          <Button variant="secondary" size="sm" onClick={() => onArchive(lesson)} className="bg-white/80 text-blue-700 hover:bg-white">
            Lưu trữ
          </Button>
        )}
      </div>
    </div>
  );
}
