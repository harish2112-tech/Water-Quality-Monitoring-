from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class WaterParameter(str, Enum):
    """Enum for water quality parameters (mirrors model enum)."""
    PH = "ph"
    TURBIDITY = "turbidity"
    DISSOLVED_OXYGEN = "dissolved_oxygen"
    CONDUCTIVITY = "conductivity"
    TEMPERATURE = "temperature"
    NITRATES = "nitrates"
    COLIFORM = "coliform"
    LEAD = "lead"
    ARSENIC = "arsenic"


class ReadingCreate(BaseModel):
    """Schema for creating a station reading."""
    station_id: int
    parameter: WaterParameter
    value: float
    recorded_at: Optional[datetime] = None


class ReadingResponse(BaseModel):
    """Schema for station reading response."""
    id: int
    station_id: int
    parameter: WaterParameter
    value: float
    recorded_at: datetime
    is_safe: bool

    class Config:
        from_attributes = True


class PivotedReadingResponse(BaseModel):
    """Schema for pivoted station readings used in charts."""
    time: str
    pH: Optional[float] = None
    turbidity: Optional[float] = None
    dissolvedOxygen: Optional[float] = None
    temperature: Optional[float] = None
    lead: Optional[float] = None
    arsenic: Optional[float] = None
    wqi: Optional[int] = None
