import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAssignments,
  addAssignment,
  toggleComplete,
  deleteAssignment,
  setStatusFilter,
  setSelectedSubject,
  setSelectedPriority,
  setSearchTerm,
  setSortBy,
  resetToDefaultMockData,
} from './assignmentsSlice';
import {
  DeadlineStatusFilter,
  PriorityLevel,
  isOverdue,
} from '../../types/deadline.types';
import type {
  Assignment,
  CreateAssignmentDTO,
} from '../../types/deadline.types';
import { DeadlineCard } from '../../components/deadline/DeadlineCard';
import { DeadlineStatsBar } from '../../components/deadline/DeadlineStatsBar';
import { CompoundFilter } from '../../components/common/CompoundFilter';
import { CreateDeadlineModal } from '../../components/deadline/CreateDeadlineModal';
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Inbox,
  Sparkles,
  Layers,
} from 'lucide-react';

export function AssignmentsTab() {
  const dispatch = useAppDispatch();
  const {
    items: assignments,
    status,
    error,
    statusFilter,
    selectedSubject,
    selectedPriority,
    searchTerm,
    sortBy,
  } = useAppSelector((state) => state.assignments);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAssignments({ delayMs: 600 }));
    }
  }, [status, dispatch]);

  const availableSubjects = useMemo(() => {
    const subjects = assignments.map((a) => a.subject);
    return Array.from(new Set(subjects));
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    let result = [...assignments];

    if (statusFilter === DeadlineStatusFilter.PENDING) {
      result = result.filter((a) => !a.completed && !isOverdue(a.dueDate, false));
    } else if (statusFilter === DeadlineStatusFilter.OVERDUE) {
      result = result.filter((a) => !a.completed && isOverdue(a.dueDate, false));
    } else if (statusFilter === DeadlineStatusFilter.COMPLETED) {
      result = result.filter((a) => a.completed);
    }

    if (selectedSubject !== 'ALL') {
      result = result.filter((a) => a.subject === selectedSubject);
    }

    if (selectedPriority !== 'ALL') {
      result = result.filter((a) => a.priority === selectedPriority);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'dueDateDesc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight: Record<PriorityLevel, number> = {
          [PriorityLevel.HIGH]: 3,
          [PriorityLevel.MEDIUM]: 2,
          [PriorityLevel.LOW]: 1,
        };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [assignments, statusFilter, selectedSubject, selectedPriority, searchTerm, sortBy]);

  const handleCreateAssignment = (dto: CreateAssignmentDTO) => {
    dispatch(addAssignment(dto));
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleComplete(id));
  };

  const handleDeleteAssignment = (id: string) => {
    dispatch(deleteAssignment(id));
  };

  return (
    <div className="tracker-layout">
      <div className="tracker-header-actions">
        <div className="section-title-wrap">
          <h2>
            <Layers size={22} className="section-icon" /> Danh sách bài tập & Deadline
          </h2>
          <p>Theo dõi tiến độ, sắp xếp thời gian làm bài hiệu quả và đúng hạn</p>
        </div>

        <div className="header-btn-group">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => dispatch(resetToDefaultMockData())}
            title="Khôi phục danh sách mẫu từ PTIT"
          >
            <RefreshCw size={15} /> Dữ liệu mẫu
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} /> Thêm bài tập mới
          </button>
        </div>
      </div>

      <DeadlineStatsBar
        assignments={assignments}
        activeFilter={statusFilter}
        onSelectFilter={(filter) => dispatch(setStatusFilter(filter))}
      />

      <CompoundFilter
        statusFilter={statusFilter}
        onStatusChange={(st) => dispatch(setStatusFilter(st))}
        searchTerm={searchTerm}
        onSearchChange={(tm) => dispatch(setSearchTerm(tm))}
        selectedSubject={selectedSubject}
        onSubjectChange={(sb) => dispatch(setSelectedSubject(sb))}
        availableSubjects={availableSubjects}
        selectedPriority={selectedPriority}
        onPriorityChange={(pr) => dispatch(setSelectedPriority(pr))}
        sortBy={sortBy}
        onSortChange={(sb) => dispatch(setSortBy(sb))}
      />

      {status === 'loading' && (
        <div className="deadline-grid-loading">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <div key={key} className="skeleton-card glass-panel shimmer">
              <div className="skeleton-line title" />
              <div className="skeleton-line text" />
              <div className="skeleton-line footer" />
            </div>
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="glass-panel state-error-box">
          <AlertCircle size={40} className="error-icon" />
          <h3>Không thể kết nối máy chủ!</h3>
          <p>{error || 'Đã có sự cố khi tải danh sách bài tập. Vui lòng thử lại.'}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => dispatch(fetchAssignments({ delayMs: 400 }))}
          >
            <RefreshCw size={15} /> Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && filteredAssignments.length === 0 && (
        <div className="glass-panel state-empty-box">
          <div className="empty-icon-wrap">
            <Inbox size={48} />
          </div>
          <h3>Không có bài tập nào phù hợp bộ lọc</h3>
          <p>
            {searchTerm || selectedSubject !== 'ALL' || selectedPriority !== 'ALL'
              ? 'Thử điều chỉnh lại bộ lọc môn học, độ ưu tiên hoặc xóa từ khóa tìm kiếm.'
              : 'Tuyệt vời! Bạn không còn deadline nào đang chờ. Hãy thêm bài tập mới nếu có.'}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Sparkles size={16} /> Thêm bài tập mới
          </button>
        </div>
      )}

      {status === 'succeeded' && filteredAssignments.length > 0 && (
        <div className="deadline-cards-grid">
          {filteredAssignments.map((assignment: Assignment) => (
            <DeadlineCard
              key={assignment.id}
              assignment={assignment}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteAssignment}
            />
          ))}
        </div>
      )}

      <CreateDeadlineModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssignment}
        existingSubjects={availableSubjects}
      />
    </div>
  );
}
