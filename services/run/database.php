<?php
include_once '../parser.php';
print "Getting new books to database\r\n";

$i = intval(file_get_contents('database.txt'));

try {
    $vars->outi_delay = 0;
    $full = true;
    $categories = array('Elämäkertaromaanit', 'Aikakausiromaanit', 'Eräkertomukset', 'Fantasiakirjallisuus', 'Historialliset rakkausromaanit', 'Historialliset romaanit', 'Huumori', 'Jännityskirjallisuus', 'Kauhukirjallisuus', 'Kehitysromaanit', 'Maaseuturomaanit', 'Muistelmat', 'Murrekirjallisuus', 'Naiskirjallisuus', 'Perheromaanit', 'Poliisikirjallisuus', 'Psykologinen jännityskirjallisuus', 'Psykologiset romaanit', 'Rakkausromaanit', 'Romanttinen jännityskirjallisuus', 'Salapoliisikirjallisuus', 'Satiiri', 'Seikkailukirjallisuus', 'Sotakirjallisuus', 'Sukuromaanit', 'Tieteiskirjallisuus', 'Uskonnollinen kirjallisuus', 'Vakoilukirjallisuus', 'Viihdekirjallisuus', 'Yhteiskunnalliset romaanit');
    $failed = 0;
    $counter = 0;
    if ($full) {
        try {
            print "Processing all\n";
            for ($i; $i <= 5000; $i++) {
                print "index " . $i . "\n";
                if (!fetch_outi_all($i * 50)) {
                    if ($failed == 10)
                        break;
                    sleep(60);
                    $failed++;
                    $i--;
                    continue;
                }
                $failed = 0;
            }
            if ($failed == 10 && $i > 4900)
                $i = 0;
            if ($i == 5000)
                $i = 0;
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
        $fp = fopen('database.txt', 'w');
        fwrite($fp, $i);
        fclose($fp);
    } else {

        foreach ($categories as $cat) {
            print "Processing " . $cat . "\n";
            for ($i = 0; $i < 150; $i++) {
                print "index " . $i . "\n";
                if (!fetch_outi_literature($cat, $i * 50))
                    break;
            }
        }

    }
} catch (Exception $e) {
    error_log($e->getMessage());
}
print "Done getting new books to database\r\n";