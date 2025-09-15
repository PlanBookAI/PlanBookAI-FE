'use client';

import { useCallback, useMemo, useState } from 'react';
import type { MonHoc } from '@/types/exam';
import type { TaoDeThiTuCauHoiRequest, DeThi } from '@/types/exam';
import { examService } from '@/services/exam';

export interface ExamDraftPayload {
  tieuDe: string;
  monHoc: MonHoc;
  khoiLop: number;
  thoiGianLamBai: number;
  danhSachCauHoiId: string[];
}

export function useExamDraft(initial?: Partial<ExamDraftPayload>) {
  const [draft, setDraft] = useState<ExamDraftPayload>({
    tieuDe: initial?.tieuDe ?? '',
    monHoc: (initial?.monHoc ?? 'TOAN') as MonHoc,
    khoiLop: initial?.khoiLop ?? 10,
    thoiGianLamBai: initial?.thoiGianLamBai ?? 45,
    danhSachCauHoiId: initial?.danhSachCauHoiId ?? [],
  });

  const addQuestionId = useCallback((id: string) => {
    setDraft(prev => {
      if (!id || prev.danhSachCauHoiId.includes(id)) return prev;
      return { ...prev, danhSachCauHoiId: [...prev.danhSachCauHoiId, id] };
    });
  }, []);

  const removeQuestionId = useCallback((id: string) => {
    setDraft(prev => ({
      ...prev,
      danhSachCauHoiId: prev.danhSachCauHoiId.filter(x => x !== id)
    }));
  }, []);

  const clearQuestionIds = useCallback(() => {
    setDraft(prev => ({ ...prev, danhSachCauHoiId: [] }));
  }, []);

  const setMeta = useCallback((meta: Partial<Omit<ExamDraftPayload, 'danhSachCauHoiId'>>) => {
    setDraft(prev => ({ ...prev, ...meta }));
  }, []);

  const payload: TaoDeThiTuCauHoiRequest = useMemo(() => ({
    tieuDe: draft.tieuDe,
    monHoc: draft.monHoc,
    khoiLop: draft.khoiLop,
    thoiGianLamBai: draft.thoiGianLamBai,
    danhSachCauHoiId: draft.danhSachCauHoiId,
  }), [draft]);

  const save = useCallback(async (): Promise<DeThi> => {
    if (!payload.tieuDe?.trim()) {
      throw new Error('Vui lòng nhập tiêu đề đề thi');
    }
    if (!payload.monHoc) {
      throw new Error('Vui lòng chọn môn học');
    }
    if (!payload.khoiLop) {
      throw new Error('Vui lòng chọn khối lớp');
    }
    if (!Array.isArray(payload.danhSachCauHoiId) || payload.danhSachCauHoiId.length === 0) {
      throw new Error('Vui lòng thêm ít nhất một câu hỏi');
    }
    return await examService.createExamFromQuestionIds(payload);
  }, [payload]);

  return {
    draft,
    payload,
    setMeta,
    addQuestionId,
    removeQuestionId,
    clearQuestionIds,
    save,
  };
}


