import { useCallback, useMemo } from 'react';
import type { Language } from '../../domain/index.ts';
import { interpolate, translate, type TranslationKey } from '../../../shared/index.ts';
import { useSettings } from '../settings/index.ts';

// useTranslation is a thin wrapper around the dictionary that closes
// over the active language. It is a hook rather than its own context
// because the language already lives in SettingsContext; adding a
// second provider would just duplicate state.

export interface TranslationApi {
  t: (key: TranslationKey) => string;
  tFmt: (key: TranslationKey, params: Readonly<Record<string, string | number>>) => string;
  lang: Language;
}

export function useTranslation(): TranslationApi {
  const { settings } = useSettings();
  const lang = settings.lang;

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);
  const tFmt = useCallback(
    (key: TranslationKey, params: Readonly<Record<string, string | number>>) =>
      interpolate(translate(lang, key), params),
    [lang],
  );

  return useMemo(() => ({ t, tFmt, lang }), [t, tFmt, lang]);
}
