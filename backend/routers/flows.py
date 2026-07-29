from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import json
from database import get_db
from models.flow import Flow
from services.flow_codegen import generate_langgraph_code

router = APIRouter(prefix="/flows", tags=["flows"])

class FlowCreate(BaseModel):
    project_id: str
    name: str
    nodes_json: str = "[]"
    edges_json: str = "[]"

class FlowUpdate(BaseModel):
    name: str
    nodes_json: str
    edges_json: str

@router.get("")
async def list_flows(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flow).where(Flow.project_id == project_id))
    return result.scalars().all()

@router.post("")
async def create_flow(req: FlowCreate, db: AsyncSession = Depends(get_db)):
    f = Flow(
        project_id=req.project_id,
        name=req.name,
        nodes_json=req.nodes_json,
        edges_json=req.edges_json
    )
    db.add(f)
    await db.commit()
    await db.refresh(f)
    return f

@router.get("/{id}")
async def get_flow(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Flow).where(Flow.id == id))
    f = res.scalars().first()
    if not f:
        raise HTTPException(status_code=404, detail="Flow not found")
    return f

@router.put("/{id}")
async def update_flow(id: str, req: FlowUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Flow).where(Flow.id == id))
    f = res.scalars().first()
    if not f:
        raise HTTPException(status_code=404, detail="Flow not found")
    f.name = req.name
    f.nodes_json = req.nodes_json
    f.edges_json = req.edges_json
    await db.commit()
    return f

@router.delete("/{id}")
async def delete_flow(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Flow).where(Flow.id == id))
    f = res.scalars().first()
    if not f:
        raise HTTPException(status_code=404, detail="Flow not found")
    await db.delete(f)
    await db.commit()
    return {"message": "Flow deleted"}

@router.post("/{id}/generate-code")
async def generate_code(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Flow).where(Flow.id == id))
    f = res.scalars().first()
    if not f:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    nodes = json.loads(f.nodes_json)
    edges = json.loads(f.edges_json)
    
    code = generate_langgraph_code(nodes, edges, flow_name=f.name)
    f.generated_code = code
    await db.commit()
    return {"code": code}
