import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import {
    Package, MessageSquare, Star, Tag, Settings as SettingsIcon,
    Search, Trash2, Edit, Plus, X, LogOut, Globe, Loader2, Sparkles,
    AlertTriangle, CheckCircle, ArrowUpRight, ThumbsUp, ThumbsDown,
    Save, Eye,
} from 'lucide-react';

interface Category { id: number; name: string; products_count?: number; }
interface Product {
    id: number; title: string; price: number; category_id: number;
    badge: string | null; description: string; image: string;
    additional_images: string[] | null; tags: string[] | null;
    allergens: string[] | null;
    reviews_count: number; rating_score: number; category?: Category;
}
interface Review {
    id: number; product_id: number; name: string; email: string;
    rating: number; comment: string; approved: boolean;
    created_at: string; product: { id: number; title: string; };
}
interface FeatureItem { icon: string; title: string; text: string; }
interface Props {
    products: Product[]; categories: Category[]; reviews: Review[];
    settings: Record<string, string>;
    stats: { total_products: number; total_reviews: number; avg_rating: number; total_categories: number; };
    flash?: { success?: string; };
}

const c = {
    bg: '#f7f5f0', surface: '#ffffff', border: '#e8e2d6', borderHover: '#c9a84c',
    dark: '#1e1b14', muted: '#8a7d6a', gold: '#c9a84c', goldDark: '#755b00',
    goldLight: 'rgba(201,168,76,0.10)', danger: '#dc2626', dangerLight: 'rgba(220,38,38,0.08)',
    nav: '#1a1712', text: '#1e1b14', textMuted: '#8a7d6a', textFaint: '#b5a898',
    green: '#16a34a', greenLight: 'rgba(22,163,74,0.10)',
};

type Tab = 'products' | 'categories' | 'reviews' | 'settings';

const inputClass = "block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit";
const inputStyle = { border: `1.5px solid ${c.border}`, color: c.text, background: c.bg };
const labelClass = "block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]";

function Pill({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
    return (
        <span className="inline-block px-2.5 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase"
            style={{
                background: gold ? c.goldLight : '#f0ece4',
                border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : '#e2dac8'}`,
                color: gold ? c.goldDark : c.textMuted,
            }}>
            {children}
        </span>
    );
}

function Stat({ icon: Icon, label, value, suffix }: { icon: any; label: string; value: string | number; suffix?: string }) {
    return (
        <div className="bg-white rounded-xl px-6 py-[22px] flex items-center gap-[18px]"
            style={{ border: `1px solid ${c.border}` }}>
            <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: c.goldLight, color: c.goldDark }}>
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: c.textFaint }}>{label}</span>
                <div className="text-[28px] font-extrabold leading-none flex items-baseline gap-1 mt-[5px]" style={{ color: c.dark }}>
                    {value}
                    {suffix && <span className="text-base" style={{ color: c.gold }}>{suffix}</span>}
                </div>
            </div>
        </div>
    );
}

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

export default function AdminIndex({ products = [], categories = [], reviews = [], settings = {}, stats, flash }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const tabs: { key: Tab; label: string; icon: any }[] = [
        { key: 'products', label: 'Products', icon: Package },
        { key: 'categories', label: 'Categories', icon: Tag },
        { key: 'reviews', label: 'Reviews', icon: MessageSquare },
        { key: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    const err = (msg?: string) => msg ? <p className="mt-1 text-xs font-semibold" style={{ color: c.danger }}>{msg}</p> : null;

    return (
        <>
            <Head><title>Admin — Cleopatra Baklava</title></Head>
            <style>{`
                body { margin: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
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

                    <div className="flex items-center gap-1">
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <button key={key} onClick={() => setActiveTab(key)}
                                className="flex items-center gap-[7px] px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase cursor-pointer border-none rounded-lg transition-all duration-200 font-inherit"
                                style={{
                                    background: activeTab === key ? c.goldLight : 'transparent',
                                    color: activeTab === key ? c.goldDark : '#7a6e5e',
                                }}>
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                        <Link href="/"
                            className="flex items-center gap-[7px] px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase no-underline rounded-lg transition-colors duration-200"
                            style={{ color: '#7a6e5e' }}
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)}
                            onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
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

                <div className="max-w-[1300px] mx-auto px-8 py-9 pb-20">
                    {activeTab === 'products' && <ProductsSection products={products} categories={categories} stats={stats} err={err} showToast={showToast} />}
                    {activeTab === 'categories' && <CategoriesSection categories={categories} err={err} showToast={showToast} />}
                    {activeTab === 'reviews' && <ReviewsSection reviews={reviews} showToast={showToast} />}
                    {activeTab === 'settings' && <SettingsSection settings={settings} err={err} showToast={showToast} />}
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

// ─── Products Section ──────────────────────────
function ProductsSection({ products, categories, stats, err, showToast }: {
    products: Product[]; categories: Category[]; stats: Props['stats'];
    err: (msg?: string) => React.ReactNode; showToast: (msg: string) => void;
}) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Product | null>(null);

    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        title: '', price: '', category_id: '',
        badge: '', description: '', image: '', tags: '', allergens: '', additional_images: '',
    });

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
            onSuccess: () => { setModalOpen(false); reset(); },
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        router.post('/admin', { _action: 'delete-product', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast('Product deleted.'); },
        });
    };

    const filtered = products.filter(p =>
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
        (catFilter === 'All' || p.category_id === parseInt(catFilter))
    );

    return (
        <>
            <div className="mb-8">
                <h2 className="font-serif text-[32px] font-bold m-0 leading-tight" style={{ color: c.dark }}>Product Catalogue</h2>
                <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Manage your full range of artisanal baklava products in real-time.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <Stat icon={Package} label="Products" value={stats.total_products} />
                <Stat icon={Tag} label="Categories" value={stats.total_categories} />
                <Stat icon={MessageSquare} label="Reviews" value={stats.total_reviews} />
                <Stat icon={Star} label="Avg Rating" value={stats.avg_rating} suffix="★" />
            </div>

            <div className="bg-white rounded-xl px-5 py-4 flex items-center gap-3 mb-5 flex-wrap" style={{ border: `1px solid ${c.border}` }}>
                <div className="relative flex-[1_1_260px] min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.textFaint }} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                        className="block w-full box-border px-3 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit pl-[38px]"
                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    className="block w-auto min-w-[170px] box-border px-3 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                    style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                    onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-[22px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap text-white transition-colors duration-200"
                    style={{ background: c.goldDark, boxShadow: '0 2px 10px rgba(117,91,0,0.18)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                            {['Product', 'Category', 'Price', 'Badge & Tags', 'Rating', ''].map((h, i) => (
                                <th key={i} className="px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap" style={{ textAlign: i === 5 ? 'right' : 'left', color: c.textFaint }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-14 text-center text-sm" style={{ color: c.textFaint }}>No products found.</td></tr>
                        )}
                        {filtered.map((p, idx) => (
                            <tr key={p.id} className="transition-[background] duration-150" style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${c.border}` : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#fdf9f2')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-[52px] h-[52px] rounded-xl overflow-hidden shrink-0 bg-[#f0ece4]" style={{ border: `1px solid ${c.border}` }}>
                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover"
                                                onError={e => { (e.target as HTMLImageElement).src = '/logo.svg'; }} />
                                        </div>
                                        <div>
                                            <div className="font-serif font-semibold text-[15px] mb-0.5" style={{ color: c.dark }}>{p.title}</div>
                                            <div className="text-[11px] font-semibold tracking-[0.08em]" style={{ color: c.textFaint }}># {p.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4"><Pill>{p.category?.name ?? 'Unset'}</Pill></td>
                                <td className="px-5 py-4 font-bold text-base whitespace-nowrap" style={{ color: c.dark }}>€{p.price.toFixed(2)}</td>
                                <td className="px-5 py-4 max-w-[220px]">
                                    <div className="flex flex-col gap-1.5">
                                        {p.badge && <Pill gold>{p.badge}</Pill>}
                                        <div className="flex flex-wrap gap-1">
                                            {(p.tags ?? []).slice(0, 3).map((t, i) => <Pill key={i}>{t}</Pill>)}
                                            {(p.tags ?? []).length > 3 && <span className="text-[11px] leading-[22px]" style={{ color: c.textFaint }}>+{(p.tags ?? []).length - 3}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-base leading-none" style={{ color: c.gold }}>★</span>
                                        <span className="font-bold text-[15px]" style={{ color: c.dark }}>{p.rating_score.toFixed(1)}</span>
                                        <span className="text-xs" style={{ color: c.textFaint }}>({p.reviews_count})</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => openEdit(p)} title="Edit"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white cursor-pointer transition-all duration-200"
                                            style={{ border: `1.5px solid ${c.border}`, color: c.textMuted }}
                                            onMouseEnter={e => { (e.currentTarget as any).style.borderColor = c.goldDark; (e.currentTarget as any).style.color = c.goldDark; (e.currentTarget as any).style.background = '#fdf9f2'; }}
                                            onMouseLeave={e => { (e.currentTarget as any).style.borderColor = c.border; (e.currentTarget as any).style.color = c.textMuted; (e.currentTarget as any).style.background = '#fff'; }}>
                                            <Edit size={15} />
                                        </button>
                                        <button onClick={() => setToDelete(p)} title="Delete"
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

            {/* CREATE / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setModalOpen(false)} className="fixed inset-0" style={{ background: 'rgba(14,12,8,0.72)', backdropFilter: 'blur(6px)' }} />
                    <div className="relative z-10 w-full max-w-[700px] max-h-[92vh] rounded-2xl overflow-hidden flex flex-col" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
                        <div className="flex items-center justify-between shrink-0 px-7 py-6 bg-[#faf8f4]" style={{ borderBottom: `1px solid ${c.border}` }}>
                            <div className="flex items-center gap-2.5">
                                <Sparkles size={20} style={{ color: c.gold }} />
                                <h3 className="font-serif text-[22px] font-bold m-0" style={{ color: c.dark }}>{data.id ? 'Edit Product' : 'Add New Product'}</h3>
                            </div>
                            <button onClick={() => setModalOpen(false)}
                                className="w-[34px] h-[34px] flex items-center justify-center border-none rounded-full bg-transparent cursor-pointer transition-all duration-200"
                                style={{ color: c.textMuted }}
                                onMouseEnter={e => { (e.currentTarget as any).style.background = '#e8e2d6'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; }}>
                                <X size={19} />
                            </button>
                        </div>
                        <form className="overflow-y-auto flex-1 p-7" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className={labelClass} style={{ color: c.textMuted }}>Product Title *</label>
                                    <input type="text" required value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Cleopatra's Pistachio Nest"
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.title)}
                                </div>
                                <div>
                                    <label className={labelClass} style={{ color: c.textMuted }}>Category *</label>
                                    <select required value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                                        style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {err(errors.category_id)}
                                </div>
                                <div>
                                    <label className={labelClass} style={{ color: c.textMuted }}>Price (€) *</label>
                                    <input type="number" step="0.01" min="0" required value={data.price} onChange={e => setData('price', e.target.value)} placeholder="24.50"
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.price)}
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass} style={{ color: c.textMuted }}>Primary Image URL *</label>
                                    <input type="text" required value={data.image} onChange={e => setData('image', e.target.value)} placeholder="/images/product.png or https://..."
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.image)}
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass} style={{ color: c.textMuted }}>Description *</label>
                                    <textarea required rows={3} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe ingredients, heritage, texture..."
                                        className={inputClass + ' resize-none'} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.description)}
                                </div>
                                <div>
                                    <label className={labelClass} style={{ color: c.textMuted }}>Badge <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(optional)</span></label>
                                    <select value={data.badge} onChange={e => setData('badge', e.target.value)}
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                                        style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                                        <option value="">— No Badge —</option>
                                        <option value="Best Seller">Best Seller</option>
                                        <option value="New Collection">New Collection</option>
                                        <option value="Premium Choice">Premium Choice</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass} style={{ color: c.textMuted }}>Tags <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated)</span></label>
                                    <input type="text" value={data.tags} onChange={e => setData('tags', e.target.value)} placeholder="Pistachio, Honey, Rosewater"
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass} style={{ color: c.textMuted }}>Allergens <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated)</span></label>
                                    <input type="text" value={data.allergens} onChange={e => setData('allergens', e.target.value)} placeholder="Nuts, Gluten, Dairy"
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass} style={{ color: c.textMuted }}>Gallery Images <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated URLs)</span></label>
                                    <input type="text" value={data.additional_images} onChange={e => setData('additional_images', e.target.value)} placeholder="/images/1.png, /images/2.png"
                                        className={inputClass} style={inputStyle}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>
                            </div>
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
                                    {data.id ? 'Save Changes' : 'Create Product'}
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
                                <h3 className="font-serif text-xl font-bold m-0 mb-2" style={{ color: c.dark }}>Delete Product?</h3>
                                <p className="text-sm leading-relaxed m-0" style={{ color: c.textMuted }}>
                                    <strong style={{ color: c.dark }}>"{toDelete.title}"</strong> will be permanently removed. This cannot be undone.
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

// ─── Categories Section ────────────────────────
function CategoriesSection({ categories, err, showToast }: {
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
            onSuccess: () => { setModalOpen(false); reset(); setEditing(null); },
        });
    };
    const handleDelete = () => {
        if (!toDelete) return;
        router.post('/admin', { _action: 'delete-category', id: toDelete.id }, {
            onSuccess: () => { setToDelete(null); showToast('Category deleted.'); },
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
        </>
    );
}

// ─── Reviews Section ──────────────────────────
function ReviewsSection({ reviews, showToast }: {
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
        </>
    );
}

// ─── Settings Section ─────────────────────────
function SettingsSection({ settings, err, showToast }: {
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
            onSuccess: () => { clearErrors(); },
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
