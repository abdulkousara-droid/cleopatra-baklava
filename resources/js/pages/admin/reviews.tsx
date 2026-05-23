import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { MessageSquare, ThumbsUp, ThumbsDown, Trash2, LogOut, Globe, CheckCircle, AlertTriangle, Loader2, Star, Package, Tag, Settings as SettingsIcon } from 'lucide-react';

interface Review {
    id: number; product_id: number; name: string; email: string;
    rating: number; comment: string; approved: boolean;
    created_at: string;
    product: { id: number; title: string; };
}
interface Props {
    reviews: Review[];
    flash?: { success?: string; };
}

const c = {
    bg: '#f7f5f0', surface: '#ffffff', border: '#e8e2d6',
    borderHover: '#c9a84c', dark: '#1e1b14', muted: '#8a7d6a',
    gold: '#c9a84c', goldDark: '#755b00', goldLight: 'rgba(201,168,76,0.10)',
    danger: '#dc2626', dangerLight: 'rgba(220,38,38,0.08)',
    nav: '#1a1712', text: '#1e1b14', textMuted: '#8a7d6a', textFaint: '#b5a898',
    green: '#16a34a', greenLight: 'rgba(22,163,74,0.10)',
};

export default function AdminReviews({ reviews = [], flash }: Props) {
    const [toDelete, setToDelete] = useState<Review | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const handleToggleApprove = (review: Review) => {
        setProcessingId(review.id);
        router.put(`/admin/reviews/${review.id}/approve`, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const handleDelete = () => {
        if (!toDelete) return;
        setProcessingId(toDelete.id);
        router.delete(`/admin/reviews/${toDelete.id}`, {
            onSuccess: () => { setToDelete(null); showToast('Review deleted.'); },
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <>
            <Head><title>Reviews — Admin</title></Head>
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
                        <Link href="/admin/settings" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <SettingsIcon size={15} /> Settings
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
                <div className="max-w-[1100px] mx-auto px-8 py-9 pb-20">
                    <div className="mb-8">
                        <h2 className="font-serif text-[32px] font-bold m-0 leading-tight" style={{ color: c.dark }}>Reviews</h2>
                        <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Moderate customer reviews and ratings.</p>
                    </div>

                    {/* TABLE */}
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
                                                    onMouseEnter={e => { (e.currentTarget as any).style.borderColor = r.approved ? c.danger : c.green; (e.currentTarget as any).style.background = r.approved ? '#fff5f5' : '#f0fdf4'; }}
                                                    onMouseLeave={e => { (e.currentTarget as any).style.borderColor = c.border; (e.currentTarget as any).style.background = '#fff'; }}>
                                                    {processingId === r.id ? <Loader2 size={14} className="animate-spin" /> : r.approved ? <ThumbsDown size={14} /> : <ThumbsUp size={14} />}
                                                </button>
                                                <button onClick={() => setToDelete(r)} disabled={processingId === r.id} title="Delete"
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                    style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                                    onMouseEnter={e => { (e.currentTarget as any).style.borderColor = c.danger; (e.currentTarget as any).style.color = c.danger; (e.currentTarget as any).style.background = '#fff5f5'; }}
                                                    onMouseLeave={e => { (e.currentTarget as any).style.borderColor = c.border; (e.currentTarget as any).style.color = c.textMuted; (e.currentTarget as any).style.background = '#fff'; }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
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
