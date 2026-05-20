import React from 'react';
import { Link } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 z-50 flex h-20 w-full items-center border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-16">
                {/* Logo / Brand Title using theme Primary color */}
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                    Cleopatra Baklava
                </h1>

                {/* Desktop Navigation Links mapped to semantic Foreground / Muted states */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link
                        className="border-b-2 border-primary pb-1 text-sm font-semibold tracking-widest text-primary uppercase"
                        href="#"
                    >
                        Home
                    </Link>
                    <Link
                        className="text-sm font-semibold tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-primary"
                        href="#"
                    >
                        New Arrivals
                    </Link>
                    <Link
                        className="text-sm font-semibold tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-primary"
                        href="#"
                    >
                        Most Popular
                    </Link>
                    <Link
                        className="text-sm font-semibold tracking-widest text-muted-foreground uppercase transition-colors duration-300 hover:text-primary"
                        href="#"
                    >
                        Shop
                    </Link>
                </nav>

                {/* Action Utility Buttons */}
                <div className="flex items-center gap-6 text-primary">
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <Search className="material-symbols-outlined" />
                        <span className="ml-3 material-symbols-outlined">
                            Search
                        </span>
                    </button>
                    <button className="flex cursor-pointer transition-all duration-300 hover:scale-110">
                        <ShoppingBag className="material-symbols-outlined" />
                        <span className="material-symbols-outlined ml-3">
                            Shopping Bag
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
