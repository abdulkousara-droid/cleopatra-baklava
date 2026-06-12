<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id'       => 1,
            'title'             => fake()->words(3, true),
            'price'             => fake()->randomElement([4.50, 8.00, 14.00, 28.00]),
            'badge'             => null,
            'description'       => fake()->sentence(),
            'image'             => 'https://placehold.co/400x300',
            'additional_images' => [],
            'tags'              => [],
            'allergens'         => [],
            'reviews_count'     => fake()->numberBetween(1, 100),
            'rating_score'      => fake()->randomFloat(1, 3.0, 5.0),
        ];
    }
}
