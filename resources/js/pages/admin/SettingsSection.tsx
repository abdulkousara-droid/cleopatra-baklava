import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { c, inputClass, inputStyle, labelClass, FeatureItem, parseFeatures } from './shared';

export default function SettingsSection({ settings, err, showToast }: {
    settings: Record<string, string>; err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
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
            onSuccess: () => { clearErrors(); showToast('Settings saved.'); },
            onError: () => showToast('Failed to save settings.'),
        });
    };

    const sectionTitle = (title: string, desc?: string) => (
        <div className="mb-1" style={{ color: c.textMuted }}>
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase m-0" style={{ color: c.dark }}>{title}</h3>
            {desc && <p className="text-[11px] mt-1 mb-3" style={{ color: c.textFaint }}>{desc}</p>}
        </div>
    );

    return (
        <>
            <div className="mb-8">
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight flex items-center gap-3" style={{ color: c.dark }}>
                    <SettingsIcon size={28} style={{ color: c.gold }} /> Settings
                </h2>
                <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Manage store-wide configuration and welcome email content.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                    {sectionTitle('Store Settings')}
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>
                            WhatsApp Number <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(for customer orders)</span>
                        </label>
                        <input type="text" required value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)}
                            placeholder="e.g. 34931234567" className={inputClass} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.whatsapp_number)}
                        <p className="mt-2 text-[11px]" style={{ color: c.textFaint }}>Include country code without + or spaces. Example: 34931234567</p>
                    </div>
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>
                            Store Location <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(shown in order messages)</span>
                        </label>
                        <input type="text" required value={data.store_location} onChange={e => setData('store_location', e.target.value)}
                            placeholder="e.g. Carrer de Balmes 123, 08008 Barcelona" className={inputClass} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.store_location)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                    {sectionTitle('Welcome Email', 'Edit the content of the welcome email sent to new newsletter subscribers.')}
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>Email Heading</label>
                        <input type="text" required value={data.email_heading} onChange={e => setData('email_heading', e.target.value)}
                            placeholder="Welcome to the Inner Circle." className={inputClass} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.email_heading)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>Email Body</label>
                        <p className="text-[11px] mb-2" style={{ color: c.textFaint }}>Use a blank line between paragraphs. HTML is not needed — just plain text.</p>
                        <textarea rows={8} value={data.email_body} onChange={e => setData('email_body', e.target.value)}
                            placeholder="Dear Connoisseur,&#10;&#10;We are delighted to welcome you..."
                            className={inputClass + ' leading-relaxed'} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.email_body)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>
                            Feature Highlights <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(3 items)</span>
                        </label>
                        <p className="text-[11px] mb-3" style={{ color: c.textFaint }}>These three feature boxes appear in the email.</p>
                        {features.map((feature, idx) => (
                            <div key={idx} className="mb-4 p-4 rounded-xl" style={{ background: c.goldLight, border: `1px solid ${c.border}` }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: c.textMuted }}>Feature {idx + 1}</span>
                                </div>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                    <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Icon</label>
                                    <input type="text" value={feature.icon} onChange={e => updateFeatures(idx, 'icon', e.target.value)}
                                        placeholder="🌿" className={`${inputClass} w-16 text-center text-lg`} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Title</label>
                                    <input type="text" value={feature.title} onChange={e => updateFeatures(idx, 'title', e.target.value)}
                                        placeholder="All-Natural Ingredients" className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Text</label>
                                    <textarea rows={2} value={feature.text} onChange={e => updateFeatures(idx, 'text', e.target.value)}
                                        placeholder="We source only organic..." className={inputClass + ' leading-relaxed'} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>
                            </div>
                        ))}
                        {err(errors.email_features)}
                    </div>
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>Button Text</label>
                        <input type="text" required value={data.email_cta_text} onChange={e => setData('email_cta_text', e.target.value)}
                            placeholder="Explore the Collection" className={inputClass} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.email_cta_text)}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                    {sectionTitle('Footer Address / Contact', 'Shown in the email footer and store communications.')}
                    <div className="mb-5">
                        <label className={labelClass} style={{ color: c.textMuted }}>Address & Contact Info</label>
                        <textarea rows={3} value={data.email_footer_address} onChange={e => setData('email_footer_address', e.target.value)}
                            placeholder="Carrer de les Flors 14, Barcelona, Spain&#10;hello@cleopatrabaklava.com"
                            className={inputClass + ' leading-relaxed'} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.email_footer_address)}
                    </div>
                </div>

                <div className="flex justify-end pt-8" style={{ borderTop: `1px solid ${c.border}` }}>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed"
                        style={{ background: c.goldDark, opacity: processing ? 0.7 : 1, boxShadow: '0 2px 12px rgba(117,91,0,0.18)' }}
                        onMouseEnter={e => !processing && (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                        {processing && <Loader2 size={14} className="animate-spin" />}
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            </form>
        </>
    );
}
