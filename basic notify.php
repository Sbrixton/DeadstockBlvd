<?php
// Capture raw POST
$raw_post = file_get_contents('php://input');

// Try decoding
$post_data = $_POST ?: json_decode($raw_post, true);

// Log both
file_put_contents('notify.log', print_r($post_data, true) . "\n", FILE_APPEND);

echo "OK";
?>
