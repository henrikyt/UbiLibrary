<?php
include_once "db.php";

$headers = getallheaders();
$headers = $headers['id'];
header('id:' . $headers);
header('Content-Type: application/json');

$keywords = array();
$searchwords = array();

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
    $newsearchwords = explode(',', $_GET["searchwords"]);
    $newsearchwords = array_filter($newsearchwords);
    $searchwords = array();
    if (count($newsearchwords) > 0) {
        $compare = json_decode(file_get_contents('../data/keywords.json'));
        foreach ($newsearchwords as $key => $word) {
            if (in_array(ucfirst($word), $compare)) {
                array_push($keywords, $word);
            } else if (in_array($word, $compare)) {
                array_push($keywords, $word);
            } else
                array_push($searchwords, $word);
        }
    }
}

$turn = intval($_GET['turn']);
$results = array();
if (count($searchwords) > 0) {
    $results = array_merge($results, db_suggest_books_search_exact($searchwords, "+" . implode(' +', $keywords), $turn * 13));
    if (count($results) < 50)
        $results = array_dube(array_merge($results, db_suggest_books_search($searchwords, "+" . implode(' +', $keywords), $turn * 13, false)));
    if (count($results) < 50)
        $results = array_dube(array_merge($results, db_suggest_books_search_nb($searchwords, "+" . implode(' +', $keywords), $turn * 13, false)));
    if (count($results) < 50)
        $results = array_dube(array_merge($results, db_suggest_books_search($searchwords, "+" . implode(' +', $keywords), $turn * 13, true)));
    if (count($results) < 50)
        $results = array_dube(array_merge($results, db_suggest_books_search_nb($searchwords, "+" . implode(' +', $keywords), $turn * 13, true)));
} else {
    $results = array_merge($results, db_suggest_books("+" . implode(' +', $keywords), $turn * 13));

}
$results = array_slice($results, 0, 50);
if (count($results) == 0)
    array_push($results, "CONTINUE");
exit(json_encode($results));


function array_dube($array)       {
    foreach ($array as $k => $v) {
        if (($kt = array_search($v, $array)) !== false and $k != $kt) {
            unset($array[$kt]);
        }

    }
    return $array;
}