<?php

include_once 'lib/Encoding.php';

Class VarsDB
{
    # DATABASE
    public $dbengine = 'mysql';
    public $dbname = 'ubilibrary';
    public $dbuser = 'ubilibraryuser';
    public $dbpass = 'ubioulu';
    public $dbhost = 'localhost';
}

Class Vars
{
    # SETTINGS
    public $debug_books = false;
    public $debug = false;
    public $querypath_settings;
    public $querypath_settings_alt;
    public $goodreads_key = 'jMR65h5cRoyNEXrMwEhtg';
    public $google_key = 'AIzaSyChhzu-St-DtAEWp47d_q-lQYIrSfhAeZo';
    public $ny_key = '488b29d008b4fe393057528f8450602f:19:67888197';
    #public $output = 'D:\\Other\\Workspace\\UBILibrary\\data\\';
    public $output = '/var/www/html/ubilibrary/data/';
    public $outi_delay = 0;

    # SERVERS
    public $url_msl = 'http://www.kirjakauppaliitto.fi/ratings/index.html';
    public $url_goodreads = 'http://www.goodreads.com/';
    public $url_googlebooks = 'https://www.googleapis.com/books/v1/';
    public $url_ouka_server = 'http://www.ouka.fi';

    # SAMPO
    public $url_sampo_sparql = 'http://api.kirjasampo.fi:8080/kirjasampo-backend/subi/service/sparql/?query=';
    public $url_sampo_search = 'http://api.kirjasampo.fi:8080/kirjasampo-backend/subi/service/rdf/search';

    # LIBRARY SERVERS
    public $url_outi_server = 'http://oukasrv6.ouka.fi:8001/';
    public $url_outi = 'Intro?dat0=$BOOKNAME$&dat1=$AUTHORNAME$&formid=fullt&typ0=2&typ1=0';
    public $url_outi_name_only = 'Intro?dat0=$BOOKNAME$&formid=fullt&typ0=2';
    public $url_outi_available = 'Intro?formid=avlbs&doci=$BOOKID$';
    public $url_outi_book = 'Intro?formid=docis&doci=$BOOKID$';
    public $url_outi_suggest = 'Intro?dat0=ki&dat1=fin&formid=fullt&typ0=11&typ1=7&rppg=10';
    public $url_outi_literature = 'Intro?dat0=ki&dat1=fin&dat2=$BOOKID$&formid=fullt&typ0=11&typ1=7&typ2=3&rppg=50&offs=$OFFSET$';
    public $url_outi_custom = 'Intro?dat0=$WORDS$&formid=fullt&typ0=86&rppg=50';
    public $url_outi_all = 'Intro?boo1=AND&booC=NOT&dat4=fin&dat5=0&dat5=2013&formid=fullt&previd=find2&rppg=50&typ0=2&typ1=0&typ2=3&typ3=11&typ4=7&typ5=8&typ7=42&typ8=3&typA=30&typB=30&typC=11&ulang=fin&sesid=1372158411&offs=$OFFSET$';

    # LIBRARY CALENDARS
    public $ical = array(
        'ical_courses' => 'https://www.google.com/calendar/ical/uag9tnhpfqk6ed90a8a84ula80%40group.calendar.google.com/public/basic.ics', #'https://www.google.com/calendar/feeds/uag9tnhpfqk6ed90a8a84ula80%40group.calendar.google.com/public/basic';
        'ical_books' => 'https://www.google.com/calendar/ical/juahjt5h32q2qqfms5qjjknm48%40group.calendar.google.com/public/basic.ics', #'https://www.google.com/calendar/feeds/juahjt5h32q2qqfms5qjjknm48%40group.calendar.google.com/public/basic';
        'ical_children' => 'https://www.google.com/calendar/ical/29dbsq2s4foubgoem4vdvj6epk%40group.calendar.google.com/public/basic.ics' #'https://www.google.com/calendar/feeds/29dbsq2s4foubgoem4vdvj6epk%40group.calendar.google.com/public/basic';
    );

    public $rss = array(
        'rss_general' => 'http://www.ouka.fi/oulu/kirjasto/etusivu/-/asset_publisher/7Nqx/rss?p_p_cacheability=cacheLevelPage',
        'rss_news' => 'http://www.ouka.fi/oulu/kirjasto/ajankohtaista/-/asset_publisher/CG1w/rss?p_p_cacheability=cacheLevelPage');

    function __construct()
    {
        $this->querypath_settings = array('convert_from_encoding' => 'ISO-8859-1'); #, 'context' => stream_context_create(array('http' => array('header' => 'Connection: close\r\n'))));
        $this->querypath_settings_alt = array('convert_from_encoding' => 'ISO-8859-1', 'context' => stream_context_create(array('http' => array('timeout' => 1 , 'header' => 'Connection: close\r\n'))));
    }
}

$vars = new Vars();

# GENERAL FUNCTIONS

function str_clean($string)
{
    if (is_array($string)) {
        $string = $string[0];
    }
    return EncodingUTF::fixUTF8(str_replace('\\', '', trim(preg_replace('/\s+/', ' ', strip_tags($string)))));
}

# CLASSES

class Date
{
    public $startDate = "";
    public $endDate = "";
    public $headline = "";
    public $text = "";
    public $tag = "";
    public $asset = array(media => "", credit => "", caption => "");
}

class Event
{
    public $title = "";
    public $start = "";
    public $end = "";
    public $url = "";
    public $description = "";
    public $location = "";
    public $image = "";
    public $background = "";
    public $id = "";
    public $cost = "";
    public $allDay = false;
    public $noEnd = false;
    public $remove = "";
}

/**
 * Class Book
 * object
 */
class Book
{
    public $id = "";
    public $book_id = "";
    public $name = "";
    public $author_fn = "";
    public $author_sn = "";
    public $abstract = "";
    public $publisher = "";
    public $length = "";
    public $language = "";
    public $tags = "";
    public $location = "";
    public $picture = "";
    public $rating = "";
    public $rating_count = "";
    public $category = "";
    public $subcategory = "";
    public $isbn = "";
    public $type = "";

    function __construct($arr = null)
    {
        if ($arr) {
            foreach ($arr as $key => $value) {
                $this->$key = $value;
            }
        }
    }

    function save()
    {
        try {
            Database::beginTransaction();
            $db = Database::prepare(Database::$sql_insert);
            $arr = array();
            foreach ($this as $key => $value) {
                $arr[':' . $key] = $value;
            }
            $db->execute($arr);
            Database::commit();
        } catch (Exception $e) {
            error_log("Book save ID" . $this->book_id . " : " . $e->getMessage());
        }
    }

}

/**
 * Class Database
 * static singleton access to database
 */
class Database
{
    private static $link = null;
    public static $sql_insert = "";
    public static $sql_replace = "";

    private static function getLink()
    {
        if (self :: $link) {
            return self :: $link;
        }

        $sql1 = 'INTO books (';
        $sql2 = ' VALUES (';
        $book = new Book();
        foreach ($book as $key => $value) {
            end($book);
            if ($key === key($book)) {
                $sql1 .= $key . ')';
                $sql2 .= ':' . $key . ')';
            } else {
                $sql1 .= $key . ', ';
                $sql2 .= ':' . $key . ', ';
            }
        }
        self :: $sql_insert = 'INSERT ' . $sql1 . $sql2;
        self :: $sql_replace = 'REPLACE ' . $sql1 . $sql2;

        $vars = new VarsDB();
        $dns = $vars->dbengine . ':dbname=' . $vars->dbname . ";charset=utf8;host=" . $vars->dbhost;
        self :: $link = new PDO ($dns, $vars->dbuser, $vars->dbpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        return self :: $link;
    }

    public static function __callStatic($name, $args)
    {
        $callback = array(self :: getLink(), $name);
        return call_user_func_array($callback, $args);
    }
}