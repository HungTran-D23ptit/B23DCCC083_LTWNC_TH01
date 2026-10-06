import React, { createContext, useContext } from 'react';
import { PriorityLevel, UrgencyLevel } from '../../types/deadline.types';
import type { Assignment } from '../../types/deadline.types';
import { useDeadlineCalculator } from '../../hooks/useDeadlineCalculator';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  AlertCircle,
  Tag,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface DeadlineCardContextValue {
  assignment: Assignment;
  isOverdue: boolean;
  isDueToday: boolean;
  displayText: string;
  urgency: UrgencyLevel;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DeadlineCardContext = createContext<DeadlineCardContextValue | undefined>(undefined);

function useDeadlineCardContext() {
  const context = useContext(DeadlineCardContext);
  if (!context) {
    throw new Error('DeadlineCard compound components must be used within <DeadlineCard>');
  }
  return context;
}

interface DeadlineCardProps {
  assignment: Assignment;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  children?: React.ReactNode;
}

export function DeadlineCard({
  assignment,
  onToggleComplete,
  onDelete,
  children,
}: DeadlineCardProps) {
  const calc = useDeadlineCalculator(assignment.dueDate, assignment.completed);

  const contextValue: DeadlineCardContextValue = {
    assignment,
    isOverdue: calc.isOverdue,
    isDueToday: calc.isDueToday,
    displayText: calc.displayText,
    urgency: calc.urgency,
    onToggleComplete,
    onDelete,
  };

  const getCardBorderClass = () => {
    if (assignment.completed) return 'card-completed';
    if (calc.isOverdue) return 'card-overdue';
    if (calc.isDueToday) return 'card-urgent';
    if (assignment.priority === PriorityLevel.HIGH) return 'card-priority-high';
    return '';
  };

  return (
    <DeadlineCardContext.Provider value={contextValue}>
      <div className={`deadline-card ${getCardBorderClass()}`}>
        {children || (
          <>
            <DeadlineCard.Header />
            <DeadlineCard.Body />
            <DeadlineCard.Footer />
          </>
        )}
      </div>
    </DeadlineCardContext.Provider>
  );
}

DeadlineCard.Header = function DeadlineCardHeader() {
  const { assignment, onToggleComplete } = useDeadlineCardContext();

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.HIGH:
        return <span className="badge badge-priority-high">Ưu tiên cao</span>;
      case PriorityLevel.MEDIUM:
        return <span className="badge badge-priority-medium">Ưu tiên trung bình</span>;
      case PriorityLevel.LOW:
        return <span className="badge badge-priority-low">Ưu tiên thấp</span>;
    }
  };

  return (
    <div className="deadline-card-header">
      <div className="deadline-subject-wrap">
        <span className="subject-icon">
          <BookOpen size={14} />
        </span>
        <span className="subject-name">{assignment.subject}</span>
      </div>

      <div className="deadline-header-right">
        {getPriorityBadge(assignment.priority)}
        <button
          type="button"
          className={`toggle-check-btn ${assignment.completed ? 'completed' : ''}`}
          onClick={() => onToggleComplete?.(assignment.id)}
          title={assignment.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        >
          {assignment.completed ? (
            <CheckCircle2 size={20} className="check-icon-active" />
          ) : (
            <Circle size={20} className="check-icon-idle" />
          )}
        </button>
      </div>
    </div>
  );
};

DeadlineCard.Body = function DeadlineCardBody() {
  const { assignment, displayText, isOverdue, isDueToday, urgency } = useDeadlineCardContext();

  const getCountdownBadgeClass = () => {
    if (assignment.completed) return 'countdown-completed';
    if (isOverdue) return 'countdown-overdue';
    if (isDueToday) return 'countdown-urgent';
    if (urgency === UrgencyLevel.WARNING) return 'countdown-warning';
    return 'countdown-normal';
  };

  return (
    <div className="deadline-card-body">
      <h3 className={`deadline-title ${assignment.completed ? 'text-strikethrough' : ''}`}>
        {assignment.title}
      </h3>

      {assignment.description && (
        <p className="deadline-desc">{assignment.description}</p>
      )}

      <div className="deadline-status-row">
        <div className={`countdown-badge ${getCountdownBadgeClass()}`}>
          {isOverdue ? (
            <AlertCircle size={14} />
          ) : isDueToday ? (
            <Sparkles size={14} />
          ) : (
            <Clock size={14} />
          )}
          <span>{displayText}</span>
        </div>

        {assignment.tags && assignment.tags.length > 0 && (
          <div className="deadline-tags">
            {assignment.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                <Tag size={11} /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

DeadlineCard.Footer = function DeadlineCardFooter() {
  const { assignment, onDelete, onToggleComplete } = useDeadlineCardContext();

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="deadline-card-footer">
      <div className="deadline-date-info">
        <Calendar size={14} />
        <span>Hạn nộp: <strong>{formatDateTime(assignment.dueDate)}</strong></span>
      </div>

      <div className="deadline-card-actions">
        <button
          type="button"
          className={`btn-action ${assignment.completed ? 'btn-action-undo' : 'btn-action-complete'}`}
          onClick={() => onToggleComplete?.(assignment.id)}
        >
          {assignment.completed ? 'Làm lại' : 'Hoàn thành'}
        </button>

        <button
          type="button"
          className="btn-action btn-action-delete"
          onClick={() => onDelete?.(assignment.id)}
          title="Xóa bài tập này"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};
