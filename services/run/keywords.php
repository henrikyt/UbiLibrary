<?php
include_once '../db.php';
print "Getting new keywords\r\n";
try {
    $res = db_get_keywords();
    $final = array();
    foreach ($res as $row) {
        $tags = explode(';', $row['tags']);
        foreach ($tags as $tag) {
            if (!in_array($tag, $final)) {
                if (!db_is_value($tag))
                    array_push($final, $tag);
            }
        }
    }
    $fp = fopen('../../data/keywords.json', 'w');
    fwrite($fp, json_encode($final));
    fclose($fp);
} catch (Exception $e) {
    error_log("Keyword parser: " . $e->getMessage());
}
print "Done getting new keywords\r\n";