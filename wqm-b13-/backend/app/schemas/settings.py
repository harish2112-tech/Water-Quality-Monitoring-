from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class ThresholdBase(BaseModel):
    parameter: str
    warning_value: float
    critical_value: float
    unit: str

class ThresholdResponse(ThresholdBase):
    id: int

    class Config:
        from_attributes = True

class UserPreferenceBase(BaseModel):
    email_notifications: bool
    sms_notifications: bool
    webhook_url: Optional[str] = None
    unit_system: str
    timezone: str
    default_lat: float
    default_lng: float
    default_zoom: int

class UserPreferenceResponse(UserPreferenceBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
