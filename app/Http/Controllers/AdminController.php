<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Products;
use App\Models\Review;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminController extends Controller
{
    public function index(): InertiaResponse | RedirectResponse
    {
        if (Auth::check()) {
            if (Auth::user()->email !== 'admin@cleopatrabaklava.com') {
                Auth::logout();
                return redirect()->route('admin.index')->withErrors([
                    'email' => 'Unauthorized access. Only the designated administrator account is allowed.',
                ]);
            }

            $products = Products::with('category')->orderBy('id', 'desc')->get();
            $categories = Categories::withCount('products')->orderBy('name')->get();
            $reviews = Review::with('product')->orderBy('id', 'desc')->get();
            $settings = Setting::all()->pluck('value', 'key');

            $totalProducts = Products::count();
            $totalReviews = Review::count();
            $avgRating = round((float)Products::avg('rating_score'), 1);
            if ($avgRating === 0.0) {
                $avgRating = 5.0;
            }
            $totalCategories = Categories::count();

            return Inertia::render('admin/index', [
                'products' => $products,
                'categories' => $categories,
                'reviews' => $reviews,
                'settings' => $settings,
                'stats' => [
                    'total_products' => $totalProducts,
                    'total_reviews' => $totalReviews,
                    'avg_rating' => $avgRating,
                    'total_categories' => $totalCategories,
                ],
            ]);
        }

        return Inertia::render('admin/login');
    }

    public function handleAction(Request $request): RedirectResponse
    {
        $action = $request->input('_action');

        if ($action === 'login') {
            return $this->handleLogin($request);
        }

        if (!Auth::check() || Auth::user()->email !== 'admin@cleopatrabaklava.com') {
            return redirect()->route('admin.index');
        }

        return match ($action) {
            'store-product' => (new AdminProductController)->store($request),
            'update-product' => (new AdminProductController)->update($request, Products::findOrFail($request->input('id'))),
            'delete-product' => (new AdminProductController)->destroy(Products::findOrFail($request->input('id'))),
            'store-category' => (new AdminCategoryController)->store($request),
            'update-category' => (new AdminCategoryController)->update($request, Categories::findOrFail($request->input('id'))),
            'delete-category' => (new AdminCategoryController)->destroy(Categories::findOrFail($request->input('id'))),
            'toggle-approve-review' => (new AdminReviewController)->toggleApprove(Review::findOrFail($request->input('id'))),
            'delete-review' => (new AdminReviewController)->destroy(Review::findOrFail($request->input('id'))),
            'update-settings' => (new AdminSettingController)->update($request),
            default => back()->withErrors(['message' => 'Unknown action.']),
        };
    }

    private function handleLogin(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $throttleKey = Str::transliterate(
            Str::lower($request->input('email')) . '|' . $request->ip()
        );

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ])->onlyInput('email');
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            if ($user->email === 'admin@cleopatrabaklava.com') {
                RateLimiter::clear($throttleKey);
                $request->session()->regenerate();
                return redirect()->intended(route('admin.index'));
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        RateLimiter::hit($throttleKey, 60);

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records or are not authorized.',
        ])->onlyInput('email');
    }
}
