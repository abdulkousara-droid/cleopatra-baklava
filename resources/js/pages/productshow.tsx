import React, { useState } from 'react';
import {
    Star,
    Info,
    Minus,
    Plus,
    Truck,
    CheckCircle2,
} from 'lucide-react';
import { Head, router, Link } from '@inertiajs/react';
import { useCart } from '@/lib/cart';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ProductShow({ product, relatedProducts = [] }: { product: any; relatedProducts: any[] }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(product?.image);

    const updateQty = (change: number) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const currentProduct = product || {
        title: 'Pistachio Baklava',
        price: 4.5,
        badge: 'House Special',
        description:
            'Our signature creation features forty layers of hand-rolled, paper-thin phyllo pastry. Each piece is generously filled with premium, early-harvest Gaziantep pistachios and bathed in a light syrup of organic wildflower honey and a hint of Mediterranean orange blossom.',
        tags: ['Gaziantep Pistachios', 'Organic Honey', 'Artisanal Butter', 'Orange Blossom'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7oUeiDwawXvMBSkdwibegtOpxuGcHN0RmvJGEfb0Yi1ku4beGuuA1Xg4cWDLLdTQyR824mQZBSrDjvwoDpI91aOlwB4zVcUfw92ZJ3Ecu7rxRdVI1vQdmIFr0khBeycalzMLZios-ft4F5PJqqV2vWR5hxP3W2PAD2dkTFbo7344rTc3WIctBaffGYiYCwtkl-UpnEapRznbr-ie2icWnnOKDPDQFYDmI8Gh9I-foBRRKcsYxHN3UfFkZOQ55s4bm97lSKjwAgf7',
        additionalImages: [],
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(currentProduct);
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.visit('/checkout');
    };

    return (
        <>
            <Head title={`${currentProduct.title} - Cleopatra Baklava`} />
            <Header />
            <div className="text-on-surface min-h-screen bg-background font-sans">
                <main className="pt-32 pb-28 md:pb-16">
                    {/* Product Hero Section */}
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-24">
                        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
                            {/* Left: Image Gallery */}
                            <div className="space-y-6 lg:col-span-7">
                                <div className="group bg-surface-container relative aspect-[4/5] overflow-hidden rounded-xl shadow-xl">
                                    <img
                                        alt={currentProduct.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={activeImage || currentProduct.image}
                                    />
                                    {currentProduct.badge && (
                                        <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                            <span className={`rounded-full px-4 py-1 font-label-md text-[12px] tracking-wider uppercase shadow-lg ${
                                                currentProduct.badge === 'New' || currentProduct.badge === 'New Collection'
                                                    ? 'bg-[#e8e2d6] text-[#4d4637]'
                                                    : currentProduct.badge === 'Premium Choice'
                                                      ? 'bg-[#1e1b14] text-[#c9a84c]'
                                                      : 'bg-[#755b00] text-white'
                                            }`}>
                                                {currentProduct.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery Thumbnails */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        onClick={() => setActiveImage(currentProduct.image)}
                                        className={`aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors ${activeImage === currentProduct.image ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30 hover:border-primary'}`}
                                    >
                                        <img alt="Main product" className="h-full w-full object-cover" src={currentProduct.image} />
                                    </div>
                                    {currentProduct.additionalImages?.map((imgUrl: string, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors ${activeImage === imgUrl ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30 hover:border-primary'}`}
                                        >
                                            <img alt={`Detail view ${index + 1}`} className="h-full w-full object-cover" src={imgUrl} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Product Details Column */}
                            <div className="lg:sticky lg:top-12 lg:col-span-5">
                                <nav className="text-on-surface-variant mb-6 flex gap-2 font-label-md text-[12px] tracking-widest uppercase">
                                    <Link className="hover:text-primary" href="/shop">Shop</Link>
                                    <span>/</span>
                                    <span className="text-primary">{currentProduct.title}</span>
                                </nav>

                                <h1 className="text-on-surface mb-2 font-headline-md text-[36px] md:text-[48px] leading-tight">
                                    {currentProduct.title}
                                </h1>

                                <div className="mb-6 flex items-center gap-4">
                                    <div className="flex text-primary">
                                        {[...Array(4)].map((_, i) => (
                                            <Star key={i} size={18} fill="currentColor" />
                                        ))}
                                        <Star size={18} fill="currentColor" className="opacity-50" />
                                    </div>
                                    <span className="text-on-surface-variant font-body-md text-sm">(128 Reviews)</span>
                                </div>

                                <div className="mb-8 text-3xl font-bold text-primary">
                                    €{Number(currentProduct.price).toFixed(2)}{' '}
                                    <span className="text-on-surface-variant text-lg font-normal">/ piece</span>
                                </div>

                                <div className="mb-10 space-y-8">
                                    <div>
                                        <h3 className="text-label-md text-on-surface mb-3 font-label-md uppercase">The Craft</h3>
                                        <p className="text-on-surface-variant font-body-md leading-relaxed">{currentProduct.description}</p>
                                    </div>

                                    {currentProduct.tags && currentProduct.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-label-md text-on-surface mb-3 font-label-md uppercase">Ingredients</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {currentProduct.tags.map((tag: string, i: number) => (
                                                    <span key={i} className="rounded-full bg-primary/10 px-3 py-1 font-label-md text-[12px] text-primary">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-outline-variant/30 bg-surface-container-low rounded-xl border p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Info size={16} className="text-primary" />
                                            <span className="text-on-surface font-label-md text-[12px] uppercase">Allergen Information</span>
                                        </div>
                                        <p className="text-on-surface-variant font-sans text-[12px]">
                                            Contains: Nuts (Pistachios), Gluten (Wheat), Dairy (Milk). May contain traces of other nuts.
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="border-outline-variant flex h-14 items-center overflow-hidden rounded-lg border bg-white">
                                            <button
                                                className="hover:bg-surface-container flex h-full items-center justify-center px-4 transition-colors"
                                                onClick={() => updateQty(-1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-12 text-center font-body-md font-semibold select-none">{quantity}</span>
                                            <button
                                                className="hover:bg-surface-container flex h-full items-center justify-center px-4 transition-colors"
                                                onClick={() => updateQty(1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleBuyNow}
                                            className="text-on-primary text-label-md h-14 flex-1 cursor-pointer rounded-lg bg-primary font-label-md tracking-widest uppercase shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="text-label-md h-14 w-full cursor-pointer rounded-lg border-2 border-primary bg-transparent font-label-md font-semibold tracking-widest text-primary uppercase transition-all hover:bg-primary/5"
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                <div className="text-on-surface-variant border-outline-variant/30 mt-8 flex items-center justify-between border-t pt-6 font-label-md text-[12px]">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} className="text-primary" />
                                        <span>Express Shipping in Barcelona</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-primary" />
                                        <span>Freshness Guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Geometric Separator */}
                    <div className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-24 flex items-center gap-4 opacity-30">
                        <div className="h-[1px] flex-1 bg-primary"></div>
                        <div className="h-2 w-2 rotate-45 border border-primary bg-primary"></div>
                        <div className="h-[1px] flex-1 bg-primary"></div>
                    </div>

                    {/* Related Delights Section */}
                    {relatedProducts.length > 0 && (
                        <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-32">
                            <h2 className="mb-12 text-center font-serif text-[32px] font-semibold text-foreground">
                                Related Delights
                            </h2>
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                {relatedProducts.map((item) => (
                                    <Link
                                        href={`/productshow?id=${item.id}`}
                                        key={item.id}
                                        className="group cursor-pointer"
                                    >
                                        <div className="border-outline-variant/10 relative mb-4 aspect-square overflow-hidden rounded-xl border bg-white shadow-sm">
                                            <img
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                src={item.image}
                                            />
                                            {item.badge && (
                                                <span className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                                                    item.badge === 'New' || item.badge === 'New Collection'
                                                        ? 'bg-[#e8e2d6] text-[#4d4637]'
                                                        : item.badge === 'Premium Choice'
                                                          ? 'bg-[#1e1b14] text-[#c9a84c]'
                                                          : 'bg-[#755b00] text-white'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mb-1 font-serif font-bold text-foreground transition-colors group-hover:text-primary">
                                            {item.title}
                                        </h3>
                                        <p className="font-label-md text-sm text-primary">
                                            €{Number(item.price).toFixed(2)} / pc
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Customer Reviews */}
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-32">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="bg-surface-container border-outline-variant/20 flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-sm">
                                <h3 className="mb-2 font-headline-sm text-xl">Customer Rating</h3>
                                <div className="mb-2 text-[64px] leading-none font-bold text-primary">4.8</div>
                                <div className="mb-4 flex gap-0.5 text-primary">
                                    {[...Array(4)].map((_, i) => (
                                        <Star key={i} size={20} fill="currentColor" />
                                    ))}
                                    <Star size={20} fill="currentColor" className="opacity-50" />
                                </div>
                                <p className="text-on-surface-variant font-body-md text-sm">
                                    Based on 128 verified purchases from our Barcelona boutique and online shop.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-2">
                                <div className="border-outline-variant/20 rounded-xl border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex justify-between">
                                        <span className="text-on-surface font-label-md text-sm">Marta S.</span>
                                        <div className="flex gap-0.5 text-primary">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </div>
                                    <p className="text-on-surface-variant font-body-md text-sm italic">
                                        "The texture is unlike any baklava I've had. The honey is subtle, letting the quality of the pistachios shine through."
                                    </p>
                                </div>
                                <div className="border-outline-variant/20 rounded-xl border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex justify-between">
                                        <span className="text-on-surface font-label-md text-sm">Jordi V.</span>
                                        <div className="flex gap-0.5 text-primary">
                                            {[...Array(4)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                            <Star size={12} />
                                        </div>
                                    </div>
                                    <p className="text-on-surface-variant font-body-md text-sm italic">
                                        "Perfect crunch. It feels very premium and makes for an incredible gift. The packaging is as beautiful as the taste."
                                    </p>
                                </div>
                                <div className="border-outline-variant/20 flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm md:col-span-2">
                                    <p className="font-body-md text-sm font-bold">Share your experience</p>
                                    <button className="bg-surface-container rounded-full px-6 py-2 font-label-md text-xs text-primary transition-colors hover:bg-primary/10">
                                        Write Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
