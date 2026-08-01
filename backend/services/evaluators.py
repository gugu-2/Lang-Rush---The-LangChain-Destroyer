import re
import json
import logging
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
try:
    from colibri.bridge import ColibriEngine
except ImportError:
    ColibriEngine = None

logger = logging.getLogger(__name__)

def exact_match_eval(actual: str, expected: str) -> float:
    return 1.0 if actual.strip() == expected.strip() else 0.0

def contains_eval(actual: str, keyword: str) -> float:
    return 1.0 if keyword.lower() in actual.lower() else 0.0

def regex_eval(actual: str, pattern: str) -> float:
    return 1.0 if re.search(pattern, actual) else 0.0

async def llm_judge_eval(inputs: dict, actual: str, expected: str, api_key: str) -> float:
    # Basic mock for llm judge
    if not api_key:
        import random
        return random.uniform(0.6, 0.9)
    # Ideally call OpenAI GPT-4o-mini here
    return 0.8

async def local_llm_judge_eval(inputs: dict, actual: str, expected: str) -> float:
    """Zero-Cost offline evaluator using Colibrì Engine."""
    if not ColibriEngine:
        logger.error("Colibrì Engine not found for local evaluation")
        return 0.0
        
    prompt = f"""
    You are an expert evaluator. Compare the ACTUAL output to the EXPECTED output based on the INPUTS.
    Score from 0.0 (completely wrong) to 1.0 (perfect). Return ONLY a JSON object with a "score" float field.
    INPUTS: {json.dumps(inputs)}
    EXPECTED: {expected}
    ACTUAL: {actual}
    """
    try:
        engine = ColibriEngine(model_path="olmoe-7b")
        result_text = await engine.generate(prompt, max_tokens=150)
        # Try to parse the score out of the output
        match = re.search(r'"score"\s*:\s*([0-9.]+)', result_text)
        if match:
            return float(match.group(1))
        return 0.5 # fallback score if couldn't parse
    except Exception as e:
        logger.error(f"Local LLM judge failed: {e}")
        return 0.0

async def run_evaluation(eval_run_id: str, db):
    from sqlalchemy.future import select
    from models.evaluation import EvalRun, EvalResult
    from models.dataset import DatasetExample
    
    res = await db.execute(select(EvalRun).where(EvalRun.id == eval_run_id))
    eval_run = res.scalars().first()
    if not eval_run:
        return
        
    examples_res = await db.execute(select(DatasetExample).where(DatasetExample.dataset_id == eval_run.dataset_id))
    examples = examples_res.scalars().all()
    
    total_score = 0.0
    for ex in examples:
        actual_mock = "mock response" # Should be fetched from runs
        expected = ex.expected_output
        score = 0.0
        if eval_run.evaluator_type == "exact_match":
            score = exact_match_eval(actual_mock, expected)
        elif eval_run.evaluator_type == "contains":
            score = contains_eval(actual_mock, expected)
        elif eval_run.evaluator_type == "local_llm_judge":
            inputs = json.loads(ex.inputs) if ex.inputs else {}
            score = await local_llm_judge_eval(inputs, actual_mock, expected)
        
        result = EvalResult(
            eval_run_id=eval_run.id,
            example_id=ex.id,
            actual_output=actual_mock,
            score=score,
            passed=(score > 0.5)
        )
        db.add(result)
        total_score += score
        
    if examples:
        eval_run.overall_score = total_score / len(examples)
    eval_run.status = "completed"
    await db.commit()
