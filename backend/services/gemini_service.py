import httpx
import json
import logging
from config import settings

logger = logging.getLogger("gemini_service")

async def call_gemini(prompt: str, system_instruction: str = "", model: str = "models/gemini-2.5-flash", temperature: float = 0.7) -> str:
    """
    Call Gemini API directly via HTTP REST endpoint.
    Uses settings.get_gemini_key() or falls back to mock if key not set.
    """
    api_key = settings.get_gemini_key()
    if not api_key:
        logger.warning("GEMINI_API_KEY / GOOGLE_API_KEY not found in environment. Using fallback mock response.")
        return f"[Simulated Gemini Output for: {prompt[:60]}...]"

    model_name = model if model.startswith("models/") else f"models/{model}"
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 2048
        }
    }
    
    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }
        
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code == 200:
            data = resp.json()
            try:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            except (KeyError, IndexError) as e:
                logger.error(f"Error parsing Gemini response: {e}")
                return str(data)
        else:
            logger.error(f"Gemini API error {resp.status_code}: {resp.text}")
            return f"Gemini Error ({resp.status_code}): {resp.text[:200]}"
