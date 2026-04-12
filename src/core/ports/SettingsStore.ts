import type { Settings } from '../domain/index.ts';

// SettingsStore is the persistence contract for user preferences and
// profile. The concrete adapter is localStorage-backed, but callers see
// only this port.

export interface SettingsStore {
  load(): Settings;
  save(settings: Settings): void;
}
