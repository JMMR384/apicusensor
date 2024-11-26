<?php
include_once 'helpers/functions.php';

$conn = dbConnect();

// Obtener el número de colmenas activas
$activeHivesQuery = "SELECT COUNT(DISTINCT id) AS activeHives FROM colmena";
$activeHivesResult = $conn->query($activeHivesQuery);
$activeHives = $activeHivesResult->fetch(PDO::FETCH_ASSOC)['activeHives'];

// Obtener la temperatura promedio general
$averageTempQuery = "SELECT AVG(temperatura) AS averageTemp FROM metricas";
$averageTempResult = $conn->query($averageTempQuery);
$averageTemp = round($averageTempResult->fetch(PDO::FETCH_ASSOC)['averageTemp'], 2);

// Obtener la humedad promedio general
$averageHumidityQuery = "SELECT AVG(humedad) AS averageHumidity FROM metricas";
$averageHumidityResult = $conn->query($averageHumidityQuery);
$averageHumidity = round($averageHumidityResult->fetch(PDO::FETCH_ASSOC)['averageHumidity'], 2);

// Obtener la temperatura promedio y la humedad promedio por colmena para los gráficos
$hiveMetricsQuery = "
    SELECT colmena.id AS hiveId, 
           AVG(metricas.temperatura) AS avgTemp, 
           AVG(metricas.humedad) AS avgHumidity
    FROM metricas
    JOIN colmena ON metricas.id_colmena = colmena.id
    GROUP BY colmena.id
    ORDER BY colmena.id
";
$hiveMetricsResult = $conn->query($hiveMetricsQuery)->fetchAll(PDO::FETCH_ASSOC);

$conn = null;

// Devolver los datos en formato JSON
header('Content-Type: application/json');
echo json_encode([
    'activeHives' => $activeHives,
    'averageTemp' => $averageTemp,
    'averageHumidity' => $averageHumidity,
    'hiveMetrics' => $hiveMetricsResult // Datos de humedad y temperatura por colmena
]);
