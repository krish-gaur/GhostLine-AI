from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.websocket.manager import (
    manager
)

router = APIRouter()


@router.websocket("/live")

async def websocket_endpoint(
    websocket: WebSocket
):

    await manager.connect(
        websocket
    )

    try:

        while True:

            data = (
                await websocket.receive_json()
            )

            await manager.broadcast({

                "event":
                    "live_post",

                "data":
                    data
            })

    except WebSocketDisconnect:

        manager.disconnect(
            websocket
        )