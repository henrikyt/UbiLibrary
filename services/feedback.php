<?php

if (isset($_GET['remove'])) {
    $fp = fopen('feedback.txt', 'w');
    fwrite($fp, "Kirjaston UBIn palautekysely\r\n\r\n\r\n");
    fclose($fp);
    echo('<html>');
    echo('<head>');
    echo('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
    echo('<link rel="stylesheet" href="../styles/services.css"/>');
    echo('</head>');
    echo('<body>');
    echo('<h3>Palautteet poistettu</h3>');
    echo('<br><button onclick="history.go(-1);return false;">Takaisin</button>');
    echo('</body>');
    echo('</html>');
    exit();
}

if (is_array($_GET)) {
    $mail = "\r\n" . date('r') . "\r\n";
    foreach ($_GET as $key => $value) {
        if ($value)
            $mail .= $key . "\r\n" . $value . "\r\n";
    }
    $fp = fopen('feedback.txt', 'a');
    fwrite($fp, $mail);
    fclose($fp);
    //TODO OPEN PORT
    #mail($email, 'Kirjaston UBI-näytön palaute', $mail,'From:henrikyt@gmail.com');
}
exit();