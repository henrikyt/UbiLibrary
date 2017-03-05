<?php

include_once "../parser.php";

print "Updating suggested books\r\n";
try {
    $vars->outi_delay = 0;
    print "Updating OUKA\r\n";
    fetch_ouka_vinkit();
    print "Updating NY\r\n";
    #fetch_ny_times();
    print "Updating MSL\r\n";
    fetch_msl();

} catch (Exception $e) {
    error_log("Content parser: " . $e->getMessage());
}

if (filesize($vars->output . 'lib_all_backup.json') != 0)
    rename($vars->output . 'lib_all_backup.json', $vars->output . 'lib_all.json');
chmod($vars->output . 'lib_all.json', 0777);
print "Done updating suggested books\r\n";