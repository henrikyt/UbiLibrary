<?php
include_once "db.php";

$library = array(
    'CHILD' => "'Lasten ja nuorten kirjat','Lapset'",
    'TEEN' => "'Lasten ja nuorten kirjat','Nuoret','Elokuvat','Pelit','Sarjakuvat','Musiikki'",
    'YOUNGADULT' => "'Kotimainen kaunokirjallisuus','Käännetty kaunokirjallisuus','Kaunokirjallisuus','Pokkarit'",
    'ADULT' => "'Kotimainen kaunokirjallisuus','Käännetty kaunokirjallisuus','Tietokirjat','Kaunokirjallisuus','Tietokirjallisuus'",
    'SENIOR' => "'Kotimainen kaunokirjallisuus','Käännetty kaunokirjallisuus','Tietokirjat','Kaunokirjallisuus','Tietokirjallisuus','Lehdet'"
);
$genre = array(
    'FEMALECHILD' => "lastenkirjallisuus,kuvakirjat",
    'MALECHILD' => "lastenkirjallisuus,kuvakirjat",
    'FEMALETEEN' => "nuortenkirjallisuus",
    'MALETEEN' => "nuortenkirjallisuus,pelit,fantasiakirjallisuus",
    'FEMALEYOUNGADULT' => "psykologinen jännityskirjallisuus,fantasiakirjallisuus,rakkausromaanit,romanttinen jännityskirjallisuus,viihdekirjallisuus,nuorten aikuisten kirjat,",
    'MALEYOUNGADULT' => "fantasiakirjallisuus,tieteiskirjallisuus,seikkailukirjallisuus,kauhukirjallisuus,mieskirjallisuus,jännityskirjallisuus,nuorten aikuisten kirjat,",
    'FEMALEADULT' => "elämänkertaromaanit,naiskirjallisuus,kehitysromaanit,puutarhanhoito,keittokirjat,novellit,rakkausromaanit,romanttinen jännityskirjallisuus,viihdekirjallisuus,historialliset romaanit,jännityskirjallisuus",
    'MALEADULT' => "sodat,eräkertomukset,elämänkertaromaanit,novellit,historialliset romaanit,mieskirjallisuus,jännityskirjallisuus",
    'FEMALESENIOR' => "historialliset rakkausromaanit,muistelmat,elämänkertaromaanit,rakkausromaanit,historialliset romaanit",
    'MALESENIOR' => "muistelmat,sotakirjallisuus,eräkertomukset,historialliset romaanit"
);

header('Content-Type: application/json');
$results = array();
$results = db_recommend_books_start(implode(' ', explode(',', $genre[$_GET['gender'] . $_GET['age']])), $library[$_GET['age']], $_GET['turn'] * 10);
if (count($results) < 10) {
    $results = array_merge($results, db_recommend_books(implode(' ', explode(',', $genre[$_GET['gender'] . $_GET['age']])), ($_GET['turn']) * 10));
}
exit(json_encode($results));

