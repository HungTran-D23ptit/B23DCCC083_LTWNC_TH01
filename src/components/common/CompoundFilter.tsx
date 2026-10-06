import React, { createContext, useContext } from 'react';
import { DeadlineStatusFilter, PriorityLevel } from '../../types/deadline.types';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface CompoundFilterContextValue {
  statusFilter: DeadlineStatusFilter;
  onStatusChange: (status: DeadlineStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  availableSubjects: string[];
  selectedPriority: PriorityLevel | 'ALL';
  onPriorityChange: (priority: PriorityLevel | 'ALL') => void;
  sortBy: 'urgentFirst' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title';
  onSortChange: (
    sort: 'urgentFirst' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title'
  ) => void;
}

const CompoundFilterContext = createContext<CompoundFilterContextValue | undefined>(undefined);

function useCompoundFilter() {
  const context = useContext(CompoundFilterContext);
  if (!context) {
    throw new Error('CompoundFilter sub-components must be rendered within <CompoundFilter>');
  }
  return context;
}

interface CompoundFilterProps extends CompoundFilterContextValue {
  children?: React.ReactNode;
}

export function CompoundFilter({
  children,
  ...contextProps
}: CompoundFilterProps) {
  return (
    <CompoundFilterContext.Provider value={contextProps}>
      <div className="compound-filter-panel glass-panel">
        {children || (
          <>
            <div className="filter-top-row">
              <CompoundFilter.StatusTabs />
              <CompoundFilter.Search />
            </div>
            <div className="filter-bottom-row">
              <CompoundFilter.SubjectSelect />
              <CompoundFilter.PrioritySelect />
              <CompoundFilter.SortDropdown />
            </div>
          </>
        )}
      </div>
    </CompoundFilterContext.Provider>
  );
}

CompoundFilter.StatusTabs = function StatusTabs() {
  const { statusFilter, onStatusChange } = useCompoundFilter();

  const tabs: { label: string; value: DeadlineStatusFilter }[] = [
    { label: 'Tất cả bài tập', value: DeadlineStatusFilter.ALL },
    { label: 'Chưa hoàn thành', value: DeadlineStatusFilter.PENDING },
    { label: 'Quá hạn', value: DeadlineStatusFilter.OVERDUE },
    { label: 'Đã hoàn thành', value: DeadlineStatusFilter.COMPLETED },
  ];

  return (
    <div className="filter-status-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`filter-tab-btn ${statusFilter === tab.value ? 'active' : ''}`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

CompoundFilter.Search = function SearchInput() {
  const { searchTerm, onSearchChange } = useCompoundFilter();

  return (
    <div className="filter-search-wrap">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        placeholder="Tìm theo tên bài tập, môn học, tag..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-search-input"
      />
      {searchTerm && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={() => onSearchChange('')}
          title="Xóa nội dung tìm kiếm"
          aria-label="Xóa nội dung tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
};

CompoundFilter.SubjectSelect = function SubjectSelect() {
  const { selectedSubject, onSubjectChange, availableSubjects } = useCompoundFilter();

  return (
    <div className="filter-select-group">
      <Filter size={14} className="select-icon" />
      <select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        className="filter-select"
      >
        <option value="ALL">Môn học: Tất cả môn</option>
        {availableSubjects.map((sub) => (
          <option key={sub} value={sub}>
            {sub}
          </option>
        ))}
      </select>
    </div>
  );
};

CompoundFilter.PrioritySelect = function PrioritySelect() {
  const { selectedPriority, onPriorityChange } = useCompoundFilter();

  return (
    <div className="filter-select-group">
      <select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value as PriorityLevel | 'ALL')}
        className="filter-select"
      >
        <option value="ALL">Độ ưu tiên: Tất cả</option>
        <option value={PriorityLevel.HIGH}>Ưu tiên cao</option>
        <option value={PriorityLevel.MEDIUM}>Ưu tiên trung bình</option>
        <option value={PriorityLevel.LOW}>Ưu tiên thấp</option>
      </select>
    </div>
  );
};

CompoundFilter.SortDropdown = function SortDropdown() {
  const { sortBy, onSortChange } = useCompoundFilter();

  return (
    <div className="filter-select-group sort-group">
      <ArrowUpDown size={14} className="select-icon" />
      <select
        value={sortBy}
        onChange={(e) =>
          onSortChange(
            e.target.value as
              | 'urgentFirst'
              | 'dueDateAsc'
              | 'dueDateDesc'
              | 'priority'
              | 'title'
          )
        }
        className="filter-select"
      >
        <option value="urgentFirst">Hạn nộp: Sắp đến hạn nhất</option>
        <option value="dueDateAsc">Theo ngày: Cũ nhất → Mới nhất</option>
        <option value="dueDateDesc">Theo ngày: Mới nhất → Cũ nhất</option>
        <option value="priority">Độ ưu tiên: Cao đến thấp</option>
        <option value="title">Tên bài tập: A → Z</option>
      </select>
    </div>
  );
};
