from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Dict, Any, List
from database import get_db
from models.evaluation import EvalRun, EvalResult, AnnotationQueue, Annotation
from services.evaluators import run_evaluation

router = APIRouter(prefix="", tags=["evaluations"])

class EvalRunCreate(BaseModel):
    dataset_id: str
    project_id: str
    evaluator_type: str
    evaluator_config: Dict[str, Any] = {}

class AnnotationCreate(BaseModel):
    queue_id: str
    score: float
    comment: str = ""

@router.post("/evaluations/run")
async def create_eval_run(req: EvalRunCreate, db: AsyncSession = Depends(get_db)):
    ev = EvalRun(
        dataset_id=req.dataset_id,
        project_id=req.project_id,
        evaluator_type=req.evaluator_type,
        status="pending"
    )
    db.add(ev)
    await db.commit()
    await db.refresh(ev)
    
    # Run synchronously
    await run_evaluation(ev.id, db)
    
    return ev

@router.get("/evaluations")
async def list_evaluations(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EvalRun).where(EvalRun.project_id == project_id))
    return result.scalars().all()

@router.get("/evaluations/compare")
async def compare_evals(a: str, b: str, db: AsyncSession = Depends(get_db)):
    res_a = await db.execute(select(EvalRun).where(EvalRun.id == a))
    res_b = await db.execute(select(EvalRun).where(EvalRun.id == b))
    run_a = res_a.scalars().first()
    run_b = res_b.scalars().first()
    if not run_a or not run_b:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return {
        "run_a": run_a,
        "run_b": run_b,
        "diff": run_b.overall_score - run_a.overall_score
    }

@router.get("/evaluations/{id}")
async def get_evaluation(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EvalRun).where(EvalRun.id == id))
    ev = res.scalars().first()
    if not ev:
        raise HTTPException(status_code=404, detail="Eval run not found")
        
    results_res = await db.execute(select(EvalResult).where(EvalResult.eval_run_id == id))
    return {"eval_run": ev, "results": results_res.scalars().all()}

class AnnotationQueueCreate(BaseModel):
    project_id: str
    name: str

@router.post("/annotations/queues")
async def create_annotation_queue(req: AnnotationQueueCreate, db: AsyncSession = Depends(get_db)):
    q = AnnotationQueue(project_id=req.project_id, name=req.name)
    db.add(q)
    await db.commit()
    await db.refresh(q)
    return q

@router.get("/annotations/queues")
async def list_queues(project_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AnnotationQueue).where(AnnotationQueue.project_id == project_id))
    return res.scalars().all()

@router.post("/annotations/{run_id}")
async def submit_annotation(run_id: str, req: AnnotationCreate, db: AsyncSession = Depends(get_db)):
    ann = Annotation(
        queue_id=req.queue_id,
        run_id=run_id,
        score=req.score,
        comment=req.comment
    )
    db.add(ann)
    await db.commit()
    await db.refresh(ann)
    return ann

@router.get("/annotations")
async def get_annotations(run_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Annotation).where(Annotation.run_id == run_id))
    return res.scalars().all()
