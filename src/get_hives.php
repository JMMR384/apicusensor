<?php
include_once 'helpers/functions.php';
header('Content-Type: application/json'); // Asegúrate de que la cabecera sea correcta.

try {
    $conn = dbConnect();
    $stmt = $conn->query("SELECT id FROM colmena");
    $hives = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($hives);
} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>