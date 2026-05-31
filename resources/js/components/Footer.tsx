import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border text-foreground pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                <div className="space-y-4">
                    <h4 className="font-serif text-2xl font-bold text-primary tracking-tight">
                        Cleopatra
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                        {t('footer.barcelona_tagline')}
                    </p>
                </div>

                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {t('footer.boutique_hours')}
                    </h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <span className="font-medium text-foreground block">{t('footer.mon_sat')}</span>
                            9:00 - 15:00 | 17:00 - 21:00
                        </li>
                        <li>
                            <span className="font-medium text-foreground block">{t('footer.sunday')}</span>
                            11:00 - 15:00 <span className="text-xs opacity-75">{t('footer.afternoons_closed')}</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {t('footer.visit_us')}
                    </h5>
                    <address className="text-sm text-muted-foreground not-italic space-y-2 leading-relaxed">
                        <p dangerouslySetInnerHTML={{ __html: t('footer.location') }} />
                        <p className="text-xs text-muted-foreground/80 italic">
                            {t('footer.steps_from_sagrada')}
                        </p>
                        <p className="pt-1 block text-foreground font-medium">
                            {t('footer.phone')}
                        </p>
                    </address>
                </div>

                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {t('footer.navigation')}
                    </h5>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                {t('nav.collections')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/heritage" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                {t('nav.heritage')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/catering" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                {t('nav.catering')}
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p dangerouslySetInnerHTML={{ __html: t('footer.rights', { year: currentYear }) }} />
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-primary transition-colors">{t('nav.privacy_policy')}</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">{t('nav.terms_of_service')}</Link>
                </div>
            </div>
        </footer>
    );
}
