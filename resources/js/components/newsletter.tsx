import React, { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: any) => {
        e.preventDefault();
        // Handle newsletter subscription actions here
        console.log('Subscribing email:', email);
    };

    return (
        <section className="py-24 max-w-2xl mx-auto px-6 text-center bg-background">

            {/* Decorative Food/Menu SVG Icon colored with theme Primary Gold */}
            <div className="flex justify-center mb-6 text-primary">
                <svg
                    className="w-12 h-12 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-8.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7zm7-3c-1.66 0-3 1.34-3 3v4h4v-4c0-1.66-1.34-3-3-3zm3 11h-8v2h8v-2zm0 4h-8v2h8v-2z"/>
                </svg>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Taste the Extraordinary
            </h3>

            <p className="text-muted-foreground font-sans text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join our newsletter for exclusive tasting invites and seasonal collection reveals.
            </p>

            {/* Subscription Action Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    aria-label="Email address for newsletter subscription"
                    className="flex-grow bg-card text-foreground border border-border rounded-lg px-5 py-4 font-sans text-base placeholder-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                />

                <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-10 py-4 font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-98 transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap"
                >
                    Subscribe
                </button>
            </form>

        </section>
    );
}
