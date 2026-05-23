import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Settings as SettingsIcon, Save, LogOut, Globe, CheckCircle, Loader2, Package, Tag, MessageSquare, Eye } from 'lucide-react';

interface FeatureItem {
    icon: string;
    title: string;
    text: string;
}

interface Props {
    settings: Record<string, string>;
    flash?: { success?: string; };
}

const c = {
    bg: '#f7f5f0', surface: '#ffffff', border: '#e8e2d6',
    dark: '#1e1b14', gold: '#c9a84c', goldDark: '#755b00', goldLight: 'rgba(201,168,76,0.10)',
    danger: '#dc2626', nav: '#1a1712', text: '#1e1b14', textMuted: '#8a7d6a', textFaint: '#b5a898',
};

function parseFeatures(raw: string): FeatureItem[] {
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 3) return parsed;
    } catch {}
    return [
        { icon: '🌿', title: '', text: '' },
        { icon: '🏛️', title: '', text: '' },
        { icon: '📦', title: '', text: '' },
    ];
}

export default function AdminSettings({ settings = {}, flash }: Props) {
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const [features, setFeatures] = useState<FeatureItem[]>(() => parseFeatures(settings.email_features || '[]'));

    const { data, setData, put, processing, errors, clearErrors } = useForm({
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
        put('/admin/settings', {
            onSuccess: () => { clearErrors(); },
        });
    };

    const err = (msg?: string) => msg ? <p className="mt-1 text-xs font-semibold" style={{ color: c.danger }}>{msg}</p> : null;

    const inputClass = "block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit";
    const inputStyle = { border: `1.5px solid ${c.border}`, color: c.text, background: c.bg };
    const labelClass = "block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]";

    const sectionTitle = (title: string, desc?: string) => (
        <div className="mb-1" style={{ color: c.textMuted }}>
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase m-0" style={{ color: c.dark }}>{title}</h3>
            {desc && <p className="text-[11px] mt-1 mb-3" style={{ color: c.textFaint }}>{desc}</p>}
        </div>
    );

    return (
        <>
            <Head><title>Settings — Admin</title></Head>
            <style>{`
                body { margin: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                ::placeholder { color: #b5a898; }
            `}</style>

            <div className="min-h-screen" style={{ background: c.bg }}>
                {/* TOPBAR */}
                <nav className="sticky top-0 z-[100] flex items-center justify-between px-8 h-16" style={{ background: c.nav, borderBottom: '1px solid rgba(201,168,76,0.12)', boxShadow: '0 1px 16px rgba(0,0,0,0.25)' }}>
                    <div className="flex items-center gap-3.5">
                        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                        <div>
                            <div className="text-[#f5f0e8] font-serif text-lg font-semibold leading-tight">
                                Cleopatra <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase align-middle" style={{ color: c.gold }}>Admin</span>
                            </div>
                            <div className="text-[#5a5040] text-[10px] tracking-[0.18em] uppercase mt-0.5 font-semibold">Barcelona Workspace</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link href="/admin/products" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <Package size={15} /> Products
                        </Link>
                        <Link href="/admin/categories" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <Tag size={15} /> Categories
                        </Link>
                        <Link href="/admin/reviews" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <MessageSquare size={15} /> Reviews
                        </Link>
                        <Link href="/" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <Globe size={15} /> Shopfront
                        </Link>
                        <button onClick={() => router.post('/admin/logout')}
                            className="flex items-center gap-[7px] text-[#f87171] border border-[rgba(220,38,38,0.2)] rounded-lg px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200"
                            style={{ background: 'rgba(220,38,38,0.08)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.16)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)'; }}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </nav>

                {/* PAGE */}
                <div className="max-w-[800px] mx-auto px-8 py-9 pb-20">
                    <div className="mb-8">
                        <h2 className="font-serif text-[32px] font-bold m-0 leading-tight flex items-center gap-3" style={{ color: c.dark }}>
                            <SettingsIcon size={28} style={{ color: c.gold }} /> Settings
                        </h2>
                        <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Manage store-wide configuration and welcome email content.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* STORE SETTINGS */}
                        <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                            {sectionTitle('Store Settings')}

                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    WhatsApp Number <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(for customer orders)</span>
                                </label>
                                <input type="text" required value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)}
                                    placeholder="e.g. 34931234567"
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                {err(errors.whatsapp_number)}
                                <p className="mt-2 text-[11px]" style={{ color: c.textFaint }}>Include country code without + or spaces. Example: 34931234567</p>
                            </div>

                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Store Location <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(shown in order messages)</span>
                                </label>
                                <input type="text" required value={data.store_location} onChange={e => setData('store_location', e.target.value)}
                                    placeholder="e.g. Carrer de Balmes 123, 08008 Barcelona"
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                {err(errors.store_location)}
                            </div>
                        </div>

                        {/* EMAIL CONTENT */}
                        <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                            {sectionTitle('Welcome Email', 'Edit the content of the welcome email sent to new newsletter subscribers.')}

                            {/* Heading */}
                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Email Heading
                                </label>
                                <input type="text" required value={data.email_heading} onChange={e => setData('email_heading', e.target.value)}
                                    placeholder="Welcome to the Inner Circle."
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                {err(errors.email_heading)}
                                <p className="mt-2 text-[11px]" style={{ color: c.textFaint }}>The main heading at the top of the email.</p>
                            </div>

                            {/* Body */}
                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Email Body
                                </label>
                                <p className="text-[11px] mb-2" style={{ color: c.textFaint }}>Use a blank line between paragraphs. HTML is not needed — just plain text.</p>
                                <textarea
                                    rows={8}
                                    value={data.email_body}
                                    onChange={e => setData('email_body', e.target.value)}
                                    placeholder="Dear Connoisseur,&#10;&#10;We are delighted to welcome you..."
                                    className={inputClass + " leading-relaxed"}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}
                                />
                                {err(errors.email_body)}
                            </div>

                            {/* Features */}
                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Feature Highlights <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(3 items)</span>
                                </label>
                                <p className="text-[11px] mb-3" style={{ color: c.textFaint }}>These three feature boxes appear in the email. Edit the icon (emoji), title, and description for each.</p>
                                {features.map((feature, idx) => (
                                    <div key={idx} className="mb-4 p-4 rounded-xl" style={{ background: c.goldLight, border: `1px solid ${c.border}` }}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: c.textMuted }}>Feature {idx + 1}</span>
                                        </div>
                                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
                                            <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Icon</label>
                                            <input type="text" value={feature.icon} onChange={e => updateFeatures(idx, 'icon', e.target.value)}
                                                placeholder="🌿"
                                                className={`${inputClass} w-16 text-center text-lg`}
                                                style={inputStyle}
                                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />

                                            <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Title</label>
                                            <input type="text" value={feature.title} onChange={e => updateFeatures(idx, 'title', e.target.value)}
                                                placeholder="All-Natural Ingredients"
                                                className={inputClass}
                                                style={inputStyle}
                                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />

                                            <label className="text-[11px] font-semibold" style={{ color: c.textMuted }}>Text</label>
                                            <textarea rows={2} value={feature.text} onChange={e => updateFeatures(idx, 'text', e.target.value)}
                                                placeholder="We source only organic..."
                                                className={inputClass + " leading-relaxed"}
                                                style={inputStyle}
                                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                        </div>
                                    </div>
                                ))}
                                {err(errors.email_features)}
                            </div>

                            {/* CTA Text */}
                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Button Text
                                </label>
                                <input type="text" required value={data.email_cta_text} onChange={e => setData('email_cta_text', e.target.value)}
                                    placeholder="Explore the Collection"
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                {err(errors.email_cta_text)}
                                <p className="mt-2 text-[11px]" style={{ color: c.textFaint }}>The text on the call-to-action button at the bottom of the email.</p>
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="bg-white rounded-xl p-7 mb-6" style={{ border: `1px solid ${c.border}` }}>
                            {sectionTitle('Footer Address / Contact', 'Shown in the email footer and store communications.')}

                            <div className="mb-5">
                                <label className={labelClass} style={{ color: c.textMuted }}>
                                    Address & Contact Info
                                </label>
                                <textarea rows={3} value={data.email_footer_address} onChange={e => setData('email_footer_address', e.target.value)}
                                    placeholder="Carrer de les Flors 14, Barcelona, Spain&#10;hello@cleopatrabaklava.com"
                                    className={inputClass + " leading-relaxed"}
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                {err(errors.email_footer_address)}
                                <p className="mt-2 text-[11px]" style={{ color: c.textFaint }}>You can use multiple lines.</p>
                            </div>
                        </div>

                        {/* SAVE */}
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
                </div>
            </div>

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-7 right-7 z-[300] flex items-center gap-3 rounded-xl px-[22px] py-4"
                    style={{ background: c.dark, border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
                    <CheckCircle size={18} className="shrink-0" style={{ color: c.gold }} />
                    <span className="text-sm font-semibold text-[#f5f0e8]">{toast}</span>
                </div>
            )}
        </>
    );
}
