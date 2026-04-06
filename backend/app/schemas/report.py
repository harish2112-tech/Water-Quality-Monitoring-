from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReportBase(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    description: str
    latitude: float
    longitude: float
    source: Optional[str] = None
    photo_url: Optional[str] = None
<<<<<<< HEAD
    station_id: Optional[int] = None
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29


class ReportCreate(ReportBase):
    pass


class ReportStatusUpdate(BaseModel):
    status: str


class ReportResponse(ReportBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    location: Optional[str] = None
    water_source: Optional[str] = None # Include backend column name in response
<<<<<<< HEAD
    station_id: Optional[int] = None
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29

    class Config:
        from_attributes = True
