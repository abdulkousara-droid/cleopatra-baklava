import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import {
    Package, Tag, MessageSquare, Star, Settings as SettingsIcon,
    Send, LogOut, Globe, CheckCircle,
} from 'lucide-react';
import { c, Pill } from './shared';
import ProductsSection from './ProductsSection';
import CategoriesSection from './CategoriesSection';
import ReviewsSection from './ReviewsSection';
import SettingsSection from './SettingsSection';
import CampaignSection from './CampaignSection';

interface Props {
    products: any[]; categories: any[]; reviews: any[];
    settings: Record<string, string>;
    subscriberCount: number;
    stats: { total_products: number; total_reviews: number; avg_rating: number; total_categories: number; };
    flash?: { success?: string; };
}

type Tab = 'products' | 'categories' | 'reviews' | 'settings' | 'campaign';

export default function AdminIndex({ products = [], categories = [], reviews = [], settings = {}, subscriberCount = 0, stats, flash }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const tabs: { key: Tab; label: string; icon: React.ComponentType<{ size?: number | string }> }[] = [
        { key: 'products', label: 'Products', icon: Package },
        { key: 'categories', label: 'Categories', icon: Tag },
        { key: 'reviews', label: 'Reviews', icon: MessageSquare },
        { key: 'settings', label: 'Settings', icon: SettingsIcon },
        { key: 'campaign', label: 'Campaign', icon: Send },
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
                    {activeTab === 'campaign' && <CampaignSection subscriberCount={subscriberCount} err={err} showToast={showToast} />}
                </div>
            </div>

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
