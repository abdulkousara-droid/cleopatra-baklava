import { Link } from '@inertiajs/react';
import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
    return (
        <>
            <section className="relative mt-22 flex w-full items-center justify-center overflow-hidden text-white h-[75vh] min-h-[560px] md:h-[80vh] md:min-h-[560px] lg:min-h-[680px]">
                {/* Background Image Container with modern Ken Burns zoom effect */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <picture>
                        <source srcSet="/hero-baklava.webp" type="image/webp" />
                        <img
                            src="/hero-baklava.png"
                            alt="Artisanal baklava layers with pistachios"
                            width="1024"
                            height="1024"
                            fetchPriority="high"
                            className="h-full w-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                        />
                    </picture>
                    {/* Dark gradient overlays for cinematic lighting and high text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
                </div>

                {/* Ambient Golden Glow behind content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none z-5"></div>

                {/* Hero Content Wrapper */}
                <div className="relative z-10 max-w-4xl px-margin-mobile text-center text-white md:px-margin-desktop">
                    {/* Eyebrow tag */}
                    <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.25em] text-accent uppercase mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        The Taste of Royal Tradition
                    </span>

                    {/* Highly aesthetic split title: Cleopatra (elegant italic serif) + Baklava (bold golden gradient) */}
                    <h2 className="mb-2 font-serif text-[42px] leading-tight md:text-[72px] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                        <span className="italic font-normal text-stone-100 font-serif mr-2 md:mr-4">
                            Cleopatra
                        </span>
                        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-bold">
                            Baklava
                        </span>
                    </h2>

                    {/* Classic brand separator ornament */}
                    <div className="flex items-center justify-center gap-4 my-6">
                        <span className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-amber-400/60"></span>
                        <span className="text-amber-400/90 text-xs">✦</span>
                        <span className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-amber-400/60"></span>
                    </div>

                    {/* Elegant, clean and premium subtitle */}
                    <p className="mb-10 font-sans text-base md:text-xl tracking-wide text-stone-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        Authentic Middle Eastern Sweets in the Heart of{' '}
                        <span className="text-amber-300 font-medium border-b border-amber-300/30 pb-0.5">
                            Barcelona
                        </span>
                    </p>

                    {/* Action buttons with subtle high-end animations */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/shop"
                            className="w-full cursor-pointer rounded-full bg-primary px-10 py-4 text-sm font-semibold tracking-widest text-primary-foreground uppercase shadow-xl transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-98 sm:w-auto text-center"
                        >
                            Shop the Collection
                        </Link>

                        <a
                            href="#story-section"
                            className="w-full cursor-pointer rounded-full border border-white/60 px-10 py-4 text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-xs transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105 active:scale-98 sm:w-auto text-center"
                        >
                            Our Story
                        </a>
                    </div>
                </div>

                {/* Decorative Animated Scroll Indicator */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce text-white opacity-75 cursor-pointer z-10">
                    <a href="#bestsellers-section" className="flex flex-col items-center group gap-1" aria-label="Scroll to Bestsellers">
                        <span className="text-[14px] font-bold tracking-[0.25em] text-stone-300 transition-colors duration-300 group-hover:text-amber-300">
                            Explore More
                        </span>
                        <ChevronDown className="h-15 w-15 text-white transition-transform duration-300 group-hover:scale-110" />
                    </a>
                </div>
            </section>
        </>
    );
}
