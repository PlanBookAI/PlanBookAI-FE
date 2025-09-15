import { ReactNode } from 'react';
import { 
  LessonDetailModal,
  LessonFormModal,
  TemplateFormModal,
  CreateFromTemplateModal
} from '@/components/lesson';
import { TemplateSelectionModal } from '@/components/lesson/ui';
import { LessonPlan, LessonTemplate, Topic } from '@/types/lesson';

export interface ModalState {
  showDetailModal: boolean;
  showCreateModal: boolean;
  showEditModal: boolean;
  showTemplateModal: boolean;
  showCreateTemplateModal: boolean;
  showCreateFromTemplateModal: boolean;
  selectedLessonPlan: LessonPlan | null;
  selectedTemplate: LessonTemplate | null;
}

export interface ModalHandlers {
  onViewLessonPlan: (lesson: LessonPlan) => void;
  onEditLessonPlan: (lesson: LessonPlan) => void;
  onCreateLessonPlan: (data: any) => Promise<void>;
  onUpdateLessonPlan: (data: any) => Promise<void>;
  onCreateFromTemplate: (templateId: number, data: any) => Promise<void>;
  onCreateTemplate: (data: any) => Promise<void>;
  onUpdateTemplate: (data: any) => Promise<void>;
  onSelectTemplate: (template: LessonTemplate) => void;
  onCloseDetailModal: () => void;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCloseTemplateModal: () => void;
  onCloseCreateTemplateModal: () => void;
  onCloseCreateFromTemplateModal: () => void;
  onEditFromDetailModal: (lesson: LessonPlan) => void;
  onEditTemplate: (template: LessonTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export interface ModalManagerProps {
  state: ModalState;
  handlers: ModalHandlers;
  topics: Topic[];
  publicTemplates: LessonTemplate[];
  myTemplates: LessonTemplate[];
  loading: {
    lessons: boolean;
    templates: boolean;
  };
}

export class ModalManager {
  static renderModals(props: ModalManagerProps): ReactNode {
    const { state, handlers, topics, publicTemplates, myTemplates, loading } = props;

    return (
      <>
        {/* Lesson Detail Modal */}
        {state.showDetailModal && state.selectedLessonPlan && (
          <LessonDetailModal
            lesson={state.selectedLessonPlan}
            topics={topics}
            onClose={handlers.onCloseDetailModal}
            onEdit={handlers.onEditFromDetailModal}
          />
        )}

        {/* Create Lesson Modal */}
        {state.showCreateModal && (
          <LessonFormModal
            topics={topics}
            onSubmit={handlers.onCreateLessonPlan}
            onClose={handlers.onCloseCreateModal}
            isLoading={loading.lessons}
          />
        )}

        {/* Edit Lesson Modal */}
        {state.showEditModal && state.selectedLessonPlan && (
          <LessonFormModal
            lesson={state.selectedLessonPlan}
            topics={topics}
            onSubmit={handlers.onUpdateLessonPlan}
            onClose={handlers.onCloseEditModal}
            isLoading={loading.lessons}
          />
        )}

        {/* Create Template Modal */}
        {state.showCreateTemplateModal && (
          <TemplateFormModal
            template={state.selectedTemplate || undefined}
            topics={topics}
            onSubmit={state.selectedTemplate ? handlers.onUpdateTemplate : handlers.onCreateTemplate}
            onClose={handlers.onCloseCreateTemplateModal}
            isLoading={loading.templates}
          />
        )}

        {/* Create from Template Modal */}
        {state.showCreateFromTemplateModal && state.selectedTemplate && (
          <CreateFromTemplateModal
            template={state.selectedTemplate}
            topics={topics}
            onSubmit={handlers.onCreateFromTemplate}
            onClose={handlers.onCloseCreateFromTemplateModal}
            isLoading={loading.lessons}
            onEdit={handlers.onEditTemplate}
            onDelete={handlers.onDeleteTemplate}
          />
        )}

        {/* Template Selection Modal */}
        {state.showTemplateModal && (
          <TemplateSelectionModal
            templates={[...publicTemplates, ...myTemplates]}
            onSelect={handlers.onSelectTemplate}
            onClose={handlers.onCloseTemplateModal}
          />
        )}
      </>
    );
  }
}
