import type { GamificationState } from '../domain/index.ts';

// GamificationStore persists the XP, level, streak, and unlocked-badge
// state for the single local user.

export interface GamificationStore {
  load(): GamificationState;
  save(state: GamificationState): void;
}
