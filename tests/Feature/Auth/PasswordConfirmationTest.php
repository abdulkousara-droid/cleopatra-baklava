<?php

test('password confirmation routes are disabled', function () {
    $response = $this->get('/user/confirm-password');
    $response->assertNotFound();
});
