<?php
$start = microtime(true);
include_once 'variables.php';
include_once 'lib/qp.php';
include_once 'parser.php';

print microtime(true) - $start . "\r\n";
$parser = get_parser_alt($vars->url_outi_server . str_replace('$BOOKID$', '412092', $vars->url_outi_available), '.tnlsoulu');
#print microtime(true) - $start . "\r\n";
#$parser = file_get_html($vars->url_outi_server . str_replace('$BOOKID$', '412092', $vars->url_outi_available));
#print microtime(true) - $start . "\r\n";
#$context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
#$parser = file_get_contents($vars->url_outi_server . str_replace('$BOOKID$', '412092', $vars->url_outi_available),false,$context);
print microtime(true) - $start . "\r\n";
print $parser->text();
