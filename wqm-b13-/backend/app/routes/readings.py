from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.reading import ReadingResponse
from app.services import report_service
from app.services.auth import get_current_user

from app.schemas.reading import ReadingResponse, PivotedReadingResponse

router = APIRouter(prefix="/api/readings", tags=["Sensor Readings"])


@router.get("", response_model=List[ReadingResponse])
def all_readings(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get all sensor readings (most recent first)."""
    return report_service.get_all_readings(db, skip=skip, limit=limit)

@router.get("/station/{station_id}", response_model=List[PivotedReadingResponse])
def readings_by_station(
    station_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get pivoted readings for a specific station (optimized for charts)."""
    return report_service.get_pivoted_station_readings(db, station_id)
