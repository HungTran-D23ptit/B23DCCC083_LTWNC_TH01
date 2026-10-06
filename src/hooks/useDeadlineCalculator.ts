import { useMemo } from 'react';
import { UrgencyLevel } from '../types/deadline.types';
import type { CalculatedDeadlineInfo } from '../types/deadline.types';

export function useDeadlineCalculator(
  dueDate: string,
  completed: boolean
): CalculatedDeadlineInfo {
  return useMemo<CalculatedDeadlineInfo>(() => {
    if (completed) {
      return {
        isOverdue: false,
        isDueToday: false,
        remainingDays: 0,
        remainingHours: 0,
        displayText: 'Đã hoàn thành',
        urgency: UrgencyLevel.COMPLETED,
        badgeClass: 'badge-completed',
      };
    }

    const now = new Date();
    const target = new Date(dueDate);

    if (isNaN(target.getTime())) {
      return {
        isOverdue: false,
        isDueToday: false,
        remainingDays: 0,
        remainingHours: 0,
        displayText: 'Không xác định',
        urgency: UrgencyLevel.NORMAL,
        badgeClass: 'badge-normal',
      };
    }

    const diffMs = target.getTime() - now.getTime();

    if (diffMs < 0) {
      const overdueDays = Math.max(1, Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24)));
      return {
        isOverdue: true,
        isDueToday: false,
        remainingDays: 0,
        remainingHours: 0,
        displayText: `Quá hạn ${overdueDays} ngày`,
        urgency: UrgencyLevel.CRITICAL,
        badgeClass: 'badge-overdue',
      };
    }

    const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (remainingDays === 0) {
      const hoursText = remainingHours > 0 ? ` (còn ${remainingHours}h)` : '';
      return {
        isOverdue: false,
        isDueToday: true,
        remainingDays: 0,
        remainingHours,
        displayText: `Hôm nay là hạn chót${hoursText}`,
        urgency: UrgencyLevel.CRITICAL,
        badgeClass: 'badge-urgent',
      };
    }

    if (remainingDays === 1) {
      return {
        isOverdue: false,
        isDueToday: false,
        remainingDays: 1,
        remainingHours,
        displayText: 'Còn 1 ngày',
        urgency: UrgencyLevel.WARNING,
        badgeClass: 'badge-warning',
      };
    }

    return {
      isOverdue: false,
      isDueToday: false,
      remainingDays,
      remainingHours,
      displayText: `Còn ${remainingDays} ngày`,
      urgency: remainingDays <= 3 ? UrgencyLevel.WARNING : UrgencyLevel.NORMAL,
      badgeClass: remainingDays <= 3 ? 'badge-warning' : 'badge-normal',
    };
  }, [dueDate, completed]);
}
