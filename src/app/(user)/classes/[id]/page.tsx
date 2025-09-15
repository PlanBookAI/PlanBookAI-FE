'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { classroomService } from '@/services/classroom';
import * as XLSX from 'xlsx';
import type { LopHocDto, HocSinhDto } from '@/types/classroom';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lop, setLop] = useState<LopHocDto | null>(null);

  const [students, setStudents] = useState<{ items: HocSinhDto[]; totalCount: number; totalPages: number }>({ items: [], totalCount: 0, totalPages: 0 });
  const [stuPage, setStuPage] = useState(1);
  const [stuPageSize, setStuPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [formStudent, setFormStudent] = useState<{ fullName: string; studentCode: string; birthDate: string; gender: 'MALE' | 'FEMALE' }>({ fullName: '', studentCode: '', birthDate: '', gender: 'MALE' });
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<HocSinhDto | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ id: string; fullName: string; studentCode: string; birthDate: string; gender: 'MALE' | 'FEMALE' | undefined ; isActive: boolean }>({ id: '', fullName: '', studentCode: '', birthDate: '', gender: undefined, isActive: true });

  const formatGender = (g?: string) => (g === 'MALE' ? 'Nam' : g === 'FEMALE' ? 'Nữ' : '');

  useEffect(() => {
    let mounted = true;
    if (!classId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      classroomService.getClassById(classId),
      classroomService.getStudentsByClass(classId, stuPage, stuPageSize),
    ])
      .then(([cls, stu]) => {
        if (!mounted) return;
        setLop(cls);
        setStudents({ items: stu.items || [], totalCount: stu.totalCount || 0, totalPages: stu.totalPages || 0 });
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Không thể tải dữ liệu lớp');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [classId, stuPage, stuPageSize, refreshKey]);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Chi tiết lớp</h1>
            {lop && (
              <p className="text-blue-100 mt-1">{lop.name} • Khối {lop.grade} • {lop.academicYear}</p>
            )}
          </div>
          <Link href="/classes" className="text-sm text-white/90 hover:text-white underline underline-offset-4">Danh sách lớp</Link>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          {loading && <div className="text-white/90">Đang tải dữ liệu lớp...</div>}
          {error && <div className="text-red-200">{error}</div>}
          {!loading && !error && lop && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-white/90">Trạng thái: {lop.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setRefreshKey((k) => k + 1)} className="px-3 py-1 rounded bg-white/20 text-white/95 hover:bg-white/30 text-sm">Tải lại</button>
                  <button
                    onClick={() => {
                      const data = students.items.map(s => ({
                        'Họ tên': s.fullName,
                        'Mã HS': s.studentCode,
                        'Giới tính': s.gender === 'MALE' ? 'Nam' : s.gender === 'FEMALE' ? 'Nữ' : '',
                        'Ngày sinh': new Date(s.birthDate).toLocaleDateString(),
                      }));
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách');
                      const fileName = `${lop.name.replace(/\s+/g,'_')}_students.xlsx`;
                      XLSX.writeFile(wb, fileName);
                    }}
                    className="px-3 py-1 rounded bg-white/20 text-white/95 hover:bg-white/30 text-sm"
                  >
                    Tải danh sách học sinh
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-white">Học sinh</h2>
                  <div className="flex items-center gap-3 text-white/90">
                    <button onClick={() => { setShowAddStudent(true); setAddError(null); }} className="px-3 py-1 rounded bg-white/20 hover:bg-white/30">Thêm học sinh</button>
                    <label htmlFor="size" className="text-sm">Số dòng/trang</label>
                    <select id="size" value={stuPageSize} onChange={(e) => { setStuPageSize(parseInt(e.target.value)); setStuPage(1); }} className="bg-white/20 text-white px-2 py-1 rounded outline-none">
                      <option className="text-gray-900" value={5}>5</option>
                      <option className="text-gray-900" value={10}>10</option>
                      <option className="text-gray-900" value={20}>20</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white/80 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/90 text-gray-700">
                      <tr>
                        <th className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => setSortAsc((v) => !v)}
                            className="flex items-center gap-1 hover:underline"
                          >
                            Họ tên
                            <span className="text-xs">{sortAsc ? 'A→Z' : 'Z→A'}</span>
                          </button>
                        </th>
                        <th className="px-4 py-2">Mã HS</th>
                        <th className="px-4 py-2">Giới tính</th>
                        <th className="px-4 py-2">Ngày sinh</th>
                        <th className="px-4 py-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...students.items]
                        .sort((a, b) => (sortAsc ? a.fullName.localeCompare(b.fullName) : b.fullName.localeCompare(a.fullName)))
                        .map(s => (
                        <tr key={s.id} className="border-t border-gray-200">
                          <td className="px-4 py-2">{s.fullName}</td>
                          <td className="px-4 py-2">{s.studentCode}</td>
                          <td className="px-4 py-2">{formatGender(s.gender)}</td>
                          <td className="px-4 py-2">{new Date(s.birthDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                className="text-blue-600 hover:underline text-sm"
                                onClick={() => {
                                  setEditError(null);
                                  setShowEdit(true);
                                  setEditForm({
                                    id: s.id,
                                    fullName: s.fullName,
                                    studentCode: s.studentCode,
                                    birthDate: s.birthDate ? new Date(s.birthDate).toISOString().slice(0,10) : '',
                                    gender: (s.gender === 'MALE' || s.gender === 'FEMALE') ? s.gender : undefined,
                                    isActive: (s as any).isActive ?? true,
                                  });
                                }}
                              >
                                Sửa
                              </button>
                              <button
                                className="text-red-600 hover:underline text-sm"
                                onClick={() => { setStudentToDelete(s); setShowDelete(true); }}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {students.items.length === 0 && (
                        <tr>
                          <td className="px-4 py-4 text-gray-500" colSpan={5}>Chưa có học sinh</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-end gap-2 text-white/90 mt-3">
                  <button disabled={stuPage <= 1} onClick={() => setStuPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-white/20 disabled:opacity-50">Trước</button>
                  <span>Trang {stuPage}/{Math.max(1, students.totalPages)}</span>
                  <button disabled={stuPage >= students.totalPages} onClick={() => setStuPage((p) => p + 1)} className="px-3 py-1 rounded bg-white/20 disabled:opacity-50">Sau</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {showAddStudent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddStudent(false)}></div>
        <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Thêm học sinh</h3>
            <button onClick={() => setShowAddStudent(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!classId) return;
                setAdding(true);
                setAddError(null);
                try {
                  await classroomService.createStudentInClass(
                    classId,
                    {
                      fullName: formStudent.fullName,
                      studentCode: formStudent.studentCode,
                      birthDate: formStudent.birthDate,
                      gender: formStudent.gender,
                    }
                  );
                  setShowAddStudent(false);
                  setFormStudent({ fullName: '', studentCode: '', birthDate: '', gender: 'MALE' });
                  setRefreshKey((k) => k + 1);
                } catch (e) {
                  setAddError(e instanceof Error ? e.message : 'Không thể thêm học sinh');
                  setShowError(true);
                } finally {
                  setAdding(false);
                }
              }}
              className="space-y-4"
            >
              {addError && <div className="text-red-600 text-sm">{addError}</div>}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
                <input type="text" value={formStudent.fullName} onChange={(e) => setFormStudent({ ...formStudent, fullName: e.target.value })} required className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Mã HS</label>
                  <input type="text" value={formStudent.studentCode} onChange={(e) => setFormStudent({ ...formStudent, studentCode: e.target.value })} required className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Giới tính</label>
                  <select value={formStudent.gender} onChange={(e) => setFormStudent({ ...formStudent, gender: e.target.value as 'MALE' | 'FEMALE' })} className="w-full px-3 py-2 rounded border border-gray-300 outline-none">
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ngày sinh</label>
                <input type="date" value={formStudent.birthDate} onChange={(e) => setFormStudent({ ...formStudent, birthDate: e.target.value })} required className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
                <p className="text-xs text-gray-500 mt-1">Sẽ gửi dạng ISO: YYYY-MM-DDT00:00:00Z</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddStudent(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700">Hủy</button>
                <button type="submit" disabled={adding} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{adding ? 'Đang lưu...' : 'Thêm học sinh'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {showEdit && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowEdit(false)}></div>
        <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Sửa học sinh</h3>
            <button onClick={() => setShowEdit(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-5">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!classId) return;
                setSavingEdit(true);
                setEditError(null);
                try {
                  await classroomService.updateStudent(editForm.id, {
                    id: editForm.id,
                    fullName: editForm.fullName,
                    studentCode: editForm.studentCode,
                    birthDate: editForm.birthDate,
                    gender: editForm.gender,
                    classId: classId as string,
                    isActive: editForm.isActive,
                  });
                  setShowEdit(false);
                  setRefreshKey((k) => k + 1);
                } catch (e) {
                  setEditError(e instanceof Error ? e.message : 'Không thể lưu');
                } finally {
                  setSavingEdit(false);
                }
              }}
              className="space-y-4"
            >
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
                <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Mã HS</label>
                  <input type="text" value={editForm.studentCode} onChange={(e) => setEditForm({ ...editForm, studentCode: e.target.value })} required className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Giới tính</label>
                  <select value={editForm.gender ?? ''} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value === '' ? undefined : (e.target.value as 'MALE' | 'FEMALE') })} className="w-full px-3 py-2 rounded border border-gray-300 outline-none">
                    <option value="">Không đổi</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ngày sinh</label>
                  <input type="date" value={editForm.birthDate} onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })} className="w-full px-3 py-2 rounded border border-gray-300 outline-none" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input id="activeEdit" type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} className="h-4 w-4" />
                  <label htmlFor="activeEdit" className="text-sm text-gray-700">Đang hoạt động</label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700">Hủy</button>
                <button type="submit" disabled={savingEdit} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{savingEdit ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {showError && addError && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowError(false)}></div>
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lỗi</h3>
            <button onClick={() => setShowError(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-5">
            <div className="text-red-600 text-sm whitespace-pre-line">{addError}</div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button onClick={() => setShowError(false)} className="px-4 py-2 rounded bg-blue-600 text-white">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {showDelete && studentToDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowDelete(false)}></div>
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
            <button onClick={() => setShowDelete(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-5">
            <p className="text-gray-700 text-sm">Bạn có chắc muốn xóa học sinh "{studentToDelete.fullName}"?</p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700">Hủy</button>
              <button
                onClick={async () => {
                  if (!studentToDelete) return;
                  setDeleting(true);
                  try {
                    await classroomService.deleteStudent(studentToDelete.id);
                    setShowDelete(false);
                    setStudentToDelete(null);
                    setRefreshKey((k) => k + 1);
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


