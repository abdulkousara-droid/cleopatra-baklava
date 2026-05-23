<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterSubscribed;
use App\Models\NewsletterSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
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
        Mail::to($validated['email'])->send(new NewsletterSubscribed($validated['email']));

        return response()->json([
            'status'  => 'subscribed',
            'message' => 'Welcome to the Cleopatra Baklava Inner Circle! Check your inbox for your exclusive gift.',
        ], 201);
    }
}
