<?php

test('email verification routes are disabled', function () {
    $response = $this->get('/email/verify');
    $response->assertNotFound();
});
