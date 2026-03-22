from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.station import StationCreate, StationUpdate, StationResponse
from app.services import station_service
from app.services.auth import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/api/stations", tags=["Water Stations"])


def require_admin_or_authority(current_user: User = Depends(get_current_user)):
    """Only admins and authorities can create/update stations."""
    if current_user.role not in (UserRole.ADMIN, UserRole.AUTHORITY):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return current_user


@router.get("", response_model=List[StationResponse])
def list_stations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """List all water monitoring stations."""
    return station_service.get_all_stations(db, skip=skip, limit=limit)


@router.get("/{station_id}", response_model=StationResponse)
def get_station(
    station_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get a single station by ID."""
    station = station_service.get_station_by_id(db, station_id)
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
    return station


@router.post("", response_model=StationResponse, status_code=status.HTTP_201_CREATED)
def create_station(
    data: StationCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin_or_authority),
):
    """Create a new water monitoring station (admin/authority only)."""
    return station_service.create_station(db, data)


@router.put("/{station_id}", response_model=StationResponse)
def update_station(
    station_id: int,
    data: StationUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin_or_authority),
):
    """Update an existing station (admin/authority only)."""
    station = station_service.update_station(db, station_id, data)
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
    return station


@router.delete("/{station_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_station(
    station_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin_or_authority),
):
    """Delete a station (admin only)."""
    deleted = station_service.delete_station(db, station_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
