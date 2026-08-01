import logging
import sys
import os
from typing import AsyncGenerator, Union
import openai
from config import settings

# Add the project root to sys.path so we can import colibri
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
try:
    from colibri.bridge import ColibriEngine, ColibriEngineError
except ImportError:
    ColibriEngine = None

logger = logging.getLogger(__name__)

async def generate_with_fallback(prompt: str, model: str = "gpt-4o-mini", max_tokens: int = 1024, stream: bool = False) -> Union[str, AsyncGenerator[str, None]]:
    """
    Attempts to generate using Cloud API. If it fails due to limits or network, falls back to Colibri local inference.
    """
    client = openai.AsyncOpenAI(api_key=settings.openai_api_key or "dummy_key")
    
    try:
        logger.info(f"Attempting cloud generation with {model}...")
        if stream:
            return _stream_openai_with_fallback(client, prompt, model, max_tokens)
        else:
            response = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response.choices[0].message.content
            
    except (openai.RateLimitError, openai.APIConnectionError, openai.InternalServerError, openai.AuthenticationError) as e:
        logger.warning(f"Cloud API failed ({type(e).__name__}). Triggering TokenMiser offline fallback.")
        return await _run_colibri_fallback(prompt, max_tokens, stream)

async def _stream_openai_with_fallback(client, prompt: str, model: str, max_tokens: int):
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
            stream=True
        )
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except (openai.RateLimitError, openai.APIConnectionError, openai.InternalServerError, openai.AuthenticationError) as e:
        logger.warning(f"Cloud API streaming failed to start ({type(e).__name__}). Triggering TokenMiser offline fallback.")
        
        # If it fails before yielding anything, we fallback
        fallback_stream = await _run_colibri_fallback(prompt, max_tokens, stream=True)
        async for token in fallback_stream:
            yield token

async def _run_colibri_fallback(prompt: str, max_tokens: int, stream: bool):
    if not ColibriEngine:
        err = "Colibrì engine module not found. Offline fallback unavailable."
        logger.error(err)
        if stream:
            async def err_gen(): yield err
            return err_gen()
        return err

    # Pick a local model
    local_model = "olmoe-7b"
    engine = ColibriEngine(model_path=local_model)
    
    if stream:
        return engine.generate_stream(prompt, max_tokens=max_tokens)
    else:
        return await engine.generate(prompt, max_tokens=max_tokens)
