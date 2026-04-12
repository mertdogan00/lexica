import type { DailyProgressStore } from './DailyProgressStore.ts';
import type { GamificationStore } from './GamificationStore.ts';
import type { SettingsStore } from './SettingsStore.ts';
import type { WordRepository } from './WordRepository.ts';

// Container is the aggregate port that bundles every persistence port
// Lexica needs. Application code asks for this single shape instead of
// threading four ports through every hook, and the bootstrap layer is
// free to build it from any concrete adapter set (IndexedDB today,
// hypothetically an in-memory stub for tests).

export interface Container {
  wordRepository: WordRepository;
  settingsStore: SettingsStore;
  dailyProgressStore: DailyProgressStore;
  gamificationStore: GamificationStore;
}
