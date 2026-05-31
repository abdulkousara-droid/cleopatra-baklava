import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, router } from '@inertiajs/react';
import { Settings as SettingsIcon, Globe, Save } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { inputClass, labelClass, FeatureItem, parseFeatures } from './shared';

export default function SettingsSection({ settings, err, showToast }: {
    settings: Record<string, string>; err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const { t } = useTranslation();

    const [features, setFeatures] = useState<FeatureItem[]>(() => parseFeatures(settings.email_features || '[]'));

    const { data, setData, processing, errors, clearErrors } = useForm({
        whatsapp_number: settings.whatsapp_number || '',
        store_location: settings.store_location || '',
        email_heading: settings.email_heading || 'Welcome to the Inner Circle.',
        email_body: settings.email_body || '',
        email_features: settings.email_features || '[]',
        email_cta_text: settings.email_cta_text || 'Explore the Collection',
        email_footer_address: settings.email_footer_address || '',
    });

    const updateFeatures = (idx: number, field: keyof FeatureItem, value: string) => {
        const updated = [...features];
        updated[idx] = { ...updated[idx], [field]: value };
        setFeatures(updated);
        setData('email_features', JSON.stringify(updated));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin', { ...data, _action: 'update-settings' }, {
            onSuccess: () => { clearErrors(); showToast(t('admin.toast_settings_saved')); },
            onError: () => showToast(t('admin.toast_settings_failed')),
        });
    };

    const sectionTitle = (title: string, desc?: string) => (
        <div className="mb-1 text-admin-muted">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase m-0 text-foreground">{title}</h3>
            {desc && <p className="text-[11px] mt-1 mb-3 text-admin-faint">{desc}</p>}
        </div>
    );

    return (
        <>
            <div className="mb-8">
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight flex items-center gap-3 text-foreground">
                    <SettingsIcon size={28} className="text-accent" /> {t('admin.settings_title')}
                </h2>
                <p className="text-sm mt-1.5 text-admin-muted">{t('admin.settings_desc')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl p-7 mb-6 border border-admin-border">
                    {sectionTitle(t('admin.store_settings'))}
                    <div className="mb-5">
                        <label className={labelClass}>
                            {t('admin.whatsapp_number')} <span className="font-normal normal-case tracking-normal text-admin-faint">(for customer orders)</span>
                        </label>
                        <input type="text" required value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)}
                            placeholder="e.g. 34931234567" className={inputClass + ' focus:border-accent'} />
                        {err(errors.whatsapp_number)}
                        <p className="mt-2 text-[11px] text-admin-faint">{t('admin.whatsapp_help')}</p>
                    </div>
                    <div className="mb-5">
                        <label className={labelClass}>
                            {t('admin.store_location')} <span className="font-normal normal-case tracking-normal text-admin-faint">(shown in order messages)</span>
                        </label>
                        <input type="text" required value={data.store_location} onChange={e => setData('store_location', e.target.value)}
                            placeholder="e.g. Carrer de Balmes 123, 08008 Barcelona" className={inputClass + ' focus:border-accent'} />
                        {err(errors.store_location)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-7 mb-6 border border-admin-border">
                    {sectionTitle(t('admin.welcome_email'), t('admin.welcome_email_desc'))}
                    <div className="mb-5">
                        <label className={labelClass}>{t('admin.email_heading')}</label>
                        <input type="text" required value={data.email_heading} onChange={e => setData('email_heading', e.target.value)}
                            placeholder="Welcome to the Inner Circle." className={inputClass + ' focus:border-accent'} />
                        {err(errors.email_heading)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass}>{t('admin.email_body')}</label>
                        <p className="text-[11px] mb-2 text-admin-faint">{t('admin.body_help')}</p>
                        <textarea rows={8} value={data.email_body} onChange={e => setData('email_body', e.target.value)}
                            placeholder="Dear Connoisseur,&#10;&#10;We are delighted to welcome you..."
                            className={inputClass + ' leading-relaxed focus:border-accent'} />
                        {err(errors.email_body)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass}>
                            {t('admin.feature_highlights')} <span className="font-normal normal-case tracking-normal text-admin-faint">(3 items)</span>
                        </label>
                        <p className="text-[11px] mb-3 text-admin-faint">{t('admin.feature_highlights_desc')}</p>
                        {features.map((feature, idx) => (
                            <div key={idx} className="mb-4 p-4 rounded-xl bg-accent/10 border border-admin-border">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-admin-muted">Feature {idx + 1}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                    <label className="text-[11px] font-semibold text-admin-muted">{t('admin.icon')}</label>
                                    <input type="text" value={feature.icon} onChange={e => updateFeatures(idx, 'icon', e.target.value)}
                                        placeholder="🌿" className={`${inputClass} w-16 text-center text-lg focus:border-accent`} />
                                    <label className="text-[11px] font-semibold text-admin-muted">{t('admin.title')}</label>
                                    <input type="text" value={feature.title} onChange={e => updateFeatures(idx, 'title', e.target.value)}
                                        placeholder="All-Natural Ingredients" className={inputClass + ' focus:border-accent'} />
                                    <label className="text-[11px] font-semibold text-admin-muted">{t('admin.text')}</label>
                                    <textarea rows={2} value={feature.text} onChange={e => updateFeatures(idx, 'text', e.target.value)}
                                        placeholder="We source only organic..." className={inputClass + ' leading-relaxed focus:border-accent'} />
                                </div>
                            </div>
                        ))}
                        {err(errors.email_features)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass}>{t('admin.button_text')}</label>
                        <input type="text" required value={data.email_cta_text} onChange={e => setData('email_cta_text', e.target.value)}
                            placeholder="Explore the Collection" className={inputClass + ' focus:border-accent'} />
                        {err(errors.email_cta_text)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-7 mb-6 border border-admin-border">
                    {sectionTitle(t('admin.footer_address'), t('admin.footer_address_desc'))}
                    <div className="mb-5">
                        <label className={labelClass}>{t('admin.footer_address')}</label>
                        <textarea rows={3} value={data.email_footer_address} onChange={e => setData('email_footer_address', e.target.value)}
                            placeholder="Carrer de les Flors 14, Barcelona, Spain&#10;hello@cleopatrabaklava.com"
                            className={inputClass + ' leading-relaxed focus:border-accent'} />
                        {err(errors.email_footer_address)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-7 mb-6 border border-admin-border">
                    {sectionTitle(t('admin.language'), t('admin.language_desc'))}
                    <div className="flex items-center gap-4">
                        <Globe size={20} className="text-admin-muted shrink-0" />
                        <LanguageSwitcher />
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-admin-border">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed bg-primary hover:bg-[#5b4600] shadow-[0_2px_12px_rgba(117,91,0,0.18)] disabled:opacity-70">
                        {processing && <Loader2 size={14} className="animate-spin" />}
                        <Save size={16} /> {t('admin.save_settings')}
                    </button>
                </div>
            </form>
        </>
    );
}
