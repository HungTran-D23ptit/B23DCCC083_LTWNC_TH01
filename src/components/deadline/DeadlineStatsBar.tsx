import { useMemo } from 'react';
import { DeadlineStatusFilter, isOverdue } from '../../types/deadline.types';
import type { Assignment } from '../../types/deadline.types';
import {
  ListTodo,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface DeadlineStatsBarProps {
  assignments: Assignment[];
  activeFilter: DeadlineStatusFilter;
  onSelectFilter: (filter: DeadlineStatusFilter) => void;
}

export function DeadlineStatsBar({
  assignments,
  activeFilter,
  onSelectFilter,
}: DeadlineStatsBarProps) {
  const stats = useMemo(() => {
    const total = assignments.length;
    let completed = 0;
    let overdue = 0;
    let pending = 0;

    assignments.forEach((asn) => {
      if (asn.completed) {
        completed++;
      } else {
        pending++;
        if (isOverdue(asn.dueDate, false)) {
          overdue++;
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, overdue, pending, completionRate };
  }, [assignments]);

  return (
    <div className="stats-dashboard">
      <div className="stats-grid">
        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.ALL ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.ALL)}
          title="Bấm để lọc: Xem tất cả bài tập"
          aria-label="Lọc tất cả bài tập"
        >
          <div className="stat-icon-wrap icon-blue">
            <ListTodo size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-lbl">Tổng bài tập</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.PENDING ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.PENDING)}
          title="Bấm để lọc: Xem các bài tập đang chờ làm"
          aria-label="Lọc bài tập đang chờ làm"
        >
          <div className="stat-icon-wrap icon-amber">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-val">{stats.pending}</div>
            <div className="stat-lbl">Đang chờ làm</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.OVERDUE ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.OVERDUE)}
          title="Bấm để lọc: Xem các bài tập đã quá hạn nộp"
          aria-label="Lọc bài tập đã quá hạn"
        >
          <div className="stat-icon-wrap icon-rose">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-val">{stats.overdue}</div>
            <div className="stat-lbl">Quá hạn nộp</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.COMPLETED ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.COMPLETED)}
          title="Bấm để lọc: Xem các bài tập đã hoàn thành"
          aria-label="Lọc bài tập đã hoàn thành"
        >
          <div className="stat-icon-wrap icon-emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-val">{stats.completed}</div>
            <div className="stat-lbl">Đã hoàn thành</div>
          </div>
        </button>
      </div>

      <div className="completion-progress-card">
        <div className="progress-label-row">
          <span>Tiến độ hoàn thành bài tập kỳ này</span>
          <strong>{stats.completionRate}% ({stats.completed}/{stats.total})</strong>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
