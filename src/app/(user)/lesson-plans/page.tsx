'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  useLessonPlans, 
  useTemplates, 
  useTopics 
} from '@/hooks';
import {
  LessonCard,
  TemplateCard,
  TopicCard
} from '@/components/lesson';
import { TemplateFormModal } from '@/components/lesson/TemplateFormModal';
import { CreateFromTemplateModal } from '@/components/lesson/CreateFromTemplateModal';
import {
  NavButton,
  GradeFilterButton,
  LoadingSpinner,
  EmptyState,
  InlineAlert
} from '@/components/lesson/ui';
import { LessonPageHandlers, LessonPageHandlersProps } from '@/handlers/LessonPageHandlers';
import { LessonPageUtils, TabType } from '@/utils/lessonPageUtils';
import { ModalManager, ModalState, ModalHandlers } from '@/managers/ModalManager';
import type { 
  LessonPlan, 
  LessonTemplate, 
  GradeLevel 
} from '@/types/lesson';

export default function TeacherLessonPlansPage() {
  // ================== STATE ==================
  
  // UI Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedSubject] = useState('HOA_HOC');

  // Modal State
  const [modalState, setModalState] = useState<ModalState>({
    showDetailModal: false,
    showCreateModal: false,
    showEditModal: false,
    showTemplateModal: false,
    showCreateTemplateModal: false,
    showCreateFromTemplateModal: false,
    selectedLessonPlan: null,
    selectedTemplate: null
  });

  // ================== HOOKS ==================
  
  const lessonHooks = useLessonPlans();
  const templateHooks = useTemplates();
  const topicHooks = useTopics();

  // ================== EFFECTS ==================
  
  // Load lesson plans và topics khi filters thay đổi
  useEffect(() => {
    const filters = {
      keyword: searchQuery || undefined,
      monHoc: selectedSubject,
      khoi: selectedGrade ? Number(selectedGrade) as GradeLevel : undefined,
      chuDeId: selectedTopic || undefined
    };
    
    lessonHooks.fetchLessonPlans(filters);
    topicHooks.fetchTopics();
  }, [searchQuery, selectedGrade, selectedTopic, selectedSubject]);

  // Load templates khi filters thay đổi
  useEffect(() => {
    const filters = {
      keyword: searchQuery || undefined,
      monHoc: selectedSubject,
      khoi: selectedGrade ? Number(selectedGrade) as GradeLevel : undefined
    };
    
    templateHooks.fetchPublicTemplates(filters);
    templateHooks.fetchMyTemplates(filters);
  }, [searchQuery, selectedGrade, selectedSubject]);

  // ================== HANDLERS SETUP ==================
  
  // Modal state setters
  const setSelectedLessonPlan = (lesson: LessonPlan | null) => {
    setModalState(prev => ({ ...prev, selectedLessonPlan: lesson }));
  };

  const setSelectedTemplate = (template: LessonTemplate | null) => {
    setModalState(prev => ({ ...prev, selectedTemplate: template }));
  };

  const setShowDetailModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showDetailModal: show }));
  };

  const setShowEditModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showEditModal: show }));
  };

  const setShowCreateModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showCreateModal: show }));
  };

  const setShowTemplateModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showTemplateModal: show }));
  };

  const setShowCreateTemplateModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showCreateTemplateModal: show }));
  };

  const setShowCreateFromTemplateModal = (show: boolean) => {
    setModalState(prev => ({ ...prev, showCreateFromTemplateModal: show }));
  };

  // Handlers props for LessonPageHandlers
  const handlersProps: LessonPageHandlersProps = {
    // Hook functions
    getLessonPlan: lessonHooks.getLessonPlan,
    createLessonPlan: lessonHooks.createLessonPlan,
    updateLessonPlan: lessonHooks.updateLessonPlan,
    deleteLessonPlan: lessonHooks.deleteLessonPlan,
    copyLessonPlan: lessonHooks.copyLessonPlan,
    transitionStatus: lessonHooks.transitionStatus,
    createFromTemplate: lessonHooks.createFromTemplate,
    getTemplate: templateHooks.getTemplate,
    createTemplate: templateHooks.createTemplate,

    // Template functions
    updateTemplate: templateHooks.updateTemplate,
    deleteTemplate: templateHooks.deleteTemplate,
    getTemplates: templateHooks.fetchMyTemplates,
    
    // State setters
    setSelectedLessonPlan,
    setSelectedTemplate,
    setShowDetailModal,
    setShowEditModal,
    setShowCreateModal,
    setShowTemplateModal,
    setShowCreateTemplateModal,
    setShowCreateFromTemplateModal,

    // Modal state setter
    setModalState,
  };

  // Create handlers instance
  const handlers = new LessonPageHandlers(handlersProps);

  // Modal handlers
  const modalHandlers: ModalHandlers = {
    onViewLessonPlan: handlers.handleViewLessonPlan,
    onEditLessonPlan: handlers.handleEditLessonPlan,
    onCreateLessonPlan: handlers.handleCreateLessonPlan,
    onUpdateLessonPlan: handlers.handleUpdateLessonPlan,
    onCreateFromTemplate: handlers.handleCreateFromTemplate,
    onCreateTemplate: handlers.handleCreateTemplate,
    onUpdateTemplate: handlers.handleUpdateTemplate,
    onSelectTemplate: handlers.handleSelectTemplate,
    onCloseDetailModal: handlers.handleCloseDetailModal,
    onCloseCreateModal: handlers.handleCloseCreateModal,
    onCloseEditModal: handlers.handleCloseEditModal,
    onCloseTemplateModal: handlers.handleCloseTemplateModal,
    onCloseCreateTemplateModal: handlers.handleCloseCreateTemplateModal,
    onCloseCreateFromTemplateModal: handlers.handleCloseCreateFromTemplateModal,
    onEditFromDetailModal: handlers.handleEditFromDetailModal,

    // Template management handlers 
    onEditTemplate: handlers.handleEditTemplate,
    onDeleteTemplate: handlers.handleDeleteTemplate
  };

  // ================== COMPUTED VALUES ==================
  
  const filteredLessonPlans = LessonPageUtils.getFilteredLessonPlans(
    lessonHooks.lessonPlans, 
    activeTab, 
    lessonHooks.filterByStatus
  );

  const activeTemplates = LessonPageUtils.getActiveTemplates(
    templateHooks.publicTemplates,
    templateHooks.myTemplates,
    activeTab
  );

  const filteredTopics = LessonPageUtils.getFilteredTopics(topicHooks.topics, selectedGrade);

  // ================== EVENT HANDLERS ==================
  
  const handleTopicSelect = (topicId: number) => {
    setSelectedTopic(topicId);
    setActiveTab('all');
  };

  const handleGradeToggle = (grade: number) => {
    setSelectedGrade(selectedGrade === grade.toString() ? '' : grade.toString());
  };

  // ================== RENDER HELPERS ==================
  
  const renderActionButtons = () => {
    if (LessonPageUtils.shouldShowLessonActions(activeTab)) {
      return (
        <>
          <Button
            variant="secondary"
            onClick={() => setShowTemplateModal(true)}
            className="bg-white bg-opacity-15 hover:bg-opacity-25 text-white border-white border-opacity-30"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Từ mẫu
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tạo giáo án
          </Button>
        </>
      );
    }

    if (LessonPageUtils.shouldShowCreateTemplateAction(activeTab)) {
      return (
        <Button
          variant="primary"
          onClick={() => setShowCreateTemplateModal(true)}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Tạo mẫu
        </Button>
      );
    }

    return null;
  };

  const renderTabContent = () => {
    // Error handling - show errors as inline alerts, don't block content
    const hasError = lessonHooks.error || templateHooks.error || topicHooks.error;

    // Lesson tabs
    if (LessonPageUtils.isLessonTab(activeTab)) {
      if (lessonHooks.loading) {
        return <LoadingSpinner />;
      }

      return (
        <div className="space-y-4">
          {lessonHooks.error && (
            <InlineAlert type="error" message={`Lỗi: ${lessonHooks.error}`} />
          )}
          
          {filteredLessonPlans.length === 0 ? (
            <EmptyState
              title={LessonPageUtils.getEmptyStateConfig(activeTab).title}
              description={LessonPageUtils.getEmptyStateConfig(activeTab).description}
              actionLabel={LessonPageUtils.getEmptyStateConfig(activeTab).actionLabel}
              onAction={LessonPageUtils.getEmptyStateConfig(activeTab).hasAction ? () => setShowCreateModal(true) : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessonPlans.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onView={handlers.handleViewLessonPlan}
                  onEdit={handlers.handleEditLessonPlan}
                  onDelete={handlers.handleDeleteLessonPlan}
                  onCopy={handlers.handleCopyLessonPlan}
                  onApprove={handlers.handleApprove}
                  onPublish={handlers.handlePublish}
                  onArchive={handlers.handleArchive}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Template tabs
    if (LessonPageUtils.isTemplateTab(activeTab)) {
      if (templateHooks.loading) {
        return <LoadingSpinner />;
      }

      return (
        <div className="space-y-4">
          {templateHooks.error && (
            <InlineAlert type="error" message={`Lỗi: ${templateHooks.error}`} />
          )}
          
          {activeTemplates.length === 0 ? (
            <EmptyState
              title={LessonPageUtils.getEmptyStateConfig(activeTab).title}
              description={LessonPageUtils.getEmptyStateConfig(activeTab).description}
              actionLabel={LessonPageUtils.getEmptyStateConfig(activeTab).actionLabel}
              onAction={LessonPageUtils.getEmptyStateConfig(activeTab).hasAction ? () => setShowCreateTemplateModal(true) : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onView={handlers.handleViewTemplate}
                  topicName={(template.chuDeId && (topicHooks.topics.find(t => t.id === template.chuDeId)?.ten)) || undefined}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Topics tab
    if (LessonPageUtils.isTopicTab(activeTab)) {
      if (topicHooks.loading) {
        return <LoadingSpinner />;
      }

      return (
        <div className="space-y-4">
          {topicHooks.error && (
            <InlineAlert type="error" message={`Lỗi: ${topicHooks.error}`} />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                lessonCount={LessonPageUtils.getTopicLessonCount(lessonHooks.lessonPlans, topic.id)}
                onSelect={() => handleTopicSelect(topic.id)}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // ================== RENDER ==================

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="flex">
        {/* Sub Sidebar */}
        <div className="w-80 bg-white bg-opacity-10 backdrop-blur-sm border-r border-white border-opacity-20 min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-8">Quản lý giáo án</h2>
            
            {/* Navigation */}
            <div className="space-y-6">
              {/* Giáo án */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Giáo án</h3>
                <div className="space-y-1">
                  <NavButton
                    isActive={activeTab === 'all'}
                    onClick={() => setActiveTab('all')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-7-2a2 2 0 002 2h10a2 2 0 002-2M5 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2"/>
                      </svg>
                    )}
                    label="Tất cả"
                    count={lessonHooks.stats.total}
                  />
                  <NavButton
                    isActive={activeTab === 'draft'}
                    onClick={() => setActiveTab('draft')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M18.5 2.5l3 3M7 13l8.5-8.5"/>
                      </svg>
                    )}
                    label="Bản nháp"
                    count={lessonHooks.stats.drafts}
                  />
                  <NavButton
                    isActive={activeTab === 'completed'}
                    onClick={() => setActiveTab('completed')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                    label="Hoàn thành"
                    count={lessonHooks.stats.completed}
                  />
                  <NavButton
                    isActive={activeTab === 'published'}
                    onClick={() => setActiveTab('published')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414"/>
                      </svg>
                    )}
                    label="Đã xuất bản"
                    count={lessonHooks.stats.published}
                  />
                  <NavButton
                    isActive={activeTab === 'archived'}
                    onClick={() => setActiveTab('archived')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M5 7l2 12h10l2-12M9 7V5h6v2"/>
                      </svg>
                    )}
                    label="Lưu trữ"
                    count={lessonHooks.stats.archived}
                  />
                </div>

                {/* Quick Actions - DYNAMIC */}
                <div className="border-t border-white border-opacity-20 pt-4">
                  <div className="px-3 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider mb-2">
                    Thao tác nhanh
                  </div>
                  
                  {/* Action button for notifications */}
                  <button
                    onClick={() => window.location.href = '/notifications'}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 text-blue-100 hover:bg-white hover:bg-opacity-10"
                  >
                    <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span>Thông báo</span>
                    <span className="ml-auto text-xs bg-yellow-400 bg-opacity-80 text-yellow-900 px-2 py-1 rounded">New</span>
                  </button>
                </div>
              </div>

              {/* Mẫu giáo án */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Mẫu giáo án</h3>
                <div className="space-y-1">
                  <NavButton
                    isActive={activeTab === 'public-templates'}
                    onClick={() => setActiveTab('public-templates')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3M5 10v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                      </svg>
                    )}
                    label="Mẫu công khai"
                    count={templateHooks.stats.templates_public}
                  />
                  <NavButton
                    isActive={activeTab === 'my-templates'}
                    onClick={() => setActiveTab('my-templates')}
                    icon={(
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A8 8 0 1118.879 6.196 8 8 0 015.12 17.804z"/>
                      </svg>
                    )}
                    label="Mẫu của tôi"
                    count={templateHooks.stats.templates_mine}
                  />
                </div>
              </div>

              {/* Chủ đề */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chủ đề</h3>
                <NavButton
                  isActive={activeTab === 'topics'}
                  onClick={() => setActiveTab('topics')}
                  icon={(
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7-7 7-7-7V7a4 4 0 014-4z"/>
                    </svg>
                  )}
                  label="Quản lý chủ đề"
                />
              </div>

              {/* Lọc theo khối */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Lọc theo khối</h3>
                <div className="space-y-1">
                  {[10, 11, 12].map(grade => (
                    <GradeFilterButton
                      key={grade}
                      grade={grade}
                      isSelected={selectedGrade === grade.toString()}
                      onClick={() => handleGradeToggle(grade)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Header với breadcrumb và search */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <nav className="text-blue-200 text-sm">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="hover:text-white transition-colors hover:underline"
                >
                  Dashboard
                </button>
                <span className="mx-2">/</span>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  Quản lý giáo án
                </button>
              </nav>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {LessonPageUtils.getTabTitle(activeTab)}
                </h1>
                <p className="text-blue-200">
                  {LessonPageUtils.getTabDescription(activeTab)}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 pr-10 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  <svg className="absolute right-3 top-2.5 h-5 w-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                {/* Action buttons */}
                {renderActionButtons()}
              </div>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {ModalManager.renderModals({
        state: modalState,
        handlers: modalHandlers,
        topics: topicHooks.topics,
        publicTemplates: templateHooks.publicTemplates,
        myTemplates: templateHooks.myTemplates,
        loading: {
          lessons: lessonHooks.loading,
          templates: templateHooks.loading
          }
        })}

        {/* Create From Template Modal */}
        {modalState.showCreateFromTemplateModal && modalState.selectedTemplate && (
          <CreateFromTemplateModal
            template={modalState.selectedTemplate}
            topics={topicHooks.topics}
            onSubmit={handlers.handleCreateFromTemplate}
            onClose={handlers.handleCloseCreateFromTemplateModal}
            isLoading={lessonHooks.loading}
            onEdit={handlers.handleEditTemplate}
            onDelete={handlers.handleDeleteTemplate}
          />
        )}
      </div>
    </AuthGuard>
  );
}