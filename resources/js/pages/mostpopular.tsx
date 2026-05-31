import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Newsletter from '@/components/Newsletter';
import PopularProductGrid from '@/components/PopularProductGrid';
import Footer from '@/components/Footer';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

export default function MostPopular({products}: {products: Product[]}) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('most_popular.page_title')} />
            <Header />
            <div className="text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background font-body-md antialiased">
                <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-16 pt-32 text-center">
                    <h1 className="text-display-lg text-on-background mb-4 font-display-lg text-[36px] md:text-[48px] leading-tight">
                        {t('most_popular.title')}{' '}
                        <span role="img" aria-label="heart red">
                            ❤️
                        </span>
                    </h1>

                    <div className="mb-6 flex items-center justify-center">
                        <div className="h-[1px] w-16 bg-primary/30"></div>
                        <span className="mx-4 text-sm text-primary">⬥</span>
                        <div className="h-[1px] w-16 bg-primary/30"></div>
                    </div>

                    <p className="text-body-lg text-on-surface-variant mx-auto max-w-2xl font-body-lg leading-relaxed">
                        {t('most_popular.subtitle')}
                    </p>
                </section>

                <main className="pb-24">
                    <PopularProductGrid products={products} />
                </main>
            </div>
            <Newsletter />
            <Footer />
        </>
    );

}
