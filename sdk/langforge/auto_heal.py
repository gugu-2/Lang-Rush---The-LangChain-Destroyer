import functools
import traceback
from typing import Callable, Any
from .client import get_client

def auto_heal(func: Callable = None, *, max_retries: int = 2):
    """
    Auto-healing decorator that catches exceptions, sends error context to Gemini/LangForge backend,
    and returns a repaired output.
    """
    def decorator(fn: Callable):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs) -> Any:
            try:
                return fn(*args, **kwargs)
            except Exception as e:
                err_msg = traceback.format_exc()
                prompt_input = f"Function {fn.__name__} args={args} kwargs={kwargs}"
                # Call backend auto-heal
                client = get_client()
                try:
                    resp = client._session.post(f"{client.base_url}/api/power/auto-heal", json={
                        "prompt": prompt_input,
                        "failed_output": f"Exception raised: {str(e)}",
                        "error_message": err_msg
                    }, timeout=10)
                    if resp.status_code == 200:
                        return resp.json().get("repaired_output")
                except Exception:
                    pass
                raise e
        return wrapper

    if func is not None:
        return decorator(func)
    return decorator
