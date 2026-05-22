import { Link } from '@inertiajs/react';
import React from 'react';

export default function Hero() {
    return (
        <>
            <section className="relative mt-22 flex w-full items-center justify-center overflow-hidden text-white h-[560px]">
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-baklava.png"
                        alt="Artisanal baklava layers with pistachios"
                        className="h-full w-full object-cover"
                    />
                    {/* Shadow Overlay calibrated to look crisp over the image canvas */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/75"></div>
                </div>

                {/* Hero Content Wrapper */}
                <div className="relative z-10 max-w-4xl px-margin-mobile text-center text-white md:px-margin-desktop">
                    <h2 className="mb-4 font-serif text-[36px] leading-tight font-bold tracking-tight md:text-[48px]">
                        Cleopatra Baklava
                    </h2>

                    <p className="mb-10 font-sans text-lg tracking-wide italic opacity-90 md:text-xl">
                        Authentic Middle Eastern Sweets in the Heart of
                        Barcelona
                    </p>

                    {/* Call to Actions using your customized CSS Theme buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button className="w-full cursor-pointer rounded-full bg-primary px-10 py-4 text-sm font-semibold tracking-widest text-primary-foreground uppercase shadow-lg transition-all duration-300 hover:opacity-90 sm:w-auto">
                            <Link href={'/shop'}> Shop the Collection</Link>
                        </button>

                        <button className="w-full cursor-pointer rounded-full border border-white/60 px-10 py-4 text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-xs transition-all duration-300 hover:bg-white/10 sm:w-auto">
                            <a href="#story-section">Our Story</a>
                        </button>
                    </div>
                </div>

                {/* Decorative Animated Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white opacity-70">
                    <span className="material-symbols-outlined text-3xl">
                        Expand More
                    </span>
                </div>
            </section>
        </>
    );
}
