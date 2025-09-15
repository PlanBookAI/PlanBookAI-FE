import Button from '@/components/ui/button';
import type { LessonTemplate } from '@/types/lesson';

interface TemplateCardProps {
  template: LessonTemplate;
  onView?: (template: LessonTemplate) => void;
  onUse?: (template: LessonTemplate) => void;
  onEdit?: (template: LessonTemplate) => void;
  onDelete?: (template: LessonTemplate) => void;
  onToggleShare?: (template: LessonTemplate) => void;
  showOwnerActions?: boolean; // Hiển thị actions cho chủ sở hữu
  topicName?: string;
}

export function TemplateCard({ 
  template, 
  onView, 
  onUse, 
  onEdit, 
  onDelete, 
  onToggleShare,
  showOwnerActions = false,
  topicName
}: TemplateCardProps) {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-30 transition-all cursor-pointer">
      {/* Header với badges */}
      <div className="flex items-start justify-between mb-4">
        <span className={`text-xs px-2 py-1 rounded ${
          template.isPublic 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {template.isPublic ? 'Công khai' : 'Cá nhân'}
        </span>
        <span className="text-xs bg-blue-400 bg-opacity-80 text-blue-900 px-2 py-1 rounded">
          Khối {template.khoi}
        </span>
      </div>
      
      {/* Nội dung chính */}
      <h3 className="text-lg font-semibold text-white mb-2">{template.tieuDe}</h3>
      <p className="text-blue-200 text-sm mb-4">{template.moTa}</p>
      
      {typeof topicName !== 'undefined' && (
        <p className="text-blue-300 text-xs mb-3 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          {topicName || '-- Chưa chọn chủ đề --'}
        </p>
      )}
      
      {/* Thông tin tác giả và thời gian */}
      <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span>{template.nguoiTaoTen || 'Không rõ'}</span>
        </div>
        <span>{new Date(template.ngayTao).toLocaleDateString('vi-VN')}</span>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onView(template)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Xem
          </Button>
        )}
        
        {onUse && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white hover:bg-opacity-20"
            onClick={() => onUse(template)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Dùng mẫu
          </Button>
        )}

        {/* Owner actions */}
        {showOwnerActions && (
          <>
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={() => onEdit(template)}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Sửa
              </Button>
            )}

            {onToggleShare && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={() => onToggleShare(template)}
                title={template.isPublic ? 'Ẩn chia sẻ' : 'Chia sẻ công khai'}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                {template.isPublic ? 'Ẩn' : 'Chia sẻ'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
