<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categories extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriesFactory> */
    use HasFactory;
    protected $fillable = ['name'];

    public function products(): HasMany
    {
        // Tell Laravel specifically to use 'category_id' instead of 'categories_id'
        return $this->hasMany(Products::class, 'category_id');
    }
}
