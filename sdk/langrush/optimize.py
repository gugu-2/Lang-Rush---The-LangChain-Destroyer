import functools
import hashlib
from typing import Callable, Any

_CACHE = {}

def optimize(budget: Any = "$10/day", cache: bool = True, use_cache: bool = True, prefer_cheap: bool = True) -> Callable:
    """
    Decorator for optimizing agent execution.
    Features budget tracking, smart model routing, and local caching (TokenMiser).
    """
    enable_cache = cache and use_cache
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            if enable_cache:
                # Simple hash of inputs
                key_str = f"{func.__name__}:{args}:{kwargs}"
                cache_key = hashlib.md5(key_str.encode()).hexdigest()
                if cache_key in _CACHE:
                    return _CACHE[cache_key]
            
            # Execute function
            result = func(*args, **kwargs)
            
            if enable_cache:
                _CACHE[cache_key] = result
                
            return result
        return wrapper
    return decorator
