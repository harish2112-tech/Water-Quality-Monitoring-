from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from app.core.database import Base


class WaterStation(Base):
    """Water monitoring station model."""

    __tablename__ = "water_stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    river = Column(String, nullable=True)
    city = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    managed_by = Column(String, nullable=True)
    
    # Environmental Parameters
    wqi = Column(Integer, nullable=True)
    ph = Column(Float, nullable=True)
    turbidity = Column(Float, nullable=True)
    dissolved_oxygen = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    lead = Column(Float, nullable=True)
    arsenic = Column(Float, nullable=True)
    
    status = Column(String, default="safe") # safe, warning, critical
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_transmission = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
