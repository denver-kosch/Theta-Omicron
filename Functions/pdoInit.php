<?php
function dbConnect () {
    global $pdo;
    //dbname = name of database I'm using
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=ksigthetao', 'dkosch1','4268kosc'); 
        $pdo->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
        $pdo->exec ('SET NAMES "utf8"');
    }

    catch (PDOException $e) {
        echo $e->getMessage ();
        exit (); 
    }
}
?>