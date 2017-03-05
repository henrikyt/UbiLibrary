<?php

include_once 'lib/qp.php';
include_once 'variables.php';
include_once 'db.php';

function write_results($results)
{
    global $vars;
    $fn = $vars->output . 'lib_all_backup.json';
    if (is_file($fn)) {
        $oldresults = json_decode(file_get_contents($fn));
        if (is_array($oldresults))
            $results = array_merge($oldresults, $results);
    }
    $fp = fopen($fn, 'w');
    fwrite($fp, json_encode($results));
    fclose($fp);
}

function fetch_ny_times()
{
    global $vars;
    #  $names=array('Combined Print & E-Book Fiction'=>'Kaunokirjallisuus','Combined Print & E-Book Nonfiction'=>'Tietokirjallisuus','Paperback Trade Fiction'=>'Pokkarit','Advice, How-To & Miscellaneous'=>'Tee-se-itse kirjat','Children\'s Picture Books'=>'Lasten kuvakirjat','Children\'s Middle Grade'=>'Lasten kirjat','Young Adult'=>'Nuorten kirjat');
    $results = array();
    $today = new DateTime();
    $today->modify('-1 months');
    $parsed = json_decode(file_get_contents('http://api.nytimes.com/svc/books/v2/lists/names.json?api-key=' . $vars->ny_key));
    foreach ($parsed->results as $genre) {
        $url = 'http://api.nytimes.com/svc/books/v2/lists/' . $today->format('Y-m-d') . '/' . str_replace(' ', '-', $genre->list_name) . '.json?&api-key=' . $vars->ny_key;
        $list = json_decode(file_get_contents($url));
        foreach ($list->results as $result) {
            if (isset($result->isbns[0]->isbn13))
                $isbn = $result->isbns[0]->isbn13;
            else if (isset($result->isbns[0]->isbn10))
                $isbn = $result->isbns[0]->isbn10;
            else
                $isbn = "";

            if ($isbn == "") {
                $d = $result->book_details[0];
                $author = explode(' ', $d->author);
                $book = new Book(array('name' => mb_convert_case($d->title, MB_CASE_TITLE), 'abstract' => $d->description, 'publisher' => $d->publisher, 'author_fn' => $author[0], 'author_sn' => $author[1], 'picture' => $d->book_image, 'isbn' => $isbn, 'category' => "Luetuimmat maailmalla", 'subcategory' => $genre->display_name));
                array_push($results, $book);
            } else {
                if (($book = db_book_exist_with_content_isbn($result->isbns[0]->isbn10)) != false) {
                    $book->category = "Luetuimmat maailmalla";
                    $book->subcategory = $genre->display_name;
                    array_push($results, $book);
                } else if (($book = db_book_exist_with_content_isbn($result->isbns[0]->isbn13)) != false) {
                    $book->category = "Luetuimmat maailmalla";
                    $book->subcategory = $genre->display_name;
                    array_push($results, $book);
                } else {
                    $found = false;
                    try {
                        $others = new SimpleXMLElement(file_get_contents('http://www.librarything.com/api/thingISBN/' . $isbn));

                        if (!isset($others->unknownID)) {
                            foreach ($others->isbn as $choise) {
                                if (($book = db_book_exist_with_content_isbn((string)$choise)) != false) {
                                    $book->category = "Luetuimmat maailmalla";
                                    $book->subcategory = $genre->display_name;
                                    array_push($results, $book);
                                    $found = true;
                                    break;
                                }
                            }
                        }
                    } catch (Exception $e) {
                    };
                    if (!$found) {
                        $d = $result->book_details[0];
                        $author = explode(' ', $d->author);
                        $book = new Book(array('name' => mb_convert_case($d->title, MB_CASE_TITLE), 'abstract' => $d->description, 'publisher' => $d->publisher, 'author_fn' => $author[0], 'author_sn' => $author[1], 'picture' => $d->book_image, 'isbn' => $isbn, 'category' => "Luetuimmat maailmalla", 'subcategory' => $genre->display_name));
                        array_push($results, $book);
                    }

                }
            }
        }
    }
    $results = fetch_goodreads_ratings($results);
    write_results($results);
}

function fetch_ouka_vinkit()
{
    global $vars;
    $results = array();
    $parsed = get_parser($vars->url_ouka_server . '/oulu/kirjasto/vinkit', '.level-1');
    foreach ($parsed->find('a') as $link) {
        print $link->attr('href') . "\r\n";
        $results = fetch_ouka_vinkit_subpage($results, $link);
    }
    $results = fetch_ouka_vinkit_subpage($results, qp("<div><a href='/oulu/kirjasto/vinkit'>Kirjaston valinnat</a></div>", "a"));
    write_results($results);
}

function fetch_ouka_vinkit_subpage($results, $olink)
{
    global $vars;
    #if (strpos($olink->attr('href'), chr(24)) !== false)
    #    return $results;
    $parsed = get_parser($vars->url_ouka_server . $olink->attr('href'), '#column-2');
    foreach ($parsed->find('tr') as $item) {
        $save = false;
        $result = new Book();
        $links = $item->find('a');
        foreach ($links as $link) {
            if (strpos($link->text(), 'aatavuus') != 0) {
                if (strpos($link->attr('href'), 'doci')) {
                    $id = explode('doci=', $link->attr('href'));
                    $id = explode('&', $id[1]);
                    if (is_array($id))
                        $id = $id[0];
                    if (!db_book_exist($id)) {
                        $result = fetch_outi_details($result, str_replace('$BOOKID$', $id, $vars->url_outi_book));
                        $save = true;
                        break;
                    } else {
                        $result = db_book_exist_with_content($id);
                        break;
                    }
                } else {
                    $result = fetch_outi_book($result, $link->attr('href'));
                    if (!db_book_exist($result->book_id)) {
                        $save = true;
                    }
                    break;
                }
            }
        }
        if (!$result->name) {
            if (!$result->name) {
                if ($item->has('strong'))
                    $author_book = explode(':', $item->find('strong')->text());
                else if ($item->has('b'))
                    $author_book = explode(':', $item->find('b')->eq(0)->text());
                else
                    $author_book = explode(':', $item->find('p')->eq(0)->text());
                if (count($author_book) == 1) {
                    $result->name = str_clean($author_book[0]);
                } else {
                    $result->name = str_clean($author_book[1]);
                    $author = explode(' ', str_clean($author_book[0]));
                    $result->author_fn = $author[0];
                    $result->author_sn = $author[1];
                }
                if (!db_book_exist_by_name($result->name))
                    $result = fetch_outi_book($result, null);
                else {
                    $result = db_book_exist_by_name_with_content($result->name);
                    array_push($results, $result);
                    continue;
                }
            }
        }

        if (!$result->name || !$result->book_id)
            continue;
        $result->subcategory = "";
        $result->category = "";
        if ($olink->parent()->parent()->hasClass('level-2')) {
            $result->subcategory = str_clean($olink->text());
            $result->category = str_clean($olink->parent()->parent()->prev()->text());
        } else {
            $result->category = str_clean($olink->text());
        }

        $na = str_replace('|', '', str_replace('Katso myös Kirjasammosta', '', str_replace("Saatavuus", '', str_clean($item->text()))));

        $que = substr($na, 0, strlen($result->name) + strlen($result->author_fn) + strlen($result->author_sn) + 4);
        $na = substr($na, strlen($result->name) + strlen($result->author_fn) + strlen($result->author_sn) + 4);
        $que = str_replace($result->name, '', $que);
        $que = str_replace($result->author_sn, '', $que);
        $que = str_replace($result->author_fn, '', $que);
        $que = str_clean(str_replace(':', '', $que));
        $na = $que . $na;

        $result->abstract = $na;

        if (!$result->book_id)
            continue;
        if ($result)
            array_push($results, $result);
        if (!$save)
            db_replace_book($result);
        else
            db_save_book($result);
    }
    $results = fetch_goodreads_ratings($results);
    return $results;
}

function add_results($result, $results)
{
    if (!$result || !$results)
        return $results;
    $found = false;
    foreach ($results as $result_old) {
        if (!$result_old)
            continue;
        if ($result_old->book_id == $result->book_id) {
            $found = true;
            break;
        }
    }
    if (!$found)
        array_push($results, $result);
    return $results;
}

function fetch_msl()
{
    $results = array();
    global $vars;
    $parsed = get_parser($vars->url_msl, '.table-content');
    $category = "";
    foreach ($parsed->find('tr') as $item) {
        $db = false;
        $result = new Book();
        $book = $item->children();
        if (count($book) == 1) {
            $category = str_clean($book->text());
        } else if (count($book) == 4) {
            $name = str_clean($book->eq(2)->text());
            if (!$name)
                continue;
            $result = db_book_exist_by_name_with_content($name);
            if (is_object($result)) {
                $db = true;
            }
            if (!$db) {
                $authors = explode(',', str_clean($book->eq(1)->text()));
                if (is_array($authors))
                    $author = explode(' ', $authors[0]);
                else
                    $author = explode(' ', $authors);
                if (is_array($author) && count($author) > 1) {
                    $result->author_fn = str_clean($author[1]);
                    $result->author_sn = str_clean($author[0]);
                } else {
                    $result->author_sn = str_clean($author[0]);
                }
                $result->name = $name; # book 2
                $result = fetch_outi_book($result);
            }
            $result->category = 'Suomen luetuimmat';
            $result->subcategory = $category;
            if ($db)
                db_replace_book($result);
            array_push($results, $result);
        }
    }
    $results = fetch_goodreads_ratings($results);
    write_results($results);
}

function fetch_outi_book($result, $url = "")
{
    global $vars;
    if ($url == "") {
        $author_name = $result->author_sn . ',+' . $result->author_fn;
        $book_name = str_clean($result->name);
        if (strpos($book_name, '.')) {
            $book_name = explode('.', $book_name);
            $book_name = str_clean($book_name[0]);
        }
        if (strpos($book_name, ':')) {
            $book_name = explode(':', $book_name);
            $book_name = str_clean($book_name[0]);
        }
        $book_name = str_replace(' ', '+', $book_name);
        if ($result->author_sn == "")
            $url = str_replace('$BOOKNAME$', urlencode_for_outi($book_name), $vars->url_outi_server . $vars->url_outi_name_only);
        else
            $url = str_replace('$AUTHORNAME$', urlencode_for_outi($author_name), str_replace('$BOOKNAME$', urlencode_for_outi($book_name), $vars->url_outi_server . $vars->url_outi));
    }

    sleep($vars->outi_delay);
    $parsed = get_parser($url, '.tblsolu');

    foreach ($parsed as $item) {
        foreach ($item->find('a') as $link) {
            if ($link->hasAttr('title')) {
                $result = fetch_outi_details($result, $link->attr('href'));
                if ($result->book_id)
                    break;
            } else if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        break;
                    }
                }
                if ($result->book_id) {
                    if (!$result->isbn)
                        $result = fetch_outi_details($result, str_replace('$BOOKID$', $result->book_id, $vars->url_outi_book));
                    break;
                }
            }
        }
    }
    return $result;
}

function fetch_outi_cover($result, $url)
{
    global $vars;
    sleep($vars->outi_delay);
    $parsed = get_parser($url, 'img');
    if ($parsed->attr('src'))
        $result->picture = "http://data.kirjavalitys.fi" . $parsed->attr('src');
    return $result;
}

function fetch_outi_available($result, $url)
{
    global $vars;
    if (!$result)
        $result = array('tot_na' => 0, 'tot_av' => 0, 'lib_na' => 0, 'lib_av' => 0, 'tot_lo' => 0);
    $parsed = get_parser_alt($vars->url_outi_server . $url, '.tblsolu');
    foreach ($parsed as $location) {
        if (strpos($location->children()->eq(0)->text(), 'ulun kirjastot')) {
            $link = $location->children()->eq(1)->find('a');
            #$text = preg_split('/(\D+)(\d+)/', $link->text(), -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
            $text = explode(' ', str_clean($link->text()));
            for ($i = 0; $i < count($text); $i++) {
                if (trim($text[$i]) == 'lainassa') {
                    $result['tot_na'] += intval($text[$i - 1]);
                }
                if (trim($text[$i]) == 'hyllyssä') {
                    $result['tot_av'] += intval($text[$i - 1]);
                }
            }
            $result = fetch_outi_available($result, $link->attr('href'));
            $loans = explode(' ', str_replace('', ' ', $location->children()->eq(3)->text()));
            foreach ($loans as $loan) {
                if (is_numeric($loan) && $loan > 0) {
                    $result['tot_lo'] = $loan;
                    break;
                }
            }
            break;
            /* SUB PAGE FOR LOCATION */
        } else if (strpos($location->children()->eq(0)->text(), 'ääkirjasto')) {
            #$text = preg_split('/(\D+)(\d+)/', $location->children()->eq(1)->text(), -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
            $text = explode(' ', str_clean($location->children()->eq(1)->text()));
            for ($i = 0; $i < count($text); $i++) {
                if (trim($text[$i]) == 'lainassa') {
                    $result['lib_na'] += intval($text[$i - 1]);
                }
                if (trim($text[$i]) == 'hyllyssä') {
                    $result['lib_av'] += intval($text[$i - 1]);
                }
            }
        }
    }
    return $result;
}

function fetch_outi_name($result, $url)
{
    global $vars;
    sleep($vars->outi_delay);
    $parsed = get_parser($vars->url_outi_server . $url, '.tblsolu tr');
    foreach ($parsed as $item) {
        if (strpos($item->text(), 'SAN NIMEKE')) {
            if (!$result->name) {
                $name = explode("/", str_clean($item->children()->eq(2)->text()));
                if (is_array($name))
                    $result->name .= " " . str_clean($name[0]);
                else
                    $result->name .= " " . str_clean($name);
            }
        } else if (strpos($item->text(), 'IMEKE')) {
            $name = explode("/", str_clean($item->children()->eq(2)->text()));
            if (is_array($name))
                $result->name = str_clean($name[0]);
            else
                $result->name = str_clean($name);
        }
    }
    return $result;
}

function fetch_outi_details($result, $url)
{
    global $vars;
    sleep($vars->outi_delay);
    $parsed = get_parser($vars->url_outi_server . $url, '.tblsolu tr');
    foreach ($parsed as $item) {
        if (strpos($item->text(), 'ULKAISUTIEDOT')) {
            $result->publisher = str_clean($item->children()->eq(2)->text());
        } else if (strpos($item->text(), 'SAN NIMEKE')) {
            if (!$result->name) {
                $name = explode("/", str_clean($item->children()->eq(2)->text()));
                if (is_array($name))
                    $result->name .= " " . str_clean($name[0]);
                else
                    $result->name .= " " . str_clean($name);
            }
        } else if (strpos($item->text(), 'IMEKE')) {
            if (!$result->name) {
                $name = explode("/", str_clean($item->children()->eq(2)->text()));
                if (is_array($name))
                    $result->name = str_clean($name[0]);
                else
                    $result->name = str_clean($name);
            }
        } else if (strpos($item->text(), 'YLLYPAIKKA')) {
            $result->location = str_clean($item->children()->eq(2)->text());
        } else if (strpos($item->text(), 'INEISTOLAJI')) {
            $result->type = str_clean($item->children()->eq(2)->text());
            if (!$result->book_id)
                $result->book_id = str_clean(str_replace('ID', '', str_clean($item->children()->eq(3)->text())));
        } else if (strpos($item->text(), 'ULKAISUKIELI')) {
            $result->language = str_clean($item->children()->eq(2)->text());
        } else if (strpos($item->text(), 'LKOASU')) {
            $result->length = str_clean($item->children()->eq(2)->text());
        } else if (strpos($item->text(), 'SBN/HINTA')) {
            $isbn = str_clean($item->children()->eq(2)->text());
            $isbn = explode(' ', $isbn);
            if (is_array($isbn)) {
                $isbn = $isbn[0];
            }
            $result->isbn = str_replace('-', '', $isbn);
        } else if (strpos($item->text(), 'UOMAUTUKSET')) {
            $na = str_clean($item->children()->eq(2)->text());
            if ($result->abstract) {
                if (strlen($result->abstract) < strlen($na))
                    $result->abstract = $na;
            } else
                $result->abstract = $na;
        } else if (strpos($item->text(), 'SIASANAT')) {
            $tags = $item->find('a');
            if (count($tags) == 0) {
                $result->tags = 'muut';
            } else {
                foreach ($tags as $link) {
                    $result->tags .= str_clean($link->text()) . ";";
                }
            }
        } else if (strpos($item->text(), 'ÄÄTEKIJÄ')) {
            if (!$result->author_fn) {
                $name = explode(',', $item->children()->eq(2)->text());
                if (count($name) > 1) {
                    $result->author_fn = mb_convert_case(str_clean($name[1]), MB_CASE_TITLE, "UTF-8");
                    $sn = str_clean($name[0]);
                    if ($sn != "" && is_string($sn))
                        $result->author_sn = mb_convert_case($sn, MB_CASE_TITLE, "UTF-8");
                    else
                        $result->author_sn = '';
                } else {
                    $result->author_fn = "";
                    $result->author_sn = mb_convert_case(str_clean($name), MB_CASE_TITLE, "UTF-8");
                }
            }
        } else if (strpos($item->text(), 'ERKKO-OSOITE')) {
            foreach ($item->find('a') as $link) {
                if (strpos($link->text(), 'ansikuva'))
                    $result = fetch_outi_cover($result, $link->attr('href'));
                else if (strpos($link->text(), 'uvaus')) {
                    $result = fetch_outi_description($result, $link->attr('href'));
                }
            }
        }

    }
    return $result;
}

function fetch_outi_description($result, $url)
{
    global $vars;
    sleep($vars->outi_delay);
    if (!strpos($url, 'kirjavalitys'))
        $url = $vars->url_outi_server . $url;
    $parsed = get_parser($url, 'td');
    $na = str_clean($parsed->text());
    if (strlen($na) > strlen($result->abstract))
        $result->abstract = $na;
    return $result;
}

function fetch_outi_suggestions($keywords)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = "";
    for ($i = 2; $i < count($keywords) + 2; $i++) {
        $url .= '&typ' . $i . '=3&dat' . $i . '=' . urlencode_for_outi($keywords[$i - 2]) . '.';
    }
    $parsed = get_parser($vars->url_outi_server . $vars->url_outi_suggest . $url, '.tblsolu');
    $newresults = array();
    foreach ($parsed as $item) {
        $id = "";
        $result = new Book();
        foreach ($item->find('a') as $link) {
            if ($link->hasAttr('title')) {
                $id = $link->attr('href');
            } else if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        break;
                    }
                }
            }
        }

        if (!db_book_exist($result->book_id)) {
            $result = fetch_outi_details($result, str_replace('$BOOKID$', $result->book_id, $vars->url_outi_book));
            array_push($newresults, $result);
        }

    }
    $newresults = fetch_goodreads_ratings($newresults);
    db_save_books($newresults);
    return $newresults;
}

function fetch_outi_literature($name, $offset)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = $vars->url_outi_server . str_replace('$OFFSET$', $offset, str_replace('$BOOKID$', urlencode_for_outi($name), $vars->url_outi_literature));
    $parsed = get_parser($url, '.tblsolu');
    if (count($parsed) == 0)
        return false;
    $newresults = array();
    foreach ($parsed as $item) {
        $id = "";
        $result = new Book();
        foreach ($item->find('a') as $link) {
            if ($link->hasAttr('title')) {
                $id = $link->attr('href');
            } else if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        break;
                    }
                }
            }
        }
        if (!db_book_exist($result->book_id)) {
            $result = fetch_outi_details($result, $id);
            if ($book = db_book_exist_by_name_with_content($result->name)) {
                if (strlen($book->abstract) < strlen($result->abstract) &&
                    ($book->picture == "" || $result->picture != "") &&
                    $book->author_fn == $result->author_fn &&
                    $book->author_sn == $result->author_sn
                )
                    db_replace_book_by_id($result, $book);
            } else
                array_push($newresults, $result);
        }
    }
    $newresults = fetch_goodreads_ratings($newresults);
    db_save_books($newresults);
    return true;

}

function fetch_outi_all($offset)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = $vars->url_outi_server . str_replace('$OFFSET$', $offset, $vars->url_outi_all);
    $parsed = get_parser($url, '.tblsolu');
    if (count($parsed) == 0)
        return false;
    $newresults = array();
    foreach ($parsed as $item) {
        $id = "";
        $result = new Book();
        foreach ($item->find('a') as $link) {
            if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        $id = str_replace('$BOOKID$', $result->book_id, $vars->url_outi_book);
                        break;
                    }
                }
            }
        }
        if (!db_book_exist($result->book_id)) {
            $result = fetch_outi_details($result, $id);
            print "Found " . $result->name . "\r\n";
            array_push($newresults, $result);
        }
    }
    $newresults = fetch_goodreads_ratings($newresults);
    db_save_books($newresults);
    return true;
}

function replace_outi_all($offset)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = $vars->url_outi_server . str_replace('$OFFSET$', $offset, $vars->url_outi_all);
    $parsed = get_parser($url, '.tblsolu');
    if (count($parsed) == 0)
        return false;
    $newresults = array();
    foreach ($parsed as $item) {
        $id = "";
        $result = new Book();
        foreach ($item->find('a') as $link) {
            if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        $id = str_replace('$BOOKID$', $result->book_id, $vars->url_outi_book);
                        break;
                    }
                }
            }
        }
        if ($result = db_book_exist_with_content($result->book_id)) {
            $result = fetch_outi_name($result, $id);
            print "Found " . $result->name . "\r\n";
            array_push($newresults, $result);
        }
    }
    $newresults = fetch_goodreads_ratings($newresults);
    db_replace_books($newresults);
    return true;
}


function fetch_outi_custom($keywords)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = $vars->url_outi_server . str_replace('$WORDS$', $keywords, $vars->url_outi_custom);
    $parsed = get_parser($url, '.tblsolu');
    $newresults = array();
    $j = 0;
    foreach ($parsed as $item) {
        $id = "";
        $result = new Book();
        foreach ($item->find('a') as $link) {
            if ($link->hasAttr('title')) {
                $id = $link->attr('href');
            } else if (strpos($link->text(), 'arkista missä')) {
                $href = explode('&', $link->attr('href'));
                foreach ($href as $item) {
                    if (strpos($item, 'oci=')) {
                        $tmp = explode('=', $item);
                        $result->book_id = $tmp[1];
                        break;
                    }
                }
            }
        }
        if (!db_book_exist($result->book_id)) {
            $result = fetch_outi_details($result, $id);
            array_push($newresults, $result);
            $j++;
            if ($j == 5)
                break;
        }
    }
    $newresults = fetch_goodreads_ratings($newresults);
    db_save_books($newresults);
    return $newresults;
}

function fetch_outi_id_check($book)
{
    global $vars;
    sleep($vars->outi_delay);
    $url = $vars->url_outi_server . str_replace('$BOOKID$', $book->book_id, $vars->url_outi_book);
    $parsed = get_parser($url, '.tblsolu');
    if (strpos($parsed->text(), 'does not exist!') !== FALSE)
        return false;
    return true;
}

function fetch_sampo()
{
    global $vars;
    $querywords = 'kauhu&scifi';
    $content = '?rdflang=nt&locale=fi&o=http://www.yso.fi/onto/kaunokki%23teos&oquery=' . $querywords . '&max=10';
    $url = $vars->url_sampo_search . $content;
    $result = file_get_contents($url);
    var_dump($result);
}

function fetch_sampo_sparql()
{
    global $vars;
    $content = "
    PREFIX ks: <http://www.yso.fi/onto/kaunokki#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX lingvoj: <http://www.lingvoj.org/lang/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX gen: <http://nonexistent.org/>
    CONSTRUCT {
     ?source gen:kansikuva ?kk .
     ?source gen:tekija ?tekija .
     ?source gen:genre ?genre .
    } WHERE {
        ?source ks:manifests_in ?ft .
        ?ft ks:kansikuva ?kk .
        ?source ks:tekija ?tekija .
        ?source ks:genre ?genre .

    }
    LIMIT 10
    ";


    $url = $vars->url_sampo_sparql . urlencode_for_sampo($content);
    $result = file_get_contents($url);
    var_dump($result);
}

function fetch_goodreads_ratings($results)
{
    global $vars;
    sleep(1);
    $isbn = '';
    $first = true;
    $map = array();
    for ($i = 0; $i < count($results); $i++) {
        if (!$results[$i])
            continue;
        if (!isset($results[$i]->isbn))
            continue;
        if ($results[$i]->isbn && strlen($results[$i]->isbn) > 5) {
            if ($first) {
                $first = false;
                $isbn .= $results[$i]->isbn;
            } else
                $isbn .= ',' . $results[$i]->isbn;
            $map[$results[$i]->isbn] = $i;
        }
    }
    $url = $vars->url_goodreads . 'book/review_counts.json?isbns=' . $isbn . '&key=' . $vars->goodreads_key;
    $context = stream_context_create(array('http' => array('ignore_errors' => true)));
    try {
        $reviews = file_get_contents($url, false, $context);
    } catch (Exception $e) {
        error_log("No reviews in GoodReads?");
        return $results;
    }
    $reviews = json_decode($reviews);
    if (!isset($reviews->books))
        return $results;
    for ($j = 0; $j < count($reviews->books); $j++) {
        $id = false;
        if (isset($reviews->books[$j]->isbn13)) {
            if (isset($map[$reviews->books[$j]->isbn13]))
                $id = $map[$reviews->books[$j]->isbn13];
        }
        if (!$id) {
            if (isset($reviews->books[$j]->isbn)) {
                if (isset($map[$reviews->books[$j]->isbn]))
                    $id = $map[$reviews->books[$j]->isbn];
            }
        }
        if (is_int($id)) {
            $results[$id]->rating = $reviews->books[$j]->average_rating;
            $results[$id]->rating_count = $reviews->books[$j]->ratings_count;
        }
    }
    return $results;
}

function fetch_google_books_name($result)
{
    try {
        global $vars;
        $url = $vars->url_googlebooks . 'volumes?q=' . urlencode($result->name) . '+inauthor:' . urlencode($result->author_sn) . '&key=' . $vars->google_key;
        return json_decode(file_get_contents($url));
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    return false;
}

function fetch_google_books_isbn($isbn)
{
    try {
        global $vars;
        $url = $vars->url_googlebooks . 'volumes?q=isbn:' . $isbn . '&key=' . $vars->google_key;
        $response = file_get_contents($url);
        if (!$response)
            return false;
        else
            return json_decode($response);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    return false;
}

function urlencode_for_outi($url)
{
    return str_replace('ö', '%F6', str_replace('ä', '%E4', $url));
}

function urlencode_for_sampo($url)
{
    return urlencode(trim(preg_replace('/\s+/', ' ', $url)));
}

function get_parser($url, $var)
{
    global $vars;
    $parser = null;
    # SERVER DOWN PERMANETLY?
    if (strpos($url, 'ttp://oukasrv6.ouka.fi/') > 0 && !strpos($url, '8001')) {
        $url = str_replace('http://oukasrv6.ouka.fi/', $vars->url_outi_server, $url);
    } else if (strpos($url, 'ttps://oukasrv6.ouka.fi/') > 0 && !strpos($url, '8001')) {
        $url = str_replace('https://oukasrv6.ouka.fi/', $vars->url_outi_server, $url);
    }
    try {
        $parser = htmlqp($url, $var, $vars->querypath_settings);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    return $parser;
}

function get_parser_alt($url, $var)
{
    global $vars;
    $parser = null;
    # SERVER DOWN PERMANETLY?
    if (strpos($url, 'ttp://oukasrv6.ouka.fi/') > 0 && !strpos($url, '8001')) {
        $url = str_replace('http://oukasrv6.ouka.fi/', $vars->url_outi_server, $url);
    } else if (strpos($url, 'ttps://oukasrv6.ouka.fi/') > 0 && !strpos($url, '8001')) {
        $url = str_replace('https://oukasrv6.ouka.fi/', $vars->url_outi_server, $url);
    }
    try {
        $parser = htmlqp($url, $var, $vars->querypath_settings_alt);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
    return $parser;
}
