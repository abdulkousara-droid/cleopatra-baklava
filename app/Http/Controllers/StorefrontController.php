<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    /**
     * Page 1: Shop Page
     */
    public function shop(): Response
    {
        $category = request('category');

        return Inertia::render('shop', [
            'categories' => Category::where('name', '!=', 'All')->withCount('products')->get(),
            'products' => Product::with('category')->select([
                'id', 'title', 'description', 'price', 'category_id', 'badge', 'image', 'tags'
            ])->latest()->get()->map(function ($product) {
                $data = $product->toArray();
                $data['category'] = $product->category ? $product->category->name : null;
                return $data;
            }),
            'initialCategory' => $category ?: 'All',
        ]);
    }

    /**
     * Page 2: New Arrivals Page
     */
    public function newArrivals(): Response
    {
        return Inertia::render('newarrivals', [
            'products' => Product::where('badge', 'New Collection')
                ->select(['id', 'title', 'description', 'price', 'badge', 'image'])
                ->latest()->get()
        ]);
    }

    /**
     * Page 3: Most Popular Page
     */
    public function mostPopular(): Response
    {
        return Inertia::render('mostpopular', [
            'products' => Product::where('badge', 'Best Seller')
                ->select(['id', 'title', 'description', 'price', 'badge', 'image', 'reviews_count', 'rating_score'])
                ->orderBy('rating_score', 'desc')->get()
        ]);
    }

    /**
     * Home Page — shows 3 featured products in the Bestsellers section
     */
    public function home(): Response
    {
        $columns = ['id', 'title', 'description', 'price', 'badge', 'image'];

        $featuredProducts = Product::whereIn('badge', ['Best Seller', 'Top Rated'])
            ->select($columns)
            ->latest()
            ->take(3)
            ->get();

        if ($featuredProducts->count() < 3) {
            $fallbackProducts = Product::whereNotIn('id', $featuredProducts->pluck('id'))
                ->select($columns)
                ->latest()
                ->take(3 - $featuredProducts->count())
                ->get();

            $featuredProducts = $featuredProducts->concat($fallbackProducts)->values();
        }

        return Inertia::render('home', [
            'products' => $featuredProducts,
        ]);
    }

    /**
     * Product Show Page
     * Returns full product data + up to 4 related products from same category.
     */
    public function productshow(Request $request): Response
    {
        $id = $request->query('id');

        $product = Product::with('category')->find($id);

        if (!$product) {
            abort(404);
        }

        // Build product data with camelCase additionalImages for React
        $productData = [
            'id'               => $product->id,
            'title'            => $product->title,
            'description'      => $product->description,
            'price'            => $product->price,
            'badge'            => $product->badge,
            'image'            => $product->image,
            'additionalImages' => $product->additional_images ?? [],
            'tags'             => $product->tags ?? [],
            'allergens'        => $product->allergens ?? [],
            'category'         => $product->category ? $product->category->name : null,
            'reviews_count'    => $product->reviews_count,
            'rating_score'     => $product->rating_score,
        ];

        // Fetch up to 4 related products (same category, exclude current)
        $relatedProducts = [];
        if ($product->category_id) {
            $relatedProducts = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->select(['id', 'title', 'price', 'badge', 'image'])
                ->take(4)
                ->get()
                ->map(fn($p) => [
                    'id'    => $p->id,
                    'title' => $p->title,
                    'price' => $p->price,
                    'badge' => $p->badge,
                    'image' => $p->image,
                ])
                ->toArray();
        }

        // Fetch approved reviews for this product (newest first)
        $reviews = Review::where('product_id', $product->id)
            ->where('approved', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($r) => [
                'id'         => $r->id,
                'name'       => $r->name,
                'rating'     => $r->rating,
                'comment'    => $r->comment,
                'created_at' => $r->created_at->format('M d, Y'),
            ]);

        return Inertia::render('productshow', [
            'product'         => $productData,
            'relatedProducts' => $relatedProducts,
            'reviews'         => $reviews,
        ]);
    }

    /**
     * API: Search Products
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        if (!$query) {
            return response()->json([]);
        }
        $products = Product::where('title', 'ilike', '%' . $query . '%')
            ->orWhere('description', 'ilike', '%' . $query . '%')
            ->select(['id', 'title', 'price', 'image', 'description'])
            ->take(5)->get();
        return response()->json($products);
    }
}
