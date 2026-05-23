<?php

test('password reset is disabled', function () {
    $response = $this->get('/password/reset');
    $response->assertRedirect(route('admin.login'));
});
