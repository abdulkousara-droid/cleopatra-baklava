<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class AdminAuthController extends Controller
{
    /**
     * Display the admin login form.
     */
    public function showLoginForm(): InertiaResponse | RedirectResponse
    {
        if (Auth::check() && Auth::user()->email === 'admin@cleopatrabaklava.com') {
            return redirect()->route('admin.products');
        }

        return Inertia::render('admin/login');
    }

    /**
     * Handle the admin login attempt.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->email === 'admin@cleopatrabaklava.com') {
                $request->session()->regenerate();
                return redirect()->intended(route('admin.products'));
            }

            // Log out immediately if the user is authenticated but not the admin
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records or are not authorized.',
        ])->onlyInput('email');
    }

    /**
     * Handle admin logout.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
