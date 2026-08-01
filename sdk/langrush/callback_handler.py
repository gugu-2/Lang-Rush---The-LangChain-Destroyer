from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from uuid import UUID
import json
import time

try:
    from langchain_core.callbacks.base import BaseCallbackHandler
    from langchain_core.outputs import LLMResult
except ImportError:
    class BaseCallbackHandler:
        pass
    LLMResult = None

from .client import get_client

# Cost per 1K tokens (input_cost, output_cost) in USD
MODEL_COSTS = {
    "gpt-4o": (0.0025, 0.010),
    "gpt-4o-mini": (0.000150, 0.000600),
    "gpt-4-turbo": (0.010, 0.030),
    "gpt-3.5-turbo": (0.0005, 0.0015),
    "claude-3-5-sonnet-20241022": (0.003, 0.015),
    "claude-3-haiku-20240307": (0.00025, 0.00125),
    "gemini-1.5-flash": (0.000075, 0.000300),
    "gemini-1.5-pro": (0.00125, 0.005),
}

def estimate_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    # Find matching model (partial match)
    for key, (in_cost, out_cost) in MODEL_COSTS.items():
        if key in model.lower() or model.lower() in key:
            return (prompt_tokens / 1000 * in_cost) + (completion_tokens / 1000 * out_cost)
    return 0.0

class LangRushCallbackHandler(BaseCallbackHandler):
    """
    LangChain callback handler that sends all traces to LangRush.
    
    Usage:
        from langrush import LangRushCallbackHandler
        handler = LangRushCallbackHandler()
        chain.invoke(input, config={"callbacks": [handler]})
    """
    
    def __init__(self, project_api_key: str = "", tags: List[str] = None):
        self.project_api_key = project_api_key
        self.tags = tags or []
        self._runs: Dict[str, dict] = {}  # run_id -> run data
        self._client = get_client()
    
    def _get_run_id(self, run_id) -> str:
        return str(run_id)
    
    def on_llm_start(self, serialized: Dict, prompts: List[str], *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs):
        rid = self._get_run_id(run_id)
        model = serialized.get("kwargs", {}).get("model_name", serialized.get("id", ["unknown"])[-1])
        self._runs[rid] = {
            "id": rid,
            "name": f"LLM: {model}",
            "run_type": "llm",
            "status": "pending",
            "inputs": {"prompts": prompts},
            "outputs": {},
            "model_name": model,
            "parent_run_id": self._get_run_id(parent_run_id) if parent_run_id else None,
            "start_time": datetime.utcnow().isoformat(),
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_cost_usd": 0.0,
            "tags": self.tags,
        }
    
    def on_llm_end(self, response, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid not in self._runs:
            return
        run = self._runs[rid]
        # Extract token usage
        usage = {}
        if hasattr(response, "llm_output") and response.llm_output:
            usage = response.llm_output.get("token_usage", {})
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        output_text = ""
        if response.generations:
            output_text = response.generations[0][0].text if response.generations[0] else ""
        run.update({
            "status": "success",
            "outputs": {"text": output_text},
            "end_time": datetime.utcnow().isoformat(),
            "latency_ms": (datetime.utcnow() - datetime.fromisoformat(run["start_time"])).total_seconds() * 1000,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_cost_usd": estimate_cost(run["model_name"], prompt_tokens, completion_tokens),
        })
        self._client.send_run_async(run)
    
    def on_llm_error(self, error: Exception, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid in self._runs:
            self._runs[rid].update({"status": "error", "error": str(error), "end_time": datetime.utcnow().isoformat()})
            self._client.send_run_async(self._runs[rid])
    
    def on_chain_start(self, serialized: Dict, inputs: Dict, *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs):
        rid = self._get_run_id(run_id)
        name = serialized.get("id", ["chain"])[-1] if serialized else "chain"
        self._runs[rid] = {
            "id": rid,
            "name": f"Chain: {name}",
            "run_type": "chain",
            "status": "pending",
            "inputs": inputs,
            "outputs": {},
            "model_name": "",
            "parent_run_id": self._get_run_id(parent_run_id) if parent_run_id else None,
            "start_time": datetime.utcnow().isoformat(),
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_cost_usd": 0.0,
            "tags": self.tags,
        }
    
    def on_chain_end(self, outputs: Dict, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid in self._runs:
            self._runs[rid].update({"status": "success", "outputs": outputs, "end_time": datetime.utcnow().isoformat()})
            self._client.send_run_async(self._runs[rid])
    
    def on_chain_error(self, error: Exception, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid in self._runs:
            self._runs[rid].update({"status": "error", "error": str(error), "end_time": datetime.utcnow().isoformat()})
            self._client.send_run_async(self._runs[rid])
    
    def on_tool_start(self, serialized: Dict, input_str: str, *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs):
        rid = self._get_run_id(run_id)
        tool_name = serialized.get("name", "tool") if serialized else "tool"
        self._runs[rid] = {
            "id": rid,
            "name": f"Tool: {tool_name}",
            "run_type": "tool",
            "status": "pending",
            "inputs": {"input": input_str},
            "outputs": {},
            "model_name": "",
            "parent_run_id": self._get_run_id(parent_run_id) if parent_run_id else None,
            "start_time": datetime.utcnow().isoformat(),
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_cost_usd": 0.0,
            "tags": self.tags,
        }
    
    def on_tool_end(self, output: str, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid in self._runs:
            self._runs[rid].update({"status": "success", "outputs": {"output": output}, "end_time": datetime.utcnow().isoformat()})
            self._client.send_run_async(self._runs[rid])
    
    def on_tool_error(self, error: Exception, *, run_id: UUID, **kwargs):
        rid = self._get_run_id(run_id)
        if rid in self._runs:
            self._runs[rid].update({"status": "error", "error": str(error), "end_time": datetime.utcnow().isoformat()})
            self._client.send_run_async(self._runs[rid])
