import { useMemo } from 'react';
import { dateDiffDays, todayStr } from '../../../shared/index.ts';
import { useContainer } from '../di/index.ts';
import { useSettings } from '../settings/index.ts';
import { useWordLibrary } from '../words/index.ts';

// useDashboardStats derives the headline numbers shown on the
// dashboard from the current word library and daily progress counter.
// It is a pure projection — no side effects, no I/O beyond reading the
// already-loaded counter — so the dashboard re-renders instantly as
// the underlying state changes.

export interface DashboardStats {
  totalWords: number;
  todayReviewWords: number;
  overdueWords: number;
  upcomingWords: number;
  dailyCount: number;
  dailyGoal: number;
  goalPercent: number;
  hasOverdue: boolean;
  hasReviews: boolean;
}

export function useDashboardStats(): DashboardStats {
  const { words } = useWordLibrary();
  const { settings } = useSettings();
  const container = useContainer();

  return useMemo<DashboardStats>(() => {
    const today = todayStr();
    const overdue = words.filter((w) => w.nextReviewDate !== null && w.nextReviewDate < today);
    const todayDue = words.filter((w) => w.nextReviewDate === today);
    const upcoming = words.filter((w) => {
      if (!w.nextReviewDate) return false;
      const diff = dateDiffDays(w.nextReviewDate, today);
      return diff > 0 && diff <= 7;
    });

    const reviewWords = overdue.length + todayDue.length;
    const dailyCount = container.dailyProgressStore.getCount(today);
    const goalPercent =
      settings.goal > 0 ? Math.min(100, Math.round((dailyCount / settings.goal) * 100)) : 0;

    return {
      totalWords: words.length,
      todayReviewWords: reviewWords,
      overdueWords: overdue.length,
      upcomingWords: upcoming.length,
      dailyCount,
      dailyGoal: settings.goal,
      goalPercent,
      hasOverdue: overdue.length > 0,
      hasReviews: reviewWords > 0,
    };
  }, [words, settings.goal, container]);
}
