<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Supported locales.
     */
    protected array $locales = ['en', 'es', 'ar'];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->segment(1);
        if (in_array($locale, $this->locales)) {
            App::setLocale($locale);
        }
        return $next($request);
    }
}
