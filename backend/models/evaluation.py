import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Boolean, Text, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class EvalRun(Base):
    __tablename__ = "eval_runs"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id: Mapped[str] = mapped_column(String, ForeignKey("datasets.id"))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"))
    evaluator_type: Mapped[str] = mapped_column(String)  # exact_match/contains/regex/llm_judge
    status: Mapped[str] = mapped_column(String, default="pending")
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class EvalResult(Base):
    __tablename__ = "eval_results"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    eval_run_id: Mapped[str] = mapped_column(String, ForeignKey("eval_runs.id"))
    example_id: Mapped[str] = mapped_column(String, ForeignKey("dataset_examples.id"))
    actual_output: Mapped[str] = mapped_column(Text, default="")
    score: Mapped[float] = mapped_column(Float, default=0.0)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    feedback: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AnnotationQueue(Base):
    __tablename__ = "annotation_queues"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Annotation(Base):
    __tablename__ = "annotations"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    queue_id: Mapped[str] = mapped_column(String, ForeignKey("annotation_queues.id"))
    run_id: Mapped[str] = mapped_column(String, ForeignKey("runs.id"))
    reviewer_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=True)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    comment: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
