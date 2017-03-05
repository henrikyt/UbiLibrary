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
echo('<link rel="stylesheet" href="../styles/services.css"/>');
echo('</head>');
echo('<body>');
echo('<h3>Palautteen kysymykset</h3>');
if (isset($_POST['doit'])) {
    $old = json_decode(file_get_contents('../data/questions.json'), true);
    if (!$old)
        $old = array();
    $event = array();
    $event['choises'] = array();
    foreach ($_POST as $key => $value) {
        if ($value == "")
            continue;
        if (strpos($key, 'elete')) {
            foreach ($old as $key => $item) {
                if ($item['id'] == $value) {
                    array_splice($old, $key, 1);
                    echo('<h1>Tiedot poistettu: ' . $item['question'] . '</h1>');
                }
            }
        } else if ($key == 'question') {
            $event['question'] = $value;
        } else if ($key == 'type') {
            $event['type'] = $value;
        } else if ($key == 'c1') {
            array_push($event['choises'], $value);
        } else if ($key == 'c2') {
            array_push($event['choises'], $value);
        } else if ($key == 'c3') {
            array_push($event['choises'], $value);
        } else if ($key == 'c4') {
            array_push($event['choises'], $value);
        } else if ($key == 'c5') {
            array_push($event['choises'], $value);
        } else if ($key == 'c6') {
            array_push($event['choises'], $value);
        }
    }
    if (isset($event['question'])) {
        echo('<h1>Tiedot lisätty</h1>');
        $event['id'] = uniqid();
        array_push($old, $event);
    }
    echo('<br><button onclick="history.go(-1);return false;">Takaisin</button>');
    $fp = fopen($vars->output . 'questions.json', 'w');
    fwrite($fp, json_encode($old));
    fclose($fp);
} else {
    $old = json_decode(file_get_contents('../data/questions.json'), true);
    if (!$old)
        $old = array();
    echo('<form method="POST" action="ubiquestions.php">');
    echo('<h1>Vanhat kysymykset</h1>');
    foreach ($old as $item) {
        echo('<input name="delete' . $item['id'] . '" value="' . $item['id'] . '" type="checkbox">');
        echo($item['question']);
        echo('<br>');
    }
    echo('<h1>Uusi kysymys</h1>');
    echo('<h2>Kysymys</h2>');
    echo('<input name="question" type="text"/>');
    echo('<h2>Tyyppi</h2>');
    echo('<select name="type">');
    echo('<option value="check">Monta valintaa</option>');
    echo('<option value="radio">Yksi valinta</option>');
    echo('<option value="text">Teksti</option>');
    echo('</select>');
    echo('<h2>Vaihtoehdot</h2>');
    echo('<input name="c1" type="text"/><br><br>');
    echo('<input name="c2" type="text"/><br><br>');
    echo('<input name="c3" type="text"/><br><br>');
    echo('<input name="c4" type="text"/><br><br>');
    echo('<input name="c5" type="text"/><br><br>');
    echo('<input name="c6" type="text"/><br><br>');
    echo('<input name="doit" type="hidden"/>');
    echo('<br><button onclick="history . go(-1);return false;">Takaisin</button>');
    echo('<button type="submit">Lähetä</button>');
    echo('</form');
}
echo('</body>');
echo('</html>');
