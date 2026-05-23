<?php

test('settings security routes are not registered in this build', function () {
    $response = $this->get('/settings/security');
    $response->assertNotFound();
});
