import { Button } from '@/components/ui/button';
import type { DeThi, TrangThai } from '@/types/exam';

interface ExamCardProps {
  exam: DeThi;
  onEdit?: (exam: DeThi) => void;
  onView?: (exam: DeThi) => void;
  onDelete?: (exam: DeThi) => void;
}

export function ExamCard({ exam, onEdit, onView, onDelete }: ExamCardProps) {
  const getStatusInfo = (status: TrangThai) => {
    const statusMap: Record<TrangThai, { label: string; className: string }> = {
      DRAFT: { label: 'Bản nháp', className: 'bg-blue-100 text-blue-800' },
      PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-200 text-blue-900' },
      ARCHIVED: { label: 'Lưu trữ', className: 'bg-blue-50 text-blue-600' }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(exam.trangThai);

  return (
    <div className="bg-blue-50 bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-blue-200 border-opacity-20 hover:bg-opacity-20 transition-all cursor-pointer shadow-sm">
      {/* Header với badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {exam.thoiGianLamBai} phút
          </span>
        </div>
        <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
          Khối {exam.khoiLop}
        </span>
      </div>
      
      {/* Nội dung chính */}
      <h3 className="text-lg font-semibold text-blue-100 mb-2">{exam.tieuDe}</h3>
      {exam.huongDan && (
        <p className="text-blue-300 text-sm mb-2">{exam.huongDan}</p>
      )}
      
      {/* Thông tin bổ sung */}
      <div className="flex items-center space-x-4 text-xs text-blue-400 mb-4">
        <span>{exam.cauHois.length} câu hỏi</span>
        <span>{exam.tongDiem} điểm</span>
        <span>{exam.monHoc}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4">
        {onView && (
          <Button
            onClick={() => onView(exam)}
            variant="ghost"
            className="text-blue-300 hover:text-blue-100 hover:bg-blue-700 hover:bg-opacity-20"
          >
            Xem
          </Button>
        )}
        {onEdit && (
          <Button
            onClick={() => onEdit(exam)}
            variant="ghost"
            className="text-blue-300 hover:text-blue-100 hover:bg-blue-700 hover:bg-opacity-20"
          >
            Sửa
          </Button>
        )}

        {onDelete && (
          <Button
            onClick={() => onDelete(exam)}
            variant="ghost"
            className="text-red-300 hover:text-red-200 hover:bg-red-500 hover:bg-opacity-20"
          >
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
}
