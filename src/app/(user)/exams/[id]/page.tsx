'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExamPreview, QuestionManager } from '@/components/exam';
import type { DeThi, CauHoi } from '@/types/exam';
import { examService } from '@/services/exam';

export default function ExamDetailPage() {
  const { id } = useParams();
  const [exam, setExam] = useState<DeThi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const result = await examService.getExamById(String(id));
      setExam(result);
    } catch (error) {
      console.error('Failed to fetch exam:', error);
      setExam(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!exam) return;
    try {
      await examService.updateExam(exam.id, exam);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update exam:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-blue-300">Đang tải...</span>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl text-blue-200 mb-4">Không tìm thấy đề thi</h1>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
            {exam.tieuDe}
          </h1>
          <p className="text-blue-300 mt-2">Chi tiết đề thi</p>
        </div>
        <div className="space-x-4">
          <Button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Xem trước
          </Button>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'}
          >
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
          </Button>
          {isEditing && (
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-500"
            >
              Lưu thay đổi
            </Button>
          )}
        </div>
      </div>

      {/* Exam Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-800">
          <h2 className="text-xl font-semibold text-blue-200 mb-4">Thông tin chung</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-blue-400">Môn học</label>
              <div className="text-blue-100">{exam.monHoc}</div>
            </div>
            <div>
              <label className="block text-sm text-blue-400">Khối</label>
              <div className="text-blue-100">{exam.khoiLop}</div>
            </div>
            <div>
              <label className="block text-sm text-blue-400">Thời gian</label>
              <div className="text-blue-100">{exam.thoiGianLamBai} phút</div>
            </div>
            <div>
              <label className="block text-sm text-blue-400">Tổng điểm</label>
              <div className="text-blue-100">{exam.tongDiem ?? 10} điểm</div>
            </div>
            <div>
              <label className="block text-sm text-blue-400">Trạng thái</label>
              <div className="text-blue-100 capitalize">{exam.trangThai}</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-800">
          <h2 className="text-xl font-semibold text-blue-200 mb-4">Thống kê</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-blue-400">Tổng số câu hỏi</label>
              <div className="text-blue-100">{exam.cauHois.length}</div>
            </div>
            <div>
              <label className="block text-sm text-blue-400">Phân loại câu hỏi</label>
              <div className="space-y-2">
                {Object.entries(
                  exam.cauHois.reduce((acc: Record<string, number>, q) => {
                    acc[q.loaiCauHoi] = (acc[q.loaiCauHoi] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-blue-100">
                    <span className="capitalize">{String(type).replace('_', ' ')}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-800">
        <h2 className="text-xl font-semibold text-blue-200 mb-4">Danh sách câu hỏi</h2>
        <QuestionManager
          questions={exam.cauHois}
          onQuestionsChange={(questions: CauHoi[]) => {
            if (isEditing) {
              setExam({ ...exam, cauHois: questions });
            }
          }}
          isReadOnly={!isEditing}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ExamPreview
          exam={exam}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );