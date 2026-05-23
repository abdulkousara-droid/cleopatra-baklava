import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Package, MessageSquare, Star, Tag, Settings as SettingsIcon, Search, Trash2, Edit, Plus, X, LogOut, Globe, Loader2, Sparkles, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

interface Category { id: number; name: string; }
interface Product {
    id: number; title: string; price: number; category_id: number;
    badge: string | null; description: string; image: string;
    additional_images: string[] | null; tags: string[] | null;
    reviews_count: number; rating_score: number; category?: Category;
}
interface Props {
    products: Product[]; categories: Category[];
    stats: { total_products: number; total_reviews: number; avg_rating: number; total_categories: number; };
    flash?: { success?: string; };
}

// ─── Design Tokens ───────────────────────────
const c = {
    bg: '#f7f5f0',
    surface: '#ffffff',
    border: '#e8e2d6',
    borderHover: '#c9a84c',
    dark: '#1e1b14',
    muted: '#8a7d6a',
    gold: '#c9a84c',
    goldDark: '#755b00',
    goldLight: 'rgba(201,168,76,0.10)',
    danger: '#dc2626',
    dangerLight: 'rgba(220,38,38,0.08)',
    nav: '#1a1712',
    text: '#1e1b14',
    textMuted: '#8a7d6a',
    textFaint: '#b5a898',
};

// Design tokens as CSS custom properties for Tailwind usage
const tokenClasses = {
    bg: 'bg-[#f7f5f0]',
    surface: 'bg-white',
    border: 'border-[#e8e2d6]',
    nav: 'bg-[#1a1712]',
    goldDark: 'bg-[#755b00]',
    textMuted: 'text-[#8a7d6a]',
    textFaint: 'text-[#b5a898]',
    dark: 'text-[#1e1b14]',
    danger: 'bg-[#dc2626]',
};

// ─── Reusable Components ──────────────────────
const Stat = ({ icon: Icon, label, value, suffix, href }: { icon: any; label: string; value: string | number; suffix?: string; href?: string }) => {
    const inner = (
        <div className="flex items-center gap-[18px]">
            <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: c.goldLight, color: c.goldDark }}>
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: c.textFaint }}>{label}</span>
                    {href && <ArrowUpRight size={13} style={{ color: c.textFaint }} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="text-[28px] font-extrabold leading-none flex items-baseline gap-1 mt-[5px]" style={{ color: c.dark }}>
                    {value}
                    {suffix && <span className="text-base" style={{ color: c.gold }}>{suffix}</span>}
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href}
                className="group bg-white rounded-xl px-6 py-[22px] block no-underline transition-[border-color,box-shadow] duration-200"
                style={{ border: `1px solid ${c.border}`, color: 'inherit' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.gold; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px rgba(201,168,76,0.08)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                {inner}
            </Link>
        );
    }

    return (
        <div
            className="bg-white rounded-xl px-6 py-[22px] flex items-center gap-[18px] cursor-default transition-[border-color,box-shadow] duration-200"
            style={{ border: `1px solid ${c.border}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = c.gold; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px rgba(201,168,76,0.08)`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = c.border; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
            {inner}
        </div>
    );
};

const Pill = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
    <span className="inline-block px-2.5 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase"
        style={{
            background: gold ? c.goldLight : '#f0ece4',
            border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : '#e2dac8'}`,
            color: gold ? c.goldDark : c.textMuted,
        }}>
        {children}
    </span>
);

export default function Dashboard({ products = [], categories = [], stats, flash }: Props) {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Product | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
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
        const opts = { onSuccess: () => { setModalOpen(false); reset(); } };
        data.id ? put(`/admin/products/${data.id}`, opts) : post('/admin/products', opts);
    };
    const handleDelete = () => {
        if (!toDelete) {return;}

        destroy(`/admin/products/${toDelete.id}`, { onSuccess: () => { setToDelete(null); showToast('Product deleted.'); } });
    };

    const filtered = products.filter(p =>
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
        (catFilter === 'All' || p.category_id === parseInt(catFilter))
    );

    const err = (msg?: string) => msg ? <p className="mt-1 text-xs font-semibold" style={{ color: c.danger }}>{msg}</p> : null;

    return (
        <>
            <Head><title>Admin Dashboard — Cleopatra Baklava</title></Head>
            <style>{`
                body { margin: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                ::placeholder { color: #b5a898; }
            `}</style>

            <div className="min-h-screen" style={{ background: c.bg }}>

                {/* ────── TOPBAR ────── */}
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
                        <Link href="/admin/categories" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <Tag size={15} /> Categories
                        </Link>
                        <Link href="/admin/reviews" className="flex items-center gap-[7px] text-[#7a6e5e] no-underline text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 hover:no-underline"
                            onMouseEnter={e => (e.currentTarget.style.color = c.gold)} onMouseLeave={e => (e.currentTarget.style.color = '#7a6e5e')}>
                            <MessageSquare size={15} /> Reviews
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

                {/* ────── PAGE ────── */}
                <div className="max-w-[1300px] mx-auto px-8 py-9 pb-20">

                    {/* Page Title */}
                    <div className="mb-8">
                        <h2 className="font-serif text-[32px] font-bold m-0 leading-tight" style={{ color: c.dark }}>Product Catalogue</h2>
                        <p className="text-sm mt-1.5" style={{ color: c.textMuted }}>Manage your full range of artisanal baklava products in real-time.</p>
                    </div>

                    {/* ── STATS ── */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <Stat icon={Package} label="Products" value={stats.total_products} />
                        <Stat icon={Tag} label="Categories" value={stats.total_categories} href="/admin/categories" />
                        <Stat icon={MessageSquare} label="Reviews" value={stats.total_reviews} href="/admin/reviews" />
                        <Stat icon={Star} label="Avg Rating" value={stats.avg_rating} suffix="★" href="/admin/reviews" />
                    </div>

                    {/* ── TOOLBAR ── */}
                    <div className="bg-white rounded-xl px-5 py-4 flex items-center gap-3 mb-5 flex-wrap" style={{ border: `1px solid ${c.border}` }}>
                        {/* Search */}
                        <div className="relative flex-[1_1_260px] min-w-[200px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.textFaint }} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                                className="block w-full box-border px-3 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit pl-[38px]"
                                style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                        </div>

                        {/* Category */}
                        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                            className="block w-auto min-w-[170px] box-border px-3 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                            style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                            onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                            <option value="All">All Categories</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>

                        {/* Add button */}
                        <button onClick={openAdd}
                            className="flex items-center gap-2 px-[22px] py-[11px] border-none rounded-xl text-xs font-bold tracking-[0.12em] uppercase cursor-pointer whitespace-nowrap text-white transition-colors duration-200"
                            style={{ background: c.goldDark, boxShadow: '0 2px 10px rgba(117,91,0,0.18)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#5b4600')} onMouseLeave={e => (e.currentTarget.style.background = c.goldDark)}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    {/* ── TABLE ── */}
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

                                        {/* Product cell */}
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

                                        {/* Category */}
                                        <td className="px-5 py-4"><Pill>{p.category?.name ?? 'Unset'}</Pill></td>

                                        {/* Price */}
                                        <td className="px-5 py-4 font-bold text-base whitespace-nowrap" style={{ color: c.dark }}>
                                            €{p.price.toFixed(2)}
                                        </td>

                                        {/* Badges & Tags */}
                                        <td className="px-5 py-4 max-w-[220px]">
                                            <div className="flex flex-col gap-1.5">
                                                {p.badge && <Pill gold>{p.badge}</Pill>}
                                                <div className="flex flex-wrap gap-1">
                                                    {(p.tags ?? []).slice(0, 3).map((t, i) => <Pill key={i}>{t}</Pill>)}
                                                    {(p.tags ?? []).length > 3 && <span className="text-[11px] leading-[22px]" style={{ color: c.textFaint }}>+{(p.tags ?? []).length - 3}</span>}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rating */}
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-base leading-none" style={{ color: c.gold }}>★</span>
                                                <span className="font-bold text-[15px]" style={{ color: c.dark }}>{p.rating_score.toFixed(1)}</span>
                                                <span className="text-xs" style={{ color: c.textFaint }}>({p.reviews_count})</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
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
                </div>
            </div>

            {/* ────── CREATE / EDIT MODAL ────── */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div onClick={() => setModalOpen(false)} className="fixed inset-0" style={{ background: 'rgba(14,12,8,0.72)', backdropFilter: 'blur(6px)' }} />
                    <div className="relative z-10 w-full max-w-[700px] max-h-[92vh] rounded-2xl overflow-hidden flex flex-col" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 40px 100px rgba(0,0,0,0.18)' }}>
                        {/* Header */}
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

                        {/* Body */}
                        <form className="overflow-y-auto flex-1 p-7" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Product Title *</label>
                                    <input type="text" required value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Cleopatra's Pistachio Nest"
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.title)}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Category *</label>
                                    <select required value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {err(errors.category_id)}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Price (€) *</label>
                                    <input type="number" step="0.01" min="0" required value={data.price} onChange={e => setData('price', e.target.value)} placeholder="24.50"
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.price)}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Primary Image URL *</label>
                                    <input type="text" required value={data.image} onChange={e => setData('image', e.target.value)} placeholder="/images/product.png or https://..."
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.image)}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Description *</label>
                                    <textarea required rows={3} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe ingredients, heritage, texture..."
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit resize-none"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                    {err(errors.description)}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Badge <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(optional)</span></label>
                                    <select value={data.badge} onChange={e => setData('badge', e.target.value)}
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit cursor-pointer"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)}>
                                        <option value="">— No Badge —</option>
                                        <option value="Best Seller">Best Seller</option>
                                        <option value="New Collection">New Collection</option>
                                        <option value="Premium Choice">Premium Choice</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Tags <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated)</span></label>
                                    <input type="text" value={data.tags} onChange={e => setData('tags', e.target.value)} placeholder="Pistachio, Honey, Rosewater"
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Allergens <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated)</span></label>
                                    <input type="text" value={data.allergens} onChange={e => setData('allergens', e.target.value)} placeholder="Nuts, Gluten, Dairy"
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]" style={{ color: c.textMuted }}>Gallery Images <span className="font-normal normal-case tracking-normal" style={{ color: c.textFaint }}>(comma separated URLs)</span></label>
                                    <input type="text" value={data.additional_images} onChange={e => setData('additional_images', e.target.value)} placeholder="/images/1.png, /images/2.png"
                                        className="block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit"
                                        style={{ border: `1.5px solid ${c.border}`, color: c.text, background: c.bg }}
                                        onFocus={e => (e.target.style.borderColor = c.gold)} onBlur={e => (e.target.style.borderColor = c.border)} />
                                </div>
                            </div>

                            {/* Footer */}
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

            {/* ────── DELETE MODAL ────── */}
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

            {/* ────── TOAST ────── */}
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
