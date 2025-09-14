import { useState, useEffect, useCallback } from 'react';
import { LessonService } from '@/services/lesson';
import { Topic, SubjectType } from '@/types/lesson';

/**
 * Custom hook để quản lý state và logic cho chủ đề (topics)
 */
export const useTopics = () => {
  // State
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tất cả chủ đề
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LessonService.getTopics();
      
      if (response.thanhCong && Array.isArray(response.duLieu)) {
        setTopics(response.duLieu);
      } else {
        setError(response.thongDiep || 'Không thể tải danh sách chủ đề');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách chủ đề');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch chủ đề theo môn học
  const fetchTopicsBySubject = useCallback(async (subject: SubjectType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LessonService.getTopicsBySubject(subject);
      
      if (response.thanhCong && Array.isArray(response.duLieu)) {
        setTopics(response.duLieu);
      } else {
        setError(response.thongDiep || 'Không thể tải danh sách chủ đề theo môn học');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách chủ đề theo môn học');
      console.error('Error fetching topics by subject:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo chủ đề mới
  const createTopic = useCallback(async (data: any) => {
    try {
      const response = await LessonService.createTopic(data);
      
      if (response.thanhCong && response.duLieu) {
        // Refresh danh sách sau khi tạo thành công
        fetchTopics();
        return response.duLieu;
      } else {
        throw new Error(response.thongDiep || 'Không thể tạo chủ đề');
      }
    } catch (err) {
      console.error('Error creating topic:', err);
      throw err;
    }
  }, [fetchTopics]);

  // Lấy chủ đề theo ID
  const getTopicById = useCallback((id: number) => {
    return topics.find(topic => topic.id === id) || null;
  }, [topics]);

  return {
    topics,
    loading,
    error,
    fetchTopics,
    fetchTopicsBySubject,
    createTopic,
    getTopicById
  };
};

export default useTopics;
