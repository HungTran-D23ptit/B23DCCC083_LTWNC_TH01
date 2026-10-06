export const PriorityLevel = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel];

export const DeadlineStatusFilter = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  COMPLETED: 'COMPLETED',
} as const;

export type DeadlineStatusFilter =
  (typeof DeadlineStatusFilter)[keyof typeof DeadlineStatusFilter];

export const UrgencyLevel = {
  CRITICAL: 'CRITICAL',
  WARNING: 'WARNING',
  NORMAL: 'NORMAL',
  COMPLETED: 'COMPLETED',
} as const;

export type UrgencyLevel = (typeof UrgencyLevel)[keyof typeof UrgencyLevel];

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment<TMeta = Record<string, unknown>> extends BaseEntity {
  title: string;
  subject: string;
  dueDate: string;
  priority: PriorityLevel;
  completed: boolean;
  completedAt?: string;
  description?: string;
  tags?: string[];
  metadata?: TMeta;
}

export type CreateAssignmentDTO = Omit<
  Assignment,
  'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'
>;

export type UpdateAssignmentDTO = Partial<CreateAssignmentDTO>;

export type AssignmentPreview = Pick<
  Assignment,
  'id' | 'title' | 'subject' | 'dueDate' | 'priority' | 'completed'
>;

export type DeadlineStats = Record<
  'total' | 'pending' | 'overdue' | 'completed' | 'urgent',
  number
>;

export interface ApiResponse<TData> {
  data: TData;
  status: number;
  message: string;
  timestamp: string;
}

export interface CalculatedDeadlineInfo {
  isOverdue: boolean;
  isDueToday: boolean;
  remainingDays: number;
  remainingHours: number;
  displayText: string;
  urgency: UrgencyLevel;
  badgeClass: string;
}

export function isAssignment(obj: unknown): obj is Assignment {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.dueDate === 'string' &&
    typeof candidate.completed === 'boolean'
  );
}

export function isOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due.getTime() < now.getTime();
}

export function isPriorityValid(priority: string): priority is PriorityLevel {
  return Object.values(PriorityLevel).includes(priority as PriorityLevel);
}
