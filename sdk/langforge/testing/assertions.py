import re

def _get_output(result) -> str:
    if isinstance(result, dict) and 'output' in result:
        return str(result['output'])
    return str(result)

def assert_tool_called(result, tool_name: str):
    if isinstance(result, dict) and 'tool_calls' in result:
        calls = [str(c) for c in result['tool_calls']]
        if any(tool_name in c for c in calls):
            return
    out = _get_output(result)
    if tool_name not in out:
        raise AssertionError(f"Expected tool '{tool_name}' to be called, but not found in output.")

def assert_contains_topic(result, topic: str):
    out = _get_output(result).lower()
    if topic.lower() not in out:
        raise AssertionError(f"Expected topic '{topic}' not found in output.")

def assert_no_hallucination(result, source: str = ""):
    out = _get_output(result)
    sentences = [s.strip() for s in out.split('.') if s.strip()]
    source_lower = source.lower()
    
    for sentence in sentences:
        words = re.findall(r'\w+', sentence.lower())
        if len(words) >= 2:
            match_found = any(w in source_lower for w in words if len(w) >= 3)
            if not match_found:
                raise AssertionError(f"Potential hallucination detected: '{sentence}' not grounded in source text.")

def assert_sentiment(result, expected: str = "positive"):
    out = _get_output(result).lower()
    pos_words = ['good', 'great', 'excellent', 'happy', 'positive']
    neg_words = ['bad', 'terrible', 'awful', 'error', 'negative']
    
    pos_count = sum(1 for w in pos_words if w in out)
    neg_count = sum(1 for w in neg_words if w in out)
    
    if expected == "positive" and neg_count > pos_count:
        raise AssertionError("Expected positive sentiment, but found negative.")
    elif expected == "negative" and pos_count > neg_count:
        raise AssertionError("Expected negative sentiment, but found positive.")

def assert_score_above(result, threshold: float):
    # Simple length/complexity based score for demonstration
    out = _get_output(result)
    score = min(len(out) / 100.0, 1.0)
    if score < threshold:
        raise AssertionError(f"Score {score} is below threshold {threshold}.")
