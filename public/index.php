
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <script src="index.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2><i class="fas fa-bee"></i> APICUSENSOR</h2>
                <div class="profile">
                    <img src="assets/barry_bee_user.png" alt="Profile Picture">
                </div>
            </div>
            <ul>
                <li><a href="#" id="dashboard"><i class="fas fa-tachometer-alt"></i>   Dashboard</a></li>
                <li><a href="#" id="add-hive"><i class="fas fa-plus-square"></i>  Agregar Colmena</a></li>
                <li><a href="#" id="upload-data"><i class="fas fa-upload"></i>  Cargar Datos</a></li>
                <li><a href="#" id="view-hives-link"><i class="fas fa-eye" ></i>  Ver Colmenas</a></li>
                <li><a href="#" id="view-metrics"><i class="fas fa-chart-line"></i>  Ver Métricas</a></li>
                <li><a href="#" id="logout"><i class="fas fa-sign-out-alt"></i>   Cerrar Sesión</a></li>
            </ul>
        </div>
        <script>
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a dashboard_alerts.php para obtener alertas y notificaciones
    fetch('../src/get_alerts.php')
        .then(response => response.json())
        .then(data => {
            const topbar = document.querySelector('.topbar-icons');
            const messageIcon = topbar.querySelector('.fa-envelope');
            const notificationIcon = topbar.querySelector('.fa-bell');

            // Verificar el estado de la respuesta
            if (data.status === "success") {
                const { alerts, notifications } = data;

                // Mostrar alertas en el ícono de mensaje
                if (alerts && alerts.length > 0) {
                    messageIcon.title = alerts.join("\n");  // Muestra las alertas al pasar el mouse sobre el ícono
                    messageIcon.style.color = "blue"; // Cambia el color para indicar alertas
                } else {
                    messageIcon.title = "No hay mensajes";
                }

                // Mostrar notificaciones en el ícono de notificación
                if (notifications && notifications.length > 0) {
                    notificationIcon.title = notifications.join("\n"); // Muestra notificaciones al pasar el mouse
                    notificationIcon.style.color = "orange"; // Cambia el color para indicar notificaciones
                } else {
                    notificationIcon.title = "No hay notificaciones";
                }
            } else {
                // Mostrar el error si ocurrió algún problema
                alert(`Error en el servidor: ${data.message || 'Ocurrió un error al procesar los datos.'}`);
            }
        })
        .catch(error => {
            // Mostrar error en caso de fallo en la solicitud
            alert(`Error al cargar los datos de alertas y notificaciones: ${error}`);
        });
});



        </script>
        <div class="content" id="content">
            <div class="topbar">
                <span class="toggle-btn" id="toggle-btn">&#9776;</span>
                <input type="text" placeholder="Buscar...">
                <div class="topbar-icons">
                    <span><i class="fas fa-envelope"></i> </span>
                    <span><i class="fas fa-bell"></i> </span>
                    <img src="assets/barry_bee_user.png" alt="Profile Picture">
                </div>
            </div>
            <div id="alertModal" class="modal">
                <script>
                    document.addEventListener("DOMContentLoaded", function() {
    const alertModal = document.getElementById("alertModal");
    const modalBody = document.getElementById("modalBody");
    const closeButton = document.querySelector(".close-button");

    function openModal() {
        fetch('../src/get_alerts.php')
            .then(response => response.json())
            .then(data => {
                modalBody.innerHTML = ''; // Limpiar contenido previo
                if (data.status === 'success') {
                    const alerts = data.alerts || [];
                    const notifications = data.notifications || [];

                    if (alerts.length === 0 && notifications.length === 0) {
                        modalBody.innerHTML = '<p>No hay variaciones en la humedad o temperatura en este momento.</p>';
                    } else {
                        alerts.forEach(alert => {
                            modalBody.innerHTML += `<p><strong>Alerta:</strong> ${alert}</p>`;
                        });
                        notifications.forEach(notification => {
                            modalBody.innerHTML += `<p><strong>Notificación:</strong> ${notification}</p>`;
                        });
                    }
                } else {
                    modalBody.innerHTML = `<p>Error: ${data.message}</p>`;
                }
                alertModal.style.display = "block";
            })
            .catch(error => {
                modalBody.innerHTML = `<p>Error al cargar los datos: ${error.message}</p>`;
                alertModal.style.display = "block";
            });
    }

    closeButton.onclick = function() {
        alertModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === alertModal) {
            alertModal.style.display = "none";
        }
    };

    document.querySelector(".topbar-icons .fa-bell").addEventListener("click", openModal); // Icono de notificación
});

                </script>
  <div class="modal-content">
    <span class="close-button">&times;</span>
    <h2>Alertas y Notificaciones</h2>
    <div id="modalBody">
      <!-- Aquí se cargarán las alertas y notificaciones desde el código de Python -->
    </div>
  </div>
</div>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript cargado correctamente.');

    const loadingMessage = document.getElementById('loadingMessage');
    const dashboardContent = document.getElementById('dashboardContent');


    console.log('Iniciando carga de datos del dashboard...');

    fetch('../src/dashboard_data.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al conectar con dashboard_data.php: ${response.statusText}`);
            }
            console.log('Conexión exitosa con dashboard_data.php');
            return response.json();
        })
        .then(data => {
            console.log('Datos del dashboard:', data);

            document.getElementById('activeHives').textContent = ` ${data.activeHives}`;
            document.getElementById('averageTemp').textContent = ` ${data.averageTemp}°C`;
            document.getElementById('averageHumidity').textContent = ` ${data.averageHumidity}%`;

            loadingMessage.style.display = 'none';
            dashboardContent.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar datos del dashboard:', error);
            loadingMessage.textContent = 'Error al cargar datos.';
        });
});

            </script>
            <div class="content-section" id="dashboard-container">
                <h2>Dashboard</h2><br>
                <div class="card-container">
    <div class="card">
        <h3>Colmenas Activas</h3>
        <p id="activeHives"></p>
    </div>
    <div class="card">
        <h3>Temperatura Promedio</h3>
        <p id="averageTemp">Cargando...</p>
    </div>
    <div class="card">
        <h3>Humedad Promedio</h3>
        <p id="averageHumidity">Cargando...</p>
    </div>
</div>

                <div class="charts-container">
                    <div class="chart">
                        <h3>Temperatura por Colmena</h3>
                        <canvas id="temperature-chart"></canvas>
                    </div>
                    <div class="chart">
                        <h3>Humedad por Colmena</h3>
                        <canvas id="humidity-chart"></canvas>
                    </div>
                </div>
            </div>
           
            <div class="content-section" id="add-hive-container">
                <h2>Agregar Colmena</h2>
                <form id="add-hive-form">
    <div class="form-group">
        <label for="id_sector">ID de Sector:</label>
        <input type="text" id="id_sector" name="id_sector" required>
    </div>
    <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea id="description" name="description" required></textarea>
    </div>
    <button type="submit">Agregar</button>
</form>

            </div>
            
            <div class="content-section" id="upload-data-container" style="display: none;">
    <h2>Cargar Datos</h2><br><form id="csv-upload-form" enctype="multipart/form-data">
    <h3>Seleccionar colmena</h3>
    <select id="hive-id-select" name="hive-id-select">
        <!-- Opciones de colmenas generadas dinámicamente -->
    </select>
    <input type="file" id="csvFile" name="dataCliente" accept=".csv">
    <button type="button" id="uploadButton" class="btn">Cargar CSV</button> 
</form>
<script>
    document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const csvFileInput = document.getElementById('csvFile');
    const hiveIdSelect = document.getElementById('hive-id-select');

    uploadButton.addEventListener('click', function(event) {
        event.preventDefault(); // Previene el envío predeterminado del formulario

        // Verifica que los elementos CSV y Colmena existen y se seleccionaron
        if (!csvFileInput || !hiveIdSelect) {
            alert('Error: No se encontró el archivo CSV o el campo de colmena.');
            return;
        }
        if (csvFileInput.files.length === 0) {
            alert('Por favor, selecciona un archivo CSV para cargar.');
            return;
        }
        if (!hiveIdSelect.value) {
            alert('Por favor, selecciona una colmena.');
            return;
        }

        // Configura FormData para enviar el archivo y el ID de colmena
        const formData = new FormData();
        formData.append('dataCliente', csvFileInput.files[0]);
        formData.append('hive-id-select', hiveIdSelect.value);

        // Envía datos al servidor y maneja errores
        fetch('../src/upload_data.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                alert('Archivo CSV cargado exitosamente');
            } else {
                alert('Error en el servidor: ' + (result.message || 'Error desconocido'));
            }
        })
        .catch(error => {
            console.error('Error al cargar el archivo CSV:', error);
            alert('Error al cargar el archivo CSV: ' + error.message);
        });
    });
});

</script>

        
        

    </form>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.getElementById('csvFile');
    const uploadButton = document.getElementById('uploadButton');

    if (csvFileInput && uploadButton) {
        console.log("Elementos encontrados: csvFile y uploadButton");
        uploadButton.addEventListener('click', function() {
            const file = csvFileInput.files[0];
            if (!file) {
                alert("Por favor selecciona un archivo CSV.");
                return;
            }

            const formData = new FormData();
            formData.append('dataCliente', file);

            fetch('../src/upload_data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log("Datos subidos con éxito:", data);
                } else {
                    console.error("Error en el servidor:", data.message);
                }
            })
            .catch(error => {
                console.error("Error al subir el archivo:", error);
            });
        });
    } else {
        console.error("El elemento csvFile o el botón uploadButton no se encontró en el DOM.");
    }
});
    </script>
</div>
            
            <div class="content-section" id="view-hives-container" style="display: none;">
                <h2>Ver Colmenas</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sector</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="hives-table-body">
        <!-- Las filas se generarán dinámicamente aquí -->
                    </tbody>
                </table>

                
            </div>
            <div class="content-section" id="view-metrics-container" style="display: none;">
                <h2>Ver Métricas</h2>
                <!-- Aquí se mostrarán métricas adicionales -->
            </div>
        </div>
    </div>
    <div id="connection-status">
        <i class="fas fa-exclamation-triangle"></i> No hay conexión
    </div>
</html>
