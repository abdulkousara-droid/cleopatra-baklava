<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->admin = User::factory()->create([
        'name' => 'Admin',
        'email' => 'admin@cleopatrabaklava.com',
        'password' => Hash::make('azeAZE12'),
    ]);
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.products'));
    $response->assertRedirect(route('login'));
});

test('non-admin users are redirected to the admin login page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.products'));
    $response->assertRedirect(route('admin.login'));
});

test('admin user can access the dashboard', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.products'));
    $response->assertOk();
});

test('only admin@cleopatrabaklava.com can login', function () {
    $this->post(route('admin.login'), [
        'email' => 'admin@cleopatrabaklava.com',
        'password' => 'azeAZE12',
    ]);

    $this->assertAuthenticated();
});

test('non-admin email is rejected even with valid credentials', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $this->post(route('admin.login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $this->assertGuest();
});

test('admin login screen can be rendered', function () {
    $response = $this->get(route('admin.login'));
    $response->assertOk();
});
