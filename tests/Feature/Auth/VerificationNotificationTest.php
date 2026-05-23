<?php

test('verification notification routes are disabled', function () {
    $response = $this->post('/email/verification-notification');
    $response->assertNotFound();
});
