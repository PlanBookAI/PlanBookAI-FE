'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { classroomService } from '@/services/classroom';
import { AuthService } from '@/services/auth';

export default function NewClassPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number>(10);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await classroomService.createClass({
        name,
        grade,
        academicYear,
      });
      router.push('/classes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo lớp học');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Thêm lớp học</h1>
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-5">
          {error && <div className="text-red-200">{error}</div>}

          <div>
            <label className="block text-white/90 text-sm mb-1">Tên lớp</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-white/80 text-gray-900 outline-none"
              placeholder="VD: 10A1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm mb-1">Khối</label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded bg-white/80 text-gray-900 outline-none"
              >
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm mb-1">Năm học</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/80 text-gray-900 outline-none"
                placeholder="VD: 2024-2025"
              />
            </div>
          </div>

          

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded bg-white/30 text-white/80 cursor-not-allowed flex items-center gap-2"
              title="Sắp ra mắt"
            >
              Thêm bằng Excel
              <span className="text-xs bg-white/40 text-white px-2 py-0.5 rounded">Soon</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/classes')}
              className="px-4 py-2 rounded bg-white/20 text-white/95 hover:bg-white/30"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded bg-white text-blue-700 font-medium disabled:opacity-60"
            >
              {submitting ? 'Đang lưu...' : 'Tạo lớp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


