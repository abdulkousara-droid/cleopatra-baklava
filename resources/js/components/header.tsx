import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';
export default function Header() {
    const { url } = usePage();

    return (
        <header className="fixed top-0 z-50 flex h-22 w-full items-center border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-16">
                {/* Logo / Brand Title using theme Primary color */}

                <div className={'flex flex-row items-center'}>
                    <Link
                        href={'/'}
                        className="group flex items-center gap-3 focus:outline-hidden"
                    >
                        <img
                            src={'/logo.svg'}
                            alt="Cleopatra Baklava Logo"
                            className="h-25 w-auto object-contain transition-transform duration-300 group-hover:scale-107"
                        />
                    </Link>{' '}
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                        Cleopatra Baklava
                    </h1>
                </div>

                {/* Desktop Navigation Links mapped to semantic Foreground / Muted states */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className={`font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 ${url === '/' ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Home
                    </Link>

                    <Link
                        href="/newarrivals"
                        className={`font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith('/newarrivals') ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        New Arrivals
                    </Link>

                    <Link
                        href="/mostpopular"
                        className={`font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith('/mostpopular') ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Most Popular
                    </Link>

                    <Link
                        href="/shop"
                        className={`font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 ${url.startsWith('/shop') ? 'border-b-2 border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Shop
                    </Link>
                </nav>

                {/* Action Utility Buttons */}
                <div className="flex items-center gap-6 text-primary">
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <Search className="material-symbols-outlined" />
                        {/*  <span className="material-symbols-outlined ml-3">
                            Search
                        </span>*/}
                    </button>
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <ShoppingBag className="material-symbols-outlined" />
                        {/*  <span className="material-symbols-outlined ml-3">
                            Shopping Bag
                        </span>*/}
                    </button>
                </div>
            </div>
        </header>
    );
}
