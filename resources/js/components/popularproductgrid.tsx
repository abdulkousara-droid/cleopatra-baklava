import { Plus, Star } from 'lucide-react';
import React from 'react';
import { Link } from '@inertiajs/react';
import type { Product } from '@/types';

import { useCart } from '@/lib/cart';

export default function PopularProductGrid({products}: { products: Product[] }) {
    const { addToCart } = useCart();

    const handleAddItemToCart = (product: any) => {
        addToCart(product);
    };

    return (
        <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto">
            {/* Kept your original requested Grid layouts */}
            <div className="gap-gutter grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-surface-container-lowest ambient-shadow relative mx-auto flex max-w-[280px] flex-col overflow-hidden rounded-xl bg-white p-4 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Upper Badge */}
                        {product.badge && (
                            <div className="absolute top-6 left-6 z-10">
                                <span className={`rounded-full px-3 py-1 font-label-md text-[10px] tracking-widest uppercase shadow-sm ${
                                    product.badge === 'New' || product.badge === 'New Collection'
                                        ? 'bg-[#e8e2d6] text-[#4d4637]'
                                        : product.badge === 'Premium Choice'
                                          ? 'bg-[#1e1b14] text-[#c9a84c]'
                                          : 'bg-[#755b00] text-white'
                                }`}>
                                    {product.badge}
                                </span>
                            </div>
                        )}

                        {/* Img frame view box */}
                        <Link href={`/productshow?id=${product.id}`} className="block bg-surface-container mb-6 aspect-square overflow-hidden rounded-lg">
                            <img
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                src={product.image}
                                alt={product.title}
                            />
                        </Link>

                        {/* Product description content container */}
                        <div className="flex-grow">
                            <div className="mb-2 flex items-center gap-1">
                                <Star className="text-sm text-primary" />
                                <span className="font-label-md text-primary">
                                    {product.rating_score}
                                </span>
                                <span className="text-on-surface-variant/60 text-caption ml-1">
                                    ({product.reviews_count} reviews)
                                </span>
                            </div>
                            <Link href={`/productshow?id=${product.id}`} className="block">
                                <h3 className="text-headline-sm text-on-surface mb-2 font-headline-sm hover:text-primary transition-colors">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-on-surface-variant mb-4 line-clamp-2 font-body-md">
                                {product.description}
                            </p>
                        </div>

                        {/* Footer Pricing action card anchor split row */}
                        <div className="border-outline-variant/30 mt-auto flex items-center justify-between border-t pt-4">
                            <span className="font-headline-sm text-primary">
                                €{Number(product.price).toFixed(2)}
                            </span>
                            <button
                                onClick={() => handleAddItemToCart(product)}
                                className="text-on-primary hover:bg-on-primary-fixed-variant flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary shadow-sm transition-colors"
                                aria-label={`Add ${product.title} to selection`}
                            >
                                <span className="material-symbols-outlined">
                                    <Plus />
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
