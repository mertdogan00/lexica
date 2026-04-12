import type { Word } from '../word/index.ts';
import type { ReviewQuality } from './ReviewQuality.ts';
import type { SrsPresetId } from './SrsPreset.ts';
import { getIntervalTable } from './SrsPreset.ts';

export interface ScheduleContext {
  // ISO-8601 timestamp used as the new lastReviewedAt and as the anchor for
  // nextReviewDate arithmetic.
  nowIso: string;
}

// scheduleNext is the heart of Lexica's SRS engine. It takes a word, an
// answer quality, and the active preset, and returns the word advanced by
// one review step. The function is completely pure: no I/O, no clock reads,
// no mutation of the input.
//
// Level transitions mirror the original prototype exactly:
//   again → level 0, interval 1 day
//   hard  → level stays, interval = preset[level]
//   good  → level +1 (clamped to max), interval = preset[newLevel]
//   easy  → level +2 (clamped to max), interval = preset[newLevel]
//
// Status derivation: once the word reaches the final level, it is considered
// "mastered"; level 0 is "new"; anything in between is "learning".
export function scheduleNext(
  word: Word,
  quality: ReviewQuality,
  preset: SrsPresetId,
  ctx: ScheduleContext,
): Word {
  const intervals = getIntervalTable(preset);
  const maxLevel = intervals.length - 1;

  let newLevel = word.level;
  let newInterval = 1;

  switch (quality) {
    case 'again':
      newLevel = 0;
      newInterval = 1;
      break;
    case 'hard':
      // Hard keeps the level but re-uses its interval so the card resurfaces
      // at the same pace instead of getting faster.
      newInterval = intervals[newLevel] ?? 1;
      break;
    case 'good':
      newLevel = Math.min(newLevel + 1, maxLevel);
      newInterval = intervals[newLevel] ?? 1;
      break;
    case 'easy':
      newLevel = Math.min(newLevel + 2, maxLevel);
      newInterval = intervals[newLevel] ?? 1;
      break;
  }

  const nextDate = addDaysYmd(ctx.nowIso, newInterval);

  const status: Word['status'] =
    newLevel >= maxLevel ? 'mastered' : newLevel > 0 ? 'learning' : 'new';

  return {
    ...word,
    level: newLevel,
    intervalDays: newInterval,
    lastReviewedAt: ctx.nowIso,
    nextReviewDate: nextDate,
    repetitionCount: word.repetitionCount + 1,
    updatedAt: ctx.nowIso,
    status,
  };
}

// addDaysYmd takes an ISO timestamp, advances it by N days, and returns
// the resulting local calendar date as a yyyy-mm-dd string. It preserves
// the prototype's behaviour where nextReviewDate is a date-only value.
function addDaysYmd(fromIso: string, days: number): string {
  const d = new Date(fromIso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0] ?? '';
}
