<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->decimal('price', 8, 2);
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('badge')->nullable(); // New Collection, Best Seller, Premium Choice, or null
            $table->text('description');
            $table->text('image');
            $table->json('additional_images')->nullable();
            $table->json('tags'); // e.g., ['Pistachio', 'Organic Honey']
            $table->integer('reviews_count')->default(0); // For your Most Popular page rating layout
            $table->decimal('rating_score', 2, 1)->default(5.0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
