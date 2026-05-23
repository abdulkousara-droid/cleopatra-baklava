<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminReviewController extends Controller
{
    public function index(): InertiaResponse
    {
        $reviews = Review::with('product')->orderBy('id', 'desc')->get();

        return Inertia::render('admin/reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function toggleApprove(Review $review): RedirectResponse
    {
        $review->update([
            'approved' => !$review->approved,
        ]);

        $this->recalculateProductRating($review->product_id);

        return redirect()->route('admin.reviews')->with('success',
            $review->approved ? 'Review approved.' : 'Review disapproved.'
        );
    }

    public function destroy(Review $review): RedirectResponse
    {
        $productId = $review->product_id;
        $review->delete();

        $this->recalculateProductRating($productId);

        return redirect()->route('admin.reviews')->with('success', 'Review deleted successfully!');
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
