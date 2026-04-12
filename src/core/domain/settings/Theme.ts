// Theme is stored as a user preference. "auto" defers to the operating
// system's prefers-color-scheme and is the default on first launch.

export type Theme = 'light' | 'dark' | 'auto';

export const THEMES: readonly Theme[] = ['light', 'dark', 'auto'];
