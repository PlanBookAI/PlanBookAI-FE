'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { classroomService } from '@/services/classroom';
import type { LopHocDto, LopHocUpdateRequest } from '@/types/classroom';

export default function ClassesManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<{ items: LopHocDto[]; totalCount: number; totalPages: number }>({ items: [], totalCount: 0, totalPages: 0 });
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [classToDelete, setClassToDelete] = useState<LopHocDto | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailSaving, setDetailSaving] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selected, setSelected] = useState<LopHocDto | null>(null);
  const [form, setForm] = useState<{ name: string; grade: number; academicYear: string; isActive: boolean }>({ name: '', grade: 10, academicYear: '2024-2025', isActive: true });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    classroomService
      .getClasses(page, pageSize)
      .then((res) => {
        if (!mounted) return;
        setData({ items: res.items || [], totalCount: res.totalCount || 0, totalPages: res.totalPages || 0 });
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Không thể tải danh sách lớp học');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [page, pageSize, reloadKey]);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Quản lý lớp học</h1>
            <p className="text-blue-100 mt-1">Xem và quản lý danh sách lớp học của bạn.</p>
          </div>
          <Link
            href="/classes/new"
            className="px-3 py-2 rounded bg-white/20 text-white/95 hover:bg-white/30 text-sm"
          >
            Thêm lớp
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          {/* Options bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-white/90 relative">
              <label htmlFor="pageSize" className="text-sm">Số dòng/trang</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}
                className="bg-white/20 text-white px-2 py-1 rounded outline-none"
              >
                <option className="text-gray-900" value={5}>5</option>
                <option className="text-gray-900" value={10}>10</option>
                <option className="text-gray-900" value={20}>20</option>
              </select>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="px-3 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                Tải lại
              </button>
              <button
                onClick={() => setShowFilter((v) => !v)}
                className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 flex items-center gap-2"
                aria-label="Lọc lớp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3"></polygon></svg>
                <span className="text-sm">Lọc</span>
              </button>
              {showFilter && (
                <div className="absolute top-full mt-2 left-0 bg-white text-gray-800 rounded-md shadow-lg min-w-[180px] z-10">
                  <button onClick={() => { setFilterGrade(null); setShowFilter(false); }} className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${filterGrade === null ? 'font-semibold' : ''}`}>Tất cả khối</button>
                  <button onClick={() => { setFilterGrade(10); setShowFilter(false); }} className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${filterGrade === 10 ? 'font-semibold' : ''}`}>Khối 10</button>
                  <button onClick={() => { setFilterGrade(11); setShowFilter(false); }} className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${filterGrade === 11 ? 'font-semibold' : ''}`}>Khối 11</button>
                  <button onClick={() => { setFilterGrade(12); setShowFilter(false); }} className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${filterGrade === 12 ? 'font-semibold' : ''}`}>Khối 12</button>
                </div>
              )}
            </div>
            {!loading && !error && (
              <div className="text-sm text-white/80">Tổng {data.totalCount} lớp • Trang {page}/{Math.max(1, data.totalPages)}{filterGrade ? ` • Lọc: Khối ${filterGrade}` : ''}</div>
            )}
          </div>
          {loading && (
            <div className="text-white/90">Đang tải danh sách lớp học...</div>
          )}
          {error && (
            <div className="text-red-200">{error}</div>
          )}
          {!loading && !error && (
            <div>
              <div className="space-y-3">
                {(filterGrade ? data.items.filter(c => c.grade === filterGrade) : data.items).map((cls) => (
                  <div key={cls.id} className="bg-white/80 rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 font-semibold">{cls.name}</div>
                        <div className="text-sm text-gray-600">Khối {cls.grade} • {cls.academicYear}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Link href={`/classes/${cls.id}`} className="text-blue-600 hover:underline text-sm">Chi tiết</Link>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => { setClassToDelete(cls); setShowDelete(true); }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 text-white/90">
                <div></div>
                <div className="space-x-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-white/20 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span>Trang {page}/{Math.max(1, data.totalPages)}</span>
                  <button
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded bg-white/20 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {showDelete && classToDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowDelete(false)}></div>
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa lớp</h3>
            <button onClick={() => setShowDelete(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-5">
            <p className="text-gray-700 text-sm">Bạn có chắc muốn xóa lớp "{classToDelete.name}"?</p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700">Hủy</button>
              <button
                onClick={async () => {
                  if (!classToDelete) return;
                  setDeleting(true);
                  try {
                    await classroomService.deleteClass(classToDelete.id);
                    setShowDelete(false);
                    setClassToDelete(null);
                    setReloadKey((k) => k + 1);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    </>
  );
}
