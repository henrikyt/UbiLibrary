<?php
include_once "../parser.php";
print "Getting new reviews\r\n";
try {
    for ($i = 0; $i < 5000; $i++) {
        if (!($results = db_get_books_missing_reviews($i * 100))) {
            break;
        } else {
            $final_results = array();
            $results = fetch_goodreads_ratings($results);
            foreach ($results as $result) {
                if ($result->rating_count != "0")
                    array_push($final_results, $result);
            }
            if (count($final_results) > 0)
                db_replace_books($final_results);
        }
    }
} catch (Exception $e) {
    error_log("Review parser: " . $e->getMessage());
}
print "Done getting new reviews\r\n";