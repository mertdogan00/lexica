import type { ReviewQuality } from '../srs/index.ts';

// Xp is the atomic reward currency of Lexica. Everything the learner does
// that is worth celebrating produces an XP amount that is added to their
// lifetime total. Keeping the values in one place makes balancing easy.

export const XP_PER_QUALITY: Readonly<Record<ReviewQuality, number>> = {
  again: 2,
  hard: 5,
  good: 10,
  easy: 15,
};

// Flat bonus when the user reaches their daily goal. Deliberately large
// so hitting the goal feels different from individual reviews.
export const XP_DAILY_GOAL_BONUS = 50;

// Bonus when the user clears a daily goal without a single "again" answer.
export const XP_PERFECT_DAY_BONUS = 75;

export function xpForReview(quality: ReviewQuality): number {
  return XP_PER_QUALITY[quality];
}
