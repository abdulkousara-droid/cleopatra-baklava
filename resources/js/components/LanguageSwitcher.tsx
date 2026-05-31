import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { isRTL } from '@/i18n';

const languages = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = isRTL(lng) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      {languages.map((lang, i) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => switchLanguage(lang.code)}
            className={`text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              i18n.language === lang.code
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            title={lang.name}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span className="mx-1 text-muted-foreground/40 text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
