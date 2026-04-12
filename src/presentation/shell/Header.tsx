import { Moon, Sun } from 'lucide-react';
import { useSettings, useTranslation } from '../../core/application/index.ts';

// Header is the thin bar at the top of every route. It shows the
// product wordmark on the left and a quick theme toggle button on the
// right. The theme button cycles between explicit light and dark
// regardless of the user's currently stored preference, so one tap
// away from auto is always deterministic.

export function Header(): React.ReactNode {
  const { settings, update } = useSettings();
  const { t } = useTranslation();

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = (): void => {
    update({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <header className="header">
      <div className="header-title">Lexica</div>
      <div className="header-actions">
        <button type="button" className="header-btn" onClick={toggleTheme} aria-label={t('theme')}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
