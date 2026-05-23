<?php

namespace App\Http\Controllers;

use App\Mail\OfferEmail;
use App\Models\Category;
use App\Models\NewsletterSubscription;
use App\Models\Product;
use App\Models\Review;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
            if (Auth::user()->email !== config('app.admin_email')) {
                Auth::logout();
                return redirect()->route('admin.index')->withErrors([
                    'email' => 'Unauthorized access. Only the designated administrator account is allowed.',
                ]);
            }

            $products = Product::with('category')->orderBy('id', 'desc')->get();
            $categories = Category::withCount('products')->orderBy('name')->get();
            $reviews = Review::with('product')->orderBy('id', 'desc')->get();
            $settings = Setting::all()->pluck('value', 'key');

            $totalProducts = Product::count();
            $totalReviews = Review::count();
            $avgRating = round((float)Product::avg('rating_score'), 1);
            $totalCategories = Category::count();
            $subscriberCount = NewsletterSubscription::count();

            return Inertia::render('admin/index', [
                'products' => $products,
                'categories' => $categories,
                'reviews' => $reviews,
                'settings' => $settings,
                'subscriberCount' => $subscriberCount,
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

        if (!Auth::check() || Auth::user()->email !== config('app.admin_email')) {
            return redirect()->route('admin.index');
        }

        return match ($action) {
            'store-product' => (new AdminProductController)->store($request),
            'update-product' => (new AdminProductController)->update($request, Product::findOrFail($request->input('id'))),
            'delete-product' => (new AdminProductController)->destroy(Product::findOrFail($request->input('id'))),
            'store-category' => (new AdminCategoryController)->store($request),
            'update-category' => (new AdminCategoryController)->update($request, Category::findOrFail($request->input('id'))),
            'delete-category' => (new AdminCategoryController)->destroy(Category::findOrFail($request->input('id'))),
            'toggle-approve-review' => (new AdminReviewController)->toggleApprove(Review::findOrFail($request->input('id'))),
            'delete-review' => (new AdminReviewController)->destroy(Review::findOrFail($request->input('id'))),
            'update-settings' => (new AdminSettingController)->update($request),
            'send-offer' => $this->sendOffer($request),
            default => back()->withErrors(['message' => 'Unknown action.']),
        };
    }

    private function sendOffer(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'cta_text' => ['nullable', 'string', 'max:200'],
            'cta_link' => ['nullable', 'string', 'max:500'],
        ]);

        $subscribers = NewsletterSubscription::all();

        if ($subscribers->isEmpty()) {
            return redirect()->route('admin.index')->with('success', 'No subscribers to send to.');
        }

        $sent = 0;
        $failed = 0;
        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new OfferEmail(
                    subject: $data['subject'],
                    body: $data['body'],
                    ctaText: $data['cta_text'] ?? '',
                    ctaLink: $data['cta_link'] ?? '',
                ));
                $sent++;
            } catch (\Throwable $e) {
                Log::error("Offer email failed to {$subscriber->email}: " . $e->getMessage());
                $failed++;
            }
        }

        $message = "Offer sent to {$sent} subscriber" . ($sent !== 1 ? 's' : '') . '!';
        if ($failed > 0) {
            $message .= " {$failed} failed.";
        }
        return redirect()->route('admin.index')->with('success', $message);
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
            if ($user->email === config('app.admin_email')) {
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
