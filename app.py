from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import shutil
import os
import uvicorn
from HeartBeat.pipeline.prediction import ModelPredictionTrainingPipeline

app = FastAPI(
    title = "Heart murmur detection",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return{
        "message": "Heart Murmur api is running"
    }


@app.post("/predict")
async def predict(file : UploadFile = File(...)):
    
    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction_pipeline = ModelPredictionTrainingPipeline()

    prediction, confidence = prediction_pipeline.main(file_path)   

    os.remove(file_path)

    return {
        "prediction": prediction,
        "status": "SUCESSS",
        "filename": file.filename,
        "confidence": confidence
    }
