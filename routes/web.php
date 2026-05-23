<?php

use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminReviewController;
use App\Http\Controllers\AdminSettingController;
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

// Redirect any Fortify routes (/login, /register) to admin login
Route::redirect('/login', '/admin/login')->name('login');
Route::redirect('/register', '/admin/login');
Route::redirect('/password/reset', '/admin/login');

// Admin Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminAuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
});

// Admin Protected Routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    
    Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products');
    Route::post('/admin/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::put('/admin/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

    // Categories management
    Route::get('/admin/categories', [AdminCategoryController::class, 'index'])->name('admin.categories');
    Route::post('/admin/categories', [AdminCategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/admin/categories/{category}', [AdminCategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Reviews management
    Route::get('/admin/reviews', [AdminReviewController::class, 'index'])->name('admin.reviews');
    Route::put('/admin/reviews/{review}/approve', [AdminReviewController::class, 'toggleApprove'])->name('admin.reviews.approve');
    Route::delete('/admin/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('admin.reviews.destroy');

    // Settings
    Route::get('/admin/settings', [AdminSettingController::class, 'index'])->name('admin.settings');
    Route::put('/admin/settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');
});
