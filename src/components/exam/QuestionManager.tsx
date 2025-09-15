import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import type { CauHoi, LoaiCauHoi, LuaChon, DoKho, MonHoc } from '@/types/exam';

interface QuestionManagerProps {
  questions: CauHoi[];
  onQuestionsChange: (questions: CauHoi[]) => void;
  monHoc: MonHoc;
  isReadOnly?: boolean;
}

interface QuestionFormData {
  noiDung: string;
  loaiCauHoi: LoaiCauHoi;
  diem: number;
  monHoc: MonHoc;
  chuDe: string;
  doKho: DoKho;
  dapAnDung?: string;
  giaiThich?: string;
  luaChons?: LuaChon[];
  dapAnTuLuan?: string;
  tieuChiChamDiem?: string;
}

export function QuestionManager({ questions, onQuestionsChange, monHoc, isReadOnly = false }: QuestionManagerProps) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    noiDung: '',
    loaiCauHoi: 'MULTIPLE_CHOICE',
    diem: 1,
    monHoc,
    chuDe: '',
    doKho: 'MEDIUM',
    luaChons: [],
  });

  const handleInputChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.noiDung.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    if (formData.diem <= 0) {
      alert('Điểm số phải lớn hơn 0');
      return;
    }
    if (!formData.chuDe.trim()) {
      alert('Vui lòng nhập chủ đề');
      return;
    }

    // Validate based on question type
    if (formData.loaiCauHoi === 'MULTIPLE_CHOICE') {
      if (!formData.luaChons || formData.luaChons.length < 2) {
        alert('Câu hỏi trắc nghiệm cần ít nhất 2 lựa chọn');
        return;
      }
      if (!formData.luaChons.some(option => option.laDapAnDung)) {
        alert('Vui lòng chọn ít nhất một đáp án đúng');
        return;
      }
      if (formData.luaChons.some(option => !option.noiDung.trim())) {
        alert('Vui lòng nhập nội dung cho tất cả các lựa chọn');
        return;
      }
    } else if (formData.loaiCauHoi === 'TRUE_FALSE') {
      if (!formData.dapAnDung) {
        alert('Vui lòng chọn đáp án Đúng hoặc Sai');
        return;
      }
    } else if (formData.loaiCauHoi === 'FILL_IN_BLANK') {
      if (!formData.dapAnDung?.trim()) {
        alert('Vui lòng nhập đáp án');
        return;
      }
    } else if (formData.loaiCauHoi === 'ESSAY') {
      if (!formData.tieuChiChamDiem?.trim()) {
        alert('Vui lòng nhập tiêu chí chấm điểm cho câu tự luận');
        return;
      }
    }

    const newQuestion: CauHoi = {
      id: activeQuestion === null 
        ? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : String(Date.now()))
        : questions[activeQuestion].id,
      noiDung: formData.noiDung,
      loaiCauHoi: formData.loaiCauHoi,
      monHoc: formData.monHoc,
      chuDe: formData.chuDe,
      doKho: formData.doKho,
      diem: formData.diem,
      dapAnDung: formData.dapAnDung,
      giaiThich: formData.giaiThich,
      luaChons: formData.luaChons,
      dapAnTuLuan: formData.dapAnTuLuan,
      tieuChiChamDiem: formData.tieuChiChamDiem,
    };

    if (activeQuestion === null) {
      onQuestionsChange([...questions, newQuestion]);
    } else {
      const updatedQuestions = [...questions];
      updatedQuestions[activeQuestion] = newQuestion;
      onQuestionsChange(updatedQuestions);
    }

    resetForm();
    setActiveQuestion(null);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
      onQuestionsChange(questions.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setFormData({
      noiDung: '',
      loaiCauHoi: 'MULTIPLE_CHOICE',
      diem: 1,
      monHoc,
      chuDe: '',
      doKho: 'MEDIUM',
      luaChons: [],
    });
  };

  const handleEdit = (index: number) => {
    const question = questions[index];
    setFormData({
      noiDung: question.noiDung,
      loaiCauHoi: question.loaiCauHoi,
      diem: question.diem,
      monHoc: question.monHoc,
      chuDe: question.chuDe,
      doKho: question.doKho,
      dapAnDung: question.dapAnDung,
      giaiThich: question.giaiThich,
      luaChons: question.luaChons || [],
      dapAnTuLuan: question.dapAnTuLuan,
      tieuChiChamDiem: question.tieuChiChamDiem,
    });
    setActiveQuestion(index);
  };

  const handleOptionChange = (index: number, field: keyof LuaChon, value: any) => {
    if (formData.luaChons) {
      const newOptions = [...formData.luaChons];
      newOptions[index] = { ...newOptions[index], [field]: value };
      handleInputChange('luaChons', newOptions);
    }
  };

  const handleAddOption = () => {
    // Initialize luaChons if it's undefined
    const currentOptions = formData.luaChons || [];
    if (currentOptions.length >= 6) {
      alert('Không thể thêm quá 6 lựa chọn');
      return;
    }
    handleInputChange('luaChons', [
      ...currentOptions,
      {
        id: String(Date.now()),
        noiDung: '',
        laDapAnDung: false
      }
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (formData.luaChons) {
      if (formData.luaChons.length <= 2) {
        alert('Câu hỏi trắc nghiệm cần ít nhất 2 lựa chọn');
        return;
      }
      // Check if we're removing the last correct answer
      const isRemovingLastCorrect = 
        formData.luaChons[index].laDapAnDung &&
        formData.luaChons.filter(opt => opt.laDapAnDung).length === 1;
      
      if (isRemovingLastCorrect) {
        if (!confirm('Bạn đang xóa lựa chọn đúng duy nhất. Tiếp tục?')) {
          return;
        }
      }
      handleInputChange('luaChons', formData.luaChons.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Question List */}
      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="text-center p-8 text-blue-300 bg-blue-900/10 rounded-lg border border-blue-800/20">
            {isReadOnly ? 'Chưa có câu hỏi nào trong đề thi này.' : 'Hãy thêm câu hỏi đầu tiên cho đề thi.'}
          </div>
        )}
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`bg-blue-900/20 p-4 rounded-lg border border-blue-800/30 ${
              !isReadOnly ? 'hover:border-blue-700/50 transition-colors' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-blue-100">Câu {index + 1}</h4>
                <p className="text-blue-200 mt-1">{question.noiDung}</p>
                <div className="flex gap-4 mt-2 text-sm text-blue-300">
                  <span>{question.diem} điểm</span>
                  <span>•</span>
                  <span>{
                    question.loaiCauHoi === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' :
                    question.loaiCauHoi === 'ESSAY' ? 'Tự luận' :
                    question.loaiCauHoi === 'TRUE_FALSE' ? 'Đúng/Sai' :
                    'Điền vào chỗ trống'
                  }</span>
                  <span>•</span>
                  <span>Độ khó: {
                    question.doKho === 'EASY' ? 'Dễ' :
                    question.doKho === 'MEDIUM' ? 'Trung bình' : 'Khó'
                  }</span>
                </div>
                {question.luaChons && question.luaChons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {question.luaChons.map((option) => (
                      <div
                        key={option.id}
                        className={`text-sm ${option.laDapAnDung ? 'text-green-400' : 'text-blue-300'}`}
                      >
                        • {option.noiDung}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {!isReadOnly && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-blue-300 hover:text-blue-100 hover:bg-blue-700/20"
                  >
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-red-300 hover:text-red-200 hover:bg-red-900/20"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Question Form */}
      {!isReadOnly && (
        <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-800/30">
          <h3 className="font-semibold text-blue-100 mb-4">
            {activeQuestion === null ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200">Nội dung câu hỏi</label>
              <textarea
                value={formData.noiDung}
                onChange={(e) => handleInputChange('noiDung', e.target.value)}
                className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200">Loại câu hỏi</label>
                <select
                  value={formData.loaiCauHoi}
                  onChange={(e) => handleInputChange('loaiCauHoi', e.target.value as LoaiCauHoi)}
                  className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                  required
                >
                  <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                  <option value="ESSAY">Tự luận</option>
                  <option value="TRUE_FALSE">Đúng/Sai</option>
                  <option value="FILL_IN_BLANK">Điền vào chỗ trống</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200">Điểm số</label>
                <Input
                  type="number"
                  value={formData.diem}
                  onChange={(e) => handleInputChange('diem', parseFloat(e.target.value))}
                  min={0}
                  step={0.25}
                  className="mt-1 bg-blue-900/30 border-blue-700 text-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200">Độ khó</label>
                <select
                  value={formData.doKho}
                  onChange={(e) => handleInputChange('doKho', e.target.value as DoKho)}
                  className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                  required
                >
                  <option value="EASY">Dễ</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HARD">Khó</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200">Chủ đề</label>
                <Input
                  type="text"
                  value={formData.chuDe}
                  onChange={(e) => handleInputChange('chuDe', e.target.value)}
                  className="mt-1 bg-blue-900/30 border-blue-700 text-blue-100"
                  required
                />
              </div>
            </div>

            {/* Multiple Choice Options */}
            {formData.loaiCauHoi === 'MULTIPLE_CHOICE' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-blue-200">Các lựa chọn</label>
                  <Button
                    type="button"
                    onClick={handleAddOption}
                    className="text-blue-300 hover:text-blue-100"
                  >
                    Thêm lựa chọn
                  </Button>
                </div>

                {formData.luaChons?.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-4">
                    <Input
                      type="text"
                      value={option.noiDung}
                      onChange={(e) => handleOptionChange(index, 'noiDung', e.target.value)}
                      className="flex-1 bg-blue-900/30 border-blue-700 text-blue-100"
                      placeholder={`Lựa chọn ${index + 1}`}
                    />
                    <label className="flex items-center space-x-2 text-blue-200">
                      <input
                        type="checkbox"
                        checked={option.laDapAnDung}
                        onChange={(e) => handleOptionChange(index, 'laDapAnDung', e.target.checked)}
                        className="rounded border-blue-700 bg-blue-900/30 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Đáp án đúng</span>
                    </label>
                    <Button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-300 hover:text-red-200"
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* True/False Answer */}
            {formData.loaiCauHoi === 'TRUE_FALSE' && (
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Đáp án</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.dapAnDung === 'true'}
                      onChange={() => handleInputChange('dapAnDung', 'true')}
                      className="border-blue-700 bg-blue-900/30 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-blue-200">Đúng</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={formData.dapAnDung === 'false'}
                      onChange={() => handleInputChange('dapAnDung', 'false')}
                      className="border-blue-700 bg-blue-900/30 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-blue-200">Sai</span>
                  </label>
                </div>
              </div>
            )}

            {/* Fill in Blank Answer */}
            {formData.loaiCauHoi === 'FILL_IN_BLANK' && (
              <div>
                <label className="block text-sm font-medium text-blue-200">Đáp án</label>
                <Input
                  type="text"
                  value={formData.dapAnDung || ''}
                  onChange={(e) => handleInputChange('dapAnDung', e.target.value)}
                  className="mt-1 bg-blue-900/30 border-blue-700 text-blue-100"
                />
              </div>
            )}

            {/* Essay Answer */}
            {formData.loaiCauHoi === 'ESSAY' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200">Đáp án mẫu</label>
                  <textarea
                    value={formData.dapAnTuLuan || ''}
                    onChange={(e) => handleInputChange('dapAnTuLuan', e.target.value)}
                    className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200">Tiêu chí chấm điểm</label>
                  <textarea
                    value={formData.tieuChiChamDiem || ''}
                    onChange={(e) => handleInputChange('tieuChiChamDiem', e.target.value)}
                    className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-200">Giải thích đáp án</label>
              <textarea
                value={formData.giaiThich || ''}
                onChange={(e) => handleInputChange('giaiThich', e.target.value)}
                className="mt-1 w-full rounded-md bg-blue-900/30 border border-blue-700 text-blue-100 px-3 py-2"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={() => {
                setActiveQuestion(null);
                setFormData({
                  noiDung: '',
                  loaiCauHoi: 'MULTIPLE_CHOICE',
                  diem: 1,
                  monHoc,
                  chuDe: '',
                  doKho: 'MEDIUM',
                  luaChons: [],
                });
              }}
              className="bg-blue-900 hover:bg-blue-800 text-blue-100"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {activeQuestion === null ? 'Thêm câu hỏi' : 'Cập nhật câu hỏi'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}