<?php 
function dbConnect() {
    $host = 'localhost';
    $db = 'apicusensor';
    $user = 'root';
    $pass = '';

    try {
        return new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
}
