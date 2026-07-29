import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Boolean, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Prompt(Base):
    __tablename__ = "prompts"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String, unique=True)
    description: Mapped[str] = mapped_column(String, default="")
    tags: Mapped[str] = mapped_column(Text, default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class PromptVersion(Base):
    __tablename__ = "prompt_versions"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    prompt_id: Mapped[str] = mapped_column(String, ForeignKey("prompts.id"))
    version_number: Mapped[int] = mapped_column(Integer, default=1)
    template: Mapped[str] = mapped_column(Text)
    model_name: Mapped[str] = mapped_column(String, default="gpt-4o-mini")
    temperature: Mapped[float] = mapped_column(Float, default=0.7)
    commit_message: Mapped[str] = mapped_column(String, default="")
    is_production: Mapped[bool] = mapped_column(Boolean, default=False)
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    avg_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
