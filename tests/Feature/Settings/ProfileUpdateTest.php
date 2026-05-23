<?php

test('settings profile routes are not registered in this build', function () {
    $response = $this->get('/settings/profile');
    $response->assertNotFound();
});
