import { LessonPlan, LessonTemplate, Topic, LessonStatus } from '@/types/lesson';

export type TabType = 'all' | 'draft' | 'completed' | 'published' | 'archived' | 'public-templates' | 'my-templates' | 'topics';

export class LessonPageUtils {
  // ================== TAB INFO UTILITIES ==================

  static getTabTitle(tab: TabType): string {
    const titles: Record<TabType, string> = {
      'all': 'Tất cả giáo án',
      'draft': 'Bản nháp',
      'completed': 'Hoàn thành',
      'published': 'Đã xuất bản',
      'archived': 'Lưu trữ',
      'public-templates': 'Mẫu công khai',
      'my-templates': 'Mẫu của tôi',
      'topics': 'Quản lý chủ đề'
    };
    return titles[tab];
  }

  static getTabDescription(tab: TabType): string {
    const descriptions: Record<TabType, string> = {
      'all': 'Danh sách tất cả giáo án của bạn',
      'draft': 'Các giáo án đang soạn thảo',
      'completed': 'Các giáo án đã hoàn thành',
      'published': 'Các giáo án đã được xuất bản',
      'archived': 'Các giáo án đã lưu trữ',
      'public-templates': 'Mẫu giáo án công khai từ cộng đồng',
      'my-templates': 'Mẫu giáo án do bạn tạo',
      'topics': 'Quản lý chủ đề cho môn Hóa học'
    };
    return descriptions[tab];
  }

  // ================== FILTERING UTILITIES ==================

  static getFilteredLessonPlans(
    lessonPlans: LessonPlan[], 
    activeTab: TabType,
    filterByStatus: (status?: LessonStatus) => LessonPlan[]
  ): LessonPlan[] {
    if (activeTab === 'all') return lessonPlans;
    
    const statusMap: Record<string, LessonStatus> = {
      'draft': 'DRAFT',
      'completed': 'COMPLETED', 
      'published': 'PUBLISHED',
      'archived': 'ARCHIVED'
    };

    const targetStatus = statusMap[activeTab];
    return targetStatus ? filterByStatus(targetStatus) : [];
  }

  static getActiveTemplates(
    publicTemplates: LessonTemplate[], 
    myTemplates: LessonTemplate[], 
    activeTab: TabType
  ): LessonTemplate[] {
    return activeTab === 'public-templates' ? publicTemplates : myTemplates;
  }

  static getFilteredTopics(topics: Topic[], selectedGrade: string): Topic[] {
    if (!selectedGrade) return topics;
    return topics.filter(topic => topic.khoi === Number(selectedGrade));
  }

  static getTopicLessonCount(lessonPlans: LessonPlan[], topicId: number): number {
    return lessonPlans.filter(plan => plan.chuDeId === topicId).length;
  }

  // ================== TAB TYPE CHECKING ==================

  static isLessonTab(activeTab: TabType): boolean {
    return ['all', 'draft', 'completed', 'published', 'archived'].includes(activeTab);
  }

  static isTemplateTab(activeTab: TabType): boolean {
    return ['public-templates', 'my-templates'].includes(activeTab);
  }

  static isTopicTab(activeTab: TabType): boolean {
    return activeTab === 'topics';
  }

  // ================== ACTION BUTTON UTILITIES ==================

  static shouldShowLessonActions(activeTab: TabType): boolean {
    return this.isLessonTab(activeTab);
  }

  static shouldShowCreateTemplateAction(activeTab: TabType): boolean {
    return activeTab === 'my-templates';
  }

  // ================== EMPTY STATE UTILITIES ==================

  static getEmptyStateConfig(activeTab: TabType): {
    title: string;
    description: string;
    actionLabel?: string;
    hasAction: boolean;
  } {
    const configs = {
      'all': {
        title: 'Chưa có giáo án nào',
        description: 'Hãy tạo giáo án đầu tiên của bạn',
        actionLabel: 'Tạo giáo án',
        hasAction: true
      },
      'draft': {
        title: 'Chưa có bản nháp nào',
        description: 'Các giáo án đang soạn thảo sẽ hiển thị ở đây',
        hasAction: false
      },
      'completed': {
        title: 'Chưa có giáo án hoàn thành',
        description: 'Các giáo án đã hoàn thành sẽ hiển thị ở đây',
        hasAction: false
      },
      'published': {
        title: 'Chưa có giáo án xuất bản',
        description: 'Các giáo án đã xuất bản sẽ hiển thị ở đây',
        hasAction: false
      },
      'archived': {
        title: 'Chưa có giáo án lưu trữ',
        description: 'Các giáo án đã lưu trữ sẽ hiển thị ở đây',
        hasAction: false
      },
      'public-templates': {
        title: 'Chưa có mẫu công khai',
        description: 'Mẫu giáo án công khai từ cộng đồng sẽ hiển thị ở đây',
        hasAction: false
      },
      'my-templates': {
        title: 'Chưa có mẫu nào',
        description: 'Hãy tạo mẫu đầu tiên của bạn',
        actionLabel: 'Tạo mẫu',
        hasAction: true
      },
      'topics': {
        title: 'Chưa có chủ đề nào',
        description: 'Danh sách chủ đề sẽ hiển thị ở đây',
        hasAction: false
      }
    };

    return configs[activeTab] || configs['all'];
  }
}
