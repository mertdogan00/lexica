import type { Language, Settings } from '../../core/domain/index.ts';
import { DEFAULT_SETTINGS, LANGUAGES } from '../../core/domain/index.ts';
import type { SettingsStore } from '../../core/ports/index.ts';

// LocalStorageSettingsStore stores settings as a single JSON blob under
// the key "lexica_settings". On load we merge with the defaults so that
// new fields added to Settings don't break existing users, and so that
// a corrupt blob degrades gracefully to defaults instead of a crash.

const KEY = 'lexica_settings';

// Map browser language tags to the supported UI languages.
const normalizeLang = (value: string): Language | null => {
  const lowered = value.toLowerCase();
  if (lowered.startsWith('tr')) return 'tr';
  if (lowered.startsWith('en')) return 'en';
  return null;
};

// Choose the best matching language from the browser preferences.
const resolveBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return DEFAULT_SETTINGS.lang;
  const candidates = [navigator.language, ...(navigator.languages ?? [])].filter(
    (entry): entry is string => Boolean(entry),
  );

  for (const candidate of candidates) {
    const match = normalizeLang(candidate);
    if (match) return match;
  }

  return DEFAULT_SETTINGS.lang;
};

const ensureLanguage = (value: unknown, fallback: Language): Language => {
  if (typeof value !== 'string') return fallback;
  const normalized = normalizeLang(value);
  if (normalized && LANGUAGES.includes(normalized)) return normalized;
  return fallback;
};

export class LocalStorageSettingsStore implements SettingsStore {
  load(): Settings {
    try {
      // Base defaults should respect browser language for first-time users.
      const baseDefaults: Settings = {
        ...DEFAULT_SETTINGS,
        lang: resolveBrowserLanguage(),
      };
      const raw = localStorage.getItem(KEY);
      if (!raw) return baseDefaults;
      const parsed = JSON.parse(raw) as Partial<Settings> & {
        profile?: Partial<Settings['profile']>;
      };
      const merged: Settings = {
        ...baseDefaults,
        ...parsed,
        profile: {
          ...baseDefaults.profile,
          ...(parsed.profile ?? {}),
        },
      };
      // Keep language within the supported set even if storage was edited.
      merged.lang = ensureLanguage(parsed.lang, baseDefaults.lang);
      return merged;
    } catch {
      return {
        ...DEFAULT_SETTINGS,
        lang: resolveBrowserLanguage(),
      };
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
