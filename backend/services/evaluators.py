import re
import json

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
