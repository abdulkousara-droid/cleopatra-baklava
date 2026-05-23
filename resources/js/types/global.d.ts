import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    whatsapp_number: string;
    store_location: string;
    [key: string]: unknown;
}
