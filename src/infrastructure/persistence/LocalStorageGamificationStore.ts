import type { GamificationState } from '../../core/domain/index.ts';
import { EMPTY_GAMIFICATION, EMPTY_STREAK } from '../../core/domain/index.ts';
import type { GamificationStore } from '../../core/ports/index.ts';

// LocalStorageGamificationStore stores the XP/level/streak/badge state
// as a single JSON blob under "lexica_gamification". On load we merge
// with the empty defaults so older saves missing new fields still parse.

const KEY = 'lexica_gamification';

export class LocalStorageGamificationStore implements GamificationStore {
  load(): GamificationState {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return EMPTY_GAMIFICATION;
      const parsed = JSON.parse(raw) as Partial<GamificationState> & {
        streak?: Partial<GamificationState['streak']>;
        unlockedBadges?: GamificationState['unlockedBadges'];
      };
      return {
        ...EMPTY_GAMIFICATION,
        ...parsed,
        streak: {
          ...EMPTY_STREAK,
          ...(parsed.streak ?? {}),
        },
        unlockedBadges: parsed.unlockedBadges ?? [],
      };
    } catch {
      return EMPTY_GAMIFICATION;
    }
  }

  save(state: GamificationState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
}
