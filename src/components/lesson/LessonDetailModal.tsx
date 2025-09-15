import Button from '@/components/ui/button';
import { LessonPlan, Topic } from '@/types/lesson';

interface LessonDetailModalProps {
  lesson: LessonPlan;
  topics?: Topic[];
  onClose: () => void;
  onEdit?: (lesson: LessonPlan) => void;
}

export function LessonDetailModal({ lesson, topics, onClose, onEdit }: LessonDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Chi tiết giáo án</h2>
                <p className="text-sm text-gray-500">{lesson.tieuDe}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
              <p className="text-gray-900">{lesson.tieuDe}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Khối</label>
              <p className="text-gray-900">Khối {lesson.khoi}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thời lượng tiết</label>
              <p className="text-gray-900">{lesson.thoiLuongTiet} tiết</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lớp học</label>
              <p className="text-gray-900">{lesson.lopHoc || 'Chưa xác định'}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Chủ đề</label>
              <p className="text-gray-900">
                {lesson.chuDeId
                  ? (topics?.find(t => t.id === lesson.chuDeId)?.ten || `ID ${lesson.chuDeId}`)
                  : 'Chưa xác định'}
              </p>
          </div>
        </div>

          {/* Mục tiêu */}
          {lesson.mucTieu && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mục tiêu</label>
              <p className="text-gray-900 whitespace-pre-wrap">{lesson.mucTieu}</p>
            </div>
          )}

          {/* Nội dung chi tiết */}
          {(lesson.noiDung?.noiDungChiTiet || lesson.noiDung) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nội dung chi tiết</label>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {(() => {
                  const d: any = lesson.noiDung?.noiDungChiTiet ?? lesson.noiDung;
                  const mucTieu = d.mucTieu ?? d.MucTieu ?? '';
                  const thoiLuong = d.thoiLuong ?? d.ThoiLuong ?? d.thoiluong ?? '';
                  const phuongPhap = d.phuongPhap ?? d.PhuongPhap ?? '';
                  const noiDung: string[] = d.noiDung ?? d.NoiDung ?? [];
                  const thietBi: string[] = d.thietBi ?? d.ThietBi ?? [];

                  return (
                    <>
                      {mucTieu && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Mục tiêu học tập</div>
                          <p className="text-gray-900 whitespace-pre-wrap">{mucTieu}</p>
                        </div>
                      )}

                      {thoiLuong && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Thời lượng</div>
                          <p className="text-gray-900">{thoiLuong}</p>
                        </div>
                      )}

                      {phuongPhap && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Phương pháp giảng dạy</div>
                          <p className="text-gray-900 whitespace-pre-wrap">{phuongPhap}</p>
                        </div>
                      )}

                      {Array.isArray(noiDung) && noiDung.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Nội dung bài học</div>
                          <ul className="list-disc list-inside text-gray-900 space-y-1">
                            {noiDung.map((item, idx) => (
                              <li key={`nd-${idx}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(thietBi) && thietBi.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Thiết bị cần thiết</div>
                          <ul className="list-disc list-inside text-gray-900 space-y-1">
                            {thietBi.map((item, idx) => (
                              <li key={`tb-${idx}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Ghi chú */}
          {lesson.ghiChu && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ghi chú</label>
              <p className="text-gray-900">{lesson.ghiChu}</p>
            </div>
          )}

          {/* Yêu cầu đặc biệt */}
          {lesson.yeuCauDacBiet && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Yêu cầu đặc biệt</label>
              <p className="text-gray-900">{lesson.yeuCauDacBiet}</p>
            </div>
          )}

          {/* Thông tin thêm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
              <p className="text-gray-900">{new Date(lesson.ngayTao).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
              <p className="text-gray-900">{new Date(lesson.ngayCapNhat).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <p className="text-gray-900">{getStatusLabel(lesson.trangThai)}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sử dụng AI</label>
              <p className="text-gray-900">{lesson.suDungAI ? 'Có' : 'Không'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Đóng
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              onClick={() => onEdit(lesson)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function để chuyển đổi trạng thái thành văn bản hiển thị
function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'DRAFT': 'Bản nháp',
    'COMPLETED': 'Hoàn thành',
    'PUBLISHED': 'Đã xuất bản',
    'ARCHIVED': 'Lưu trữ'
  };
  return statusMap[status] || status;
}
