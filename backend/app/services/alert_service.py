from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.schemas.alert import AlertCreate


def get_alerts(db: Session, skip: int = 0, limit: int = 100) -> List[Alert]:
    """Retrieve active water quality alerts ordered by most recent first."""
    return (
        db.query(Alert)
        .order_by(Alert.issued_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_alert(db: Session, data: AlertCreate) -> Alert:
    """Issue a new water quality alert."""
    alert = Alert(
        type=data.type,
        title=data.title,
        message=data.message,
        severity=data.severity,
        location=data.location,
        station_id=data.station_id
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def check_and_generate_alerts(db: Session, station):
    """
    Scan station attributes and automatically generate alerts if thresholds are breached.
    """
    from app.models.alert import AlertType
    
    # 1. pH Check
    if station.ph is not None:
        if station.ph < 6.0:
            _trigger_alert(db, station, AlertType.PH_VARIANCE, "Acidic Water Alert", 
                          "Water pH level is below 6.0, indicating acidic conditions which can be harmful.", "high")
        elif station.ph > 8.5:
            _trigger_alert(db, station, AlertType.PH_VARIANCE, "Alkaline Water Alert", 
                          "Water pH level is above 8.5, indicating alkaline conditions which can be harmful.", "high")
    
    # 2. Turbidity Check
    if station.turbidity is not None and station.turbidity > 8.0:
        _trigger_alert(db, station, AlertType.CLARITY_WARNING, "High Turbidity Detected", 
                      "Water clarity is unsafe. Possible contamination or suspended particles.", "high")
                      
    # 3. Dissolved Oxygen Check
    if station.dissolved_oxygen is not None and station.dissolved_oxygen < 5.0:
        _trigger_alert(db, station, AlertType.AQUATIC_RISK, "Low Oxygen Level", 
                      "Low oxygen levels may harm aquatic life.", "warning")

    # 4. WQI Check
    if station.wqi is not None:
        if station.wqi < 40:
            _trigger_alert(db, station, AlertType.WQI_BREACH, "Critical Water Quality", 
                          "Water quality index indicates extremely polluted water.", "critical")
        elif 40 <= station.wqi <= 70:
            _trigger_alert(db, station, AlertType.WQI_BREACH, "Water Quality Warning", 
                          f"Water quality index ({station.wqi}) is in the warning zone.", "medium")

    # Update station status based on highest severity active alert
    _update_station_status(db, station)


def _trigger_alert(db: Session, station, type, title, message, severity):
    """Helper to issue an alert if one doesn't recently exist for this condition."""
    # Prevent duplicate active alerts for the same type and station
    existing = db.query(Alert).filter(
        Alert.station_id == station.id,
        Alert.type == type,
        Alert.title == title,
        Alert.status == "Active"
    ).first()
    
    if existing:
        return

    alert = Alert(
        station_id=station.id,
        type=type,
        title=title,
        message=message,
        severity=severity,
        location=f"{station.river or ''} - {station.city or station.name}"
    )
    db.add(alert)
    db.commit()


def _update_station_status(db: Session, station):
    """Update station status based on active alerts."""
    active_alerts = db.query(Alert).filter(
        Alert.station_id == station.id,
        Alert.status == "Active"
    ).all()
    
    if not active_alerts:
        station.status = "safe"
    else:
        severities = [a.severity.lower() for a in active_alerts]
        if "critical" in severities:
            station.status = "critical"
        elif any(s in ["high", "medium", "warning"] for s in severities):
            station.status = "warning"
        else:
            station.status = "safe"
    
    db.commit()


def delete_alert(db: Session, alert_id: int) -> bool:
    """Cancel/Delete an alert by ID."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        return False
    
    db.delete(alert)
    db.commit()
    return True


def acknowledge_alert(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "Acknowledged"
        db.commit()
        db.refresh(alert)
        return alert
    return None
