import type { Word } from '../word/index.ts';
import type { SrsPresetId } from './SrsPreset.ts';
import { getIntervalTable } from './SrsPreset.ts';

export interface IntervalPreview {
  hard: number;
  good: number;
  easy: number;
}

// previewIntervals mirrors the label shown under each review button
// ("Hard — 3 days", "Good — 7 days", ...) so the user sees the schedule
// they are committing to. Again is always 1 day and is omitted from the
// preview since it is fixed regardless of level or preset.
export function previewIntervals(word: Word, preset: SrsPresetId): IntervalPreview {
  const intervals = getIntervalTable(preset);
  const maxLevel = intervals.length - 1;

  const hardLevel = Math.max(0, word.level);
  const goodLevel = Math.min(word.level + 1, maxLevel);
  const easyLevel = Math.min(word.level + 2, maxLevel);

  return {
    hard: intervals[hardLevel] ?? 1,
    good: intervals[goodLevel] ?? 1,
    easy: intervals[easyLevel] ?? 1,
  };
}
