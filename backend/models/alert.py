import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class AlertRule(Base):
    __tablename__ = "alert_rules"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"))
    metric: Mapped[str] = mapped_column(String)  # error_rate/latency_p95/cost_daily
    condition: Mapped[str] = mapped_column(String)  # gt/lt
    threshold: Mapped[float] = mapped_column(Float)
    channel: Mapped[str] = mapped_column(String, default="slack")  # slack/email/discord
    webhook_url: Mapped[str] = mapped_column(String, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AlertEvent(Base):
    __tablename__ = "alert_events"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rule_id: Mapped[str] = mapped_column(String, ForeignKey("alert_rules.id"))
    triggered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    value: Mapped[float] = mapped_column(Float)
    resolved_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
