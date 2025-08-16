<?php
// Simple IPN notify listener that just writes raw POST to a log file
file_put_contents('notify.log', json_encode($_POST) . "\n", FILE_APPEND);
echo "OK";
?>
