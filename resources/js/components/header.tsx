import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, ShoppingBag, Plus, Minus, Trash2, Home, Sparkles, Heart, Store, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Hardcoded routes (no wayfinder needed)

export default function Header() {
    const { url } = usePage();

    // Route URLs
    const homeUrl = '/';
    const shopUrl = '/shop';
    const newArrivalsUrl = '/newarrivals';
    const mostPopularUrl = '/mostpopular';

    // 4. Cart and Search State
    const { cartItems, itemCount, cartTotal, updateQuantity, removeFromCart, addToCart } = useCart();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const debounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleSearchItemAdd = (product: any) => {
        addToCart(product);
        setSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <>
        <header className="fixed top-0 z-50 flex h-22 w-full items-center border-b border-border bg-background/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
                {/* Logo / Brand Title */}
                <div className="flex flex-row items-center">
                    <Link
                        href={homeUrl}
                        className="group flex items-center gap-3 focus:outline-hidden"
                    >
                        <img
                            src="/logo.svg"
                            alt="Cleopatra Baklava Logo"
                            className="h-[64px] md:h-[100px] w-auto object-contain transition-transform duration-300 group-hover:scale-107"
                        />
                    </Link>{' '}
                    <h1 className="font-serif text-xl md:text-3xl font-semibold tracking-tight text-primary hidden sm:block">
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
                <div className="flex items-center gap-6 text-primary relative">
                    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                        <DialogTrigger asChild>
                            <button className="flex cursor-pointer transition-all duration-300 hover:scale-110 relative">
                                <Search className="h-6 w-6" />
                            </button>
                        </DialogTrigger>
                        <DialogContent hideClose className="sm:max-w-xl top-[20%] translate-y-0 bg-white shadow-2xl rounded-2xl border border-gray-100 p-0 overflow-hidden">
                            <div className="flex flex-col">
                                {/* Search Input Row */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                                    <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search for baklava, kunafa, mamoul..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-base placeholder:text-gray-400 text-gray-900 focus:outline-none"
                                        autoFocus
                                    />
                                    <DialogPrimitive.Close
                                        onClick={() => { setSearchQuery(''); }}
                                        className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </DialogPrimitive.Close>
                                </div>
                                {/* Results */}
                                <div className="max-h-[60vh] overflow-y-auto p-4">
                                    {isSearching && (
                                        <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                                            Searching our delicious treats...
                                        </div>
                                    )}
                                    {!isSearching && searchQuery && searchResults.length === 0 && (
                                        <div className="p-8 text-center text-sm text-gray-500">
                                            <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                                            No products found matching "{searchQuery}".
                                        </div>
                                    )}
                                    {!isSearching && !searchQuery && (
                                        <div className="p-6 text-center text-sm text-gray-400">
                                            Start typing to search our collection...
                                        </div>
                                    )}
                                    {!isSearching && searchResults.length > 0 && (
                                        <ul className="space-y-2">
                                            {searchResults.map((product) => (
                                                <li key={product.id} className="flex items-center gap-4 p-3 hover:bg-orange-50/50 rounded-xl transition-colors border border-transparent hover:border-orange-100">
                                                    <Link href={`/productshow?id=${product.id}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-4 flex-1 min-w-0 no-underline">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.title} className="h-14 w-14 rounded-lg object-cover shadow-sm flex-shrink-0" />
                                                        ) : (
                                                            <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><ShoppingBag className="h-5 w-5 text-gray-400"/></div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 truncate">{product.title}</h4>
                                                            <p className="text-primary font-bold mt-0.5">€{Number(product.price).toFixed(2)}</p>
                                                        </div>
                                                    </Link>
                                                    <button
                                                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 shadow-sm transition-colors flex-shrink-0"
                                                        onClick={() => handleSearchItemAdd(product)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="relative">
                        <button
                            className="flex cursor-pointer transition-all duration-300 hover:scale-110 relative"
                            onClick={() => setCartOpen(!cartOpen)}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {cartOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setCartOpen(false)}
                                />
                                <div className="absolute right-0 top-[120%] w-[340px] flex flex-col max-h-[85vh] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 z-50 origin-top-right animate-in fade-in zoom-in-95">
                                    <div className="border-b border-gray-100 px-5 py-4 bg-gray-50/50 rounded-t-xl flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 text-lg">Your Cart</h3>
                                        <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{itemCount} items</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-5 bg-white">
                                        {cartItems.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center text-gray-400 py-10">
                                                <ShoppingBag className="mb-4 h-12 w-12 opacity-20" />
                                                <p className="text-gray-500 font-medium">Your cart is empty.</p>
                                                <button
                                                    className="mt-4 text-primary text-sm font-medium hover:underline"
                                                    onClick={() => setCartOpen(false)}
                                                >
                                                    Continue Shopping
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="space-y-5">
                                                {cartItems.map((item) => (
                                                    <li key={item.id} className="flex items-center space-x-4 border-b border-gray-50 pb-5 last:border-b-0 last:pb-0">
                                                        <Link href={`/productshow?id=${item.id}`} onClick={() => setCartOpen(false)} className="flex items-center space-x-4 flex-1 min-w-0 no-underline">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.title} className="h-16 w-16 rounded-lg object-cover border border-gray-100 shadow-sm flex-shrink-0" />
                                                            ) : (
                                                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><ShoppingBag className="h-6 w-6 text-gray-300"/></div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">{item.title}</h4>
                                                                <p className="text-primary font-bold text-sm mt-1">€{item.price.toFixed(2)}</p>
                                                            </div>
                                                        </Link>
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 hover:text-primary text-gray-600 transition-colors bg-white shadow-sm"
                                                                >
                                                                    <Minus className="h-3.5 w-3.5" />
                                                                </button>
                                                                <span className="text-sm font-semibold w-5 text-center text-gray-800">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 hover:text-primary text-gray-600 transition-colors bg-white shadow-sm"
                                                                >
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex-shrink-0"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    {cartItems.length > 0 && (
                                        <div className="border-t border-gray-100 p-5 bg-gray-50/50 rounded-b-xl">
                                            <div className="mb-4 flex justify-between font-bold text-gray-900 text-lg">
                                                <span>Subtotal</span>
                                                <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                                            </div>
                                            <Link
                                                href="/checkout"
                                                onClick={() => setCartOpen(false)}
                                                className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3.5 text-base font-bold text-white shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                                            >
                                                Proceed to Checkout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-[72px] bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 pb-safe-bottom">
            <Link
                href={homeUrl}
                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${url === homeUrl ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
                <Home className="h-5 w-5" />
                <span className="text-[10px] font-label-md tracking-widest uppercase">Home</span>
            </Link>

            <Link
                href={newArrivalsUrl}
                className={`flex flex-col items-center justify-center w-20 h-full space-y-1 transition-colors ${url.startsWith(newArrivalsUrl) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
                <Sparkles className="h-5 w-5" />
                <span className="text-[10px] font-label-md tracking-widest uppercase">New</span>
            </Link>

            <Link
                href={mostPopularUrl}
                className={`flex flex-col items-center justify-center w-20 h-full space-y-1 transition-colors ${url.startsWith(mostPopularUrl) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
                <Heart className="h-5 w-5" />
                <span className="text-[10px] font-label-md tracking-widest uppercase">Popular</span>
            </Link>

            <Link
                href={shopUrl}
                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${url.startsWith(shopUrl) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
                <Store className="h-5 w-5" />
                <span className="text-[10px] font-label-md tracking-widest uppercase">Shop</span>
            </Link>
        </nav>
        </>
    );
}
