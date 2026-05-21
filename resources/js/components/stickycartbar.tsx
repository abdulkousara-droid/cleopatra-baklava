import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export default function StickyCartBar({ isVisible, count, total, onClear }) {
    return (
        <div
            className={`bg-surface/95 border-outline-variant fixed right-0 bottom-0 left-0 z-40 border-t backdrop-blur-lg transition-transform duration-500 ${
                isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div className="max-w-container-max px-margin-desktop mx-auto flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                    <div className="bg-primary-container rounded-full p-2">
                        <span className="material-symbols-outlined text-on-primary-container">
                            <ShoppingCart />
                        </span>
                    </div>
                    <div>
                        <p className="font-label-md text-label-md text-on-surface">
                            {count} Items in Your Basket
                        </p>
                        <p className="font-body-md text-body-md font-bold text-primary">
                            Total: €{total.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <button
                        onClick={onClear}
                        className="text-on-surface-variant font-label-md cursor-pointer transition-colors hover:text-primary"
                    >
                        Clear All
                    </button>

                    {/* Strict Inertia link routing back to /cart */}
                    <Link
                        href="/cart"
                        className="text-on-primary font-label-md luxury-shadow inline-block rounded-lg bg-primary px-10 py-3 transition-transform hover:scale-105"
                    >
                        VIEW CART & CHECKOUT
                    </Link>
                </div>
            </div>
        </div>
    );
}
