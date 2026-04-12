import type { TranslationKey } from '../../shared/index.ts';

// RouteConfig is the single source of truth for Lexica's navigation.
// The AppShell renders bottom-nav items from this list and
// route-config stays decoupled from the actual page components so the
// array can be reordered or extended without touching routing wiring.

export type RouteId = 'dashboard' | 'words' | 'review' | 'settings';

export interface RouteDefinition {
  id: RouteId;
  path: string;
  labelKey: TranslationKey;
  // Icon name from lucide-react that the bottom nav resolves at render
  // time. Kept as a string so the config file does not need a JSX dep.
  iconName: 'Home' | 'BookOpen' | 'Sparkles' | 'Settings';
  // Whether the floating add-word button should appear on this route.
  showFab: boolean;
}

export const ROUTES: readonly RouteDefinition[] = [
  { id: 'dashboard', path: '/', labelKey: 'nav_home', iconName: 'Home', showFab: true },
  { id: 'words', path: '/words', labelKey: 'nav_words', iconName: 'BookOpen', showFab: true },
  { id: 'review', path: '/review', labelKey: 'nav_review', iconName: 'Sparkles', showFab: false },
  {
    id: 'settings',
    path: '/settings',
    labelKey: 'nav_settings',
    iconName: 'Settings',
    showFab: false,
  },
];
