<?php
// Log only basic _POST to a safe file
file_put_contents('log.txt', print_r($_POST, true), FILE_APPEND);
echo "OK";
?>
