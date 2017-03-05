<?php

include_once "../parser.php";

$i = intval(file_get_contents('covers.txt'));

print "Updating covers from index " . $i . "\r\n";
$stop = false;
for ($i; $i < 5000; $i++) {
    if ($books = db_get_books_missing_covers($i * 100)) {
        foreach ($books as $book) {
            if ((!$gbook = fetch_google_books_isbn($book->isbn))) {
                $stop = true;
                break;
            } else {
                if ($gbook->totalItems == 0)
                    continue;
                foreach ($gbook->items as $item) {
                    if (isset($item->volymeInfo->imageLinks->thumbnail)) {
                        $book->picture = $item->volymeInfo->imageLinks->thumbnail;
                        db_replace_book($book);
                        break;
                    }
                }
            }
        }
    } else {
        $i = 0;
        break;
    }
    if ($stop)
        break;
}

$fp = fopen('covers.txt', 'w');
fwrite($fp, $i);
fclose($fp);
print "Done updating covers\r\n";
