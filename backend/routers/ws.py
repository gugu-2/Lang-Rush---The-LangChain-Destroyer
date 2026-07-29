from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter(tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        # Dictionary mapping project_id to a list of active websocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()
        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)

    def disconnect(self, websocket: WebSocket, project_id: str):
        if project_id in self.active_connections:
            self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]

    async def broadcast_run(self, project_id: str, run_data: dict):
        if project_id in self.active_connections:
            message = json.dumps({"event": "new_run", "data": run_data})
            for connection in self.active_connections[project_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/runs/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: str):
    await manager.connect(websocket, project_id)
    try:
        while True:
            data = await websocket.receive_text()
            # In a real app we might handle ping/pong here
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)

async def broadcast_run(project_id: str, run_data: dict):
    # This function is meant to be called from other routers
    # converting run object to dict is required before passing here
    await manager.broadcast_run(project_id, run_data)
