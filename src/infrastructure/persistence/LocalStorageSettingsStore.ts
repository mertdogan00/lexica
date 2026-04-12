import type { Settings } from '../../core/domain/index.ts';
import { DEFAULT_SETTINGS } from '../../core/domain/index.ts';
import type { SettingsStore } from '../../core/ports/index.ts';

// LocalStorageSettingsStore stores settings as a single JSON blob under
// the key "lexica_settings". On load we merge with the defaults so that
// new fields added to Settings don't break existing users, and so that
// a corrupt blob degrades gracefully to defaults instead of a crash.

const KEY = 'lexica_settings';

export class LocalStorageSettingsStore implements SettingsStore {
  load(): Settings {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<Settings> & {
        profile?: Partial<Settings['profile']>;
      };
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        profile: {
          ...DEFAULT_SETTINGS.profile,
          ...(parsed.profile ?? {}),
        },
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  save(settings: Settings): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // Storage full or unavailable — there is nothing meaningful we can
      // do from the adapter, so we swallow silently and let the next
      // save attempt retry.
    }
  }
}
