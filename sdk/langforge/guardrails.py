import functools
from typing import Callable, Any
from .client import get_client

def guardrails(check_pii: bool = True, check_injection: bool = True):
    """
    Guardrails decorator that inspects prompt inputs for PII & injection attacks before executing.
    """
    def decorator(fn: Callable):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs) -> Any:
            prompt_text = str(args[0]) if args else str(kwargs)
            client = get_client()
            try:
                resp = client._session.post(f"{client.base_url}/api/power/guardrails/scan", json={
                    "prompt": prompt_text,
                    "check_pii": check_pii,
                    "check_injection": check_injection
                }, timeout=5)
                if resp.status_code == 200:
                    data = resp.json()
                    if not data.get("is_safe"):
                        print(f"[LANGFORGE GUARDRAIL WARNING] Violations: {data.get('violations')}")
                        # Replace input prompt with sanitized prompt if args provided
                        if args and isinstance(args[0], str):
                            args = (data.get("sanitized_prompt"),) + args[1:]
            except Exception:
                pass
            return fn(*args, **kwargs)
        return wrapper
    return decorator
