import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border text-foreground pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                {/* Brand Column */}
                <div className="space-y-4">
                    <h4 className="font-serif text-2xl font-bold text-primary tracking-tight">
                        Cleopatra
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                        Handcrafted Middle Eastern delicacies and fine artisanal pastries in the heart of Barcelona.
                    </p>
                </div>

                {/* Hours Column */}
                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Boutique Hours
                    </h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <span className="font-medium text-foreground block">Mon — Sat</span>
                            9:00 - 15:00 | 17:00 - 21:00
                        </li>
                        <li>
                            <span className="font-medium text-foreground block">Sunday</span>
                            11:00 - 15:00 <span className="text-xs opacity-75">(Afternoons Closed)</span>
                        </li>
                    </ul>
                </div>

                {/* Location Column */}
                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Visit Us
                    </h5>
                    <address className="text-sm text-muted-foreground not-italic space-y-2 leading-relaxed">
                        <p>
                            Carrer de Còrsega, 535<br />
                            08025 Barcelona, Spain
                        </p>
                        <p className="text-xs text-muted-foreground/80 italic">
                            Steps away from Sagrada Família
                        </p>
                        <p className="pt-1 block text-foreground font-medium">
                            Tlf: +34 933 48 08 49
                        </p>
                    </address>
                </div>

                {/* Social / Quick Navigation Links */}
                <div className="space-y-4">
                    <h5 className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Navigation
                    </h5>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                Our Collections
                            </Link>
                        </li>
                        <li>
                            <Link href="/heritage" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                Our Heritage Story
                            </Link>
                        </li>
                        <li>
                            <Link href="/catering" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                                Catering & Delivery
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Bottom Legal / Attributions Bar */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>
                    &copy; {currentYear} Cleopatra Baklava. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
