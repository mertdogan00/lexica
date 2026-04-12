import type { Container } from '../core/ports/index.ts';
import {
  IndexedDBWordRepository,
  LocalStorageDailyProgressStore,
  LocalStorageGamificationStore,
  LocalStorageSettingsStore,
} from '../infrastructure/index.ts';

// createContainer is the composition root of Lexica. It binds domain
// ports to their concrete infrastructure adapters exactly once per app
// instance. It is the only place in the codebase that imports from
// ../infrastructure — application code and UI code always go through
// the Container port aggregate instead.

export function createContainer(): Container {
  return {
    wordRepository: new IndexedDBWordRepository(),
    settingsStore: new LocalStorageSettingsStore(),
    dailyProgressStore: new LocalStorageDailyProgressStore(),
    gamificationStore: new LocalStorageGamificationStore(),
  };
}
