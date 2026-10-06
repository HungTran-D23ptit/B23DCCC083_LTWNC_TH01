import { useMemo } from 'react';
import { DeadlineStatusFilter, isOverdue } from '../../types/deadline.types';
import type { Assignment } from '../../types/deadline.types';
import {
  ListTodo,
  Clock,
  AlertTriangle,
  Flame,
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
    let urgent = 0;
    let pending = 0;

    const now = new Date();

    assignments.forEach((asn) => {
      if (asn.completed) {
        completed++;
      } else {
        pending++;
        if (isOverdue(asn.dueDate, false)) {
          overdue++;
        } else {
          const due = new Date(asn.dueDate);
          const diffMs = due.getTime() - now.getTime();
          const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (remainingDays === 0) {
            urgent++;
          }
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, overdue, urgent, pending, completionRate };
  }, [assignments]);

  return (
    <div className="stats-dashboard">
      <div className="stats-grid">
        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.ALL ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.ALL)}
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
          className={`stat-card stat-card-urgent`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.PENDING)}
        >
          <div className="stat-icon-wrap icon-orange">
            <Flame size={22} />
          </div>
          <div className="stat-content">
            <div className="stat-val">{stats.urgent}</div>
            <div className="stat-lbl">Hạn hôm nay</div>
          </div>
        </button>

        <button
          type="button"
          className={`stat-card ${activeFilter === DeadlineStatusFilter.COMPLETED ? 'active' : ''}`}
          onClick={() => onSelectFilter(DeadlineStatusFilter.COMPLETED)}
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
