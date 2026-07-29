from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from collections import defaultdict
from datetime import datetime, timedelta
from database import get_db
from models.run import Run

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/dashboard")
async def get_dashboard_stats(project_id: str, timerange: str = "7d", db: AsyncSession = Depends(get_db)):
    # Parse timerange
    now = datetime.utcnow()
    if timerange == '1h':
        start_time = now - timedelta(hours=1)
    elif timerange == '24h':
        start_time = now - timedelta(days=1)
    elif timerange == '7d':
        start_time = now - timedelta(days=7)
    elif timerange == '30d':
        start_time = now - timedelta(days=30)
    else:
        start_time = now - timedelta(days=7)

    query = select(Run).where(Run.project_id == project_id, Run.start_time >= start_time)
    result = await db.execute(query)
    runs = result.scalars().all()
    
    total_runs = len(runs)
    if total_runs == 0:
        return {
            "total_runs": 0,
            "error_rate": 0.0,
            "avg_latency_ms": 0.0,
            "total_tokens": 0,
            "total_cost_usd": 0.0,
            "runs_over_time": [],
            "error_rate_over_time": [],
            "cost_by_model": [],
            "latency_percentiles": {"p50": 0.0, "p95": 0.0, "p99": 0.0}
        }
        
    errors = sum(1 for r in runs if r.status == "error")
    error_rate = (errors / total_runs) * 100
    
    avg_latency = sum(r.latency_ms for r in runs) / total_runs
    total_tokens = sum(r.prompt_tokens + r.completion_tokens for r in runs)
    total_cost = sum(r.total_cost_usd for r in runs)
    
    # Bucket by hour
    buckets = defaultdict(lambda: {"total": 0, "errors": 0})
    cost_by_model_map = defaultdict(float)
    latencies = []
    
    for r in runs:
        hour_str = r.start_time.strftime("%Y-%m-%dT%H:00:00Z")
        buckets[hour_str]["total"] += 1
        if r.status == "error":
            buckets[hour_str]["errors"] += 1
        
        if r.model_name:
            cost_by_model_map[r.model_name] += r.total_cost_usd
            
        latencies.append(r.latency_ms)
        
    runs_over_time = [{"timestamp": k, "count": v["total"]} for k, v in sorted(buckets.items())]
    error_rate_over_time = [
        {"timestamp": k, "rate": (v["errors"] / v["total"] * 100) if v["total"] > 0 else 0} 
        for k, v in sorted(buckets.items())
    ]
    
    cost_by_model = [{"model": k, "cost": v} for k, v in cost_by_model_map.items()]
    
    # Percentiles
    import numpy as np
    latencies_arr = np.array(latencies)
    p50 = float(np.percentile(latencies_arr, 50))
    p95 = float(np.percentile(latencies_arr, 95))
    p99 = float(np.percentile(latencies_arr, 99))
    
    return {
        "total_runs": total_runs,
        "error_rate": error_rate,
        "avg_latency_ms": avg_latency,
        "total_tokens": total_tokens,
        "total_cost_usd": total_cost,
        "runs_over_time": runs_over_time,
        "error_rate_over_time": error_rate_over_time,
        "cost_by_model": cost_by_model,
        "latency_percentiles": {"p50": p50, "p95": p95, "p99": p99}
    }
