from fastapi import FastAPI

from app.api.route.upload import router as upload_router
from app.api.route.analysis import router as analysis_router
from app.api.route.websocket import (
    router as websocket_router
)

app = FastAPI(title="GhostLine Backend")


app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(
    websocket_router
)

@app.get("/")
async def root():
    return {
        "message": "GhostLine backend running"
    }