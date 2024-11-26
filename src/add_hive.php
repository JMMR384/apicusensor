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
}// Asegúrate de que la ruta sea correcta
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_sector = $_POST['id_sector'];
    $description = $_POST['description'];

    try {
        $conn = dbConnect();
        $stmt = $conn->prepare("INSERT INTO colmena (id_sector, description) VALUES (?, ?)");
        $stmt->execute([$id_sector, $description]);
        $hiveId = $conn->lastInsertId();
        
        echo json_encode(['status' => 'success', 'hiveId' => $hiveId]);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
