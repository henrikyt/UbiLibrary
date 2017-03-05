<?php
include_once "../db.php";
print "Defragging database\r\n";
for ($i = 0; $i < 5000; $i++) {
    print "index " . $i . " \r\n";
    if (!($books = db_get_books($i * 50)))
        break;
    else {
        foreach ($books as $book) {
            if (!$book->isbn || !$book->author_sn || !$book->author_fn || $book->type != "Kirja")
                continue;
            else if (!($compares = db_book_exist_by_name_with_content_multiple($book->name)))
                continue;
            else {
                $cimg = "";
                $cabs = "";
                foreach ($compares as $compare) {
                    if (!$compare->author_fn || !$compare->author_sn || !$compare->isbn)
                        continue;
                    if ($book->isbn != $compare->isbn && $compare->author_fn == $book->author_fn && $compare->author_sn == $book->author_sn) {
                        if ($compare->picture)
                            $cimg = $compare->picture;
                        if (strlen($cabs) < strlen($compare->abstract))
                            $cabs = $compare->abstract;
                    }
                }
                if ($cimg || $cabs) {
                    $replace = false;
                    if (!$book->picture && $cimg) {
                        $book->picture = $cimg;
                        $replace = true;
                    }
                    if (!$book->abstract && $cabs) {
                        $book->abstract = $cabs;
                        $replace = true;
                    } else if (strlen($cabs) > 100 && strlen($book->abstract) < 100 && strlen($cabs) > strlen($book->abstract)) {
                        $book->abstract = $cabs;
                        $replace = true;
                    }
                    if ($replace) {
                        db_replace_book($book);
                        print "Replaced " . $book->name . "\r\n";
                    }
                }

            }
        }
    }
}

print "Defrag done\r\n";