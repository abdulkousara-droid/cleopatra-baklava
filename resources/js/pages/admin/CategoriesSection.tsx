import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, router } from '@inertiajs/react';
import { Plus, X, Tag, AlertTriangle, Loader2, Edit, Trash2 } from 'lucide-react';
import { inputClass, labelClass, Category } from './shared';

export default function CategoriesSection({ categories, err, showToast }: {
    categories: Category[]; err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const { t } = useTranslation();
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
            onSuccess: () => { setModalOpen(false); reset(); setEditing(null); showToast(editing ? t('admin.toast_category_updated') : t('admin.toast_category_created')); },
            onError: () => showToast(t('admin.toast_category_failed')),
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        router.post('/admin', { _action: 'delete-category', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast(t('admin.toast_category_deleted')); },
            onError: () => showToast(t('admin.toast_category_delete_failed')),
        });
    };

    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-[32px] font-bold m-0 leading-tight text-foreground">{t('admin.categories_title')}</h2>
                    <p className="text-sm mt-1.5 text-admin-muted">{t('admin.categories_desc')}</p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-[22px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap text-white transition-colors duration-200 bg-primary shadow-[0_2px_10px_rgba(117,91,0,0.18)] hover:bg-[#5b4600]">
                    <Plus size={16} /> {t('admin.add_category')}
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-admin-border">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#faf8f4] border-b border-admin-border">
                            {[t('admin.name'), t('admin.products'), ''].map((h, i) => (
                                <th key={i} className={`px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap text-admin-faint ${i === 2 ? 'text-right' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-14 text-center text-sm text-admin-faint">{t('admin.no_categories')}</td></tr>
                        )}
                        {categories.map((cat) => (
                            <tr key={cat.id} className="transition-colors duration-150 hover:bg-[#fdf9f2] border-b border-admin-border last:border-b-0">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0 bg-accent/10 text-primary">
                                            <Tag size={16} />
                                        </div>
                                        <span className="font-serif font-semibold text-[15px] text-foreground">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-admin-muted">{t('admin.products_count_plural', { count: cat.products_count ?? 0 })}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => openEdit(cat)} title={t('admin.edit')}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 border-[1.5px] border-admin-border text-admin-muted hover:border-primary hover:text-primary hover:bg-[#fdf9f2]">
                                            <Edit size={15} />
                                        </button>
                                        <button onClick={() => setToDelete(cat)} title={t('admin.delete')}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 border-[1.5px] border-admin-border text-admin-muted hover:border-red-600 hover:text-red-600 hover:bg-[#fff5f5]">
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
                    <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-[rgba(14,12,8,0.72)] backdrop-blur-[6px]" />
                    <div className="relative z-10 w-full max-w-[480px] rounded-2xl overflow-hidden bg-card border border-admin-border shadow-[0_40px_100px_rgba(0,0,0,0.18)]">
                        <div className="flex items-center justify-between shrink-0 px-7 py-6 bg-[#faf8f4] border-b border-admin-border">
                            <h3 className="font-serif text-[22px] font-bold m-0 text-foreground">{editing ? t('admin.edit_category') : t('admin.add_new_category')}</h3>
                            <button onClick={() => setModalOpen(false)}
                                className="w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-transparent cursor-pointer transition-all duration-200 text-admin-muted hover:bg-[#e8e2d6]">
                                <X size={19} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-7">
                            <label className={labelClass}>{t('admin.category_name')}</label>
                            <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Pistachio Delights"
                                className={inputClass + ' focus:border-accent'} />
                            {err(errors.name)}
                            <div className="flex justify-end gap-2.5 mt-7 pt-5 border-t border-admin-border">
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="px-[22px] py-[11px] rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit transition-all duration-200 border-[1.5px] border-admin-border text-admin-muted hover:bg-[#f7f5f0]">
                                    {t('admin.cancel')}
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed bg-primary hover:bg-[#5b4600] shadow-[0_2px_12px_rgba(117,91,0,0.18)] disabled:opacity-70">
                                    {processing && <Loader2 size={14} className="animate-spin" />}
                                    {editing ? t('admin.save_changes') : t('admin.create_category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setToDelete(null)} className="fixed inset-0 bg-[rgba(14,12,8,0.72)] backdrop-blur-[6px]" />
                    <div className="relative z-10 w-full max-w-[440px] rounded-2xl p-8 bg-card border border-admin-border shadow-[0_40px_100px_rgba(0,0,0,0.18)]">
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-600/10">
                                <AlertTriangle size={22} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold m-0 mb-2 text-foreground">{t('admin.delete_category_title')}</h3>
                                <p className="text-sm leading-relaxed m-0 text-admin-muted">
                                    {t('admin.delete_category_warning', { name: toDelete.name })}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-5 border-t border-admin-border">
                            <button onClick={() => setToDelete(null)}
                                className="px-5 py-2.5 rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit border-[1.5px] border-admin-border text-admin-muted">{t('admin.cancel')}</button>
                            <button onClick={handleDelete} disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit disabled:cursor-not-allowed bg-red-600 disabled:opacity-70">
                                {processing && <Loader2 size={14} className="animate-spin" />}
                                {t('admin.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
