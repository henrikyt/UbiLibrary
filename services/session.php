<?php
include_once "db.php";
$guid = uniqid();
foreach ($_POST['data'] as $key => $value) {
    if ($key != 'gender' && $key != 'age') {
        if ($value[0] != 0) {
            db_save_stats($key, $value[0], $value[1], $_POST['data']['gender'], $_POST['data']['age'], $guid);
        }
    }
}