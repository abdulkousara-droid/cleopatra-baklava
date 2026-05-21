<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    /**
     * Page 1: Shop Page
     * Displays all items grouped by their category listings.
     * Supports: Best Seller, New, Premium Choice, or null badges.
     */
    public function shop(): Response
    {
        return Inertia::render('shop', [
            // Pull everything so the frontend can easily toggle categories dynamically
            'products' => Products::with('category')->select([
                'id', 'title', 'description', 'price', 'category_id', 'badge', 'image', 'tags'
            ])->latest()->get()->map(function ($product) {
                $data = $product->toArray();
                $data['category'] = $product->category ? $product->category->name : null;
                return $data;
            })
        ]);
    }

    /**
     * Page 2: New Arrivals Page
     * Exclusively showcases items labeled with the "New Collection" badge flag.
     */
    public function newArrivals(): Response
    {
        return Inertia::render('newarrivals', [
            'products' => Products::where('badge', 'New Collection')
                ->select(['id', 'title', 'description', 'price', 'badge', 'image'])
                ->latest()
                ->get()
        ]);
    }

    /**
     * Page 3: Most Popular Page
     * Fetches high-performing catalog variants showing rating and review metrics.
     */
    public function mostPopular(): Response
    {
        return Inertia::render('mostpopular', [
            'products' => Products::where('badge', 'Best Seller')
                ->select(['id', 'title', 'description', 'price', 'badge', 'image', 'reviews_count', 'rating_score'])
                ->orderBy('rating_score', 'desc')
                ->get()
        ]);
    }
}
