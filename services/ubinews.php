<?php

include_once "variables.php";

//Set no caching
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

echo('<html>');
echo('<head>');
echo('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
echo('<link rel="stylesheet" href="../styles/slides.css"/>');
echo('<link rel="stylesheet" href="../styles/services.css"/>');
echo('<script src="../scripts/lib/datetimepicker.js"></script>');
echo('<script src="../scripts/lib/jquery/jquery-2.0.2.min.js"></script>');
echo('</head>');
echo('<body>');
echo('<h3>Tiedotteet</h3>');
if (isset($_POST['doit'])) {
    $old = json_decode(file_get_contents('../data/rss_custom.json'), true);
    if (!$old)
        $old = array();
    $event = new Event();
    $event->start = new DateTime('now');
    $event->start = $event->start->format('c');
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'elete')) {
            foreach ($old as $key => $item) {
                if ($item['id'] == $value) {
                    array_splice($old, $key, 1);
                    echo('<h1>Tiedot poistettu: ' . $item['title'] . '</h1>');
                }
            }
        } else if ($key == 'title') {
            $event->title = $value;
        } else if ($key == 'description') {
            $event->description = $value;
        } else if ($key == 'image') {
            $event->image = $value;
        } else if ($key == 'background') {
            $event->background = $value;
        } else if ($key == 'removeday') {
            $tmp = new DateTime($value);
            $event->remove = $tmp->format('c');
        }
    }
    if ($event->title) {
        echo('<h1>Tiedot lisätty: ' . $event->title . '</h1>');
        $event->id = uniqid();
        array_push($old, $event);
    }
    echo('<br><button onclick="history.go(-1);return false;">Takaisin</button>');
    $fp = fopen($vars->output . 'rss_custom.json', 'w');
    fwrite($fp, json_encode($old));
    fclose($fp);
} else {
    $old = json_decode(file_get_contents('../data/rss_custom.json'), true);
    if (!$old)
        $old = array();
    echo('<form method="POST" action="ubinews.php">');
    echo('<h1>Vanhat tiedoteet</h1>');
    foreach ($old as $item) {
        echo('<input name="delete' . $item['id'] . '" value="' . $item['id'] . '" type="checkbox">');
        echo($item['title']);
        echo('<br>');
    }
    echo('<h1>Uusi tiedote</h1>');
    echo('<p>Sisältö-kenttä tukee html-tageja (esim. &#60;br&#62; on rivinvaihto). <a href="http://www.w3schools.com/html/html_formatting.asp">Ohjeet tageihin.</a> </p>');
    echo('<p>Jos haluat käyttää koko tiedotetta kuvana, syötä Tiedote kuvana kenttään laajakuvaformaatissa (16:9) olevan kuvan verkko-osoite.</p>');
    echo('<p>Kuvissa tulee käyttää URLia verkko-osoitteeseen (esim. http://www.kirjavalitys.fi/1/2.jpeg )</p>');
    echo('<p>Kuvat pienennetään suhteessa kunnes ne mahtuvat niille ilmotettuihin maksimikokoihin. Liian suuret kuvat hidastavat ohjelmaan käynnistymistä.</p>');
    echo('<h2>Otsikko (pakollinen)</h2>');
    echo('<input id="title" name="title" type="text"/>');
    echo('<h2>Sisältö</h2>');
    echo('<textarea id="description" name="description"></textarea>');
    echo('<h2>Kuva URL (250px * 290px)</h2>');
    echo('<input id="image" name="image" type="text"/>');
    echo('<h2>Tiedote kuvana URL (710px * 438px)</h2>');
    echo('<input id="background" name="background" type="text"/>');
    echo('<h2>Poistetaan päivänä:</h2>');
    echo('<input name="removeday" id="day" type="text" readonly="readonly"><a href="javascript:NewCal(\'day\',\'ddmmyyyy\')"> <img src="../files/cal.gif" width="16" height="16" border="0" alt="Pick a date"></a>');
    echo('<input name="doit" type="hidden"/>');
    echo('<br><br><button onclick="history.go(-1);return false;">Takaisin</button>');
    echo('<button type="button" onclick="preview()">Esikatselu</button>');
    echo('<button type="submit">Lähetä</button>');
    echo('</form>');
    echo('<div id="preview"></div>');
}
echo('</body>');
echo('</html>');
