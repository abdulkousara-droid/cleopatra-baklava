import React from 'react';
import Header from '@/components/header';
import Newsletter from '@/components/newsletter';
import PopularProductGrid from '@/components/popularproductgrid';
import Footer from '@/components/footer';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

export default function MostPopular({products}: {products: Product[]}) {
    console.log('MostPopular', products);

    return (
        <>
            <Head title="Most Popular" />
            <Header />
            <div className="text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background font-body-md antialiased">
                {/* Hero Title Section */}
                <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-16 pt-32 text-center">
                    <h1 className="text-display-lg text-on-background mb-4 font-display-lg text-[36px] md:text-[48px] leading-tight">
                        Most Popular{' '}
                        <span role="img" aria-label="heart red">
                            ❤️
                        </span>
                    </h1>

                    {/* Diamond Header Line Accent */}
                    <div className="mb-6 flex items-center justify-center">
                        <div className="h-[1px] w-16 bg-primary/30"></div>
                        <span className="mx-4 text-sm text-primary">⬥</span>
                        <div className="h-[1px] w-16 bg-primary/30"></div>
                    </div>

                    <p className="text-body-lg text-on-surface-variant mx-auto max-w-2xl font-body-lg leading-relaxed">
                        Discover Barcelona's finest artisanal selection. Each
                        piece is a masterpiece of heritage, crafted with premium
                        Mediterranean ingredients and traditional Arabic
                        techniques perfected over generations.
                    </p>
                </section>

                {/* Main Grid View */}
                <main className="pb-24">
                    <PopularProductGrid products={products} />
                </main>
            </div>
            <Newsletter />
            <Footer />
        </>
    );

}
