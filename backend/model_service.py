from fastapi import FastAPI, File, UploadFile
import uvicorn
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io

app = FastAPI(title="API Mamografías - Tesis")

# --- CONFIGURACIÓN ---
MODEL_PATH = "modelo_resnet.keras" # Asegúrate que este archivo existe
IMG_SIZE = (224, 224) 

# --- CONSTRUCCIÓN MANUAL DEL MODELO ---
# Esto evita el error de "2 input tensors" porque definimos el grafo nosotros mismos.
def cargar_arquitectura_y_pesos():
    print("Reconstruyendo arquitectura del modelo...")
    
    # 1. Definir la Base (ResNet50)
    # Usamos weights=None porque cargaremos nuestros propios pesos después
    base_model = ResNet50(
        weights=None, 
        include_top=False, 
        input_shape=(224, 224, 3)
    )
    
    # 2. Reconstruir la estructura EXACTA de tu entrenamiento
    # (ResNet + GlobalPool + Dense 256 + Dropout + Salida)
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'), # OJO: Debe ser 256, no 128
        layers.Dropout(0.5),                  # OJO: Debe ser 0.5
        layers.Dense(1, activation='sigmoid')
    ])
    
    # 3. Construir el grafo con el tamaño de entrada
    model.build((None, 224, 224, 3))
    
    # 4. Cargar los pesos
    print(f"Cargando pesos desde {MODEL_PATH}...")
    try:
        model.load_weights(MODEL_PATH)
        print("¡Pesos cargados exitosamente!")
        return model
    except Exception as e:
        print(f"ERROR FATAL cargando pesos: {e}")
        return None

# Inicializamos el modelo al arrancar
model = cargar_arquitectura_y_pesos()

def preparar_imagen(img_bytes):
    img = Image.open(io.BytesIO(img_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return preprocess_input(img_array)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": "El modelo no se pudo cargar en el servidor."}

    contents = await file.read()
    
    try:
        processed_image = preparar_imagen(contents)
        prediction = model.predict(processed_image)
        score = float(prediction[0][0])
        
        # Umbral de decisión (puedes ajustarlo si quieres ser más estricto)
        resultado = "Maligno" if score > 0.5 else "Benigno"
        confianza = score if score > 0.5 else 1 - score
        
        return {
            "filename": file.filename,
            "diagnostico": resultado,
            "probabilidad_malignidad": round(score, 4),
            "confianza": f"{round(confianza * 100, 2)}%",
            "modelo": "ResNet50 (Pesos Cargados Manualmente)"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)