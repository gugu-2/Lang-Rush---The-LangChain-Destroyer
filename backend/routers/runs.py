from fastapi import APIRouter, Depends, HTTPException, Header, Query
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from pydantic import BaseModel
from database import get_db
from models.run import Run
from models.project import Project

router = APIRouter(prefix="/runs", tags=["runs"])

import json
from typing import Optional, List, Any

class RunCreate(BaseModel):
    id: Optional[str] = None
    name: str = "run"
    run_type: str = "chain"
    inputs: Optional[Any] = "{}"
    outputs: Optional[Any] = "{}"
    status: str = "success"
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    model_name: str = ""
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_cost_usd: float = 0.0
    parent_run_id: Optional[str] = None
    project_id: Optional[str] = None
    tags: Optional[Any] = "[]"

class BulkDelete(BaseModel):
    ids: List[str]

@router.post("")
async def create_run(run: RunCreate, x_api_key: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    pid = run.project_id
    if not pid and x_api_key:
        res = await db.execute(select(Project).where(Project.api_key == x_api_key))
        proj = res.scalars().first()
        if proj:
            pid = proj.id
    if not pid:
        # Fallback to first project or default
        res = await db.execute(select(Project))
        proj = res.scalars().first()
        if proj:
            pid = proj.id
        else:
            pid = "default-project"
    
    inputs_str = json.dumps(run.inputs) if isinstance(run.inputs, (dict, list)) else str(run.inputs or "{}")
    outputs_str = json.dumps(run.outputs) if isinstance(run.outputs, (dict, list)) else str(run.outputs or "{}")
    tags_str = json.dumps(run.tags) if isinstance(run.tags, (dict, list)) else str(run.tags or "[]")
    
    start_dt = run.start_time or datetime.utcnow()
    latency = 0.0
    if run.end_time and start_dt:
        latency = (run.end_time - start_dt).total_seconds() * 1000
    
    new_run = Run(
        id=run.id or str(uuid.uuid4()),
        project_id=pid,
        name=run.name,
        run_type=run.run_type,
        inputs=inputs_str,
        outputs=outputs_str,
        status=run.status,
        start_time=start_dt,
        end_time=run.end_time,
        model_name=run.model_name,
        prompt_tokens=run.prompt_tokens,
        completion_tokens=run.completion_tokens,
        total_cost_usd=run.total_cost_usd,
        parent_run_id=run.parent_run_id,
        latency_ms=latency,
        tags=tags_str
    )
    db.add(new_run)
    await db.commit()
    await db.refresh(new_run)
    return new_run

@router.get("")
async def list_runs(
    project_id: str,
    status: Optional[str] = None,
    model_name: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(Run).where(Run.project_id == project_id)
    if status:
        query = query.where(Run.status == status)
    if model_name:
        query = query.where(Run.model_name == model_name)
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}")
async def get_run(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Run).where(Run.id == id))
    run = result.scalars().first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/{id}/children")
async def get_run_children(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Run).where(Run.parent_run_id == id))
    return result.scalars().all()

@router.delete("/{id}")
async def delete_run(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Run).where(Run.id == id))
    run = result.scalars().first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    await db.delete(run)
    await db.commit()
    return {"message": "Run deleted"}

@router.post("/bulk-delete")
async def bulk_delete_runs(req: BulkDelete, db: AsyncSession = Depends(get_db)):
    for rid in req.ids:
        result = await db.execute(select(Run).where(Run.id == rid))
        run = result.scalars().first()
        if run:
            await db.delete(run)
    await db.commit()
    return {"message": f"Deleted {len(req.ids)} runs"}
