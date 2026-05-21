<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Products extends Model
{
    /** @use HasFactory<\Database\Factories\ProductsFactory> */
    use HasFactory;

    protected $fillable = [
        'title', 'price', 'category_id', 'badge', 'description',
        'image', 'additional_images', 'tags', 'reviews_count', 'rating_score'
    ];

    protected $casts = [
        'tags' => 'array',
        'additional_images' => 'array',
        'price' => 'float',
        'rating_score' => 'float',
        'reviews_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }
}
