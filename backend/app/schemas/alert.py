from pydantic import BaseModel
from datetime import datetime
from enum import Enum # Added import for Enum


from typing import Optional

# Define AlertType enum here as per the instruction's implied change
class AlertType(str, Enum):
    CHEMICAL_IMBALANCE = "chemical_imbalance"
    AQUATIC_RISK = "aquatic_risk"
    CLARITY_WARNING = "clarity_warning"
    PH_VARIANCE = "ph_variance"
    WQI_BREACH = "wqi_breach"


class AlertBase(BaseModel):
    title: str
    type: AlertType
    severity: str = "warning"
    message: str
    location: str
    station_id: Optional[int] = None
    status: str = "Active"


class AlertCreate(AlertBase):
    pass


class AlertResponse(AlertBase):
    id: int
    issued_at: datetime

    class Config:
        from_attributes = True
