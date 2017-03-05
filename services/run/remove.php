<?php

include_once "../parser.php";
print "Updating books \r\n";
$stop = false;
for ($i = 0; $i < 10000; $i++) {
    if ($books = db_get_books($i * 50)) {
        foreach ($books as $book) {
            if ((!fetch_outi_id_check($book))) {
                db_remove_book($book);
                print "Removed " . $book->name;
            }
        }
    } else {
        break;
    }
}
print "Done updating books \r\n";
