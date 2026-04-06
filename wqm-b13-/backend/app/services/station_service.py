from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.station import WaterStation
from app.schemas.station import StationCreate, StationUpdate
from app.services import alert_service


def get_all_stations(db: Session, skip: int = 0, limit: int = 100) -> List[WaterStation]:
    """Return a paginated list of all stations."""
    return db.query(WaterStation).offset(skip).limit(limit).all()


def get_station_by_id(db: Session, station_id: int) -> Optional[WaterStation]:
    """Return a single station by its ID."""
    return db.query(WaterStation).filter(WaterStation.id == station_id).first()


def create_station(db: Session, data: StationCreate) -> WaterStation:
    """Create a new water station."""
    station = WaterStation(
        name=data.name,
        river=data.river,
        city=data.city,
        latitude=data.latitude,
        longitude=data.longitude,
        managed_by=data.managed_by,
        wqi=data.wqi,
        ph=data.ph,
        turbidity=data.turbidity,
        dissolved_oxygen=data.dissolved_oxygen,
        temperature=data.temperature,
        lead=data.lead,
        arsenic=data.arsenic,
        status=data.status
    )
    db.add(station)
    db.commit()
    db.refresh(station)
    
    # Trigger alert check
    alert_service.check_and_generate_alerts(db, station)
    
    return station


def update_station(db: Session, station_id: int, data: StationUpdate) -> Optional[WaterStation]:
    """Update an existing station's fields."""
    station = get_station_by_id(db, station_id)
    if not station:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(station, key, value)
    db.commit()
    db.refresh(station)
    
    # Trigger alert check
    alert_service.check_and_generate_alerts(db, station)
    
    return station


def delete_station(db: Session, station_id: int) -> bool:
    """Delete a station by ID. Returns True if deleted."""
    station = get_station_by_id(db, station_id)
    if not station:
        return False
    db.delete(station)
    db.commit()
    return True
from datetime import datetime, timedelta
from sqlalchemy import func
from app.models.reading import WaterReading

def get_aggregated_readings(db: Session, station_id: int, period_hours: int = 24) -> List[dict]:
    """
    Get hourly averaged readings for a station over a specified period.
    Returns a list of dicts suitable for AggregateReadingResponse.
    """
    start_time = datetime.utcnow() - timedelta(hours=period_hours)
    
    # 1. Group by hour and parameter
    results = (
        db.query(
            func.date_trunc('hour', WaterReading.recorded_at).label('hour'),
            WaterReading.parameter,
            func.avg(WaterReading.value).label('avg_value')
        )
        .filter(WaterReading.station_id == station_id)
        .filter(WaterReading.recorded_at >= start_time)
        .group_by(func.date_trunc('hour', WaterReading.recorded_at), WaterReading.parameter)
        .order_by(func.date_trunc('hour', WaterReading.recorded_at).asc())
        .all()
    )
    
    # 2. Pivot results: {timestamp: {param1: val1, param2: val2}}
    pivoted = {}
    for hour, param, avg_val in results:
        if hour not in pivoted:
            pivoted[hour] = {"timestamp": hour}
        pivoted[hour][param.value if hasattr(param, 'value') else str(param)] = round(avg_val, 2)
        
    # Return sorted list
    return sorted(pivoted.values(), key=lambda x: x["timestamp"])
