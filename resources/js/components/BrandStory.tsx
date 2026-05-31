import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BrandStory() {
    const { t } = useTranslation();

    return (
        <section id="story-section" className="bg-muted/40 py-24 md:py-32 overflow-hidden relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">

                <div className="relative group justify-self-center w-full max-w-md md:max-w-none">
                    <div className="absolute -inset-4 border border-primary rounded-xl -rotate-2 z-0 hidden sm:block"></div>

                    <div className="rounded-xl relative z-10 overflow-hidden shadow-xl aspect-[4/5] bg-card border border-border">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArBr2E9jfeUhxP8azQLxr4uZ-d3g-9xXTGmRjaJC8x1Xz8oGfLLJaEv6PHVZVll6YTUYFRP74S0trfx9eQ9c5oaXjE7L9eNzPWNJlKtar4QMsca76kLQL8jgzcG06-jghosTuk7GgzbhqTiazUF6g_QRnBhuoiZI2FNfvY9HOpHh7corENHiX5opsNdM0fBUoAH57ZtkeYiBgiXXVj10EKxFqaGB36pgdaPKMYaY959ER6C5k80CRh2bAW6V9SAyHq1U7QxNoBy5P5"
                            alt="Elegant interior of the Cleopatra Baklava luxury boutique in Barcelona"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4 block">
            {t('brand_story.heritage')}
          </span>

                    <h3 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6 md:mb-8">
                        {t('brand_story.title')}
                    </h3>

                    <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-sans">
                        <p>{t('brand_story.p1')}</p>
                        <p>{t('brand_story.p2')}</p>
                        <p>{t('brand_story.p3')}</p>
                    </div>

                    <div className="mt-8 md:mt-10 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-primary"></div>
                        <span className="font-serif text-lg md:text-xl italic text-primary font-medium">
                            {t('brand_story.founder')}
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}
