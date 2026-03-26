from sqlalchemy import Column, Integer, Float, Boolean, DateTime, Enum, ForeignKey, String
from datetime import datetime
import enum
from app.core.database import Base


class WaterParameter(str, enum.Enum):
    """Enum for water quality parameters."""
    PH = "ph"
    TURBIDITY = "turbidity"
    DISSOLVED_OXYGEN = "dissolved_oxygen"
    CONDUCTIVITY = "conductivity"
    TEMPERATURE = "temperature"
    NITRATES = "nitrates"
    COLIFORM = "coliform"
    LEAD = "lead"
    ARSENIC = "arsenic"


class WaterReading(Base):
    """Water quality reading/measurement model."""

    __tablename__ = "water_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=False, index=True)
    parameter = Column(String(50), nullable=False) # Stores WaterParameter values
    value = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    is_safe = Column(Boolean, default=True)
    data_source = Column(String, default="sensor") # sensor, manual, usgs
