<?php
include_once "variables.php";

$headers = getallheaders();
$headers = $headers['id'];
header('id:' . $headers);
header('Content-Type: application/json');

$vars = new Vars();
$p = $vars->url_goodreads . '/book/isbn?format=json&isbn=' . $_GET["isbn"] . '&key=' . $vars->goodreads_key;
$results = file_get_contents($vars->url_goodreads . '/book/isbn?format=json&isbn=' . $_GET["isbn"] . '&key=' . $vars->goodreads_key);
exit($results);