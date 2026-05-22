import React from 'react';
import { Link } from '@inertiajs/react';
import type { Product } from '@/types';

import { useCart } from '@/lib/cart';

export default function ProductGrid({ products }:{ products: Product[] }) {
    const { addToCart } = useCart();

    return (
        <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto pb-24">
            <div className="gap-gutter grid grid-cols-1 md:grid-cols-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-surface-container-lowest ambient-shadow mx-auto mb-3 max-w-sm translate-y-0 transform overflow-hidden rounded-xl bg-white opacity-100 transition-all duration-500 hover:-translate-y-2"
                    >
                        {/* Image Box */}
                        <Link href={`/productshow?id=${product.id}`} className="block relative aspect-square overflow-hidden bg-surface-container">
                            <img
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src={product.image}
                                alt={product.title}
                            />
                            {product.badge && (
                                <div className="absolute top-4 right-4 pointer-events-none">
                                    <span className="rounded-full bg-primary/10 px-3 py-1 font-label-md text-primary backdrop-blur-md">
                                        {product.badge}
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Product Meta Body */}
                        <div className="p-8">
                            <div className="mb-2 flex items-start justify-between">
                                <Link href={`/productshow?id=${product.id}`} className="text-headline-sm text-on-surface font-headline-sm hover:text-primary transition-colors">
                                    {product.title}
                                </Link>
                                <span className="text-headline-sm font-headline-sm text-primary">
                                    €{Number(product.price).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-body-md text-on-surface-variant mb-6 min-h-[48px] font-body-md">
                                {product.description}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={() => addToCart(product)}
                                aria-label={`Buy ${product.title} now`}
                                className="text-on-primary hover:bg-primary-container hover:text-on-primary-container w-full cursor-pointer rounded-lg bg-primary py-4 font-label-md tracking-widest uppercase transition-all duration-300"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
