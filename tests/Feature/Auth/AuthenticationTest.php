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

test('login screen redirects to admin login', function () {
    $response = $this->get('/login');
    $response->assertRedirect(route('admin.login'));
});

test('register screen redirects to admin login', function () {
    $response = $this->get('/register');
    $response->assertRedirect(route('admin.login'));
});

test('password reset screen redirects to admin login', function () {
    $response = $this->get('/password/reset');
    $response->assertRedirect(route('admin.login'));
});

test('admin can authenticate with correct credentials', function () {
    $response = $this->post(route('admin.login'), [
        'email' => 'admin@cleopatrabaklava.com',
        'password' => 'azeAZE12',
    ]);

    $response->assertRedirect(route('admin.products'));
    $this->assertAuthenticated();
});

test('admin cannot authenticate with wrong password', function () {
    $response = $this->post(route('admin.login'), [
        'email' => 'admin@cleopatrabaklava.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('non-admin email cannot authenticate via admin login', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('admin.login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin can logout', function () {
    $this->actingAs($this->admin);

    $response = $this->post(route('admin.logout'));

    $response->assertRedirect(route('admin.login'));
    $this->assertGuest();
});

test('admin login is rate limited after 5 attempts', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post(route('admin.login'), [
            'email' => 'admin@cleopatrabaklava.com',
            'password' => 'wrong-password',
        ]);
    }

    $response = $this->post(route('admin.login'), [
        'email' => 'admin@cleopatrabaklava.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $errors = session()->get('errors');
    expect($errors->get('email')[0])->toContain('Too many login attempts');
});
