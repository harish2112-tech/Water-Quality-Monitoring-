from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class StationCreate(BaseModel):
    """Schema for creating a water station."""
    name: str
    river: Optional[str] = None
    city: Optional[str] = None
    latitude: float
    longitude: float
    managed_by: Optional[str] = None
    external_site_id: Optional[str] = None
    data_source: Optional[str] = "internal"
    wqi: Optional[int] = None
    ph: Optional[float] = None
    turbidity: Optional[float] = None
    dissolved_oxygen: Optional[float] = None
    temperature: Optional[float] = None
    lead: Optional[float] = None
    arsenic: Optional[float] = None
    status: Optional[str] = "safe"


class StationUpdate(BaseModel):
    """Schema for updating a water station."""
    name: Optional[str] = None
    river: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: Optional[bool] = None
    managed_by: Optional[str] = None
    external_site_id: Optional[str] = None
    data_source: Optional[str] = None
    wqi: Optional[int] = None
    ph: Optional[float] = None
    turbidity: Optional[float] = None
    dissolved_oxygen: Optional[float] = None
    temperature: Optional[float] = None
    lead: Optional[float] = None
    arsenic: Optional[float] = None
    status: Optional[str] = None


class StationResponse(BaseModel):
    """Schema for water station response."""
    id: int
    name: str
    river: Optional[str]
    city: Optional[str]
    latitude: float
    longitude: float
    managed_by: Optional[str]
    external_site_id: Optional[str]
    data_source: Optional[str]
    wqi: Optional[int]
    ph: Optional[float]
    turbidity: Optional[float]
    dissolved_oxygen: Optional[float]
    temperature: Optional[float]
    lead: Optional[float]
    arsenic: Optional[float]
    status: Optional[str] = "safe"
    is_active: Optional[bool] = True
    created_at: Optional[datetime] = None
    last_transmission: Optional[datetime] = None
    
    class Config:
        from_attributes = True
