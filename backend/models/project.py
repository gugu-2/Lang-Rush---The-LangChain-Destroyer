import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Project(Base):
    __tablename__ = "projects"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String, default="")
    color: Mapped[str] = mapped_column(String, default="#4f6ef7")
    environment: Mapped[str] = mapped_column(String, default="development")  # production/staging/development
    api_key: Mapped[str] = mapped_column(String, default=lambda: str(uuid.uuid4()), unique=True)
    owner_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
