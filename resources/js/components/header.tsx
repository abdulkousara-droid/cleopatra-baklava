import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';

// 1. Import 'home' from the root index where Route::inertia links land

// 2. Import your StorefrontController actions from their generated action file
// Wayfinder creates these named exactly after your PHP methods!
import {
    shop,
    newArrivals,
    mostPopular,
} from '@/actions/App/Http/Controllers/StorefrontController';
import { home } from '@/routes/index';

export default function Header() {
    const { url } = usePage();

    // 3. Generate the URLs using the .url() function attached directly to the exports
    const homeUrl = home.url();
    const shopUrl = shop.url();
    const newArrivalsUrl = newArrivals.url();
    const mostPopularUrl = mostPopular.url();

    return (
        <header className="fixed top-0 z-50 flex h-22 w-full items-center border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-16">
                {/* Logo / Brand Title */}
                <div className="flex flex-row items-center">
                    <Link
                        href={homeUrl}
                        className="group flex items-center gap-3 focus:outline-hidden"
                    >
                        <img
                            src="/logo.svg"
                            alt="Cleopatra Baklava Logo"
                            className="h-25 w-auto object-contain transition-transform duration-300 group-hover:scale-107"
                        />
                    </Link>{' '}
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                        Cleopatra Baklava
                    </h1>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        href={homeUrl}
                        className={`text-label-md font-label-md tracking-widest uppercase transition-colors duration-300 ${url === homeUrl ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Home
                    </Link>

                    <Link
                        href={newArrivalsUrl}
                        className={`text-label-md font-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith(newArrivalsUrl) ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        New Arrivals
                    </Link>

                    <Link
                        href={mostPopularUrl}
                        className={`text-label-md font-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith(mostPopularUrl) ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Most Popular
                    </Link>

                    <Link
                        href={shopUrl}
                        className={`text-label-md font-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith(shopUrl) ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Shop
                    </Link>
                </nav>

                {/* Action Utility Buttons */}
                <div className="flex items-center gap-6 text-primary">
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <Search className="material-symbols-outlined" />
                    </button>
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <ShoppingBag className="material-symbols-outlined" />
                    </button>
                </div>
            </div>
        </header>
    );
}
