<?php

test('two factor challenge routes are disabled for unauthenticated', function () {
    $response = $this->get('/two-factor-challenge');
    $response->assertNotFound();
});
