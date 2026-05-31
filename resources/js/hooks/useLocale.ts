import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n';

export function useLocale() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = isRTL(i18n.language) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return {
    locale: i18n.language,
    isRTL: isRTL(i18n.language),
    dir: isRTL(i18n.language) ? 'rtl' : 'ltr' as 'rtl' | 'ltr',
  };
}
