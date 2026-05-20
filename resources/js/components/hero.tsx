import React from 'react';

export default function Hero() {
    return (
        <section className="relative mt-20 flex h-[570px] w-full items-center justify-center overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAiFP-LDB1Zln5IBYE1MpGc9ubHb09MdlPmuPqiKabr1bbMMo2xIGP6oSqL9Bc8UdC4ItgEpDuovh5NKLOzPkh4ZOpq9vygyEnD7jyijWXo5O0pxJxDIjWADIS8FXzdALH_QiAhM66NpRBWMEy_m0ujVdRRWLhK7pLA2jQ6heIXQ2g4jrDSQeTQWUCcv6kRP3ntB8pMd_tObVM6eVc94BCwnHNwL9ZcWYMyb31RnzyXeCM9yn63isUl_Pdp8cvGMobQJAVn50G-UGy"
                    alt="Artisanal baklava layers with pistachios"
                    className="h-full w-full object-cover"
                />
                {/* Shadow Overlay calibrated to look crisp over the image canvas */}
                <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/75"></div>
            </div>

            {/* Hero Content Wrapper */}
            <div className="relative z-10 max-w-4xl px-6 text-center text-white md:px-16">
                <h2 className="mb-4 font-serif text-5xl leading-tight font-bold tracking-tight md:text-6xl">
                    Cleopatra Baklava
                </h2>

                <p className="mb-10 font-sans text-lg tracking-wide italic opacity-90 md:text-xl">
                    Authentic Middle Eastern Sweets in the Heart of Barcelona
                </p>

                {/* Call to Actions using your customized CSS Theme buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button className="w-full cursor-pointer rounded-full bg-primary px-10 py-4 text-sm font-semibold tracking-widest text-primary-foreground uppercase shadow-lg transition-all duration-300 hover:opacity-90 sm:w-auto">
                        Shop the Collection
                    </button>

                    <button className="w-full cursor-pointer rounded-full border border-white/60 px-10 py-4 text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-xs transition-all duration-300 hover:bg-white/10 sm:w-auto">
                        Our Story
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
    );
}
