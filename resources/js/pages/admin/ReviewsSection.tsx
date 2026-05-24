import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star, CheckCircle, AlertTriangle, Loader2, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { Review } from './shared';

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
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight text-foreground">Reviews</h2>
                <p className="text-sm mt-1.5 text-admin-muted">Moderate customer reviews and ratings.</p>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-admin-border">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#faf8f4] border-b border-admin-border">
                            {['Product', 'Reviewer', 'Rating', 'Comment', 'Status', ''].map((h, i) => (
                                <th key={i} className={`px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap text-admin-faint ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-admin-faint">No reviews yet.</td></tr>
                        )}
                        {reviews.map((r) => (
                            <tr key={r.id} className="transition-colors duration-150 hover:bg-[#fdf9f2] border-b border-admin-border last:border-b-0">
                                <td className="px-5 py-4">
                                    <div className="font-serif font-semibold text-[15px] text-foreground">{r.product?.title ?? 'Unknown'}</div>
                                    <div className="text-[11px] font-semibold tracking-[0.08em] mt-0.5 text-admin-faint"># {r.product_id}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="text-sm font-semibold text-foreground">{r.name}</div>
                                    <div className="text-[11px] text-admin-faint">{r.email}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-accent" />
                                        <span className="font-bold text-[15px] text-foreground">{r.rating}</span>
                                        <span className="text-xs text-admin-faint">/5</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 max-w-[300px]">
                                    <p className="text-sm leading-relaxed m-0 line-clamp-2 text-foreground">{r.comment}</p>
                                    <div className="text-[10px] mt-1.5 text-admin-faint">{r.created_at}</div>
                                </td>
                                <td className="px-5 py-4">
                                    {r.approved ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase bg-green-600/10 text-green-600 border border-green-600/20">
                                            <CheckCircle size={10} /> Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase bg-red-600/10 text-red-600 border border-red-600/20">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => handleToggleApprove(r)} disabled={processingId === r.id} title={r.approved ? 'Disapprove' : 'Approve'}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 border-[1.5px] border-admin-border ${
                                                r.approved
                                                    ? 'text-red-600 hover:border-red-600 hover:bg-[#fff5f5]'
                                                    : 'text-green-600 hover:border-green-600 hover:bg-[#f0fdf4]'
                                            }`}>
                                            {processingId === r.id ? <Loader2 size={14} className="animate-spin" /> : r.approved ? <ThumbsDown size={14} /> : <ThumbsUp size={14} />}
                                        </button>
                                        <button onClick={() => setToDelete(r)} disabled={processingId === r.id} title="Delete"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 border-[1.5px] border-admin-border text-admin-muted hover:border-red-600 hover:text-red-600 hover:bg-[#fff5f5]">
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
                    <div onClick={() => setToDelete(null)} className="fixed inset-0 bg-[rgba(14,12,8,0.72)] backdrop-blur-[6px]" />
                    <div className="relative z-10 w-full max-w-[440px] rounded-2xl p-8 bg-card border border-admin-border shadow-[0_40px_100px_rgba(0,0,0,0.18)]">
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-600/10">
                                <AlertTriangle size={22} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold m-0 mb-2 text-foreground">Delete Review?</h3>
                                <p className="text-sm leading-relaxed m-0 text-admin-muted">
                                    Review by <strong className="text-foreground">{toDelete.name}</strong> on <strong className="text-foreground">{toDelete.product?.title ?? 'Unknown'}</strong> will be permanently removed.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-5 border-t border-admin-border">
                            <button onClick={() => setToDelete(null)}
                                className="px-5 py-2.5 rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit border-[1.5px] border-admin-border text-admin-muted">Cancel</button>
                            <button onClick={handleDelete} disabled={processingId === toDelete.id}
                                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit disabled:cursor-not-allowed bg-red-600 disabled:opacity-70">
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
