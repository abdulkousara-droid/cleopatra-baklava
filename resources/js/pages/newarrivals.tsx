import React from 'react';
import { useTranslation } from 'react-i18next';
import Newsletter from '@/components/Newsletter';
import ProductGrid from '@/components/ProductGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star } from 'lucide-react';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

export default function NewArrivals({products}: {products: Product[]}) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('new_arrivals.page_title')} />
            <Header />
            <div className="text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background font-body-md">
                <header className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-16 pt-32 text-center">
                    <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        {t('new_arrivals.eyebrow')}
                    </span>
                    <h1 className="text-display-lg text-on-background mb-4 flex items-center justify-center gap-2 font-display-lg text-[36px] md:text-[48px] leading-tight">
                        {t('new_arrivals.title')}{' '}
                        <span role="img" aria-label="shining star">
                            🌟
                        </span>
                    </h1>
                    <p className="text-body-lg text-on-surface-variant mx-auto max-w-2xl font-body-lg leading-relaxed">
                        {t('new_arrivals.subtitle')}
                    </p>
                </header>

                <main>
                    <ProductGrid products={products} />

                    <div className="my-16 flex items-center justify-center gap-4">
                        <div className="h-px w-100 bg-[#c8a45d]" />
                        <span className="material-symbols-outlined text-[#c8a45d]">
                            <Star />
                        </span>
                        <div className="h-px w-100 bg-[#c8a45d]" />
                    </div>

                    <Newsletter />
                    <Footer />
                </main>
            </div>
        </>
    );
}
