import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Run(Base):
    __tablename__ = "runs"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"), index=True)
    name: Mapped[str] = mapped_column(String, default="run")
    run_type: Mapped[str] = mapped_column(String, default="chain")  # llm/chain/tool/agent
    status: Mapped[str] = mapped_column(String, default="success")  # success/error/pending
    inputs: Mapped[str] = mapped_column(Text, default="{}")  # JSON string
    outputs: Mapped[str] = mapped_column(Text, default="{}")  # JSON string
    error: Mapped[str] = mapped_column(Text, default="")
    start_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0)
    total_cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
    model_name: Mapped[str] = mapped_column(String, default="")
    parent_run_id: Mapped[str] = mapped_column(String, ForeignKey("runs.id"), nullable=True)
    tags: Mapped[str] = mapped_column(Text, default="[]")  # JSON array string
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
