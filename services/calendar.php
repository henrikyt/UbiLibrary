<?php

include_once 'lib/qp.php';
include_once 'lib/iCalReader.php';
include_once 'variables.php';

$vars = new Vars();

function cal_library_ical()
{
    global $vars;
    $next = array();
    $dates = array('cal_all' => array());
    foreach ($vars->ical as $key => $link) {
        $dates[$key] = array();
        $parsed = new ICal($link); #$parser->parse($link);
        $events = $parsed->sortEventsWithOrder($parsed->events(), SORT_ASC);
        $visit = true;
        foreach ($events as $app) {
            $date = new Event();
            $datex = new DateTime($app['DTEND']);
            $datex->modify('+3 hours');
            if ($datex < new DateTime())
                continue;
            $date->end = $datex->format('c');
            $datex = new DateTime($app['DTSTART']);
            $datex->modify('+3 hours');
            $date->start = $datex->format('c');
            $date->text = '<strong>' . str_clean($app['LOCATION']) . '</strong><br>' . str_clean($app['DESCRIPTION']);
            $date->headline = $datex->format('g:i') . ' ' . str_clean($app['SUMMARY']);
            # $date->asset['media']='http://www.oululehti.fi/etusivu/5542168.jpg';
            array_push($dates[$key], clone($date));
            $date->tag = $parsed->cat[1];
            array_push($dates['cal_all'], $date);
            if ($visit & $key == 'cal_books') {
                array_push($next, $date);
                $visit = false;
            }
        }
    }
    $result = array('headline' => 'Kirjaston tapahtumat', 'type' => 'default', 'startDate' => date('Y,m,d') . '00,00', 'text' => '');
    foreach ($dates as $key => $item) {
        $result['date'] = $item;
        $fp = fopen($vars->output . $key . '.json', 'w');
        fwrite($fp, json_encode(array('timeline' => $result)));
        fclose($fp);
    }
    $fp = fopen($vars->output . 'cal_next.json', 'w');
    fwrite($fp, json_encode($next));
    fclose($fp);
}

function cal_other_ical()
{
    global $vars;
    $dates = array();
    foreach ($vars->ical_other as $key => $link) {
        $dates[$key] = array();
        $parsed = new ICal($link);
        $events = $parsed->sortEventsWithOrder($parsed->events(), SORT_ASC);
        foreach ($events as $app) {
            $date = new Date();
            $datex = new DateTime($app['DTEND']);
            if ($datex < new DateTime())
                continue;
            $date->endDate = $datex->format('Y,m,d,H,i');
            $datex = new DateTime($app['DTSTART']);
            if ($datex < new DateTime())
                continue;
            $date->startDate = $datex->format('Y,m,d,H,i');
            $date->text = '<strong>' . str_clean(cal_get_location($app)) . '</strong><br>' . str_clean($app['DESCRIPTION']);
            $date->headline = $datex->format('g:i') . ' ' . str_clean($app['SUMMARY']);
            # $date->asset['media']='http://www.oululehti.fi/etusivu/5542168.jpg';
            array_push($dates[$key], $date);
        }
    }
    $result = array('headline' => 'Oulun tapahtumat', 'type' => 'default', 'startDate' => date('Y,m,d') . '00,00', 'text' => '');
    foreach ($dates as $key => $item) {
        $result['date'] = $item;
        $fp = fopen($vars->output . $key . '.json', 'w');
        fwrite($fp, json_encode(array('timeline' => $result)));
        fclose($fp);
    }
}

function cal_get_location($app)
{
    foreach ($app as $key => $item) {
        if (strpos($key, 'LOCATION')) {
            return $item;
        }
    }
}

function cal_load_rss()
{
    global $vars;
    $dates = array();
    foreach ($vars->rss as $key => $link) {
        $dates[$key] = array();
        $parsed = qp($link, 'entry');
        foreach ($parsed as $entry) {
            $date = new Event();
            $day = new DateTime(str_clean($entry->children('published')->text()));
            $diff = new DateTime('now');
            $diff = $diff->diff($day);
            if (intval($diff->m) > 3)
                continue;
            $url = str_clean($entry->children('id')->text());
            $date->description = cal_load_rss_sub($url);
            $date->title = str_clean($entry->find('title')->text());
            $date->image = cal_load_rss_img($url);
            $date->start = $day->format('r'); #->format('Y,m,d,H,i');
            array_push($dates[$key], $date);
        }
    }
    foreach ($dates as $key => $item) {
        $fp = fopen($vars->output . $key . '.json', 'w');
        fwrite($fp, json_encode($item));
        fclose($fp);
    }
}

function cal_load_rss_sub($url)
{
    global $vars;
    $parsed = htmlqp($vars->url_ouka_server . $url, '.asset-content');
    return str_clean($parsed->text());
}

function cal_load_rss_img($url)
{
    global $vars;
    $parsed = htmlqp($vars->url_ouka_server . $url, '.asset-content');
    $imgs = $parsed->find('img');
    foreach ($imgs as $img) {
        $style = explode(';', $img->attr('style'));
        $w = 0;
        $h = 0;
        foreach ($style as $size) {
            if (count($s = explode('width:', $size)) > 1) {
                $w = explode('px', $s[1]);
                $w = intval($w[0]);
            }
            if (count($s = explode('height:', $size)) > 1) {
                $h = explode('px', $s[1]);
                $h = intval($h[0]);
            }
        }
        if ($w > 100 && $h > 100)
            return $vars->url_ouka_server . $img->attr('src');
    }
    return "";
}

function cal_limit_news()
{

}