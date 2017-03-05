<?php
print "Removing old events\r\n";
try {
    $events = json_decode(file_get_contents("../../data/rss_custom.json"));
    $today = new DateTime();
    foreach ($events as $key => $event) {
        if ($event->remove) {
            $compare = new DateTime($event->remove);
            $diff = $today->diff($compare);
            if (!$diff->days)
                unset($events[$key]);
        }
    }
    $fp = fopen("../../data/rss_custom.json", "w");
    fwrite($fp, json_encode($events));
    fclose($fp);
} catch (Exception $e) {
    error_log("Event parser: " . $e->getMessage());
}
print "Done removing old events\r\n";
