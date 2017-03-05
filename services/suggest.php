<?php
include_once "parser.php";

$headers = getallheaders();
$headers = $headers['id'];
header('id:' . $headers);
header('Content-Type: application/json');

$keywords = array();
$searchwords = array();
$words = "";
if (isset($_GET["keywords"])) {
    $keywords = explode(',', $_GET["keywords"]);
    $keywords = array_filter($keywords);
    if (count($keywords) > 0) {
        if ($keywords[0] == "STARTCONTENT") {
            $results = db_suggest_start($_GET['turn'] * 13);
            exit(json_encode($results));
        }
    }
}

if (isset($_GET["searchwords"])) {
    $newsearchwords = array();
    $searchwords = explode(',', $_GET["searchwords"]);
    $searchwords = array_filter($searchwords);
}

if (count($keywords) > 0)
    $words .= implode(' ', $keywords);

if (count($searchwords) > 0)
    $words .= " " . implode(' ', $searchwords);

$newresults = fetch_outi_custom(urlencode($words));
exit(json_encode($newresults));
