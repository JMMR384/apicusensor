from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Función para calcular tendencia (puedes personalizarla)
def calcular_tendencia(datos):
    # Aquí agrega la lógica de predicción basada en los datos
    # Por ejemplo, simularemos una tendencia de aumento/descenso
    tendencia = {"humedad": "subiendo", "temperatura": "bajando"}
    return tendencia

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Recibir datos en formato JSON
    tendencia = calcular_tendencia(data)
    return jsonify(tendencia)

if __name__ == '__main__':
    app.run(port=5001)  # Correr en el puerto 5001
