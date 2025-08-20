<?php
$logPath = __DIR__ . '/notify.log';

file_put_contents($logPath, "Script hit at " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);

file_put_contents($logPath, json_encode($_POST) . "\n", FILE_APPEND);

echo "OK";
?>
