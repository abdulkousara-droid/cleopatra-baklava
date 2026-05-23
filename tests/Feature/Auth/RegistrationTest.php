<?php

test('registration is disabled', function () {
    $response = $this->get('/register');
    $response->assertRedirect(route('admin.login'));

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('admin.login'));
    $this->assertGuest();
});
