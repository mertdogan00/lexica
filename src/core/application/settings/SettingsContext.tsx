import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Settings } from '../../domain/index.ts';
import { DEFAULT_SETTINGS } from '../../domain/index.ts';
import { useContainer } from '../di/index.ts';

// SettingsContext holds the reactive view of user settings and owns all
// of the global side-effects that accompany settings changes: theme
// class on <body>, the meta theme-color tag, the animations toggle
// class, and the document language attribute.

export interface SettingsApi {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  updateProfile: (patch: Partial<Settings['profile']>) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsApi | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }): ReactNode {
  const container = useContainer();
  const [settings, setSettings] = useState<Settings>(() => container.settingsStore.load());

  const update = useCallback(
    (patch: Partial<Settings>): void => {
      setSettings((prev) => {
        const next: Settings = { ...prev, ...patch };
        container.settingsStore.save(next);
        return next;
      });
    },
    [container],
  );

  const updateProfile = useCallback(
    (patch: Partial<Settings['profile']>): void => {
      setSettings((prev) => {
        const next: Settings = {
          ...prev,
          profile: { ...prev.profile, ...patch },
        };
        container.settingsStore.save(next);
        return next;
      });
    },
    [container],
  );

  const resetToDefaults = useCallback((): void => {
    container.settingsStore.save(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, [container]);

  // Theme side-effects: toggle body.dark and document root, keep the
  // meta theme-color in sync, and listen to prefers-color-scheme while
  // the user is on "auto".
  useEffect(() => {
    const applyDark = (dark: boolean): void => {
      document.body.classList.toggle('dark', dark);
      document.documentElement.classList.toggle('dark', dark);
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.content = dark ? '#111110' : '#FAFAF8';
    };

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const resolveDark = (): boolean => {
      if (settings.theme === 'dark') return true;
      if (settings.theme === 'light') return false;
      return media.matches;
    };

    applyDark(resolveDark());

    if (settings.theme === 'auto') {
      const listener = (): void => applyDark(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [settings.theme]);

  useEffect(() => {
    document.body.classList.toggle('no-anim', !settings.animations);
  }, [settings.animations]);

  useEffect(() => {
    document.documentElement.lang = settings.lang;
  }, [settings.lang]);

  const api = useMemo<SettingsApi>(
    () => ({ settings, update, updateProfile, resetToDefaults }),
    [settings, update, updateProfile, resetToDefaults],
  );

  return <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsApi {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be called inside <SettingsProvider>');
  return ctx;
}
