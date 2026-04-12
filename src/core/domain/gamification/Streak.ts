// Streak tracks consecutive days on which the user completed at least one
// review. It rolls forward when the user reviews on a new day, stays put
// when they review more on the same day, and resets when a day is skipped.

export interface Streak {
  current: number;
  best: number;
  // yyyy-mm-dd of the last day that counted toward the streak, or null
  // before the first review.
  lastActiveDay: string | null;
}

export const EMPTY_STREAK: Streak = {
  current: 0,
  best: 0,
  lastActiveDay: null,
};

// bumpStreak advances the streak given today's date. It is pure: pass in
// the current streak and a yyyy-mm-dd "today", get the next streak back.
export function bumpStreak(streak: Streak, todayYmd: string): Streak {
  if (streak.lastActiveDay === todayYmd) {
    return streak;
  }

  if (streak.lastActiveDay === null) {
    return {
      current: 1,
      best: Math.max(1, streak.best),
      lastActiveDay: todayYmd,
    };
  }

  const diff = diffDaysYmd(todayYmd, streak.lastActiveDay);
  const next = diff === 1 ? streak.current + 1 : 1;

  return {
    current: next,
    best: Math.max(next, streak.best),
    lastActiveDay: todayYmd,
  };
}

// diffDaysYmd computes the whole-day difference between two yyyy-mm-dd
// strings, anchored at UTC midnight to avoid DST drift.
function diffDaysYmd(aYmd: string, bYmd: string): number {
  const a = Date.parse(`${aYmd}T00:00:00Z`);
  const b = Date.parse(`${bYmd}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((a - b) / 86_400_000);
}
