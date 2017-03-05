<?php
include_once "db.php";

header('Content-Type: application/json');

$keywords = array();
$searchwords = array();

if (isset($_GET["keywords"])) {
    $keywords = explode(';', $_GET["keywords"]);
    $keywords = array_filter($keywords);
}

$turn = intval($_GET['turn']);
$results = array();

for($i=0;$i<100;$i++){
    $results=array_dube(array_merge($results,db_similar_books("+" . implode(' +', $keywords),$turn * 13)));
    $keywords=array_slice($keywords,1);
    if(count($results) > 50)
        break;
}
$results = array_slice($results, 0, 50);
exit(json_encode($results));


function array_dube($array)       {
    foreach ($array as $k => $v) {
        if (($kt = array_search($v, $array)) !== false and $k != $kt) {
            unset($array[$kt]);
        }

    }
    return $array;
}