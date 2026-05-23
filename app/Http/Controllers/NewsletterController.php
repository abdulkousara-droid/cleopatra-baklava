<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterSubscribed;
use App\Models\NewsletterSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller implements \Illuminate\Routing\Controllers\HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'throttle:newsletter',
        ];
    }

    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        // Check for duplicate subscription
        $exists = NewsletterSubscription::where('email', $validated['email'])->exists();

        if ($exists) {
            return response()->json([
                'status'  => 'already_subscribed',
                'message' => 'You are already part of our Inner Circle! 🌟',
            ], 200);
        }

        // Save subscription
        NewsletterSubscription::create(['email' => $validated['email']]);

        // Send the luxury welcome email
        try {
            Mail::to($validated['email'])->send(new NewsletterSubscribed($validated['email']));
        } catch (\Throwable $e) {
            Log::error('Newsletter welcome email failed: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => 'subscribed',
            'message' => 'Welcome to the Cleopatra Baklava Inner Circle! Check your inbox for your welcome email.',
        ], 201);
    }
}
