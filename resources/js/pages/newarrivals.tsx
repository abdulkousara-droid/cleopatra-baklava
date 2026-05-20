import React, { useState } from 'react';
import Newsletter from '@/components/newsletter';
import ProductGrid from '@/components/productgrid';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Star } from 'lucide-react';


export default function NewArrivals() {
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1);
    };

    return (
        <>
            <Header />
            <div className="text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background">
                {/* Structural Header Wrapper */}
                <header className="max-w-container-max px-margin-desktop mx-auto mb-16 pt-32 text-center">
                    <span className="mb-3 block text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Fresh From The Bakery
                    </span>
                    <h1 className="font-display-lg text-display-lg text-on-background mb-4 flex items-center justify-center gap-2">
                        New Arrivals{' '}
                        <span role="img" aria-label="shining star">
                            🌟
                        </span>
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto max-w-2xl leading-relaxed">
                        Step into our Barcelona boutique's newest seasonal
                        collection. Discover artisanal creations where
                        Mediterranean zest meets the ancient traditions of
                        Arabic pastry craftsmanship.
                    </p>
                </header>

                {/* Main Content Sections */}
                <main>
                    <ProductGrid onAddToCart={handleAddToCart} />

                    {/* Divider Graphic*/}
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
