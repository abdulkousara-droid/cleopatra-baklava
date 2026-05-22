import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { useCart } from '@/lib/cart';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();
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
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={toUrl(item.href)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="h-5 w-5" />
                                                    )}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                whenCurrentUrl(
                                                    item.href,
                                                    activeItemStyles,
                                                ),
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="group h-9 w-9 cursor-pointer"
                                    >
                                        <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xl top-[20%] translate-y-0 bg-white">
                                    <div className="flex flex-col gap-4">
                                        <div className="relative border-b pb-2">
                                            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search for baklava, kunafa, mamoul..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border-none outline-none focus:ring-0 text-lg placeholder:text-gray-300"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-[60vh] overflow-y-auto">
                                            {isSearching && (
                                                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                                            )}
                                            {!isSearching && searchQuery && searchResults.length === 0 && (
                                                <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
                                            )}
                                            {!isSearching && searchResults.length > 0 && (
                                                <ul className="space-y-2">
                                                    {searchResults.map((product) => (
                                                        <li key={product.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md">
                                                            {product.image ? (
                                                                <img src={product.image} alt={product.title} className="h-12 w-12 rounded object-cover" />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center"><Search className="h-4 w-4 text-gray-400"/></div>
                                                            )}
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm">{product.title}</h4>
                                                                <p className="text-primary font-medium text-sm">€{Number(product.price).toFixed(2)}</p>
                                                            </div>
                                                            <Button size="sm" onClick={() => handleSearchItemAdd(product)}>Add</Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <div className="ml-1 hidden gap-1 lg:flex">
                                {rightNavItems.map((item) => (
                                    <Tooltip key={item.title}>
                                        <TooltipTrigger>
                                            <a
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">
                                                    {item.title}
                                                </span>
                                                {item.icon && (
                                                    <item.icon className="size-5 opacity-80 group-hover:opacity-100" />
                                                )}
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        {/* Cart Pop-up Dropdown */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="group relative h-9 w-9 cursor-pointer"
                                onClick={() => setCartOpen(!cartOpen)}
                            >
                                <ShoppingCart className="!size-5 opacity-80 group-hover:opacity-100" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                            
                            {cartOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setCartOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-80 flex flex-col max-h-[80vh] bg-white rounded-md shadow-2xl border border-gray-100 z-50 origin-top-right animate-in fade-in zoom-in-95">
                                        <div className="border-b px-4 py-3 bg-gray-50 rounded-t-md">
                                            <h3 className="font-semibold text-gray-800">Your Cart ({itemCount} items)</h3>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 bg-white">
                                            {cartItems.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                                                    <ShoppingCart className="mb-3 h-10 w-10 opacity-20" />
                                                    <p className="text-sm">Your cart is empty.</p>
                                                </div>
                                            ) : (
                                                <ul className="space-y-4">
                                                    {cartItems.map((item) => (
                                                        <li key={item.id} className="flex items-center space-x-3 border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.title} className="h-14 w-14 rounded-md object-cover border border-gray-100" />
                                                            ) : (
                                                                <div className="h-14 w-14 rounded-md bg-gray-100 flex items-center justify-center"><ShoppingCart className="h-6 w-6 text-gray-300"/></div>
                                                            )}
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</h4>
                                                                <p className="text-amber-600 font-bold text-xs mt-0.5">€{item.price.toFixed(2)}</p>
                                                                <div className="mt-2 flex items-center space-x-2">
                                                                    <button 
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 hover:text-amber-600 text-gray-500 transition-colors"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </button>
                                                                    <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                                                    <button 
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 hover:text-amber-600 text-gray-500 transition-colors"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        {cartItems.length > 0 && (
                                            <div className="border-t p-4 bg-gray-50 rounded-b-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                                                <div className="mb-4 flex justify-between font-bold text-gray-800">
                                                    <span>Subtotal</span>
                                                    <span className="text-amber-600">€{cartTotal.toFixed(2)}</span>
                                                </div>
                                                <Link 
                                                    href="/checkout" 
                                                    onClick={() => setCartOpen(false)}
                                                    className="flex w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
                                                >
                                                    Go to Checkout
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
