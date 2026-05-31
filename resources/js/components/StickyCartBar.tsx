import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

export default function StickyCartBar({ isVisible }: { isVisible: boolean }) {
    const { t } = useTranslation();
    const { itemCount, cartTotal, clearCart } = useCart();
    return (
        <div
            className={`bg-surface/95 border-outline-variant fixed right-0 md:bottom-0 bottom-[72px] left-0 z-40 border-t backdrop-blur-lg transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 md:translate-y-full opacity-0 md:opacity-100'
            }`}
        >
            <div className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto flex items-center justify-between py-3 md:py-4">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="bg-primary-container rounded-full p-2 hidden sm:block">
                        <span className="material-symbols-outlined text-on-primary-container">
                            <ShoppingCart />
                        </span>
                    </div>
                    <div>
                        <p className="font-label-md text-label-md text-on-surface text-xs md:text-sm">
                            {itemCount === 1 ? t('sticky_cart.item', { count: itemCount }) : t('sticky_cart.items', { count: itemCount })}
                        </p>
                        <p className="font-body-md text-body-md font-bold text-primary text-sm md:text-base">
                            {t('sticky_cart.total')} €{cartTotal.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 md:space-x-6">
                    <button
                        onClick={clearCart}
                        className="text-on-surface-variant font-label-md cursor-pointer transition-colors hover:text-primary hidden sm:block text-sm"
                    >
                        {t('sticky_cart.clear_all')}
                    </button>

                    <Link
                        href="/checkout"
                        className="text-on-primary font-label-md luxury-shadow inline-block rounded-lg bg-primary px-5 md:px-10 py-2.5 md:py-3 transition-transform hover:scale-105 text-xs md:text-sm tracking-widest text-center"
                    >
                        <span className="sm:hidden uppercase font-bold">{t('sticky_cart.checkout')}</span>
                        <span className="hidden sm:inline uppercase">{t('sticky_cart.view_cart_checkout')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
