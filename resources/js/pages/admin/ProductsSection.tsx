import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Package, Tag, MessageSquare, Star, Search, Plus, X, Sparkles,
    AlertTriangle, Loader2, Edit, Trash2, Hash, Apple, Image,
} from 'lucide-react';
import { inputClass, labelClass, Pill, Stat, Product, Category } from './shared';

export default function ProductsSection({ products, categories, stats, err, showToast }: {
    products: Product[]; categories: Category[];
    stats: { total_products: number; total_reviews: number; avg_rating: number; total_categories: number; };
    err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Product | null>(null);

    const tagRef = useRef<HTMLInputElement>(null);
    const allergenRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        title: '', price: '', category_id: '',
        badge: '', description: '', image: '', tags: '', allergens: '', additional_images: '',
    });

    const ref = useRef(data);
    ref.current = data;

    const csv = (s: string) => s ? s.split(',').map(x => x.trim()).filter(Boolean) : [];
    const labels = { tags: 'Tag', allergens: 'Allergen', additional_images: 'Image' };

    const act = (field: 'tags' | 'allergens' | 'additional_images', inp: HTMLInputElement | null) => {
        if (!inp) return;
        const v = inp.value.trim();
        if (!v) return;
        const a = csv((ref.current as any)[field]);
        if (a.includes(v)) {
            showToast(`${labels[field]} "${v}" already exists`);
            return;
        }
        setData(field as any, [...a, v].join(', '));
        inp.value = '';
        inp.focus();
    };

    const rm = (field: 'tags' | 'allergens' | 'additional_images', i: number) => {
        const a = csv((ref.current as any)[field]);
        setData(field as any, a.filter((_, j) => j !== i).join(', '));
    };

    const onEnter = (field: 'tags' | 'allergens' | 'additional_images', r: React.RefObject<HTMLInputElement | null>) => (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); act(field, r.current); }
    };

    const openAdd = () => {
        clearErrors(); reset();
        setData({ id: null, title: '', price: '', category_id: String(categories[0]?.id ?? ''), badge: '', description: '', image: '', tags: '', allergens: '', additional_images: '' });
        setModalOpen(true);
    };
    const openEdit = (p: Product) => {
        clearErrors();
        setData({ id: p.id, title: p.title, price: String(p.price), category_id: String(p.category_id), badge: p.badge ?? '', description: p.description, image: p.image, tags: (p.tags ?? []).join(', '), allergens: (p.allergens ?? []).join(', '), additional_images: (p.additional_images ?? []).join(', ') });
        setModalOpen(true);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const action = data.id ? 'update-product' : 'store-product';
        router.post('/admin', { ...data, _action: action }, {
            onSuccess: () => {
                setModalOpen(false);
                reset();
                showToast(data.id ? 'Product updated successfully!' : 'Product created successfully!');
            },
            onError: () => showToast('Failed to save product.'),
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        router.post('/admin', { _action: 'delete-product', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast('Product deleted.'); },
            onError: () => showToast('Failed to delete product.'),
        });
    };

    const filtered = products.filter(p =>
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
        (catFilter === 'All' || p.category_id === parseInt(catFilter))
    );

    return (
        <>
            <div className="mb-8">
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight text-foreground">Product Catalogue</h2>
                <p className="text-sm mt-1.5 text-admin-muted">Manage your full range of artisanal baklava products in real-time.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <Stat icon={Package} label="Products" value={stats.total_products} />
                <Stat icon={Tag} label="Categories" value={stats.total_categories} />
                <Stat icon={MessageSquare} label="Reviews" value={stats.total_reviews} />
                <Stat icon={Star} label="Avg Rating" value={stats.avg_rating} suffix="★" />
            </div>

            <div className="bg-white rounded-xl px-5 py-4 flex items-center gap-3 mb-5 flex-wrap border border-admin-border">
                <div className="relative flex-[1_1_260px] min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-admin-faint" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                        className="block w-full px-3 py-[11px] rounded-xl text-sm outline-none transition-colors duration-200 font-inherit pl-[38px] border-[1.5px] border-admin-border text-foreground bg-admin-bg focus:border-accent" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    className="block w-auto min-w-[170px] px-3 py-[11px] rounded-xl text-sm outline-none transition-colors duration-200 font-inherit cursor-pointer border-[1.5px] border-admin-border text-foreground bg-admin-bg focus:border-accent">
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-[22px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap text-white transition-colors duration-200 bg-primary shadow-[0_2px_10px_rgba(117,91,0,0.18)] hover:bg-[#5b4600]">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden border border-admin-border">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#faf8f4] border-b border-admin-border">
                            {['Product', 'Category', 'Price', 'Badge & Tags', 'Rating', ''].map((h, i) => (
                                <th key={i} className={`px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap text-admin-faint ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-admin-faint">No products found.</td></tr>
                        )}
                        {filtered.map((p) => (
                            <tr key={p.id} className="transition-colors duration-150 hover:bg-[#fdf9f2] border-b border-admin-border last:border-b-0">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 bg-[#f0ece4] border border-admin-border">
                                            <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover"
                                                onError={e => { (e.target as HTMLImageElement).src = '/logo.svg'; }} />
                                        </div>
                                        <div>
                                            <div className="font-serif font-semibold text-[15px] mb-0.5 text-foreground">{p.title}</div>
                                            <div className="text-[11px] font-semibold tracking-[0.08em] text-admin-faint"># {p.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4"><Pill>{p.category?.name ?? 'Unset'}</Pill></td>
                                <td className="px-5 py-4 font-bold text-base whitespace-nowrap text-foreground">€{Number(p.price).toFixed(2)}</td>
                                <td className="px-5 py-4 max-w-[220px]">
                                    <div className="flex flex-col gap-1.5">
                                        {p.badge && <Pill gold>{p.badge}</Pill>}
                                        <div className="flex flex-wrap gap-1">
                                            {(p.tags ?? []).slice(0, 3).map((t, i) => <Pill key={i}>{t}</Pill>)}
                                            {(p.tags ?? []).length > 3 && <span className="text-[11px] leading-[22px] text-admin-faint">+{(p.tags ?? []).length - 3}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base leading-none text-accent">★</span>
                                        <span className="font-bold text-[15px] text-foreground">{p.rating_score.toFixed(1)}</span>
                                        <span className="text-xs text-admin-faint">({p.reviews_count})</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => openEdit(p)} title="Edit"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200 border-[1.5px] border-admin-border text-admin-muted hover:border-primary hover:text-primary hover:bg-[#fdf9f2]">
                                            <Edit size={15} />
                                        </button>
                                        <button onClick={() => setToDelete(p)} title="Delete"
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
                    <div className="relative z-10 w-full max-w-[700px] max-h-[92vh] rounded-2xl overflow-hidden flex flex-col bg-card border border-admin-border shadow-[0_40px_100px_rgba(0,0,0,0.18)]">
                        <div className="flex items-center justify-between shrink-0 px-7 py-6 bg-[#faf8f4] border-b border-admin-border">
                            <div className="flex items-center gap-2.5">
                                <Sparkles size={20} className="text-accent" />
                                <h3 className="font-serif text-[22px] font-bold m-0 text-foreground">{data.id ? 'Edit Product' : 'Add New Product'}</h3>
                            </div>
                            <button onClick={() => setModalOpen(false)}
                                className="w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-transparent cursor-pointer transition-all duration-200 text-admin-muted hover:bg-[#e8e2d6]">
                                <X size={19} />
                            </button>
                        </div>
                        <form className="overflow-y-auto flex-1 p-7" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className={labelClass}>Product Title *</label>
                                    <input type="text" required value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Cleopatra's Pistachio Nest"
                                        className={inputClass + ' focus:border-accent'} />
                                    {err(errors.title)}
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select required value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                        className={inputClass + ' cursor-pointer focus:border-accent'}>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {err(errors.category_id)}
                                </div>
                                <div>
                                    <label className={labelClass}>Price (€) *</label>
                                    <input type="number" step="0.01" min="0" required value={data.price} onChange={e => setData('price', e.target.value)} placeholder="24.50"
                                        className={inputClass + ' focus:border-accent'} />
                                    {err(errors.price)}
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass}>Primary Image URL *</label>
                                    <input type="text" required value={data.image} onChange={e => setData('image', e.target.value)} placeholder="/images/product.png or https://..."
                                        className={inputClass + ' focus:border-accent'} />
                                    {err(errors.image)}
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass}>Description *</label>
                                    <textarea required rows={3} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe ingredients, heritage, texture..."
                                        className={inputClass + ' resize-none focus:border-accent'} />
                                    {err(errors.description)}
                                </div>
                                <div>
                                    <label className={labelClass}>Badge <span className="font-normal normal-case tracking-normal text-admin-faint">(optional)</span></label>
                                    <select value={data.badge} onChange={e => setData('badge', e.target.value)}
                                        className={inputClass + ' cursor-pointer focus:border-accent'}>
                                        <option value="">— No Badge —</option>
                                        <option value="Best Seller">Best Seller</option>
                                        <option value="New Collection">New Collection</option>
                                        <option value="Premium Choice">Premium Choice</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-admin-border">
                                <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4 text-admin-faint">Optional Enhancements</p>
                                {[
                                    ['Tags', 'tags', tagRef, Hash] as const,
                                    ['Allergens', 'allergens', allergenRef, Apple] as const,
                                    ['Gallery Images', 'additional_images', imageRef, Image] as const,
                                ].map(([label, field, inpRef, Icon], i) => (
                                    <div key={i} className="rounded-xl px-5 py-4 flex items-start gap-4 mb-3 bg-accent/10 border border-accent/20">
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(201,168,76,0.15)] text-primary">
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-xs font-bold tracking-[0.08em] uppercase text-foreground">{label}</span>
                                                <span className="text-[10px] font-semibold text-admin-faint">Optional</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                                                {csv((ref.current as any)[field]).length === 0 && (
                                                    <span className="text-[10px] italic text-admin-faint">None added yet</span>
                                                )}
                                                {csv((ref.current as any)[field]).map((v, j) => (
                                                    <span key={j} className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[6px] text-[10px] font-bold max-w-full bg-accent/12 border border-accent/25 text-[#5b4600]">
                                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">{v}</span>
                                                        <button type="button" onClick={() => rm(field, j)}
                                                            className="border-none bg-transparent p-0 cursor-pointer leading-none hover:opacity-60 shrink-0 text-[13px] text-[#5b4600]">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-1.5">
                                                <input ref={inpRef} type="text" onKeyDown={onEnter(field, inpRef)}
                                                    placeholder={`e.g. ${label === 'Gallery Images' ? '/images/1.png' : label === 'Allergens' ? 'Nuts' : 'Pistachio'}`}
                                                    className={inputClass + ' text-xs flex-1 min-w-0 focus:border-accent'} />
                                                <button type="button" onClick={() => act(field, inpRef.current)}
                                                    className="px-4 py-[11px] rounded-xl border-none text-xs font-bold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap transition-colors duration-200 bg-primary text-white hover:bg-[#5b4600]">
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2.5 mt-7 pt-5 border-t border-admin-border">
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="px-[22px] py-[11px] rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit transition-all duration-200 border-[1.5px] border-admin-border text-admin-muted hover:bg-[#f7f5f0]">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex items-center gap-2 px-[26px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit transition-colors duration-200 disabled:cursor-not-allowed bg-primary hover:bg-[#5b4600] shadow-[0_2px_12px_rgba(117,91,0,0.18)] disabled:opacity-70">
                                    {processing && <Loader2 size={14} className="animate-spin" />}
                                    {data.id ? 'Save Changes' : 'Create Product'}
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
                                <h3 className="font-serif text-xl font-bold m-0 mb-2 text-foreground">Delete Product?</h3>
                                <p className="text-sm leading-relaxed m-0 text-admin-muted">
                                    <strong className="text-foreground">"{toDelete.title}"</strong> will be permanently removed. This cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-5 border-t border-admin-border">
                            <button onClick={() => setToDelete(null)}
                                className="px-5 py-2.5 rounded-xl bg-white text-xs font-bold tracking-[0.1em] uppercase cursor-pointer font-inherit border-[1.5px] border-admin-border text-admin-muted">Cancel</button>
                            <button onClick={handleDelete} disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 border-none rounded-xl text-xs font-bold tracking-[0.1em] uppercase text-white font-inherit disabled:cursor-not-allowed bg-red-600 disabled:opacity-70">
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
