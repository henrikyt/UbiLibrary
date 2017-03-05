<?php
include_once "variables.php";
include_once "lib/iCalReader.php";

header('Content-Type: application/json');
date_default_timezone_set('Europe/Helsinki');

$cal = array(
    'kaikki' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/no--filter.ics',
    'kurssit' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-36c67223-0136-cae0cdea-00005ab7%27%7Ccatuid%3D%27ff808081-32832565-0132-a9580548-00000e27%27%29.ics',
    'juhlat' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a1032bbd-00000013%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104b475-00000019%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c55e2d5b-00003d7f%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104791f-00000018%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c58a16aa-000054bf%27%7Ccatuid%3D%27ff808081-337cce16-0135-3907888e-00007220%27%29.ics',
    'lapset' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a103656b-00000014%27%7Ccatuid%3D%27ff808081-32832565-0132-a4b4a3ad-00004bb3%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-304b4afa-00003874%27%29.ics',
    'tiede' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a103e969-00000016%27%7Ccatuid%3D%27ff808081-2d9d54f7-012d-a07d1444-00006ae9%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104da91-0000001a%27%29.ics',
    'liikunta' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a103931e-00000015%27%29.ics',
    'matka' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2c2f9de4-012c-3fb306f4-000078c9%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c58a6ac2-000054c0%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30347a43-00002153%27%29.ics',
    'taide' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2c2f9de4-012c-30e2ac1d-00002311%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a1025924-00000010%27%29.ics',
    'musiikki' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a101d183-0000000f%27%7Ccatuid%3D%27ff808081-32832565-0132-a4b46360-00004bb1%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30347615-00002121%27%29.ics',
    'elokuva' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2c2f9de4-012c-30441494-00002a49%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30dc89ca-000021f7%27%29.ics',
    'teatteri' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a102e368-00000012%27%29.ics',
    'muut' => ' http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/7/%28catuid%3D%27ff808081-2ba0effa-012b-a1050f47-0000001b%27%7Ccatuid%3D%27ff808081-2da70d90-012e-56c25a5d-00002fc3%27%29.ics',
    'ical_courses' => 'https://www.google.com/calendar/ical/uag9tnhpfqk6ed90a8a84ula80%40group.calendar.google.com/public/basic.ics', #'https://www.google.com/calendar/feeds/uag9tnhpfqk6ed90a8a84ula80%40group.calendar.google.com/public/basic';
    'ical_books' => 'https://www.google.com/calendar/ical/juahjt5h32q2qqfms5qjjknm48%40group.calendar.google.com/public/basic.ics', #'https://www.google.com/calendar/feeds/juahjt5h32q2qqfms5qjjknm48%40group.calendar.google.com/public/basic';
    'ical_children' => 'https://www.google.com/calendar/ical/29dbsq2s4foubgoem4vdvj6epk%40group.calendar.google.com/public/basic.ics' #'https://www.google.com/calendar/feeds/29dbsq2s4foubgoem4vdvj6epk%40group.calendar.google.com/public/basic';

);

$ical = array();
$result = array();
if (isset($_GET['type'])) {
    if ($_GET['type'] == 'CHILD') {
        array_push($ical, $cal['ical_children']);
        array_push($ical, $cal['lapset']);
    } else if ($_GET['type'] == 'TEEN') {
        array_push($ical, $cal['musiikki']);
        array_push($ical, $cal['elokuva']);
        array_push($ical, $cal['liikunta']);
    } else if ($_GET['type'] == 'YOUNGADULT') {
        array_push($ical, $cal['ical_books']);
        array_push($ical, $cal['musiikki']);
        array_push($ical, $cal['elokuva']);
    } else if ($_GET['type'] == 'ADULT') {
        array_push($ical, $cal['ical_books']);
        array_push($ical, $cal['musiikki']);
        array_push($ical, $cal['teatteri']);
        array_push($ical, $cal['tiede']);
    } else if ($_GET['type'] == 'SENIOR') {
        array_push($ical, $cal['ical_books']);
        array_push($ical, $cal['kurssit']);
        array_push($ical, $cal['matka']);
        array_push($ical, $cal['ical_courses']);
    } else {
        array_push($ical, $cal['ical_children']);
        array_push($ical, $cal['ical_courses']);
        array_push($ical, $cal['ical_books']);
    }
} else {
    array_push($ical, $cal['ical_books']);
    array_push($ical, $cal['ical_children']);
    array_push($ical, $cal['ical_courses']);
}
$compare = null;
foreach ($ical as $key => $link) {
    $parsed = new ICal($link); #$parser->parse($link);
    $events = $parsed->sortEventsWithOrder($parsed->events(), SORT_ASC);
    foreach ($events as $app) {
        if (!isset($app['DTSTART']))
            continue;
        $start = new DateTime($app['DTSTART']);
        if (strpos('www.google.com', $link) != -1)
            $start->modify('+3 hours');
        if ($start < new DateTime('now'))
            continue;
        if (!isset($_GET['type'])) {
            if($start->format('Hi')=='0000')
               continue;
        }
        if ($compare) {
            if ($start > $compare)
                continue;
        }
        $date = new Event();
        $compare = clone($start);
        if (!$app['DTEND']){
            $end=new DateTime($app['DTEND']);
            if (strpos('www.google.com', $link) != -1)
                $end->modify('+3 hours');
            $date->end = $datex->format('c');
        }else
            $date->end = $start->format('c');
        $date->start = $start->format('c');
        $date->description = str_clean($app['DESCRIPTION']);
        $date->location = str_clean($app['LOCATION']);
        $date->title = str_clean($app['SUMMARY']);
        $result = clone($date);
        break;
    }
}
exit(json_encode($result));