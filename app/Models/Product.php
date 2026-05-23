<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'title', 'price', 'category_id', 'badge', 'description',
        'image', 'additional_images', 'tags', 'allergens', 'reviews_count', 'rating_score'
    ];

    protected $casts = [
        'tags' => 'array',
        'additional_images' => 'array',
        'allergens' => 'array',
        'price' => 'float',
        'rating_score' => 'float',
        'reviews_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public static function recalculateRating(int $productId): void
    {
        $product = self::find($productId);
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
