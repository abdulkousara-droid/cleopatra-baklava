import React from 'react';
import { useForm } from '@inertiajs/react';
import { Send, Users, Loader2 } from 'lucide-react';
import { c, inputClass, inputStyle, labelClass } from './shared';

export default function CampaignSection({ subscriberCount, err, showToast }: {
    subscriberCount: number; err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _action: 'send-offer',
        subject: '',
        body: '',
        cta_text: '',
        cta_link: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin', {
            onSuccess: () => { clearErrors(); reset(); showToast('Campaign sent!'); },
            onError: () => showToast('Failed to send campaign.'),
        });
    };

    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-[32px] font-bold m-0 leading-tight flex items-center gap-3" style={{ color: c.dark }}>
                        <Send size={28} style={{ color: c.gold }} /> Email Campaign
                    </h2>
                    <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>
                        Send an exclusive offer to all {subscriberCount} newsletter subscriber{subscriberCount !== 1 ? 's' : ''}.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-[0.1em] uppercase"
                    style={{ background: c.goldLight, color: c.goldDark, border: '1px solid rgba(201,168,76,0.3)' }}>
                    <Users size={16} /> {subscriberCount} Subscriber{subscriberCount !== 1 ? 's' : ''}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl p-7" style={{ border: `1px solid ${c.border}` }}>
                    <div className="mb-6">
                        <label className={labelClass} style={{ color: c.textMuted }}>Subject Line *</label>
                        <input type="text" required value={data.subject} onChange={e => setData('subject', e.target.value)}
                            placeholder="e.g. ✦ Exclusive 20% Off — Just for You"
                            className={inputClass} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.subject)}
                    </div>

                    <div className="mb-6">
                        <label className={labelClass} style={{ color: c.textMuted }}>Email Body *</label>
                        <p className="text-[11px] mb-2" style={{ color: c.textFaint }}>Use a blank line between paragraphs. Plain text only — no HTML needed.</p>
                        <textarea rows={10} required value={data.body} onChange={e => setData('body', e.target.value)}
                            placeholder="Dear Connoisseur,&#10;&#10;We are delighted to offer you an exclusive 20% discount..."
                            className={inputClass + ' leading-relaxed'} style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        {err(errors.body)}
                    </div>

                    <div className="grid grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className={labelClass} style={{ color: c.textMuted }}>
                                CTA Button Text <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(optional)</span>
                            </label>
                            <input type="text" value={data.cta_text} onChange={e => setData('cta_text', e.target.value)}
                                placeholder="e.g. Shop the Collection"
                                className={inputClass} style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                            {err(errors.cta_text)}
                        </div>
                        <div>
                            <label className={labelClass} style={{ color: c.textMuted }}>
                                CTA Link <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(optional)</span>
                            </label>
                            <input type="text" value={data.cta_link} onChange={e => setData('cta_link', e.target.value)}
                                placeholder="e.g. https://cleopatrabaklava.com/shop"
                                className={inputClass} style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                            {err(errors.cta_link)}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6" style={{ borderTop: `1px solid ${c.border}` }}>
                        <button type="button" onClick={() => { clearErrors(); reset(); }}
                            className="px-[22px] py-[11px] rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit transition-all duration-200"
                            style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f7f5f0')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                            Clear
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed"
                            style={{ background: c.goldDark, opacity: processing ? 0.7 : 1, boxShadow: '0 2px 12px rgba(117,91,0,0.18)' }}
                            onMouseEnter={e => !processing && (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                            {processing && <Loader2 size={14} className="animate-spin" />}
                            <Send size={15} /> Send to All Subscribers
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
