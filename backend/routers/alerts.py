from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from database import get_db
from models.alert import AlertRule, AlertEvent

router = APIRouter(prefix="/alerts", tags=["alerts"])

class AlertRuleCreate(BaseModel):
    project_id: str
    metric: str
    condition: str
    threshold: float
    channel: str = "slack"
    webhook_url: str = ""

@router.get("")
async def list_alerts(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AlertRule).where(AlertRule.project_id == project_id))
    return result.scalars().all()

@router.post("")
async def create_alert(req: AlertRuleCreate, db: AsyncSession = Depends(get_db)):
    r = AlertRule(
        project_id=req.project_id,
        metric=req.metric,
        condition=req.condition,
        threshold=req.threshold,
        channel=req.channel,
        webhook_url=req.webhook_url
    )
    db.add(r)
    await db.commit()
    await db.refresh(r)
    return r

@router.put("/{id}")
async def update_alert(id: str, req: AlertRuleCreate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AlertRule).where(AlertRule.id == id))
    r = res.scalars().first()
    if not r:
        raise HTTPException(status_code=404, detail="Alert not found")
    r.metric = req.metric
    r.condition = req.condition
    r.threshold = req.threshold
    r.channel = req.channel
    r.webhook_url = req.webhook_url
    await db.commit()
    return r

@router.delete("/{id}")
async def delete_alert(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AlertRule).where(AlertRule.id == id))
    r = res.scalars().first()
    if not r:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.delete(r)
    await db.commit()
    return {"message": "Alert deleted"}

@router.get("/{id}/events")
async def list_events(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AlertEvent).where(AlertEvent.rule_id == id))
    return res.scalars().all()
