<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
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

        // Recalculate product rating_score and reviews_count
        $product = Products::findOrFail($validated['product_id']);
        $aggregates = Review::where('product_id', $product->id)
            ->where('approved', true)
            ->selectRaw('COUNT(*) as total, AVG(rating) as avg_rating')
            ->first();

        $product->reviews_count = $aggregates->total ?? 0;
        $product->rating_score  = round($aggregates->avg_rating ?? 0, 1);
        $product->save();

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
