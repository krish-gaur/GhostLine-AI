from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.websocket.manager import (
    manager
)

from app.services.streaming.live_feed import (

    add_post,

    run_live_analysis
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

            add_post(data)

            analysis = (
                run_live_analysis()
            )

            await manager.broadcast({

                "event":
                    "live_analysis",

                "data":
                    analysis
            })

    except WebSocketDisconnect:

        manager.disconnect(
            websocket
        )