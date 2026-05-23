import React, { useState } from 'react';
import {
    Star,
    Info,
    Minus,
    Plus,
    Truck,
    CheckCircle2,
    MessageSquarePlus,
    Loader2,
    CheckCircle,
    User,
    ChevronDown,
} from 'lucide-react';
import { Head, router, Link } from '@inertiajs/react';
import { useCart } from '@/lib/cart';
import Header from '@/components/header';
import Footer from '@/components/footer';

// ── Types ────────────────────────────────────────────────────────────────────
interface ProductReview {
    id: number;
    name: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ProductData {
    id: number;
    title: string;
    price: number;
    badge?: string;
    description: string;
    tags?: string[];
    image: string;
    additionalImages?: string[];
    category?: string;
    reviews_count?: number;
    rating_score?: number;
}

// ── Star Rating Picker (interactive) ─────────────────────────────────────────
function StarPicker({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform duration-150 hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                >
                    <Star
                        size={28}
                        className={`transition-colors duration-150 ${
                            star <= (hovered || value)
                                ? 'fill-[#c9a84c] text-[#c9a84c]'
                                : 'fill-transparent text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

// ── Star Display (static) ─────────────────────────────────────────────────────
function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={
                        s <= Math.round(rating)
                            ? 'fill-[#c9a84c] text-[#c9a84c]'
                            : 'fill-transparent text-gray-300'
                    }
                />
            ))}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProductShow({
    product,
    relatedProducts = [],
    reviews: initialReviews = [],
}: {
    product: ProductData;
    relatedProducts: any[];
    reviews: ProductReview[];
}) {
    const { addToCart } = useCart();
    const [quantity, setQuantity]       = useState(1);
    const [activeImage, setActiveImage] = useState(product?.image);

    // Reviews state
    const [reviews, setReviews]               = useState<ProductReview[]>(initialReviews);
    const [ratingsCount, setRatingsCount]     = useState(product?.reviews_count ?? 0);
    const [ratingScore, setRatingScore]       = useState(product?.rating_score ?? 0);
    const [showForm, setShowForm]             = useState(false);
    const [submitStatus, setSubmitStatus]     = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [formError, setFormError]           = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        rating: 0,
        comment: '',
    });

    const updateQty = (change: number) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const currentProduct = product || {
        title: 'Pistachio Baklava',
        price: 4.5,
        badge: 'House Special',
        description:
            'Our signature creation features forty layers of hand-rolled, paper-thin phyllo pastry. Each piece is generously filled with premium, early-harvest Gaziantep pistachios.',
        tags: ['Gaziantep Pistachios', 'Organic Honey', 'Artisanal Butter'],
        image: '',
        additionalImages: [],
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addToCart(currentProduct as any);
    };
    const handleBuyNow = () => {
        handleAddToCart();
        router.visit('/checkout');
    };

    // ── Review Submission ───────────────────────────────────────────────────
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.rating === 0) {
            setFormError('Please select a star rating.');
            return;
        }
        setFormError('');
        setSubmitStatus('loading');

        try {
            const csrfToken =
                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ product_id: currentProduct.id, ...form }),
            });

            if (!res.ok) {
                const err = await res.json();
                const firstError = err.errors
                    ? Object.values(err.errors as Record<string, string[]>)[0][0]
                    : 'Submission failed. Please check your details.';
                setFormError(firstError);
                setSubmitStatus('error');
                return;
            }

            const data = await res.json();

            // Append the new review to the local list
            setReviews((prev) => [data.review, ...prev]);
            setRatingsCount(data.product.reviews_count);
            setRatingScore(data.product.rating_score);
            setSubmitStatus('done');
            setForm({ name: '', email: '', rating: 0, comment: '' });
        } catch {
            setFormError('Network error. Please try again.');
            setSubmitStatus('error');
        }
    };

    return (
        <>
            <Head title={`${currentProduct.title} - Cleopatra Baklava`} />
            <Header />
            <div className="text-on-surface min-h-screen bg-background font-sans">
                <main className="pt-32 pb-28 md:pb-16">
                    {/* ── Product Hero ───────────────────────────────────────────────── */}
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
                                            <span
                                                className={`rounded-full px-4 py-1 font-label-md text-[12px] tracking-wider uppercase shadow-lg ${
                                                    currentProduct.badge === 'New' || currentProduct.badge === 'New Collection'
                                                        ? 'bg-[#e8e2d6] text-[#4d4637]'
                                                        : currentProduct.badge === 'Premium Choice'
                                                          ? 'bg-[#1e1b14] text-[#c9a84c]'
                                                          : 'bg-[#755b00] text-white'
                                                }`}
                                            >
                                                {currentProduct.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        onClick={() => setActiveImage(currentProduct.image)}
                                        className={`aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors ${
                                            activeImage === currentProduct.image
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-outline-variant/30 hover:border-primary'
                                        }`}
                                    >
                                        <img alt="Main product" className="h-full w-full object-cover" src={currentProduct.image} />
                                    </div>
                                    {currentProduct.additionalImages?.map((imgUrl, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveImage(imgUrl)}
                                            className={`aspect-square cursor-pointer overflow-hidden rounded-lg border transition-colors ${
                                                activeImage === imgUrl
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-outline-variant/30 hover:border-primary'
                                            }`}
                                        >
                                            <img alt={`Detail view ${index + 1}`} className="h-full w-full object-cover" src={imgUrl} />
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Right: Product Details */}
                            <div className="lg:sticky lg:top-12 lg:col-span-5">
                                <nav className="text-on-surface-variant mb-6 flex flex-wrap gap-2 font-label-md text-[12px] tracking-widest uppercase">
                                    <Link className="hover:text-primary" href="/shop">Shop</Link>
                                    <span>/</span>
                                    {currentProduct.category && (
                                        <>
                                            <Link className="hover:text-primary" href={`/shop?category=${encodeURIComponent(currentProduct.category)}`}>{currentProduct.category}</Link>
                                            <span>/</span>
                                        </>
                                    )}
                                    <span className="text-primary">{currentProduct.title}</span>
                                </nav>

                                <h1 className="text-on-surface mb-2 font-headline-md text-[36px] md:text-[48px] leading-tight">
                                    {currentProduct.title}
                                </h1>

                                {/* Live rating summary */}
                                <div className="mb-6 flex items-center gap-4">
                                    <StarDisplay rating={ratingScore} size={18} />
                                    <span className="text-on-surface-variant font-body-md text-sm">
                                        ({ratingsCount} {ratingsCount === 1 ? 'Review' : 'Reviews'})
                                    </span>
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
                                                {currentProduct.tags.map((tag, i) => (
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

                    {/* ── Geometric separator ────────────────────────────────────────── */}
                    <div className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-24 flex items-center gap-4 opacity-30">
                        <div className="h-[1px] flex-1 bg-primary" />
                        <div className="h-2 w-2 rotate-45 border border-primary bg-primary" />
                        <div className="h-[1px] flex-1 bg-primary" />
                    </div>

                    {/* ── Related Products ───────────────────────────────────────────── */}
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
                                                <span
                                                    className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                                                        item.badge === 'New' || item.badge === 'New Collection'
                                                            ? 'bg-[#e8e2d6] text-[#4d4637]'
                                                            : item.badge === 'Premium Choice'
                                                              ? 'bg-[#1e1b14] text-[#c9a84c]'
                                                              : 'bg-[#755b00] text-white'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mb-1 font-serif font-bold text-foreground transition-colors group-hover:text-primary">
                                            {item.title}
                                        </h3>
                                        <p className="font-label-md text-sm text-primary">€{Number(item.price).toFixed(2)} / pc</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ── Reviews Section ────────────────────────────────────────────── */}
                    <section className="max-w-container-max px-margin-mobile md:px-margin-desktop mx-auto mb-32">

                        {/* Section header */}
                        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-px w-8 bg-primary/40" />
                                    <span className="text-[11px] font-semibold tracking-[4px] uppercase text-primary">Customer Reviews</span>
                                </div>
                                <h2 className="font-serif text-[32px] font-semibold text-foreground">
                                    What Our Guests Say
                                </h2>
                            </div>
                            <button
                                onClick={() => { setShowForm(!showForm); setSubmitStatus('idle'); }}
                                className="flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-all cursor-pointer whitespace-nowrap"
                            >
                                <MessageSquarePlus size={16} />
                                Write a Review
                                <ChevronDown size={14} className={`transition-transform duration-300 ${showForm ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Rating overview card */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                            <div className="bg-[#1e1b14] rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
                                <div className="text-[64px] leading-none font-bold text-[#c9a84c] mb-2">
                                    {ratingsCount > 0 ? ratingScore.toFixed(1) : '—'}
                                </div>
                                <StarDisplay rating={ratingScore} size={18} />
                                <p className="text-[#9e8b6e] text-sm mt-3 leading-relaxed">
                                    Based on {ratingsCount} verified {ratingsCount === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>

                            {/* Review cards list */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews.length === 0 ? (
                                    <div className="md:col-span-2 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8dfc8] bg-[#fdfbf5] p-12 text-center">
                                        <Star size={36} className="text-[#e8dfc8] mb-4" />
                                        <p className="font-serif text-lg font-semibold text-[#4d4637] mb-2">No reviews yet</p>
                                        <p className="text-sm text-[#9e8b6e]">Be the first to share your experience with this delicacy.</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border border-[#e8dfc8] rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#f5ede0] flex items-center justify-center flex-shrink-0">
                                                        <User size={16} className="text-[#c9a84c]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[#1e1b14] text-sm">{review.name}</p>
                                                        <p className="text-[11px] text-[#9e8b6e]">{review.created_at}</p>
                                                    </div>
                                                </div>
                                                <StarDisplay rating={review.rating} size={12} />
                                            </div>
                                            <p className="text-[#4d4637] text-sm italic leading-relaxed flex-1">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* ── Write a Review Form (slide-in) ──────────────────────────── */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                showForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="mt-4 rounded-2xl border border-[#e8dfc8] bg-[#fdfbf5] p-8 shadow-sm">

                                {/* Success state */}
                                {submitStatus === 'done' ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <CheckCircle size={52} className="text-[#c9a84c] mb-4" />
                                        <h3 className="font-serif text-2xl font-semibold text-[#1e1b14] mb-2">
                                            Thank you for your review!
                                        </h3>
                                        <p className="text-[#6b5e47] text-sm mb-6">
                                            Your experience helps other guests discover the finest of our collection.
                                        </p>
                                        <button
                                            onClick={() => { setSubmitStatus('idle'); setShowForm(false); }}
                                            className="px-8 py-3 rounded-full bg-[#1e1b14] text-[#c9a84c] text-sm font-semibold tracking-widest uppercase hover:bg-[#2e2a1e] transition-colors cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px flex-1 bg-[#e8dfc8]" />
                                            <span className="text-[11px] font-semibold tracking-[4px] uppercase text-[#c9a84c]">Share Your Experience</span>
                                            <div className="h-px flex-1 bg-[#e8dfc8]" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#4d4637] mb-2">
                                                    Your Name <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    placeholder="e.g. Sofia M."
                                                    className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-white text-[#1e1b14] placeholder-[#b0a28c] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all"
                                                />
                                            </div>
                                            {/* Email */}
                                            <div>
                                                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#4d4637] mb-2">
                                                    Email Address <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="your@email.com"
                                                    className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-white text-[#1e1b14] placeholder-[#b0a28c] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Star Rating */}
                                        <div className="mb-6">
                                            <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#4d4637] mb-3">
                                                Your Rating <span className="text-red-400">*</span>
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                                                {form.rating > 0 && (
                                                    <span className="text-sm text-[#c9a84c] font-semibold">
                                                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Exceptional!'][form.rating]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <div className="mb-6">
                                            <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#4d4637] mb-2">
                                                Your Review <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={form.comment}
                                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                                placeholder="Describe your experience — the texture, flavour, presentation..."
                                                className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-white text-[#1e1b14] placeholder-[#b0a28c] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all resize-none"
                                            />
                                        </div>

                                        {/* Error */}
                                        {(formError || submitStatus === 'error') && (
                                            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                                {formError || 'An error occurred. Please try again.'}
                                            </p>
                                        )}

                                        {/* Submit */}
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={submitStatus === 'loading'}
                                                className="flex items-center gap-2 bg-[#1e1b14] text-[#c9a84c] px-10 py-3.5 rounded-xl text-sm font-bold tracking-[3px] uppercase hover:bg-[#2e2a1e] transition-all cursor-pointer disabled:opacity-60 shadow-md"
                                            >
                                                {submitStatus === 'loading' ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Submit Review'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
