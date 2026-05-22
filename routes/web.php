<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/api/search', [StorefrontController::class, 'search'])->name('search');
Route::inertia('/checkout', 'checkout')->name('checkout');

// Product show — uses controller so it can pass real DB data
Route::get('/productshow', [StorefrontController::class, 'productshow'])->name('productshow');

Route::get('/shop', [StorefrontController::class, 'shop'])->name('shop.index');
Route::get('/new-arrivals', [StorefrontController::class, 'newArrivals'])->name('shop.new-arrivals');
Route::get('/most-popular', [StorefrontController::class, 'mostPopular'])->name('shop.most-popular');

require __DIR__.'/settings.php';
