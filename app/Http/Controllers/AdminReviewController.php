<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class AdminReviewController extends Controller
{
    public function toggleApprove(Review $review): RedirectResponse
    {
        $review->update([
            'approved' => !$review->approved,
        ]);

        $this->recalculateProductRating($review->product_id);

        return redirect()->route('admin.index')->with('success',
            $review->approved ? 'Review approved.' : 'Review disapproved.'
        );
    }

    public function destroy(Review $review): RedirectResponse
    {
        $productId = $review->product_id;
        $review->delete();

        $this->recalculateProductRating($productId);

        return redirect()->route('admin.index')->with('success', 'Review deleted successfully!');
    }

    private function recalculateProductRating(int $productId): void
    {
        $product = Products::find($productId);
        if (!$product) {
            return;
        }

        $aggregates = Review::where('product_id', $productId)
            ->where('approved', true)
            ->selectRaw('COUNT(*) as total, AVG(rating) as avg_rating')
            ->first();

        $product->reviews_count = $aggregates->total ?? 0;
        $product->rating_score  = round($aggregates->avg_rating ?? 0, 1);
        $product->save();
    }
}
