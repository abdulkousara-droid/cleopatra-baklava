import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ComingSoon({ page = 'Page' }: { page?: string }) {
    return (
        <>
            <Head>
                <title>404 Not Found — Coming Soon</title>
            </Head>

            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff9ef] px-6 text-center font-sans">
                {/* Minimalist 404 | Coming Soon header */}
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    <span className="font-serif text-4xl md:text-5xl font-semibold text-primary">404</span>
                    <span className="h-8 w-[1px] bg-stone-300"></span>
                    <span className="text-sm md:text-base tracking-widest uppercase font-semibold text-stone-600">Coming Soon</span>
                </div>
                
                {/* Simple explanatory title and subtitle */}
                <h1 className="mt-6 font-serif text-2xl md:text-3xl font-medium text-foreground">
                    {page} Not Found
                </h1>
                
                <p className="mt-3 text-stone-500 max-w-sm text-sm leading-relaxed">
                    This page does not exist yet. We are working on it and it will be coming soon!
                </p>

                {/* Back to home link */}
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs tracking-widest uppercase font-bold text-primary hover:text-accent transition-colors duration-200"
                    >
                        ← Return to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
