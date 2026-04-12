// Language selects which translation dictionary the UI renders with.
// Lexica is bilingual by design; the two options are intentional and
// should stay in sync with the keys in shared/i18n/dictionary.

export type Language = 'tr' | 'en';

export const LANGUAGES: readonly Language[] = ['tr', 'en'];
