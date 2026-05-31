import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, router, Link } from '@inertiajs/react';
import {
    Package, Tag, MessageSquare, Star, Settings as SettingsIcon,
    Send, LogOut, Globe, CheckCircle,
} from 'lucide-react';
import { Pill } from './shared';
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
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };
    React.useEffect(() => { if (flash?.success) showToast(flash.success); }, [flash]);

    const tabs: { key: Tab; label: string; icon: React.ComponentType<{ size?: number | string }> }[] = [
        { key: 'products', label: t('admin.products'), icon: Package },
        { key: 'categories', label: t('admin.categories'), icon: Tag },
        { key: 'reviews', label: t('admin.reviews'), icon: MessageSquare },
        { key: 'settings', label: t('admin.settings'), icon: SettingsIcon },
        { key: 'campaign', label: t('admin.campaign'), icon: Send },
    ];

    const err = (msg?: string) => msg ? <p className="mt-1 text-xs font-semibold text-red-600">{msg}</p> : null;

    return (
        <>
            <Head title={t('admin_title') + ' — ' + t('site_name')} />
            <style>{`
                body { margin: 0; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                ::placeholder { color: #b5a898; }
            `}</style>

            <div className="min-h-screen bg-admin-bg">
                <nav className="sticky top-0 z-[100] flex items-center justify-between px-8 h-16 bg-admin-nav border-b border-accent/12 shadow-[0_1px_16px_rgba(0,0,0,0.25)]">
                    <div className="flex items-center gap-3.5">
                        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
                    <div>
                        <div className="text-[#f5f0e8] font-serif text-lg font-semibold leading-tight">
                            {t('site_name')} <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase align-middle text-accent">{t('admin_title')}</span>
                        </div>
                        <div className="text-[#5a5040] text-[10px] tracking-[0.18em] uppercase mt-0.5 font-semibold">{t('admin.admin_workspace')}</div>
                    </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {tabs.map(({ key, label, icon: Icon }) => (
                            <button key={key} onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-[7px] px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase cursor-pointer border-none rounded-lg transition-all duration-200 font-inherit ${
                                    activeTab === key ? 'bg-accent/10 text-primary' : 'bg-transparent text-[#7a6e5e]'
                                }`}>
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                        <Link href="/"
                            className="flex items-center gap-[7px] px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase no-underline rounded-lg transition-colors duration-200 text-[#7a6e5e] hover:text-accent">
                            <Globe size={15} /> {t('admin.shopfront')}
                        </Link>
                        <button onClick={() => router.post('/admin/logout')}
                            className="flex items-center gap-[7px] text-[#f87171] border border-red-600/20 rounded-lg px-4 py-2 text-xs font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 bg-red-600/10 hover:bg-red-600/20">
                            <LogOut size={14} /> {t('admin.sign_out')}
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
                <div className="fixed bottom-7 right-7 z-[300] flex items-center gap-3 rounded-xl px-[22px] py-4 bg-foreground border border-accent/25 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    <span className="text-sm font-semibold text-[#f5f0e8]">{toast}</span>
                </div>
            )}
        </>
    );
}
