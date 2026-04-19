from fastapi import FastAPI
from routes import ai

app = FastAPI()

app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Backend running"}