from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
from database import get_db
from models.project import Project
from models.user import User
from models.run import Run
from routers.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: str = ""
    color: str = "#4f6ef7"
    environment: str = "development"

@router.get("")
async def list_projects(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.owner_id == current_user.id))
    return result.scalars().all()

@router.post("")
async def create_project(proj: ProjectCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_proj = Project(
        name=proj.name,
        description=proj.description,
        color=proj.color,
        environment=proj.environment,
        owner_id=current_user.id
    )
    db.add(new_proj)
    await db.commit()
    await db.refresh(new_proj)
    return new_proj

@router.get("/{id}")
async def get_project(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == id, Project.owner_id == current_user.id))
    proj = result.scalars().first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.put("/{id}")
async def update_project(id: str, proj: ProjectCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == id, Project.owner_id == current_user.id))
    db_proj = result.scalars().first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db_proj.name = proj.name
    db_proj.description = proj.description
    db_proj.color = proj.color
    db_proj.environment = proj.environment
    await db.commit()
    return db_proj

@router.delete("/{id}")
async def delete_project(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == id, Project.owner_id == current_user.id))
    db_proj = result.scalars().first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(db_proj)
    await db.commit()
    return {"message": "Project deleted"}

@router.get("/{id}/stats")
async def get_project_stats(id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.id == id, Project.owner_id == current_user.id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
        
    runs_res = await db.execute(select(Run).where(Run.project_id == id))
    runs = runs_res.scalars().all()
    
    total_runs = len(runs)
    errors = sum(1 for r in runs if r.status == "error")
    error_rate = (errors / total_runs * 100) if total_runs > 0 else 0
    total_latency = sum(r.latency_ms for r in runs)
    avg_latency = (total_latency / total_runs) if total_runs > 0 else 0
    total_cost = sum(r.total_cost_usd for r in runs)
    
    return {
        "total_runs": total_runs,
        "error_rate": error_rate,
        "avg_latency_ms": avg_latency,
        "total_cost_usd": total_cost,
        "runs_today": total_runs
    }
