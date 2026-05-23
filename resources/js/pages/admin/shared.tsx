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

export const c = {
    bg: '#f7f5f0', surface: '#ffffff', border: '#e8e2d6', borderHover: '#c9a84c',
    dark: '#1e1b14', muted: '#8a7d6a', gold: '#c9a84c', goldDark: '#755b00',
    goldLight: 'rgba(201,168,76,0.10)', danger: '#dc2626', dangerLight: 'rgba(220,38,38,0.08)',
    nav: '#1a1712', text: '#1e1b14', textMuted: '#8a7d6a', textFaint: '#b5a898',
    green: '#16a34a', greenLight: 'rgba(22,163,74,0.10)',
};

export const inputClass = "block w-full box-border px-3.5 py-[11px] rounded-xl text-sm outline-none transition-[border-color] duration-200 font-inherit";
export const inputStyle = { border: `1.5px solid ${c.border}`, color: c.text, background: c.bg };
export const labelClass = "block text-[11px] font-bold tracking-[0.12em] uppercase mb-[7px]";

export function Pill({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
    return (
        <span className="inline-block px-2.5 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase"
            style={{
                background: gold ? c.goldLight : '#f0ece4',
                border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : '#e2dac8'}`,
                color: gold ? c.goldDark : c.textMuted,
            }}>
            {children}
        </span>
    );
}

export function Stat({ icon: Icon, label, value, suffix }: { icon: React.ComponentType<{ size?: number | string }>; label: string; value: string | number; suffix?: string }) {
    return (
        <div className="bg-white rounded-xl px-6 py-[22px] flex items-center gap-[18px]"
            style={{ border: `1px solid ${c.border}` }}>
            <div className="w-[52px] h-[52px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: c.goldLight, color: c.goldDark }}>
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: c.textFaint }}>{label}</span>
                <div className="text-[28px] font-extrabold leading-none flex items-baseline gap-1 mt-[5px]" style={{ color: c.dark }}>
                    {value}
                    {suffix && <span className="text-base" style={{ color: c.gold }}>{suffix}</span>}
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
