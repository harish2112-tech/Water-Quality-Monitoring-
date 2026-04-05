from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from app.core.database import Base
from datetime import datetime
import enum

class CollaborationStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    ngo_user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # NGO owner
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True) # Linked station
    project_name = Column(String(120), nullable=False)
    ngo_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    status = Column(SQLEnum(CollaborationStatus), default=CollaborationStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
