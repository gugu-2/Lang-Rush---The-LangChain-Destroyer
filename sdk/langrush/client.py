import requests
import threading
import json
from typing import Optional

class LangRushClient:
    def __init__(self, api_key: str = "", base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._session = requests.Session()
        self._session.headers.update({"X-API-Key": api_key, "Content-Type": "application/json"})
    
    def send_run(self, run_data: dict) -> Optional[str]:
        """Send a run to LangRush backend. Returns run_id or None on failure."""
        try:
            resp = self._session.post(f"{self.base_url}/api/runs", json=run_data, timeout=5)
            if resp.status_code in (200, 201):
                return resp.json().get("id")
        except Exception:
            pass
        return None
    
    def send_run_async(self, run_data: dict):
        """Send run in background thread so it doesn't block the main thread."""
        thread = threading.Thread(target=self.send_run, args=(run_data,), daemon=True)
        thread.start()
    
    def get_prompt(self, name: str, version: str = "latest") -> Optional[dict]:
        """Fetch a prompt by name."""
        try:
            resp = self._session.get(f"{self.base_url}/api/prompts/by-name/{name}/{version}", timeout=5)
            if resp.status_code == 200:
                return resp.json()
        except Exception:
            pass
        return None
    
    def push_prompt(self, name: str, template: str, model: str = "gpt-4o-mini", commit_message: str = "") -> bool:
        """Push a new prompt version."""
        try:
            resp = self._session.post(f"{self.base_url}/api/prompts", json={
                "name": name, "template": template, "model_name": model, "commit_message": commit_message
            }, timeout=5)
            return resp.status_code in (200, 201)
        except Exception:
            return False

# Global client instance
_client: Optional[LangRushClient] = None

def configure(api_key: str, base_url: str = "http://localhost:8000"):
    """Configure the global LangRush client."""
    global _client
    _client = LangRushClient(api_key=api_key, base_url=base_url)

def get_client() -> LangRushClient:
    global _client
    if _client is None:
        import os
        _client = LangRushClient(
            api_key=os.getenv("LangRush_API_KEY", ""),
            base_url=os.getenv("LangRush_URL", "http://localhost:8000")
        )
    return _client
