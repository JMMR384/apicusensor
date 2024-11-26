import json
import mysql.connector
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

def obtener_alertas():
    alertas = []
    notificaciones = []
    
    # Configurar los rangos de humedad y temperatura
    rango_humedad = (70, 75)  # Valores normales de humedad
    rango_temperatura = (20, 35)  # Valores normales de temperatura
    dias_futuros = 5  # Número de días a predecir
    
    try:
        # Conectar a la base de datos
        conn = mysql.connector.connect(
            host="localhost",  # Cambia con tu configuración
            user="root",
            password="",
            database="apicusensor"
        )
        cursor = conn.cursor(dictionary=True)
        
        # Consultar las métricas
        cursor.execute("SELECT fecha, humedad, temperatura FROM metricas")
        metricas = cursor.fetchall()
        
        # Extraer los datos necesarios para análisis
        fechas = [m['fecha'] for m in metricas]
        humedad = np.array([m['humedad'] for m in metricas])
        temperatura = np.array([m['temperatura'] for m in metricas])
        
        # Verificar alertas con rangos actuales
        for metrica in metricas:
            fecha = metrica['fecha']
            hum = metrica['humedad']
            temp = metrica['temperatura']


        
        # Función para predicciones a futuro
        def generar_predicciones(series, rango, nombre_serie, fechas):
            modelo = ARIMA(series, order=(1, 1, 1))
            ajuste = modelo.fit()
            predicciones = ajuste.predict(start=len(series), end=len(series) + dias_futuros - 1)
            fechas_futuras = [fechas[-1] + timedelta(days=i + 1) for i in range(dias_futuros)]
            
            for fecha, pred in zip(fechas_futuras, predicciones):
                if pred < rango[0] or pred > rango[1]:
                    alertas.append(f"⚠️ Predicción: {nombre_serie} fuera de rango ({rango[0]}-{rango[1]}) para el {fecha}: {pred:.2f}")

        
        # Generar predicciones para humedad y temperatura
        generar_predicciones(humedad, rango_humedad, "Humedad", fechas)
        generar_predicciones(temperatura, rango_temperatura, "Temperatura", fechas)
        
        cursor.close()
        conn.close()

    except mysql.connector.Error as e:
        return {"error": f"Error de conexión a la base de datos: {str(e)}"}

    # Retornar las alertas y notificaciones en formato JSON
    return {"alerts": alertas, "notifications": notificaciones}

if __name__ == "__main__":
    resultado = obtener_alertas()
    print(json.dumps(resultado, indent=4))
