import Button from '@/components/ui/button';
import { LessonTemplate } from '@/types/lesson';

interface TemplateSelectionModalProps {
  templates: LessonTemplate[];
  onSelect: (template: LessonTemplate) => void;
  onClose: () => void;
}

export function TemplateSelectionModal({ templates, onSelect, onClose }: TemplateSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Chọn mẫu giáo án</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">{template.tieuDe}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.moTa}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Khối {template.khoi}</span>
                  <span>{template.nguoiTaoTen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
