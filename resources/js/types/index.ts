export interface Category {
    id: number;
    name: string;
}

export interface CartItem {
    id: number | string;
    title: string;
    price: number | string;
    quantity: number;
    badge: string | null;
    image: string;
    description: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number | string;
    category_id: number | null;
    category: string | null;
    badge: string | null;
    image: string;
    tags: string[];
    additional_images?: string[];
    reviews_count?: number;
    rating_score?: number;
    borderAccent?: boolean;
}
