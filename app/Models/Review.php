<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'email',
        'rating',
        'comment',
        'approved',
    ];

    protected $casts = [
        'rating'   => 'integer',
        'approved' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
