<?php

use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'home'])->name('home');
Route::get('/api/search', [StorefrontController::class, 'search'])->name('search');
Route::inertia('/checkout', 'checkout')->name('checkout');

// Product show — uses controller so it can pass real DB data
Route::get('/productshow', [StorefrontController::class, 'productshow'])->name('productshow');

Route::get('/shop', [StorefrontController::class, 'shop'])->name('shop.index');
Route::get('/newarrivals', [StorefrontController::class, 'newArrivals'])->name('shop.new-arrivals');
Route::get('/mostpopular', [StorefrontController::class, 'mostPopular'])->name('shop.most-popular');

// Newsletter subscription
Route::post('/api/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// Product reviews
Route::post('/api/reviews', [ReviewController::class, 'store'])->name('reviews.store');

// Coming Soon placeholder pages
Route::inertia('/collections', 'comingsoon', ['page' => 'Our Collections'])->name('collections');
Route::inertia('/heritage', 'comingsoon', ['page' => 'Our Heritage Story'])->name('heritage');
Route::inertia('/catering', 'comingsoon', ['page' => 'Catering & Delivery'])->name('catering');
Route::inertia('/privacy', 'comingsoon', ['page' => 'Privacy Policy'])->name('privacy');
Route::inertia('/terms', 'comingsoon', ['page' => 'Terms of Service'])->name('terms');

// Redirect any Fortify routes (/login, /register) to admin
Route::redirect('/login', '/admin')->name('login');
Route::redirect('/register', '/admin');
Route::redirect('/password/reset', '/admin');

// Admin — single route handles both login and dashboard based on auth state
Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
Route::post('/admin', [AdminController::class, 'handleAction']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout')->middleware('auth');

Route::get('/run-migrations-xyz123', function () {
    Artisan::call('migrate:refresh', ['--seed' => true, '--force' => true]);
    return Artisan::output();
});


