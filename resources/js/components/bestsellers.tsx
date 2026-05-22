import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';
import type { Product } from '@/types';

export default function Bestsellers({ products }: { products: Product[] }) {
    const { addToCart } = useCart();
    const bestsellerProducts = products.slice(0, 3);

    return (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 bg-background">

            {/* Section Header */}
            <div className="flex flex-col items-center mb-16 text-center">
                <div className="w-12 h-[2px] bg-primary mb-6"></div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
                    Barcelona's Finest: Our Bestsellers
                </h3>
                <p className="text-muted-foreground font-sans italic tracking-wide">
                    Handcrafted daily with the finest Mediterranean ingredients
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bestsellerProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-card rounded-xl overflow-hidden border border-border shadow-xs group flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-md"
                    >
                        {/* Image — clickable to product page */}
                        <Link href={`/productshow?id=${product.id}`} className="relative aspect-square overflow-hidden bg-muted block">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.badge && (
                                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                                    {product.badge}
                                </div>
                            )}
                        </Link>

                        {/* Product Body */}
                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                            <Link href={`/productshow?id=${product.id}`} className="font-serif text-xl md:text-2xl font-semibold mb-2 text-primary hover:text-primary/80 transition-colors block">
                                {product.title}
                            </Link>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                {product.description}
                            </p>

                            {/* Card Footer */}
                            <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                                <span className="font-sans text-xl font-bold text-foreground">
                                    €{Number(product.price).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => addToCart(product)}
                                    aria-label={`Add ${product.title} to shopping bag`}
                                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:translate-x-1 transition-transform duration-300 cursor-pointer"
                                >
                                    Add to Cart
                                    <ShoppingCart size={18} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
