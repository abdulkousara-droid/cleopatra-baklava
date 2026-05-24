import React from 'react';

export interface Category { id: number; name: string; products_count?: number; }
export interface Product {
    id: number; title: string; price: number; category_id: number;
    badge: string | null; description: string; image: string;
    additional_images: string[] | null; tags: string[] | null;
    allergens: string[] | null;
    reviews_count: number; rating_score: number; category?: Category;
}
export interface Review {
    id: number; product_id: number; name: string; email: string;
    rating: number; comment: string; approved: boolean;
    created_at: string; product: { id: number; title: string; };
}
export interface FeatureItem { icon: string; title: string; text: string; }

export const inputClass = "block w-full px-3.5 py-[11px] rounded-xl text-sm outline-none transition-colors duration-200 font-inherit border-[1.5px] border-admin-border text-foreground bg-admin-bg";
export const labelClass = "block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px] text-admin-muted";

export function Pill({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
    return (
        <span className={`inline-block px-2.5 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase ${
            gold
                ? 'bg-accent/10 border border-accent/30 text-primary'
                : 'bg-[#f0ece4] border border-[#e2dac8] text-admin-muted'
        }`}>
            {children}
        </span>
    );
}

export function Stat({ icon: Icon, label, value, suffix }: { icon: React.ComponentType<{ size?: number | string }>; label: string; value: string | number; suffix?: string }) {
    return (
        <div className="bg-card rounded-xl px-6 py-[22px] flex items-center gap-[18px] border border-admin-border">
            <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center shrink-0 bg-accent/10 text-primary">
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-admin-faint">{label}</span>
                <div className="text-[28px] font-extrabold leading-none flex items-baseline gap-1 mt-[5px] text-foreground">
                    {value}
                    {suffix && <span className="text-base text-accent">{suffix}</span>}
                </div>
            </div>
        </div>
    );
}

export function parseFeatures(raw: string): FeatureItem[] {
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 3) return parsed;
    } catch {}
    return [
        { icon: '🌿', title: '', text: '' },
        { icon: '🏛️', title: '', text: '' },
        { icon: '📦', title: '', text: '' },
    ];
}
