import type { Word } from '../word/index.ts';
import type { BadgeId } from './Badge.ts';
import type { GamificationState } from './GamificationState.ts';
import { levelFromXp } from './Level.ts';

export interface BadgeEvaluationContext {
  words: readonly Word[];
  totalReviews: number;
  mixedModeReviews: number;
  perfectDayAwardedToday: boolean;
}

// checkBadgeUnlocks returns the list of badge ids that should become
// newly unlocked given the current gamification state, word library, and
// session context. It never flips badges off and never re-reports an
// already-unlocked badge.
export function checkBadgeUnlocks(
  state: GamificationState,
  ctx: BadgeEvaluationContext,
): readonly BadgeId[] {
  const already = new Set<BadgeId>(state.unlockedBadges);
  const unlocked: BadgeId[] = [];

  const push = (id: BadgeId, condition: boolean): void => {
    if (condition && !already.has(id)) {
      unlocked.push(id);
      already.add(id);
    }
  };

  const level = levelFromXp(state.xp).level;
  const masteredCount = ctx.words.filter((w) => w.status === 'mastered').length;

  push('first_word', ctx.words.length >= 1);
  push('first_review', ctx.totalReviews >= 1);
  push('words_10', ctx.words.length >= 10);
  push('words_50', ctx.words.length >= 50);
  push('words_100', ctx.words.length >= 100);
  push('mastered_5', masteredCount >= 5);
  push('mastered_25', masteredCount >= 25);
  push('streak_3', state.streak.current >= 3);
  push('streak_7', state.streak.current >= 7);
  push('streak_30', state.streak.current >= 30);
  push('level_5', level >= 5);
  push('level_10', level >= 10);
  push('perfect_day', ctx.perfectDayAwardedToday);
  push('polyglot', ctx.mixedModeReviews >= 20);

  return unlocked;
}
