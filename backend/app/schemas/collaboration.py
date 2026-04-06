from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class CollaborationBase(BaseModel):
    project_name: str = Field(..., max_length=120)
    ngo_name: str
    contact_email: EmailStr
    station_id: Optional[int] = None

class CollaborationCreate(CollaborationBase):
    pass

class CollaborationUpdate(BaseModel):
    project_name: Optional[str] = Field(None, max_length=120)
    ngo_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    status: Optional[str] = None

class CollaborationResponse(CollaborationBase):
    id: int
    ngo_user_id: int
    status: str
    created_at: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
