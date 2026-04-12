// Level is derived from lifetime XP via a fixed threshold table.
// The curve grows roughly quadratically so early levels come quickly and
// later levels become real milestones. The last entry is an implicit
// "infinity" sentinel so levelFromXp never returns out of bounds.

// Threshold[i] is the minimum XP required to reach level (i + 1).
// Level 1 starts at 0 XP, level 2 at 100 XP, and so on.
export const LEVEL_THRESHOLDS: readonly number[] = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500, 8200, 10200, 12500, 15100, 18000,
  21200, 24700, 28500, 32600,
];

export interface LevelState {
  level: number;
  currentXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

export function levelFromXp(xp: number): LevelState {
  const clamped = Math.max(0, Math.floor(xp));
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    const threshold = LEVEL_THRESHOLDS[i] ?? 0;
    if (clamped >= threshold) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold =
    LEVEL_THRESHOLDS[level] ?? currentThreshold + (currentThreshold === 0 ? 100 : currentThreshold);

  return {
    level,
    currentXp: clamped,
    xpIntoLevel: clamped - currentThreshold,
    xpForNextLevel: nextThreshold - currentThreshold,
  };
}
