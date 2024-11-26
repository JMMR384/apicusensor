document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gráficos con Chart.js
    fetch('../src/dashboard_data.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verifica que los datos se están recibiendo correctamente
            const hiveIds = data.hiveMetrics.map(hive => hive.hiveId);
            const avgTemps = data.hiveMetrics.map(hive => hive.avgTemp);
            const avgHumidities = data.hiveMetrics.map(hive => hive.avgHumidity);

            // Configuración para el gráfico de temperatura
            const tempChart = new Chart(document.getElementById('temperature-chart'), {
                type: 'line',
                data: {
                    labels: hiveIds,
                    datasets: [{
                        label: 'Temperatura Promedio',
                        data: avgTemps,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            // Configuración para el gráfico de humedad
            const humidityChart = new Chart(document.getElementById('humidity-chart'), {
                type: 'bar',
                data: {
                    labels: hiveIds,
                    datasets: [{
                        label: 'Humedad Promedio',
                        data: avgHumidities,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        })
        .catch(error => alert('Error al cargar los datos: ' + error));
    // Lógica para alternar secciones
    const sections = ['dashboard-container', 'add-hive-container', 'upload-data-container', 'view-hives-container', 'view-metrics-container'];
    document.querySelectorAll('.sidebar ul li a').forEach((link, index) => {
        link.addEventListener('click', () => {
            sections.forEach(section => document.getElementById(section).style.display = 'none');
            document.getElementById(sections[index]).style.display = 'block';
        });
    });

    // Lógica para agregar colmenas
    const addHiveForm = document.getElementById('add-hive-form');
    if (addHiveForm) {
        addHiveForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const id_sector = document.getElementById('id_sector').value;
            const description = document.getElementById('description').value;

            fetch('../src/add_hive.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id_sector=${encodeURIComponent(id_sector)}&description=${encodeURIComponent(description)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Colmena agregada exitosamente');

                    // Actualizar la tabla de colmenas en el frontend
                    const tableBody = document.getElementById('hives-table-body');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${data.hiveId}</td>
                        <td>${id_sector}</td>
                        <td>${description}</td>
                        <td><button class="delete-btn" data-id="${data.hiveId}"><i class="fas fa-trash-alt"></i></button></td>
                    `;
                    tableBody.appendChild(row);

                    // Limpiar formulario
                    addHiveForm.reset();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error al agregar colmena:', error));
        });
    }

    // Lógica para cargar datos
    const uploadDataForm = document.getElementById('upload-data-form');
    if (uploadDataForm) {
        uploadDataForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const hiveId = document.getElementById('hive-id-select').value;
            const dataFile = document.getElementById('data-file').files[0];

            const formData = new FormData();
            formData.append('hive-id-select', hiveId);
            formData.append('data-file', dataFile);

            fetch('../src/upload_data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Datos cargados exitosamente');
                    uploadDataForm.reset();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error al cargar datos:', error));
        });
    }

    // Alternar la visibilidad de la barra lateral
    const toggleBtn = document.getElementById('toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            document.querySelector('.sidebar').classList.toggle('hidden');
            document.querySelector('.content').classList.toggle('expanded');
        });
    }

    // Control de conexión
    const connectionStatus = document.getElementById('connection-status');
    function updateConnectionStatus() {
        if (navigator.onLine) {
            connectionStatus.style.display = 'none';
        } else {
            connectionStatus.style.display = 'block';
        }
    }
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();

    // Función para cargar y mostrar colmenas
    function loadHives() {
        fetch('../src/view_hives.php')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('hives-table-body');
                tableBody.innerHTML = ''; // Limpiar contenido actual

                data.forEach(hive => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${hive.id}</td>
                        <td>${hive.id_sector}</td>
                        <td>${hive.description}</td>
                        <td><button class="delete-btn" data-id="${hive.id}"><i class="fas fa-trash-alt"></i></button></td>
                    `;
                    tableBody.appendChild(row);
                });

                // Agregar evento para botones de eliminación
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const hiveId = this.getAttribute('data-id');
                        deleteHive(hiveId);
                    });
                });
            })
            .catch(error => console.error('Error al cargar colmenas:', error));
    }

    // Llamar a la función loadHives cuando se hace clic en "Ver Colmenas"
    const viewHivesLink = document.getElementById('view-hives-link');
    if (viewHivesLink) {
        viewHivesLink.addEventListener('click', loadHives);
    }

    // Función para eliminar colmena
    function deleteHive(hiveId) {
        fetch(`../src/deleteHive.php?id=${hiveId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Colmena eliminada exitosamente');
                    loadHives(); // Recargar la lista de colmenas
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error al eliminar colmena:', error));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('../src/get_hives.php')
        .then(response => response.json())
        .then(hives => {
            const hiveSelect = document.getElementById('hive-id-select');
            hives.forEach(hive => {
                // Crea el elemento option para cada colmena
                const option = document.createElement('option');
                option.value = hive.id;
                option.textContent = hive.id; // Usamos la descripción en lugar de id para que sea más descriptivo
                hiveSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las colmenas:', error));
});

document.addEventListener('DOMContentLoaded', () => {
fetchDashboardData();});

document.addEventListener('DOMContentLoaded', () => {
    fetch('../src/dashboard_data.php') // Cambia la ruta según sea necesario
        .then(response => response.json())
        .then(data => {
            // Mostrar los datos obtenidos en la consola para verificación
            console.log('Datos del dashboard:', data);

            // Actualizar los valores en las tarjetas del dashboard
            const activeHivesElement = document.getElementById('activeHives');
            const averageTempElement = document.getElementById('averageTemp');
            const averageHumidityElement = document.getElementById('averageHumidity');

            if (activeHivesElement && averageTempElement && averageHumidityElement) {
                activeHivesElement.textContent = data.activeHives;
                averageTempElement.textContent = `${data.averageTemp}°C`;
                averageHumidityElement.textContent = `${data.averageHumidity}%`;
            } else {
                console.error('Error: Los elementos del dashboard no fueron encontrados en el DOM.');
            }
        })
        .catch(error => console.error('Error al cargar datos del dashboard:', error));
});

