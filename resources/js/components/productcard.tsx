import { MessageSquareText, ShoppingBag } from 'lucide-react';
import React from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/lib/cart';

export default function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();
    const handleWhatsappOrder = () => {
        const message = encodeURIComponent(
            `Hello Cleopatra Baklava, I would like to order "${product.title}" for €${product.price}.`,
        );
        window.open(`https://wa.me/34931234567?text=${message}`, '_blank');
    };

    return (
        <div
            className={`group bg-surface-container-lowest luxury-shadow flex h-full max-w-[350px] flex-col overflow-hidden rounded-xl bg-white transition-transform duration-500 hover:-translate-y-2 ${
                product.borderAccent ? 'border border-primary/20' : ''
            }`}
        >
            {/* Product Image and Badges */}
            <Link href={`/productshow?id=${product.id}`} className="bg-surface-container relative aspect-square overflow-hidden block">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={product.image}
                    alt={product.title}
                />
                {product.badge && (
                    <span
                        className={`absolute top-4 left-4 rounded-sm px-3 py-1 font-label-md text-[12px] tracking-wider uppercase ${
                            product.badge === 'New' || product.badge === 'New Collection'
                                ? 'bg-[#e8e2d6] text-[#4d4637]'
                                : product.badge === 'Premium Choice'
                                  ? 'bg-[#1e1b14] text-[#c9a84c]'
                                  : 'bg-[#755b00] text-white'
                        }`}
                    >
                        {product.badge}
                    </span>
                )}
            </Link>

            {/* Content & Details */}
            <div className="flex flex-grow flex-col p-8">
                <div className="mb-2 flex items-start justify-between gap-4">
                    <Link href={`/productshow?id=${product.id}`} className="text-headline-sm text-on-surface line-clamp-1 font-headline-sm hover:text-primary transition-colors">
                        {product.title}
                    </Link>
                    <span className="text-headline-sm font-headline-sm text-primary">
                        €{product.price}
                    </span>
                </div>

                <p className="text-body-md text-on-surface-variant mb-6 line-clamp-3 font-body-md">
                    {product.description}
                </p>

                {/* Categories / Tags pills */}
                <div className="mb-6 flex flex-wrap items-center space-x-2 gap-y-2">
                    {(product.tags ?? []).map((tag: string, idx: number) => (
                        <span
                            key={idx}
                            className="bg-secondary-container text-on-secondary-container rounded-full bg-pink-200 px-3 py-1 text-[12px] font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA Actions buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => addToCart(product)}
                        className="text-on-primary hover:bg-on-primary-container luxury-shadow flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-primary py-4 font-label-md text-white transition-all"
                    >
                        {/* Note: Removed the material-symbols-outlined class around Lucide components to prevent icon rendering bugs */}
                        <ShoppingBag size={20} />
                        <span>ADD TO CART</span>
                    </button>

                    <button
                        onClick={handleWhatsappOrder}
                        className="hover:bg-primary-fixed/20 flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg border border-primary py-4 font-label-md text-primary transition-all"
                    >
                        <MessageSquareText size={20} />
                        <span>ORDER VIA WHATSAPP</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
