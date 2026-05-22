import { Head } from '@inertiajs/react';
import { Gem } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import ProductCard from '@/components/productcard';
import StickyCartBar from '@/components/stickycartbar';
import type { Product } from '@/types';

const CATEGORIES = ['All', 'Baklava', 'Kunafa', 'Mamoul', 'Gift Boxes'];

export default function Shop({ products, categories }: { products: Product[]; categories:any }) {
    console.log('shop categories', categories);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showStickyCart, setShowStickyCart] = useState(false);

    // Monitor scroll height to trigger the fixed checkout overlay
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

    // Filter products based on selected tab state
    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter((p) => p.category === activeCategory);

    console.log('Shop', products);

    return (
        <>
            <Head title="Shop Collection" />
            <Header />
            <div className="text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed bg-background font-body-md antialiased">
                <main className="pt-32 pb-24">
                    {/* Hero Title Section */}
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-16 text-center">
                        <h1 className="text-display-lg text-on-surface mb-4 font-display-lg text-[36px] md:text-[48px] leading-tight">
                            Shop Our Collection
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
                            Handcrafted masterpieces from Barcelona, blending
                            centuries-old traditions with modern European
                            refinement.
                        </p>
                    </section>

                    {/* Filter Navigation Bar */}
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto">
                        <div className="mb-12 flex justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide">
                            <div className="bg-surface-container-low border-outline-variant/20 flex items-center space-x-2 rounded-full border p-1.5 whitespace-nowrap">
                                {categories.map((cat: any) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.name)}
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

                        {/* Product Grid Layout */}
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

                {/* Persistent Bottom Sticky Basket Action View */}
                <StickyCartBar isVisible={showStickyCart} />
            </div>
        </>
    );
}
