import React from 'react';
import type { DeThi, CauHoi, LuaChon } from '@/types/exam';

interface ExamPreviewProps {
  exam: DeThi;
  onClose: () => void;
}

export function ExamPreview({ exam, onClose }: ExamPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl mx-4 p-8 rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Xem trước đề thi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Print version */}
        <div className="bg-white p-8 shadow-lg @print:shadow-none">
          {/* Exam header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.tieuDe}</h1>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Môn: {exam.monHoc}</p>
              <p>Khối: {exam.khoiLop}</p>
              <p>Thời gian: {exam.thoiGianLamBai} phút</p>
              <p>Tổng điểm: {exam.tongDiem} điểm</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="text-gray-700 italic">
              {exam.huongDan || 'Học sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.'}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {exam.cauHois.map((question, index) => (
              <div key={question.id} className="break-inside-avoid">
                <div className="flex items-start">
                  <span className="font-bold text-gray-900 mr-2">Câu {index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{question.noiDung}</p>
                    
                    {/* Multiple choice options */}
                    {question.loaiCauHoi === 'MULTIPLE_CHOICE' && question.luaChons && (
                      <div className="pl-4 space-y-2">
                        {question.luaChons.map((option, optIndex) => (
                          <div key={option.id} className="flex items-start">
                            <span className="font-medium text-gray-700 mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="text-gray-900">{option.noiDung}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* True/False question */}
                    {question.loaiCauHoi === 'TRUE_FALSE' && (
                      <div className="pl-4 space-y-2">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center text-gray-900">
                            <input type="radio" disabled className="mr-2" /> Đúng
                          </label>
                          <label className="flex items-center text-gray-900">
                            <input type="radio" disabled className="mr-2" /> Sai
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Fill in blank space */}
                    {question.loaiCauHoi === 'FILL_IN_BLANK' && (
                      <div className="mt-2 border-b-2 border-gray-300 min-h-[60px]"></div>
                    )}

                    {/* Essay space */}
                    {question.loaiCauHoi === 'ESSAY' && (
                      <div className="mt-2 border-2 border-gray-300 min-h-[200px] p-4"></div>
                    )}

                    {/* Point value */}
                    <div className="text-right text-sm text-gray-600 mt-1">
                      ({question.diem} điểm)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600 border-t pt-4">
            <p>----------- HẾT -----------</p>
          </div>
        </div>

        {/* Print button */}
        <div className="flex justify-end mt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            In đề thi
          </button>
        </div>
      </div>
    </div>
  );
}