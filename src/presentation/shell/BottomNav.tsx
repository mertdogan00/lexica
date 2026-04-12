import { NavLink } from 'react-router-dom';
import { BookOpen, Home, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { useDashboardStats, useTranslation } from '../../core/application/index.ts';
import { ROUTES, type RouteDefinition } from '../routing/index.ts';

// BottomNav is the persistent tab bar. Active state is managed by
// NavLink so back/forward gestures and deep links light the correct
// tab without any extra glue.

function resolveIcon(name: RouteDefinition['iconName']): React.ReactNode {
  switch (name) {
    case 'Home':
      return <Home size={24} />;
    case 'BookOpen':
      return <BookOpen size={24} />;
    case 'Sparkles':
      return <Sparkles size={24} />;
    case 'Settings':
      return <SettingsIcon size={24} />;
  }
}

export function BottomNav(): React.ReactNode {
  const { t } = useTranslation();
  const stats = useDashboardStats();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ROUTES.map((route) => (
        <NavLink
          key={route.id}
          to={route.path}
          end={route.path === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          {resolveIcon(route.iconName)}
          <span>{t(route.labelKey)}</span>
          {route.id === 'review' && stats.todayReviewWords > 0 ? (
            <span className="nav-badge">{stats.todayReviewWords}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}
