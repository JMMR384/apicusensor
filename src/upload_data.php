<?php
include_once 'helpers/functions.php';

function formatFecha($fechaStr) {
    // Intentamos convertir la fecha al formato Y-m-d (AAAA-MM-DD) usado en MySQL
    $fecha = DateTime::createFromFormat('d/m/Y', $fechaStr); // Cambia el formato según el CSV
    return $fecha ? $fecha->format('Y-m-d') : null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica si el archivo y el ID de colmena se han recibido
    if (!isset($_FILES['dataCliente']) || !isset($_POST['hive-id-select'])) {
        echo json_encode(['status' => 'error', 'message' => 'Archivo o ID de colmena no recibidos']);
        exit;
    }

    // Conexión a la base de datos
    $conn = dbConnect();

    // Obtiene el archivo CSV y el ID de colmena
    $id_colmena = $_POST['hive-id-select'];
    $archivoTmp = $_FILES['dataCliente']['tmp_name'];
    $lineas = file($archivoTmp);
    
    if ($lineas === false) {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo leer el archivo CSV']);
        exit;
    }

    $i = 0;
    foreach ($lineas as $linea) {
        // Omite la primera línea (encabezado)
        if ($i != 0) {
            $datos = explode(";", trim($linea)); // Usando coma como delimitador

            // Verifica que cada columna tenga datos válidos antes de insertar
            if (count($datos) < 4) {
                echo json_encode(['status' => 'error', 'message' => 'Formato CSV incorrecto en la línea ' . ($i + 1)]);
                exit;
            }

            $fecha = formatFecha($datos[0]);
            $humedad = (float)$datos[3];
            $temperatura = (float)$datos[4];

            // Inserta en la base de datos
            $insertar = $conn->prepare("INSERT INTO metricas (id_colmena, humedad, temperatura, fecha) VALUES (?, ?, ?, ?)");
            $insertar->execute([$id_colmena, $humedad, $temperatura, $fecha]);
        }
        $i++;
    }

    // Verifica si se añadieron registros
    if ($i > 1) {
        echo json_encode(['status' => 'success', 'message' => 'Archivo CSV cargado exitosamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se añadieron registros']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Solicitud no válida']);
}
?>
