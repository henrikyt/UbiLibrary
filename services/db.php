<?php

include_once "variables.php";

function db_save_books($books)
{
    if (count($books) == 0)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare(Database::$sql_insert);
        foreach ($books as $book) {
            $arr = array();
            foreach ($book as $key => $value) {
                $arr[':' . $key] = $value;
            }
            if ($book->name)
                $ret = $db->execute($arr);
            if (!$ret)
                error_log("DB:Book save: " . var_dump($db->errorInfo()));
        }
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("DB:Books save: " . $e->getMessage());
    }
}

function db_save_book($book)
{
    if (!$book)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare(Database::$sql_insert);
        $arr = array();
        foreach ($book as $key => $value) {
            $arr[':' . $key] = $value;
        }
        if ($book->name)
            $ret = $db->execute($arr);
        if (!$ret)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Book save ID" . $this->book_id . " : " . $e->getMessage());
    }
}

function db_remove_book($book){
    if (!$book)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare("DELETE FROM books WHERE book_id= :book_id");
        $ret = $db->execute(array(':book_id' => $book->book_id));
        if (!$ret)
            error_log("DB:Book remove: " . print_r($db->errorInfo()));
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Book remove ID" . $this->book_id . " : " . $e->getMessage());
    }
}

function db_replace_book_by_id($new, $old)
{
    if (!$new || !$old)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare(Database::$sql_replace);
        $arr = array();
        $new->id = $old->id;
        foreach ($new as $key => $value) {
            $arr[':' . $key] = $value;
        }
        if ($new->name)
            $ret = $db->execute($arr);
        if (!$ret)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Book save ID" . $new->book_id . " : " . $e->getMessage());
    }
}

function db_replace_book($book)
{
    if (!$book)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare(Database::$sql_replace);
        $arr = array();
        foreach ($book as $key => $value) {
            $arr[':' . $key] = $value;
        }
        if ($book->name)
            $ret = $db->execute($arr);
        if (!$ret)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Book save ID" . $book->book_id . " : " . $e->getMessage());
    }
}

function db_replace_books($books)
{
    if (!$books)
        return;
    try {
        Database::beginTransaction();
        $db = Database::prepare(Database::$sql_replace);
        $arr = array();
        foreach ($books as $book) {
            foreach ($book as $key => $value) {
                $arr[':' . $key] = $value;
            }
            if ($book->name)
                $ret = $db->execute($arr);
            if (!$ret)
                error_log("DB:Book save: " . print_r($db->errorInfo()));
        }
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Book save ID" . $book->book_id . " : " . $e->getMessage());
    }
}

function db_get_books($index)
{
    $return = array();
    try {
        $ret = Database::query("SELECT * FROM books LIMIT $index,50");
        if (!$ret) {
            return false;
        } else {
            if ($ret->rowCount() > 0) {
                foreach ($ret->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    $b = new Book($row);
                    array_push($return, $b);
                }
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
    }
    return $return;
}

function db_recommend_books_start($type, $category, $start)
{
    try {
        $db = Database::query("SELECT * FROM books WHERE ( category in ($category) OR subcategory in ($category) ) AND MATCH (tags) AGAINST ('$type' IN BOOLEAN MODE) ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50");
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_recommend_books($type, $start)
{
    try {
        $db = Database::query("SELECT * FROM books WHERE MATCH (tags) AGAINST ('$type' IN BOOLEAN MODE) ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50");
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_suggest_books($keywords, $start)
{
    try {
        $db = Database::query("SELECT * FROM books WHERE  MATCH (tags) AGAINST ('$keywords' IN BOOLEAN MODE) ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50");
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_suggest_books_search($searchwords, $keywords, $start, $tags)
{
    $sql = "SELECT * FROM books WHERE ";
    foreach ($searchwords as $i) {
        if ($tags)
            $sql .= "( BINARY name LIKE ('%$i%') OR BINARY author_fn LIKE ('%$i%') OR BINARY author_sn LIKE ('%$i%') OR BINARY tags LIKE ('%$i%') ) AND ";
        else
            $sql .= "( BINARY name LIKE ('%$i%') OR BINARY author_fn LIKE ('%$i%') OR BINARY author_sn LIKE ('%$i%') ) AND ";
    }
    $sql = substr($sql, 0, strlen($sql) - 4);
    if ($keywords != '+')
        $sql .= "AND MATCH (tags) AGAINST ('$keywords' IN BOOLEAN MODE) ";
    $sql .= "ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50";
    try {
        $db = Database::query($sql);
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_suggest_books_search_na($search, $start)
{
    $sql = "SELECT * FROM books WHERE ";
    foreach ($search as $i) {
        $sql .= "( BINARY name LIKE ('%$i%') OR BINARY author_fn LIKE ('%$i%') OR BINARY author_sn LIKE ('%$i%') OR BINARY tags LIKE ('%$i%') ) OR ";
    }
    $sql = substr($sql, 0, strlen($sql) - 3) . "ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50";
    try {
        $db = Database::query($sql);
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return false;
}

function db_suggest_books_search_nb($search, $keywords, $start, $tags)
{
    $sql = "SELECT * FROM books WHERE ";
    foreach ($search as $i) {
        if (!$tags)
            $sql .= "( name LIKE ('%$i%') OR author_fn LIKE ('%$i%') OR author_sn LIKE ('%$i%') ) AND ";
        else
            $sql .= "( name LIKE ('%$i%') OR author_fn LIKE ('%$i%') OR author_sn LIKE ('%$i%') OR tags LIKE ('%$i%') ) AND ";
    }
    $sql = substr($sql, 0, strlen($sql) - 4);
    if ($keywords != '+')
        $sql .= "AND MATCH (tags) AGAINST ('$keywords' IN BOOLEAN MODE) ";
    $sql .= "ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50";
    try {
        $db = Database::query($sql);
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_suggest_books_search_exact($searchwords, $keywords, $start)
{
    $sql = "SELECT * FROM books WHERE ";
    foreach ($searchwords as $i) {
        $sql .= "( name='$i' OR author_fn='$i' OR author_sn='$i' ) AND ";
    }
    $sql = substr($sql, 0, strlen($sql) - 4);
    if ($keywords != '+')
        $sql .= "AND MATCH (tags) AGAINST ('$keywords' IN BOOLEAN MODE) ";
    $sql .= "ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50";
    try {
        $db = Database::query($sql);
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}

function db_suggest_start($start)
{
    try {
        $db = Database::query("SELECT * FROM books WHERE type='Kirja' AND picture<>'' AND type='Kirja' AND rating > 3.5 AND rating_count > 8 ORDER BY RAND() LIMIT 13");
        if (!$db)
            error_log("DB:Book save: " . print_r($db->errorInfo()));
        else {
            $books = $db->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return false;
}

function db_book_exist_by_name($book_name)
{
    if (!$book_name || $book_name == "")
        return false;
    try {
        $db = Database::prepare("SELECT id FROM books WHERE name= :name LIMIT 1");
        if (!$db->execute(array(':name' => $book_name))) {
            error_log("DB:Book exists query " . $book_name);
            return false;
        } else {
            if ($db->rowCount() > 0)
                return true;
            else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $book_name . ": " . $e->getMessage());
    }
}

function db_book_exist($id)
{
    if ($id == "" || !$id)
        return true;
    try {
        $ret = Database::query("SELECT * FROM books WHERE book_id='$id' LIMIT 1");
        if (!$ret) {
            error_log("DB:Book exists query " . $id);
            return true;
        } else {
            if ($ret->rowCount() > 0)
                return true;
            else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $id . ": " . $e->getMessage());
    }
}

function db_book_exist_by_name_with_content($book_name)
{
    if (!$book_name || $book_name == "")
        return false;
    try {
        $db = Database::prepare("SELECT * FROM books WHERE name= :name LIMIT 1");
        if (!$db->execute(array(':name' => $book_name))) {
            error_log("DB:Book exists query " . $book_name);
            return false;
        } else {
            if ($db->rowCount() > 0) {
                $b = new Book($db->fetch(PDO::FETCH_ASSOC));
                return $b;
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $book_name . ": " . $e->getMessage());
    }
}

function db_book_exist_by_name_with_content_multiple($book_name)
{
    if (!$book_name || $book_name == "")
        return false;
    $return = array();
    try {
        $db = Database::prepare("SELECT * FROM books WHERE name= :name");
        if (!$db->execute(array(':name' => $book_name))) {
            error_log("DB:Book exists query first " . $book_name);
            return false;
        } else {
            if ($db->rowCount() > 0) {
                foreach ($db->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    $b = new Book($row);
                    array_push($return, $b);
                }
            } else {
                return false;
            }

        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $book_name . ": " . $e->getMessage());
        return false;
    }

    return $return;
}

function db_book_exist_by_name_fuzzy_with_content($book_name)
{

    if (!$book_name || $book_name == "")
        return false;
    try {
        $db = Database::prepare("SELECT * FROM books WHERE name= :name LIMIT 1");
        if (!$db->execute(array(':name' => $book_name))) {
            error_log("DB:Book exists query " . $book_name);
            return false;
        } else {
            if ($db->rowCount() > 0) {
                $b = new Book($db->fetch(PDO::FETCH_ASSOC));
                return $b;
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $book_name . ": " . $e->getMessage());
    }
}

function db_book_exist_with_content($book_id)
{
    if ($book_id == "" || !$book_id)
        return false;
    try {
        $ret = Database::query("SELECT * FROM books WHERE book_id='$book_id' LIMIT 1");
        if (!$ret) {
            error_log("DB:Book exists query " . $book_id);
            return false;
        } else {
            if ($ret->rowCount() > 0) {
                $b = new Book($ret->fetch(PDO::FETCH_ASSOC));
                return $b;
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $book_id . ": " . $e->getMessage());
    }
}

function db_book_exist_with_content_isbn($isbn)
{
    if ($isbn == "" || !$isbn)
        return false;
    try {
        $ret = Database::query("SELECT * FROM books WHERE isbn='$isbn' LIMIT 1");
        if (!$ret) {
            error_log("DB:Book exists query " . $isbn);
            return false;
        } else {
            if ($ret->rowCount() > 0) {
                $b = new Book($ret->fetch(PDO::FETCH_ASSOC));
                return $b;
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $isbn . ": " . $e->getMessage());
    }
    return false;
}

function db_get_books_missing_covers($start)
{
    try {
        $ret = Database::query("SELECT * FROM books WHERE ( CHAR_LENGTH(isbn)=13 OR CHAR_LENGTH(isbn)=10) AND picture='' LIMIT $start,100");
        if (!$ret) {
            return false;
        } else {
            $books = array();
            while ($row = $ret->fetch(PDO::FETCH_ASSOC)) {
                array_push($books, new Book($row));
            }
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $e->getMessage());
    }
    return false;
}

function db_get_books_missing_reviews($start)
{
    try {
        $ret = Database::query("SELECT * FROM books WHERE ( CHAR_LENGTH(isbn)=13 OR CHAR_LENGTH(isbn)=10) AND rating_count='' LIMIT $start,100");
        if (!$ret) {
            return false;
        } else {
            $books = array();
            while ($row = $ret->fetch(PDO::FETCH_ASSOC)) {
                array_push($books, new Book($row));
            }
            return $books;

        }
    } catch (Exception $e) {
        error_log("DB:Book exists " . $e->getMessage());
    }
    return false;
}

function db_get_keywords()
{
    try {
        $ret = Database::query("SELECT tags FROM books");
        if (!$ret) {
            error_log("DB:tags");
            return false;
        } else {
            if ($ret->rowCount() > 0) {
                return $ret->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:tags: " . $e->getMessage());
    }
}

function db_save_stats($name, $start, $click, $gender, $age, $guid)
{
    try {
        Database::beginTransaction();
        $db = Database::prepare("INSERT INTO stats(id,name,age,gender,start,click) values('$guid','$name','$age','$gender','$start','$click')");
        $ret = $db->execute();
        if (!$ret) {
            error_log("Stats: " . print_r($db->errorInfo()));
            Database::rollBack();
        }
        Database::commit();
    } catch (Exception $e) {
        Database::rollBack();
        error_log("Stats: " . $e->getMessage());
    }
}

function db_is_value($value)
{
    try {
        $ret = Database::query("SELECT * FROM books WHERE name='$value' OR author_fn='$value' OR author_sn='$value' LIMIT 1");
        if (!$ret) {
            error_log("DB:Tag exists query " . $value);
            return true;
        } else {
            if ($ret->rowCount() > 0)
                return true;
            else {
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("DB:Tag exists " . $value . ": " . $e->getMessage());
    }
    return false;
}

function db_similar_books($keywords, $start)
{
    try {
        $ret = Database::query("SELECT * FROM books WHERE  MATCH (tags) AGAINST ('$keywords' IN BOOLEAN MODE) ORDER BY rating_count DESC,rating DESC,picture DESC LIMIT $start, 50");
        if (!$ret)
            error_log("DB:Book save: " . print_r($ret->errorInfo()));
        else {
            $books = $ret->fetchAll(PDO::FETCH_ASSOC);
            return $books;
        }
    } catch (Exception $e) {
        error_log("DB:Get books: " . $e->getMessage());
    }
    return array();
}