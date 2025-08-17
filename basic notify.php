<?php
file_put_contents('notify.log', json_encode($_POST) . "\n", FILE_APPEND);
echo "OK";
?>
