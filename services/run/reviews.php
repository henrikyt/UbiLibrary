<?php
include_once "../parser.php";
print "Getting new reviews\r\n";
try {
    for ($i = 0; $i < 5000; $i++) {
        if (!($results = db_get_books($i * 50))) {
            break;
        } else {
            $results = fetch_goodreads_ratings($results);
            db_replace_books($results);
        }
    }
} catch (Exception $e) {
    error_log("Review parser: " . $e->getMessage());
}
print "Done getting new reviews\r\n";