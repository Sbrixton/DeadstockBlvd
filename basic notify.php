<?php
$log = "===== New Notify Hit =====\n";
$log .= "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$log .= "Date: " . date('Y-m-d H:i:s') . "\n";

// Raw POST
$raw_post = file_get_contents('php://input');
$log .= "Raw POST: " . $raw_post . "\n";

// $_POST
$log .= "_POST: " . print_r($_POST, true) . "\n";

// Write to notify.log
file_put_contents('notify.log', $log . "\n", FILE_APPEND);

echo "OK";
?>
