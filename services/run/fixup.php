<?php
include_once '../parser.php';
print "Getting new books to database\r\n";

$i = intval(file_get_contents('names.txt'));

try {
    $vars->outi_delay = 0;
    $failed = 0;
    $counter = 0;
    try {
        print "Processing all\n";
        for ($i; $i <= 5000; $i++) {
            print "index " . $i . "\n";
            if (!replace_outi_all($i * 50)) {
                if ($failed == 10)
                    break;
                sleep(60);
                $failed++;
                $i--;
                continue;
            }
            $failed = 0;
            $counter++;
        }
        if ($failed == 10 && $i > 4900)
            $i = 0;
        if ($i == 5000)
            $i = 0;
        $fp = fopen('names.txt', 'w');
        fwrite($fp, $i);
        fclose($fp);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
} catch (Exception $e) {
    error_log($e->getMessage());
}
print "Done getting new books to database\r\n";