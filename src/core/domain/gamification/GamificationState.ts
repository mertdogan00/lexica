import type { BadgeId } from './Badge.ts';
import type { Streak } from './Streak.ts';
import { EMPTY_STREAK } from './Streak.ts';

// GamificationState is the full persisted shape for the XP/level/streak/
// badge layer. It is stored as a single localStorage value so there is
// only one write path whenever anything here changes.

export interface GamificationState {
  xp: number;
  streak: Streak;
  unlockedBadges: readonly BadgeId[];
  // yyyy-mm-dd of the last day the goal bonus was awarded, to prevent
  // awarding it twice in the same day.
  lastGoalBonusDay: string | null;
  // yyyy-mm-dd of the last perfect-day bonus for the same reason.
  lastPerfectDay: string | null;
}

export const EMPTY_GAMIFICATION: GamificationState = {
  xp: 0,
  streak: EMPTY_STREAK,
  unlockedBadges: [],
  lastGoalBonusDay: null,
  lastPerfectDay: null,
};
