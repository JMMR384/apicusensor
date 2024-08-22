const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '', 
  database: 'apicunsensor'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener las métricas de una colmena
app.get('/api/metricas/:id_colmena', (req, res) => {
  const idColmena = req.params.id_colmena;
  connection.query('SELECT * FROM metricas WHERE id_colmena = ?', [idColmena], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Ruta para estimar el aumento de temperatura
app.get('/api/estimate/:id_colmena', (req, res) => {
  const idColmena = req.params.id_colmena;
  connection.query('SELECT * FROM metricas WHERE id_colmena = ?', [idColmena], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta');
    }
    const estimate = estimateTemperatureIncrease(results);
    res.json({ estimate });
  });
});

function estimateTemperatureIncrease(data) {
  if (data.length < 2) return 0;
  const firstTemp = data[0].temperatura;
  const lastTemp = data[data.length - 1].temperatura;
  return ((lastTemp - firstTemp) / firstTemp) * 100;
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Código JavaScript para el dashboard

// Función para mostrar/ocultar el menú lateral
function toggleMenu() {
  const menu = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggleBtn.innerHTML = '&#9776;';
  } else {
      menu.classList.add('active');
      toggleBtn.innerHTML = '&#9776;';
  }
}

// Función para mostrar el contenido de cada sección
function showContent(section) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((section) => {
      section.style.display = 'none';
  });
  document.getElementById(section).style.display = 'block';
}

