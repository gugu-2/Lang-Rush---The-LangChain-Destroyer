import functools
import time
import traceback
from datetime import datetime
from uuid import uuid4
from typing import Callable, Optional
import asyncio

from .client import get_client

def traceable(func: Optional[Callable] = None, *, name: str = None, run_type: str = "chain", tags: list = None):
    """
    Decorator that traces any Python function as a LangForge run.
    
    Usage:
        @traceable
        def my_function(x): ...
        
        @traceable(name="custom-name", run_type="tool")
        def my_tool(x): ...
    """
    def decorator(fn: Callable):
        fn_name = name or fn.__name__
        fn_tags = tags or []
        
        @functools.wraps(fn)
        def sync_wrapper(*args, **kwargs):
            run_id = str(uuid4())
            start = datetime.utcnow()
            inputs = {"args": [str(a) for a in args], "kwargs": {k: str(v) for k, v in kwargs.items()}}
            try:
                result = fn(*args, **kwargs)
                end = datetime.utcnow()
                get_client().send_run_async({
                    "id": run_id,
                    "name": fn_name,
                    "run_type": run_type,
                    "status": "success",
                    "inputs": inputs,
                    "outputs": {"result": str(result)},
                    "start_time": start.isoformat(),
                    "end_time": end.isoformat(),
                    "latency_ms": (end - start).total_seconds() * 1000,
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_cost_usd": 0.0,
                    "model_name": "",
                    "tags": fn_tags,
                })
                return result
            except Exception as e:
                end = datetime.utcnow()
                get_client().send_run_async({
                    "id": run_id,
                    "name": fn_name,
                    "run_type": run_type,
                    "status": "error",
                    "inputs": inputs,
                    "outputs": {},
                    "error": traceback.format_exc(),
                    "start_time": start.isoformat(),
                    "end_time": end.isoformat(),
                    "latency_ms": (end - start).total_seconds() * 1000,
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_cost_usd": 0.0,
                    "model_name": "",
                    "tags": fn_tags,
                })
                raise
        
        @functools.wraps(fn)
        async def async_wrapper(*args, **kwargs):
            run_id = str(uuid4())
            start = datetime.utcnow()
            inputs = {"args": [str(a) for a in args], "kwargs": {k: str(v) for k, v in kwargs.items()}}
            try:
                result = await fn(*args, **kwargs)
                end = datetime.utcnow()
                get_client().send_run_async({
                    "id": run_id, "name": fn_name, "run_type": run_type, "status": "success",
                    "inputs": inputs, "outputs": {"result": str(result)},
                    "start_time": start.isoformat(), "end_time": end.isoformat(),
                    "latency_ms": (end - start).total_seconds() * 1000,
                    "prompt_tokens": 0, "completion_tokens": 0, "total_cost_usd": 0.0, "model_name": "", "tags": fn_tags,
                })
                return result
            except Exception as e:
                end = datetime.utcnow()
                get_client().send_run_async({
                    "id": run_id, "name": fn_name, "run_type": run_type, "status": "error",
                    "inputs": inputs, "outputs": {}, "error": traceback.format_exc(),
                    "start_time": start.isoformat(), "end_time": end.isoformat(),
                    "latency_ms": (end - start).total_seconds() * 1000,
                    "prompt_tokens": 0, "completion_tokens": 0, "total_cost_usd": 0.0, "model_name": "", "tags": fn_tags,
                })
                raise
        
        return async_wrapper if asyncio.iscoroutinefunction(fn) else sync_wrapper
    
    # Support both @traceable and @traceable(name="x") usage
    if func is not None:
        return decorator(func)
    return decorator
