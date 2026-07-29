from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Dict, Any
from database import get_db
from models.prompt import Prompt, PromptVersion

router = APIRouter(prefix="/prompts", tags=["prompts"])

class PromptCreate(BaseModel):
    project_id: str
    name: str
    description: str = ""
    template: str
    model_name: str

class PromptVersionCreate(BaseModel):
    template: str
    model_name: str
    temperature: float = 0.7
    commit_message: str = ""

class PlaygroundRequest(BaseModel):
    template: str
    model_name: str = "gpt-4o-mini"
    temperature: float = 0.7
    variables: Dict[str, Any] = {}

@router.get("")
async def list_prompts(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Prompt).where(Prompt.project_id == project_id))
    return result.scalars().all()

@router.post("")
async def create_prompt(req: PromptCreate, db: AsyncSession = Depends(get_db)):
    prompt = Prompt(project_id=req.project_id, name=req.name, description=req.description)
    db.add(prompt)
    await db.commit()
    await db.refresh(prompt)
    
    pv = PromptVersion(
        prompt_id=prompt.id,
        version_number=1,
        template=req.template,
        model_name=req.model_name
    )
    db.add(pv)
    await db.commit()
    return prompt

@router.get("/{id}/versions")
async def list_prompt_versions(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PromptVersion).where(PromptVersion.prompt_id == id))
    return result.scalars().all()

@router.post("/{id}/versions")
async def create_prompt_version(id: str, req: PromptVersionCreate, db: AsyncSession = Depends(get_db)):
    # get max version
    result = await db.execute(select(PromptVersion).where(PromptVersion.prompt_id == id).order_by(PromptVersion.version_number.desc()))
    latest = result.scalars().first()
    v_num = 1 if not latest else latest.version_number + 1
    
    pv = PromptVersion(
        prompt_id=id,
        version_number=v_num,
        template=req.template,
        model_name=req.model_name,
        temperature=req.temperature,
        commit_message=req.commit_message
    )
    db.add(pv)
    await db.commit()
    await db.refresh(pv)
    return pv

@router.get("/by-name/{name}/latest")
async def get_latest_by_name(name: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Prompt).where(Prompt.name == name))
    prompt = res.scalars().first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
        
    v_res = await db.execute(select(PromptVersion).where(PromptVersion.prompt_id == prompt.id).order_by(PromptVersion.version_number.desc()))
    return v_res.scalars().first()

@router.post("/playground")
async def playground(req: PlaygroundRequest):
    # Mocking playground response
    rendered = req.template
    for k, v in req.variables.items():
        rendered = rendered.replace(f"{{{k}}}", str(v))
    
    return {
        "output": f"Mock response for rendered prompt: {rendered}",
        "response": f"Mock response for rendered prompt: {rendered}"
    }

@router.put("/versions/{version_id}/set-production")
async def set_production(version_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(PromptVersion).where(PromptVersion.id == version_id))
    pv = res.scalars().first()
    if not pv:
        raise HTTPException(status_code=404, detail="Version not found")
    
    # unset others
    all_res = await db.execute(select(PromptVersion).where(PromptVersion.prompt_id == pv.prompt_id))
    for p in all_res.scalars().all():
        p.is_production = False
    
    pv.is_production = True
    await db.commit()
    return pv
