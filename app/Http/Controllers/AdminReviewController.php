<?php

namespace App\Http\Controllers;

use App\Models\Product;
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
        Product::recalculateRating($productId);
    }
}
