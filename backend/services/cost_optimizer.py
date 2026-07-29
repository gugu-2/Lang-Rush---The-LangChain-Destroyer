MODEL_COSTS = {
    "gpt-4o": (0.0025, 0.01),
    "gpt-4o-mini": (0.00015, 0.0006),
    "claude-3-5-sonnet": (0.003, 0.015),
    "claude-3-haiku": (0.00025, 0.00125),
    "gemini-1.5-flash": (0.000075, 0.0003),
    "gemini-1.5-pro": (0.00125, 0.005),
}

def estimate_cost(model_name: str, prompt_tokens: int, completion_tokens: int) -> float:
    cost = MODEL_COSTS.get(model_name)
    if not cost:
        return 0.0
    input_cost_per_token = cost[0] / 1000
    output_cost_per_token = cost[1] / 1000
    total = (prompt_tokens * input_cost_per_token) + (completion_tokens * output_cost_per_token)
    return float(total)

def classify_complexity(prompt_text: str) -> str:
    tokens = len(prompt_text.split())
    if tokens < 200 and "```" not in prompt_text and "?" not in prompt_text:
        return 'simple'
    return 'complex'

def route_model(prompt_text: str, preferred_model: str) -> str:
    complexity = classify_complexity(prompt_text)
    if complexity == 'simple':
        return 'gpt-4o-mini'
    return preferred_model
