import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Tag, Plus, X, Edit, Trash2, LogOut, Globe, CheckCircle, AlertTriangle, Loader2, Package, Settings as SettingsIcon } from 'lucide-react';

interface Category {
    id: number; name: string; products_count: number;
}
interface Props {
    categories: Category[];
    flash?: { success?: string; };
}

const c = {
    bg: '#f7f5f0', surface: '#ffffff', border: '#e8e2d6',
    borderHover: '#c9a84c', dark: '#1e1b14', muted: '#8a7d6a',
    gold: '#c9a84c', goldDark: '#755b00', goldLight: 'rgba(201,168,76,0.10)',
    danger: '#dc2626', dangerLight: 'rgba(220,38,38,0.08)',
    nav: '#1a1712', text: '#1e1b14', textMuted: '#8a7d6a', textFaint: '#b5a898',
};

const tokenClasses = {
    bg: 'bg-[#f7f5f0]', surface: 'bg-white', border: 'border-[#e8e2d6]',
    nav: 'bg-[#1a1712]', goldDark: 'bg-[#755b00]',
    textMuted: 'text-[#8a7d6a]', textFaint: 'text-[#b5a898]',
    dark: 'text-[#1e1b14]', danger: 'bg-[#dc2626]',
};

export default function AdminCategories({ categories = [], flash }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [toDelete, setToDelete] = useState<Category | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openAdd = () => {
        clearErrors(); reset(); setEditing(null); setModalOpen(true);
    };
    const openEdit = (cat: Category) => {
        clearErrors(); setData({ name: cat.name }); setEditing(cat); setModalOpen(true);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { onSuccess: () => { setModalOpen(false); reset(); setEditing(null); } };
        editing
            ? put(`/admin/categories/${editing.id}`, opts)
            : post('/admin/categories', opts);
    };
    const handleDelete = () => {
        if (!toDelete) return;
        destroy(`/admin/categories/${toDelete.id}`, {
            onSuccess: () => { setToDelete(null); showToast('Category deleted.'); },
        });
    };

    const err = (msg?: string) => msg ? <p className="mt-1 text-xs font-semibold" style={{ color: c.danger }}>{msg}</p> : null;

    return (
        <>
            <Head><title>Categories — Admin</title></Head>
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
                <div className="max-w-[900px] mx-auto px-8 py-9 pb-20">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="font-serif text-[32px] font-bold m-0 leading-tight" style={{ color: c.dark }}>Categories</h2>
                            <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Organise your products with categories.</p>
                        </div>
                        <button onClick={openAdd}
                            className="flex items-center gap-2 px-[22px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap text-white transition-colors duration-200"
                            style={{ background: c.goldDark, boxShadow: '0 2px 10px rgba(117,91,0,0.18)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                            <Plus size={16} /> Add Category
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                                    {['Name', 'Products', ''].map((h, i) => (
                                        <th key={i} className="px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap" style={{ textAlign: i === 2 ? 'right' : 'left', color: c.textFaint }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr><td colSpan={3} className="px-6 py-14 text-center text-sm" style={{ color: c.textFaint }}>No categories yet. Create your first one!</td></tr>
                                )}
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id} className="transition-[background] duration-150" style={{ borderBottom: idx < categories.length - 1 ? `1px solid ${c.border}` : 'none' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#fdf9f2')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0" style={{ background: c.goldLight, color: c.goldDark }}>
                                                    <Tag size={16} />
                                                </div>
                                                <span className="font-serif font-semibold text-[15px]" style={{ color: c.dark }}>{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm" style={{ color: c.textMuted }}>{cat.products_count} product{cat.products_count !== 1 ? 's' : ''}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <button onClick={() => openEdit(cat)} title="Edit"
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200"
                                                    style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                                    onMouseEnter={e => { (e.currentTarget as any).style.borderColor = c.goldDark; (e.currentTarget as any).style.color = c.goldDark; (e.currentTarget as any).style.background = '#fdf9f2'; }}
                                                    onMouseLeave={e => { (e.currentTarget as any).style.borderColor = c.border; (e.currentTarget as any).style.color = c.textMuted; (e.currentTarget as any).style.background = '#fff'; }}>
                                                    <Edit size={15} />
                                                </button>
                                                <button onClick={() => setToDelete(cat)} title="Delete"
                                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200"
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

            {/* CREATE / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setModalOpen(false)} className="fixed inset-0" style={{ background: 'rgba(14,12,8,0.72)', backdropFilter: 'blur(6px)' }} />
                    <div className="relative z-10 w-full max-w-[480px] rounded-2xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
                        <div className="flex items-center justify-between shrink-0 px-7 py-6 bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                            <h3 className="font-serif text-[22px] font-bold m-0" style={{ color: c.dark }}>{editing ? 'Edit Category' : 'Add Category'}</h3>
                            <button onClick={() => setModalOpen(false)}
                                className="w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-transparent cursor-pointer transition-all duration-200"
                                style={{ color: c.textMuted }}
                                onMouseEnter={e => { (e.currentTarget as any).style.background = '#e8e2d6'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; }}>
                                <X size={19} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-7">
                            <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Category Name *</label>
                            <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Pistachio Delights"
                                className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                            {err(errors.name)}
                            <div className="flex justify-end gap-2.5 mt-7 pt-5" style={{ borderTop: `1px solid ${c.border}` }}>
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="px-[22px] py-[11px] rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit transition-all duration-200"
                                    style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f7f5f0')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed"
                                    style={{ background: c.goldDark, opacity: processing ? 0.7 : 1, boxShadow: '0 2px 12px rgba(117,91,0,0.18)' }}
                                    onMouseEnter={e => !processing && (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                                    {processing && <Loader2 size={14} className="animate-spin" />}
                                    {editing ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                <h3 className="font-serif text-xl font-bold m-0 mb-2" style={{ color: c.dark }}>Delete Category?</h3>
                                <p className="text-sm leading-relaxed m-0" style={{ color: c.textMuted }}>
                                    <strong style={{ color: c.dark }}>"{toDelete.name}"</strong> will be permanently removed. This cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-5" style={{ borderTop: `1px solid ${c.border}` }}>
                            <button onClick={() => setToDelete(null)}
                                className="px-5 py-2.5 rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit"
                                style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}>Cancel</button>
                            <button onClick={handleDelete} disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit disabled:cursor-not-allowed"
                                style={{ background: c.danger, opacity: processing ? 0.7 : 1 }}>
                                {processing && <Loader2 size={14} className="animate-spin" />}
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
