import { useTranslation } from 'react-i18next';
import { Head, router } from '@inertiajs/react';
import { Gem } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import StickyCartBar from '@/components/StickyCartBar';
import type { Product, Category } from '@/types';

export default function Shop({ products, categories, initialCategory = 'All' }: { products: Product[]; categories: Category[]; initialCategory?: string }) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [showStickyCart, setShowStickyCart] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowStickyCart(true);
            } else {
                setShowStickyCart(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter((p) => p.category === activeCategory);

    return (
        <>
            <Head title={t('shop.page_title')} />
            <Header />
            <div className="text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed bg-background font-body-md antialiased">
                <main className="pt-32 pb-24">
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-16 text-center">
                        <h1 className="text-display-lg text-on-surface mb-4 font-display-lg text-[36px] md:text-[48px] leading-tight">
                            {t('shop.title')}
                        </h1>

                        <div className="mb-6 flex items-center justify-center">
                            <div className="h-[1px] w-16 bg-primary/30"></div>
                            <span className="mx-4 text-sm text-primary">
                                <Gem />
                            </span>
                            <div className="h-[1px] w-16 bg-primary/30"></div>
                        </div>

                        <div className="geometric-divider mx-auto mb-8 w-48"></div>
                        <p className="text-body-lg text-on-surface-variant mx-auto max-w-2xl font-body-lg">
                            {t('shop.subtitle')}
                        </p>
                    </section>

                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto">
                        <div className="mb-12 flex justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide">
                            <div className="bg-surface-container-low border-outline-variant/20 flex items-center space-x-2 rounded-full border p-1.5 whitespace-nowrap">
                                <button
                                    onClick={() => {
                                        setActiveCategory('All');
                                        router.get('/shop');
                                    }}
                                    className={`text-label-md cursor-pointer rounded-full px-8 py-2.5 font-label-md transition-all ${
                                        activeCategory === 'All'
                                            ? 'text-on-primary bg-primary shadow-md'
                                            : 'text-on-surface-variant hover:bg-surface-variant'
                                    }`}
                                >
                                    {t('shop.all')}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.name);
                                            router.get(`/shop?category=${encodeURIComponent(cat.name)}`);
                                        }}
                                        className={`text-label-md cursor-pointer rounded-full px-8 py-2.5 font-label-md transition-all ${
                                            activeCategory === cat.name
                                                ? 'text-on-primary bg-primary shadow-md'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid justify-items-center gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                <StickyCartBar isVisible={showStickyCart} />
            </div>
        </>
    );
}
