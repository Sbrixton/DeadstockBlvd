<?php
// notify.php — PayFast IPN listener for sandbox testing

// Capture raw POST data
$raw_post_data = file_get_contents('php://input');

// Optional: Append timestamp for easy tracking
$log_entry = "[" . date("Y-m-d H:i:s") . "] " . $raw_post_data . PHP_EOL;

// Save to log file (make sure notify.log is writable by the server)
file_put_contents("notify.log", $log_entry, FILE_APPEND | LOCK_EX);

// Respond with 200 OK
http_response_code(200);
echo "OK";
?>
