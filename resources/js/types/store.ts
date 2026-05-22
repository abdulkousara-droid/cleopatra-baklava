export type Product = {
    id: number;
    name: string;
    title: string;
    price: number;
    description: string;
    image: string;
    badge: string | null;
    tags: string | null;
    category: string | null;
    rating_score: number | null;
    reviews_count: number | null;
    created_at: string | null;
};

export type CartItem = {
    id: number | string;
    title: string;
    price: number;
    quantity: number;
    badge?: string | null;
    image?: string;
    description?: string;
};
