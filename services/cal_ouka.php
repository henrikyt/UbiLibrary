<?php
ob_start();
ini_set("display_errors", 0);
include_once 'lib/qp.php';
include_once 'lib/iCalReader.php';
include_once 'variables.php';

header('Content-Type: application/json');
global $vars;
$next = array();

$cal = array(
    'kaikki' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/no--filter.ics',
    'kurssit' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-36c67223-0136-cae0cdea-00005ab7%27%7Ccatuid%3D%27ff808081-32832565-0132-a9580548-00000e27%27%29.ics',
    'juhlat' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a1032bbd-00000013%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104b475-00000019%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c55e2d5b-00003d7f%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104791f-00000018%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c58a16aa-000054bf%27%7Ccatuid%3D%27ff808081-337cce16-0135-3907888e-00007220%27%29.ics',
    'lapset' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a103656b-00000014%27%7Ccatuid%3D%27ff808081-32832565-0132-a4b4a3ad-00004bb3%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-304b4afa-00003874%27%29.ics',
    'tiede' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a103e969-00000016%27%7Ccatuid%3D%27ff808081-2d9d54f7-012d-a07d1444-00006ae9%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a104da91-0000001a%27%29.ics',
    'liikunta' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a103931e-00000015%27%29.ics',
    'matka' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2c2f9de4-012c-3fb306f4-000078c9%27%7Ccatuid%3D%27ff808081-36a9cdc5-0136-c58a6ac2-000054c0%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30347a43-00002153%27%29.ics',
    'taide' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2c2f9de4-012c-30e2ac1d-00002311%27%7Ccatuid%3D%27ff808081-2ba0effa-012b-a1025924-00000010%27%29.ics',
    'musiikki' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a101d183-0000000f%27%7Ccatuid%3D%27ff808081-32832565-0132-a4b46360-00004bb1%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30347615-00002121%27%29.ics',
    'elokuva' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2c2f9de4-012c-30441494-00002a49%27%7Ccatuid%3D%27ff808081-2c2f9de4-012c-30dc89ca-000021f7%27%29.ics',
    'teatteri' => 'http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a102e368-00000012%27%29.ics',
    'muut' => ' http://tapahtumakalenteri.ouka.fi/webcache/v1.0/icsDays/31/%28catuid%3D%27ff808081-2ba0effa-012b-a1050f47-0000001b%27%7Ccatuid%3D%27ff808081-2da70d90-012e-56c25a5d-00002fc3%27%29.ics'
);

$url = $cal[$_GET['cat']];

$parsed = new ICal($url);
$ics = $parsed->sortEventsWithOrder($parsed->events(), SORT_ASC);
$events = array();

foreach ($ics as $app) {
    $event = new Event();
    if (!$app['DTSTART'])
        continue;
    $start = new DateTime($app['DTSTART']);
    $event->start = $start->format('c');
    if ($app['DTEND']) {
        $end = new DateTime($app['DTEND']);
        $diff=$start->diff($end);
        if($diff->d>0)
            $event->allDay=true;
    } else {
        $start->modify("+2 hours");
        $end = $start;
        $event->noEnd=true;
    }
    $event->end = $end->format('c');
    $event->title = str_clean($app['SUMMARY']);
    $event->url = $app['URL'];
    $event->description = str_clean($app['DESCRIPTION']);
    if (isset($app['LOCATION']))
        $event->location = str_clean($app['LOCATION']);
    if (isset($app['X-BEDEWORK-COST']))
        $event->cost = $app['X-BEDEWORK-COST'];
    array_push($events, $event);
}

ob_end_clean();
ob_end_flush();
exit(json_encode($events));