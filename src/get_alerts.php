<?php
// dashboard_alerts.php
header('Content-Type: application/json');

// Ruta al script de Python
$pythonScriptPath = "generate_alerts.py";

// Ejecutar el script de Python y capturar el resultado
$output = shell_exec("python3 " . escapeshellarg($pythonScriptPath));

// Verificar si hubo un error en la ejecución
if ($output === null) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al ejecutar el script de Python."
    ]);
    exit;
}

// Decodificar el resultado JSON devuelto por el script de Python
$result = json_decode($output, true);

// Verificar si el JSON fue decodificado correctamente
if ($result === null) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al decodificar el JSON del script de Python."
    ]);
    exit;
}

// Comprobar si hay alertas o notificaciones
$alerts = $result['alerts'] ?? [];
$notifications = $result['notifications'] ?? [];

if (empty($alerts) && empty($notifications)) {
    $alerts[] = "En el momento las colmenas no van a presentar ninguna variación en la humedad y la temperatura.";
}

// Enviar los datos al frontend
echo json_encode([
    "status" => "success",
    "alerts" => $alerts,
    "notifications" => $notifications
]);
