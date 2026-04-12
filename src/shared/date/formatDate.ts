import type { Language } from '../../core/domain/index.ts';
import type { TranslationKey } from '../i18n/index.ts';
import { dateDiffDays } from './dateDiffDays.ts';
import { todayStr } from './todayStr.ts';

export interface RelativeFormatterDeps {
  t: (key: TranslationKey) => string;
}

// formatDateRelative turns a calendar date into a human sentence like
// "Today", "Tomorrow", "3 days left", "1 day overdue". It takes its
// translation function as a parameter so the shared date module stays
// decoupled from React and the settings state.
export function formatDateRelative(dateYmd: string | null, deps: RelativeFormatterDeps): string {
  if (!dateYmd) return deps.t('never');
  const diff = dateDiffDays(dateYmd, todayStr());
  if (diff === 0) return deps.t('today');
  if (diff === 1) return deps.t('tomorrow');
  if (diff > 1) return `${diff} ${deps.t('days_left')}`;
  return `${Math.abs(diff)} ${deps.t('days_overdue')}`;
}

// formatDateShort produces a locale-aware short date like "Apr 12" or
// "12 Nis". The language input decides which locale to ask for.
export function formatDateShort(value: string | null, lang: Language): string {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}
