// SRS presets express "how often should a word come back" as a fixed
// interval ladder indexed by level. The ladder is intentionally simple:
// the prototype used fixed intervals rather than an SM-2 ease factor, and
// we preserve that behaviour exactly so existing exports remain meaningful.

export type SrsPresetId = 'default' | 'aggressive' | 'relaxed';

export const SRS_INTERVALS: Readonly<Record<SrsPresetId, readonly number[]>> = {
  default: [1, 3, 7, 14, 30, 60, 90, 180],
  aggressive: [1, 2, 4, 7, 14, 30, 60],
  relaxed: [1, 3, 10, 30, 60, 120],
};

export function getIntervalTable(preset: SrsPresetId): readonly number[] {
  return SRS_INTERVALS[preset];
}

export function getMaxLevel(preset: SrsPresetId): number {
  return SRS_INTERVALS[preset].length - 1;
}
