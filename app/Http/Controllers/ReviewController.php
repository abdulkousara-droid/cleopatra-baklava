<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller implements \Illuminate\Routing\Controllers\HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'throttle:reviews',
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'name'       => ['required', 'string', 'max:120'],
            'email'      => ['required', 'email', 'max:255'],
            'rating'     => ['required', 'integer', 'min:1', 'max:5'],
            'comment'    => ['required', 'string', 'min:10', 'max:1500'],
        ]);

        // Save review
        $review = Review::create($validated);

        Product::recalculateRating($validated['product_id']);

        $product = Product::findOrFail($validated['product_id']);

        return response()->json([
            'status'  => 'created',
            'review'  => [
                'id'         => $review->id,
                'name'       => $review->name,
                'rating'     => $review->rating,
                'comment'    => $review->comment,
                'created_at' => $review->created_at->format('M d, Y'),
            ],
            'product' => [
                'rating_score'  => $product->rating_score,
                'reviews_count' => $product->reviews_count,
            ],
        ], 201);
    }
}
