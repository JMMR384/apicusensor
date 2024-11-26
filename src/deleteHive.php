<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root"; // Cambia esto si es necesario
$password = ""; // Cambia esto si es necesario
$dbname = "apicusensor";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el ID de la colmena
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$response = array('status' => 'error', 'message' => 'ID de colmena no válido');

if ($id > 0) {
    // Consulta para eliminar la colmena
    $sql = "DELETE FROM colmena WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        $response = array('status' => 'success', 'message' => 'Colmena eliminada exitosamente');
    } else {
        $response = array('status' => 'error', 'message' => 'Error al eliminar la colmena');
    }
}

// Devolver respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
