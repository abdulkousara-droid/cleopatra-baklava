<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/productshow', 'productshow')->name('productshow');

Route::get('/shop', [StorefrontController::class, 'shop'])->name('shop.index');
Route::get('/new-arrivals', [StorefrontController::class, 'newArrivals'])->name('shop.new-arrivals');
Route::get('/most-popular', [StorefrontController::class, 'mostPopular'])->name('shop.most-popular');

//Route::middleware(['auth', 'verified'])->group(function () {Route::inertia('dashboard', 'dashboard')->name('dashboard');});

require __DIR__.'/settings.php';
