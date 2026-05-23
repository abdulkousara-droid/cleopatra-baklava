<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || Auth::user()->email !== 'admin@cleopatrabaklava.com') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized Access.'], 403);
            }
            return redirect()->route('admin.index')->withErrors([
                'email' => 'Unauthorized access. Only the designated administrator account is allowed.'
            ]);
        }

        return $next($request);
    }
}
