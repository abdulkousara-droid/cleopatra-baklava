import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, X, Tag, AlertTriangle, Loader2, Edit, Trash2 } from 'lucide-react';
import { c, inputClass, inputStyle, labelClass, Category } from './shared';

export default function CategoriesSection({ categories, err, showToast }: {
    categories: Category[]; err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [toDelete, setToDelete] = useState<Category | null>(null);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({ name: '' });

    const openAdd = () => { clearErrors(); reset(); setEditing(null); setModalOpen(true); };
    const openEdit = (cat: Category) => { clearErrors(); setData({ name: cat.name }); setEditing(cat); setModalOpen(true); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const action = editing ? 'update-category' : 'store-category';
        router.post('/admin', { ...data, _action: action, id: editing?.id }, {
            onSuccess: () => { setModalOpen(false); reset(); setEditing(null); showToast(editing ? 'Category updated.' : 'Category created.'); },
            onError: () => showToast('Failed to save category.'),
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        router.post('/admin', { _action: 'delete-category', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast('Category deleted.'); },
            onError: () => showToast('Failed to delete category.'),
        });
    };

    return (
        <>
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
                                <td className="px-5 py-4 text-sm" style={{ color: c.textMuted }}>{cat.products_count ?? 0} product{(cat.products_count ?? 0) !== 1 ? 's' : ''}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => openEdit(cat)} title="Edit"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200"
                                            style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.goldDark; (e.currentTarget as HTMLElement).style.color = c.goldDark; (e.currentTarget as HTMLElement).style.background = '#fdf9f2'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.color = c.textMuted; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                                            <Edit size={15} />
                                        </button>
                                        <button onClick={() => setToDelete(cat)} title="Delete"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200"
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

            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setModalOpen(false)} className="fixed inset-0" style={{ background: 'rgba(14,12,8,0.72)', backdropFilter: 'blur(6px)' }} />
                    <div className="relative z-10 w-full max-w-[480px] rounded-2xl overflow-hidden" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
                        <div className="flex items-center justify-between shrink-0 px-7 py-6 bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                            <h3 className="font-serif text-[22px] font-bold m-0" style={{ color: c.dark }}>{editing ? 'Edit Category' : 'Add Category'}</h3>
                            <button onClick={() => setModalOpen(false)}
                                className="w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-transparent cursor-pointer transition-all duration-200"
                                style={{ color: c.textMuted }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8e2d6'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                <X size={19} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-7">
                            <label className={labelClass} style={{ color: c.textMuted }}>Category Name *</label>
                            <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Pistachio Delights"
                                className={inputClass} style={inputStyle}
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
        </>
    );
}
