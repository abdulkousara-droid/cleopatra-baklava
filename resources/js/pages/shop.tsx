import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/productcard';
import StickyCartBar from '@/components/stickycartbar';
import Header from '@/components/header';
import { Gem } from 'lucide-react';
import type { products } from '@/types/auth';

const SHOP_PRODUCTS = [
    {
        id: 9,
        title: 'The Signature Pistachio',
        price: 34,
        category: 'Baklava',
        badge: 'Best Seller',
        description: 'Our crown jewel. Layers of hand-stretched phyllo dough filled with premium Antep pistachios and local organic honey.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI2c3WNcm5Mbi8S6fE11yJC21B4uurKolTmvEwohxNHO5SyvrpUp0lcCV2APb2odMrng9glfWc_EovgzjZ8NvVoa7oMGk0etoA4dsXg6KQeWRkfEuwWglmDs_SkoEp1BUdFf7hgssyY3npobonNDcLHji2GUByEsl6u2g5sddaeaZi0swt-yxyg5XWh4PACQZXWPUkDM_JuQ-UcDn79WDb8J71vZhu7yLtZlY1coeQKE7hTWe3tr02jrPxGsacHp5pfpmEwGAJ7vUv',
        tags: ['Pistachio', 'Honey-Glazed']
    },
    {
        id: 10,
        title: 'Rose Water Kunafa',
        price: 28,
        category: 'Kunafa',
        badge: 'New',
        description: 'Warm, aromatic pastry filled with artisanal Akkawi cheese, infused with delicate Damask rose water.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdFRfB7QbF0209oPzIlBaryseFx2Tnwdw8t8BHmipdZb4DRaFht019gDQOaHo4io52KH9Auj14lzNhQ9VskcEQG5zfK0kHKlNHX6MJAA3-nxWfGFek5ZfWHUxcVJkjG7LHUit25Yc3cs5vLVYbKH1jiuotiqnygcHu1uDhlQM7I6asVfw_uNSqXJhcDr8g66epCmSeWMV2aJICrKZFTvCGm6p8-ldhoTgbhdmWV5nSNd_qkY2P5Nysd2NQJ2pYhhiSiZ0bdzUBEKxE',
        tags: ['Cheese', 'Rose Petal']
    },
    {
        id: 11,
        title: 'Royal Gift Box',
        price: 85,
        category: 'Gift Boxes',
        badge: 'Premium Choice',
        description: 'An curated selection of our finest baklava, mamoul, and chocolate dates. Perfect for corporate gifting or grand occasions.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcF6yiyinxtB3xzsOT_xhCfLZHUy6WqFhKgc7y3IDoq7bO6aC3BTA8IbKMlqCuSt64gxXu22ZBT8xFXuG2dG7w2Lh02oJtvSVYx7OiJxsvHeLQqg6Ncv8ZDMWR79Dt7jKoB25SFVxswyOZwdOogXOKiYRXb-YwlfyEurKRPyM0xK6qTe4O1mQqX18VWEe-jar4zgVW-2YBPKPx0wHQi55K8hFuJB4XgMPkd9QXSv7NUNZNG991AmTZ4Juzhbi9CFhXmqKOGNPU49q6',
        tags: ['Assorted', 'Gift Ready'],
        borderAccent: true
    },
    {
        id: 12,
        title: 'Walnut Mamoul',
        price: 22,
        category: 'Mamoul',
        badge: null,
        description: 'Traditional semolina cookies filled with buttery crushed walnuts and a hint of cinnamon spice.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh5Cld3AkiYQxUCWeYgBOFq0tHWzVcfe126hpW-o62zo8PXxkfXw7MS-KUHe5pku7UPbnhEFK5vNlN4kMJ9APBAuI9xTyBD5OGDtMphg1V1JftfbPOdlvq8AoMhtj-ATAlswmv46rI27v6MHgGbUTDSDVgszu2He1XJUfaWHNyH7U1odceEmxOVcFJhLF4i9h8-cHp51VNlW7f5zIFYRLTfeftsxW-6qhoS6MC177xMFk-2-iLQcq762eFbiRO1_pMiS1Drm459lXG',
        tags: ['Walnut', 'Cinnamon']
    },
    {
        id: 13,
        title: 'Gold-Leaf Dates',
        price: 42,
        category: 'Mamoul',
        badge: null,
        description: 'Premium Medjool dates stuffed with toasted almonds, dipped in Belgian dark chocolate and finished with 24k gold leaf.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxivmycvQZ6i7d6W9Xu2tlW_oMID9mmzCuS13F1OWy_XB4kbmsaLXX9J-ykvlG7oTL7hUeyj8PklFDY-sx6pme6Y_ZCF4nfRJafWKXjpyZam7lxC_9TAbck3anH3S16feU_9HUGIsOYZ3aMd-4U5B2Kwkj_RiF8xOMXDzNstBVi9Dc73ydZ0Pxlhdbd67iJjxOYcq1CiuqongzYQRoR-z7NhTB58O8SMY0ZjHaCEuladngD0lXzW_1HS_RLn004In0p0ZuK3ui55to',
        tags: ['Chocolate', '24k Gold']
    },
    {
        id: 14,
        title: 'Pomegranate Delights',
        price: 18,
        category: 'Baklava',
        badge: 'Top Rated',
        description: 'Soft, jewel-like Turkish delights infused with real pomegranate juice and loaded with pistachios.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy3vzMAwFinRxjb18noiYYcprroSmsp9Ttp-eak1M3PxFY5UNhNQ_ykTxjRWQj3dAxBVz3E2ILeRiUNvrnOboh3FBA_UslEz3SazbdrlRVrM-ZaTtkPaTwHeyc9E-1DWKyFK9hKB8vFaXmlN0jyXAyybT1VOkSHyYN16fkxs9OuXwopMt-fiLPk2eAWkPRl6tReT-nGAeXWEkOsYrc53kmm2REqbs8EjvVD2VUhsNtBeEFUZreAMGUTWaERxHkBKJ-HBczUL81hLyu',
        tags: ['Fruit', 'Artisanal'],
        borderAccent: true
    }
];

const CATEGORIES = ['All', 'Baklava', 'Kunafa', 'Mamoul', 'Gift Boxes'];

export default function Shop({products}: {products: products[]}) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [showStickyCart, setShowStickyCart] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(2);
    const [cartTotal, setCartTotal] = useState(62.00);

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
    const filteredProducts = activeCategory === 'All'
        ? SHOP_PRODUCTS
        : SHOP_PRODUCTS.filter(p => p.category === activeCategory);

    const handleAddToCart = (product) => {
        console.log(`Inertia Action: Adding ${product.title} to session cart state.`);
        // Dynamic placeholder updates for visual confirmation
        setCartItemsCount(prev => prev + 1);
        setCartTotal(prev => prev + product.price);
    };

    console.log('Shop', products);

    return (
        <>
            <Header />
            <div className="text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed bg-background font-body-md antialiased">
                <main className="pt-32 pb-24">
                    {/* Hero Title Section */}
                    <section className="max-w-container-max px-margin-desktop mx-auto mb-16 text-center">
                        <h1 className="text-display-lg text-on-surface mb-4 font-display-lg text-5xl">
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
                    <section className="max-w-container-max px-margin-desktop mx-auto">
                        <div className="mb-12 flex justify-center overflow-x-auto pb-4">
                            <div className="bg-surface-container-low border-outline-variant/20 flex items-center space-x-2 rounded-full border p-1.5 whitespace-nowrap">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`text-label-md cursor-pointer rounded-full px-8 py-2.5 font-label-md transition-all ${
                                            activeCategory === cat
                                                ? 'text-on-primary bg-primary shadow-md'
                                                : 'text-on-surface-variant hover:bg-surface-variant'
                                        }`}
                                    >
                                        {cat}
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
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                {/* Persistent Bottom Sticky Basket Action View */}
                <StickyCartBar
                    isVisible={showStickyCart}
                    count={cartItemsCount}
                    total={cartTotal}
                    onClear={() => {
                        setCartItemsCount(0);
                        setCartTotal(0);
                    }}
                />
            </div>
        </>
    );
}
