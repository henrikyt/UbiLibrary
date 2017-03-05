<?php

include_once "parser.php";
include_once 'lib/phpqrcode/qrlib.php';

$headers = getallheaders();
$headers = $headers['id'];
header('id:' . $headers);
header('Content-Type: application/json');

$id = $_GET["id"];
$result = fetch_outi_available(null, str_replace('$BOOKID$', $id, $vars->url_outi_available));
$url = $vars->url_outi_server . str_replace('$BOOKID$', $id, $vars->url_outi_available);
QRcode::png($url, $vars->output . 'qr.png', 'L', 4, 2);

exit(json_encode($result));