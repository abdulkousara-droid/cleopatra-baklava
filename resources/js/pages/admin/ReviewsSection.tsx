import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, CheckCircle, AlertTriangle, Loader2, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { c, Review } from './shared';

export default function ReviewsSection({ reviews, showToast }: {
    reviews: Review[]; showToast: (msg: string) => void;
}) {
    const [toDelete, setToDelete] = useState<Review | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleToggleApprove = (review: Review) => {
        setProcessingId(review.id);
        router.post('/admin', { _action: 'toggle-approve-review', id: review.id }, {
            onFinish: () => setProcessingId(null),
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        setProcessingId(toDelete.id);
        router.post('/admin', { _action: 'delete-review', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast('Review deleted.'); },
            onError: () => showToast('Failed to delete review.'),
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <>
            <div className="mb-8">
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight" style={{ color: c.dark }}>Reviews</h2>
                <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Moderate customer reviews and ratings.</p>
            </div>

            <div className="bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                            {['Product', 'Reviewer', 'Rating', 'Comment', 'Status', ''].map((h, i) => (
                                <th key={i} className="px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap" style={{ textAlign: i === 5 ? 'right' : 'left', color: c.textFaint }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-14 text-center text-sm" style={{ color: c.textFaint }}>No reviews yet.</td></tr>
                        )}
                        {reviews.map((r, idx) => (
                            <tr key={r.id} className="transition-[background] duration-150" style={{ borderBottom: idx < reviews.length - 1 ? `1px solid ${c.border}` : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#fdf9f2')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <td className="px-5 py-4">
                                    <div className="font-serif font-semibold text-[15px]" style={{ color: c.dark }}>{r.product?.title ?? 'Unknown'}</div>
                                    <div className="text-[11px] font-semibold tracking-[0.08em] mt-0.5" style={{ color: c.textFaint }}># {r.product_id}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="text-sm font-semibold" style={{ color: c.dark }}>{r.name}</div>
                                    <div className="text-[11px]" style={{ color: c.textFaint }}>{r.email}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} style={{ color: c.gold }} />
                                        <span className="font-bold text-[15px]" style={{ color: c.dark }}>{r.rating}</span>
                                        <span className="text-xs" style={{ color: c.textFaint }}>/5</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 max-w-[300px]">
                                    <p className="text-sm leading-relaxed m-0 line-clamp-2" style={{ color: c.text }}>{r.comment}</p>
                                    <div className="text-[10px] mt-1.5" style={{ color: c.textFaint }}>{r.created_at}</div>
                                </td>
                                <td className="px-5 py-4">
                                    {r.approved ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase"
                                            style={{ background: c.greenLight, color: c.green, border: '1px solid rgba(22,163,74,0.2)' }}>
                                            <CheckCircle size={10} /> Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase"
                                            style={{ background: c.dangerLight, color: c.danger, border: '1px solid rgba(220,38,38,0.2)' }}>
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => handleToggleApprove(r)} disabled={processingId === r.id} title={r.approved ? 'Disapprove' : 'Approve'}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            style={{ border: `1.5px solid ${c.border}`, color: r.approved ? c.danger : c.green }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = r.approved ? c.danger : c.green; (e.currentTarget as HTMLElement).style.background = r.approved ? '#fff5f5' : '#f0fdf4'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                                            {processingId === r.id ? <Loader2 size={14} className="animate-spin" /> : r.approved ? <ThumbsDown size={14} /> : <ThumbsUp size={14} />}
                                        </button>
                                        <button onClick={() => setToDelete(r)} disabled={processingId === r.id} title="Delete"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.danger; (e.currentTarget as HTMLElement).style.color = c.danger; (e.currentTarget as HTMLElement).style.background = '#fff5f5'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textMuted; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setToDelete(null)} className="fixed inset-0" style={{ background: 'rgba(14,12,8,0.72)', backdropFilter: 'blur(6px)' }} />
                    <div className="relative z-10 w-full max-w-[440px] rounded-2xl p-8" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.dangerLight }}>
                                <AlertTriangle size={22} style={{ color: c.danger }} />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold m-0 mb-2" style={{ color: c.dark }}>Delete Review?</h3>
                                <p className="text-sm leading-relaxed m-0" style={{ color: c.textMuted }}>
                                    Review by <strong style={{ color: c.dark }}>{toDelete.name}</strong> on <strong style={{ color: c.dark }}>{toDelete.product?.title ?? 'Unknown'}</strong> will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-5" style={{ borderTop: `1px solid ${c.border}` }}>
                            <button onClick={() => setToDelete(null)}
                                className="px-5 py-2.5 rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit"
                                style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}>Cancel</button>
                            <button onClick={handleDelete} disabled={processingId === toDelete.id}
                                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit disabled:cursor-not-allowed"
                                style={{ background: c.danger, opacity: processingId === toDelete.id ? 0.7 : 1 }}>
                                {processingId === toDelete.id && <Loader2 size={14} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
