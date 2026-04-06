from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.predictive_engine import analyse_station
from app.db.session import get_db
from app.models.station import WaterStation
from app.models.alert import Alert
from app.services.ws_manager import manager
from datetime import datetime, timedelta

router = APIRouter()
@router.post("/predictive/generate")
async def generate_alerts(db: Session = Depends(get_db)):
    stations = db.query(WaterStation).all()
    generated = 0
    skipped = 0

    for station in stations:
        alerts = analyse_station(station.id, db)

        for a in alerts:
            existing = db.query(Alert).filter(
             Alert.station_id == a["station_id"],
             Alert.parameter == a["parameter"],
             Alert.issued_at >= datetime.utcnow() - timedelta(hours=24)
            ).first()

            if existing:
                skipped += 1
                continue

            new_alert = Alert(
                station_id=a["station_id"],
                title=f"AI Forecast: {a['parameter'].upper()}",
                type="wqi_breach", # Defaulting to a valid AlertType
                parameter=a["parameter"],
                message=a["alert_message"],
                source="predictive",
                location=f"{station.river or 'Unknown'}, {station.city or 'Unknown'}"
            )

            db.add(new_alert)
            db.commit()
            db.refresh(new_alert)

            # ✅ STEP 5: BROADCAST HERE
            await manager.broadcast({
                "type": "new_alert",
                "payload": {
                    "id": new_alert.id,
                    "message": new_alert.message,
                    "station_id": new_alert.station_id,
                    "parameter": new_alert.parameter
                }
            })

            generated += 1

    return {"generated": generated, "skipped": skipped}




@router.get("/predictive")
def get_predictive_alerts(location: str = "", db: Session = Depends(get_db)):
    query = db.query(Alert).filter(Alert.source == "predictive")
    if location:
        query = query.filter(Alert.location.ilike(f"%{location}%"))
    alerts = query.order_by(Alert.issued_at.desc()).limit(10).all()

    return alerts