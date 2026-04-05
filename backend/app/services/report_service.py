from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.reading import WaterReading, WaterParameter
from app.models.report import Report
from app.schemas.reading import ReadingCreate
from app.schemas.report import ReportCreate

# Safe value ranges per parameter
SAFE_RANGES = {
    WaterParameter.PH: (6.5, 8.5),
    WaterParameter.TURBIDITY: (0, 4),           # NTU
    WaterParameter.DISSOLVED_OXYGEN: (6, 14),    # mg/L
    WaterParameter.CONDUCTIVITY: (0, 800),       # µS/cm
    WaterParameter.TEMPERATURE: (0, 30),         # °C
    WaterParameter.NITRATES: (0, 10),            # mg/L
    WaterParameter.COLIFORM: (0, 0),             # CFU/100ml — 0 is safe
}


def _is_safe(parameter: WaterParameter, value: float) -> bool:
    """Determine if a reading value is within the safe range."""
    lo, hi = SAFE_RANGES.get(parameter, (None, None))
    if lo is None:
        return True
    return lo <= value <= hi


def get_all_readings(db: Session, skip: int = 0, limit: int = 200) -> List[WaterReading]:
    """Return all readings ordered by most recent first."""
    return (
        db.query(WaterReading)
        .order_by(WaterReading.recorded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_readings_by_station(db: Session, station_id: int) -> List[WaterReading]:
    """Return all readings for a specific station."""
    return (
        db.query(WaterReading)
        .filter(WaterReading.station_id == station_id)
        .order_by(WaterReading.recorded_at.desc())
        .all()
    )


def get_pivoted_station_readings(db: Session, station_id: int) -> List[dict]:
    """Return pivoted readings for charts, grouped by timestamp."""
    readings = (
        db.query(WaterReading)
        .filter(WaterReading.station_id == station_id)
        .order_by(WaterReading.recorded_at.asc())
        .all()
    )
    
    pivoted = {}
    for r in readings:
        ts = r.recorded_at.strftime("%H:%M") # Simplified for "H" filter
        if ts not in pivoted:
            pivoted[ts] = {"time": ts}
        
        # Map parameter names to frontend keys
        param_map = {
            WaterParameter.PH: "pH",
            WaterParameter.TURBIDITY: "turbidity",
            WaterParameter.DISSOLVED_OXYGEN: "dissolvedOxygen",
            WaterParameter.TEMPERATURE: "temperature",
            WaterParameter.LEAD: "lead",
            WaterParameter.ARSENIC: "arsenic"
        }
        
        key = param_map.get(r.parameter)
        if key:
            pivoted[ts][key] = r.value
            
    # Return as sorted list
    return list(pivoted.values())


def create_reading(db: Session, data: ReadingCreate) -> WaterReading:
    """Create a new water quality reading."""
    reading = WaterReading(
        station_id=data.station_id,
        parameter=data.parameter,
        value=data.value,
        recorded_at=data.recorded_at or datetime.utcnow(),
        is_safe=_is_safe(data.parameter, data.value),
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


from sqlalchemy import or_

def get_reports(db: Session, user=None, skip: int = 0, limit: int = 200) -> List[Report]:
    """
    Return citizen reports ordered by most recent first.
    Filters:
    - Admin/NGO: All reports
    - Citizen: Own reports + all VERIFIED reports
    """
    query = db.query(Report)
    
    if user and user.role not in ["ngo", "admin", "authority"]:
        query = query.filter(or_(Report.user_id == user.id, Report.status == "VERIFIED"))
        
    return (
        query.order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_report(db: Session, data: ReportCreate, user_id: int) -> Report:
    """Create a new citizen water quality report."""
    report = Report(
        user_id=user_id,
        location=data.location or data.title, # Map title to location if location is missing
        description=data.description,
        latitude=data.latitude,
        longitude=data.longitude,
        water_source=data.source, # Map frontend 'source' to backend 'water_source'
        photo_url=data.photo_url,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def update_report_status(db: Session, report_id: int, status: str, verified_by: int) -> Optional[Report]:
    """Update the status of a citizen report."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        return None
    
    report.status = status
    report.verified_at = datetime.utcnow()
    report.verified_by = verified_by
    
    db.commit()
    db.refresh(report)
    return report


def get_report_by_id(db: Session, report_id: int) -> Optional[Report]:
    """Get a single report by ID."""
    return db.query(Report).filter(Report.id == report_id).first()


def delete_report(db: Session, report_id: int) -> bool:
    """Delete a report by ID."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        return False
    
    db.delete(report)
    db.commit()
    return True
