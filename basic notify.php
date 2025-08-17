<?php
$logPath = __DIR__ . '/notify.log'; // safer path

$raw_post = file_get_contents('php://input');
$post_data = $_POST ?: json_decode($raw_post, true);

// Save the IPN data
file_put_contents($logPath, print_r($post_data, true) . "\n", FILE_APPEND);

echo "OK";
?>
