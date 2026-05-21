<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/newarrivals', 'newarrivals')->name('newarrivals');
Route::inertia('/mostpopular', 'mostpopular')->name('mostpopular');
Route::inertia('/shop', 'shop')->name('shop');
Route::inertia('/productshow', 'productshow')->name('productshow');

//Route::middleware(['auth', 'verified'])->group(function () {Route::inertia('dashboard', 'dashboard')->name('dashboard');});

require __DIR__.'/settings.php';
