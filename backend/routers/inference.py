from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from services.fallback import generate_with_fallback

router = APIRouter(prefix="/api/inference", tags=["inference"])

class ChatRequest(BaseModel):
    prompt: str
    model: Optional[str] = "gpt-4o-mini"
    max_tokens: Optional[int] = 1024

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Standard blocking chat endpoint. Falls back to Colibrì if cloud APIs fail.
    """
    try:
        response = await generate_with_fallback(
            prompt=request.prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            stream=False
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def stream_chat(request: ChatRequest):
    """
    Streaming chat endpoint. Falls back to Colibrì streaming if cloud APIs fail.
    """
    try:
        generator = await generate_with_fallback(
            prompt=request.prompt,
            model=request.model,
            max_tokens=request.max_tokens,
            stream=True
        )
        
        async def event_generator():
            async for token in generator:
                yield f"data: {token}\n\n"
            yield "data: [DONE]\n\n"
            
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
