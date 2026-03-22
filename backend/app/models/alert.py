from sqlalchemy import Column, Integer, String, DateTime, Enum, Text, ForeignKey
from datetime import datetime
import enum
from app.core.database import Base


class AlertType(str, enum.Enum):
    """Alert type enumeration."""
    BOIL_NOTICE = "boil_notice"
    CONTAMINATION = "contamination"
    OUTAGE = "outage"
    CHEMICAL_IMBALANCE = "chemical_imbalance"
    AQUATIC_RISK = "aquatic_risk"
    CLARITY_WARNING = "clarity_warning"
    PH_VARIANCE = "ph_variance"
    WQI_BREACH = "wqi_breach"


class Alert(Base):
    """Water quality alert model."""
    
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True)
    title = Column(String, nullable=False)
    type = Column(String(50), nullable=False) # Stores AlertType values
    severity = Column(String, default="warning") # warning, critical, high, low
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Acknowledged
    issued_at = Column(DateTime, default=datetime.utcnow)
