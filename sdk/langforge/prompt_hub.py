import time
from typing import Optional
from .client import get_client

class PromptHub:
    def __init__(self, ttl_seconds: int = 300):
        self._cache = {}
        self.ttl = ttl_seconds

    def pull(self, name: str, version: str = "latest") -> Optional[str]:
        cache_key = f"{name}:{version}"
        cached = self._cache.get(cache_key)
        
        if cached and (time.time() - cached['time']) < self.ttl:
            return cached['template']
            
        client = get_client()
        prompt_data = client.get_prompt(name, version)
        if prompt_data and "template" in prompt_data:
            self._cache[cache_key] = {
                'template': prompt_data["template"],
                'time': time.time()
            }
            return prompt_data["template"]
        return None

    def push(self, name: str, template: str, model: str = "gpt-4o-mini", commit_message: str = "") -> bool:
        client = get_client()
        success = client.push_prompt(name, template, model, commit_message)
        if success:
            cache_key = f"{name}:latest"
            self._cache[cache_key] = {
                'template': template,
                'time': time.time()
            }
        return success

hub = PromptHub()
