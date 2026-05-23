<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Products;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminProductController extends Controller
{
    /**
     * Display the product list and statistics dashboard.
     */
    public function index(): InertiaResponse
    {
        $products = Products::with('category')->orderBy('id', 'desc')->get();
        $categories = Categories::all();

        // Gather metrics
        $totalProducts = Products::count();
        $totalReviews = Review::count();
        $avgRating = round((float)Products::avg('rating_score'), 1);
        if ($avgRating === 0.0) {
            $avgRating = 5.0;
        }
        $totalCategories = Categories::count();

        return Inertia::render('admin/dashboard', [
            'products' => $products,
            'categories' => $categories,
            'stats' => [
                'total_products' => $totalProducts,
                'total_reviews' => $totalReviews,
                'avg_rating' => $avgRating,
                'total_categories' => $totalCategories,
            ],
        ]);
    }

    /**
     * Store a newly created product in database.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:products,title'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'image' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable'],
            'additional_images' => ['nullable'],
        ]);

        // Process tags
        if (isset($data['tags'])) {
            if (is_string($data['tags'])) {
                $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
            }
        } else {
            $data['tags'] = [];
        }

        // Process additional images
        if (isset($data['additional_images'])) {
            if (is_string($data['additional_images'])) {
                $data['additional_images'] = array_values(array_filter(array_map('trim', explode(',', $data['additional_images']))));
            }
        } else {
            $data['additional_images'] = [];
        }

        // Default counters
        $data['reviews_count'] = 0;
        $data['rating_score'] = 5.0;

        Products::create($data);

        return redirect()->route('admin.products')->with('success', 'Product created successfully!');
    }

    /**
     * Update the specified product in database.
     */
    public function update(Request $request, Products $product): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:products,title,' . $product->id],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'image' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:50'],
            'tags' => ['nullable'],
            'additional_images' => ['nullable'],
        ]);

        // Process tags
        if (isset($data['tags'])) {
            if (is_string($data['tags'])) {
                $data['tags'] = array_values(array_filter(array_map('trim', explode(',', $data['tags']))));
            }
        } else {
            $data['tags'] = [];
        }

        // Process additional images
        if (isset($data['additional_images'])) {
            if (is_string($data['additional_images'])) {
                $data['additional_images'] = array_values(array_filter(array_map('trim', explode(',', $data['additional_images']))));
            }
        } else {
            $data['additional_images'] = [];
        }

        $product->update($data);

        return redirect()->route('admin.products')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product from database.
     */
    public function destroy(Products $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products')->with('success', 'Product deleted successfully!');
    }
}
