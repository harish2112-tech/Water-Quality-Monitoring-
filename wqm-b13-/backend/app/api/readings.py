from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio

async def send_ws(data):
    await manager.broadcast(data)

from app.db.session import get_db
from app.models.reading import WaterReading
from app.models.alert import Alert
from app.models.station import WaterStation   # or your actual class name
from app.schemas.reading import ReadingCreate
from app.services.predictive_engine import analyse_station
from app.services.ws_manager import manager

router = APIRouter()
def process_alerts(station_id: int, db: Session):
    alerts = analyse_station(station_id, db)

    for a in alerts:
        new_alert = Alert(
            station_id=a["station_id"],
            parameter=a["parameter"],
            message=a["alert_message"],
            source="predictive",
            issued_at=datetime.utcnow()
        )

        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        asyncio.create_task(send_ws({
            "type": "new_alert",
            "payload": {
               "id": new_alert.id,
               "message": new_alert.message,
               "station_id": new_alert.station_id,
               "parameter": new_alert.parameter
            }
        }))

        


@router.post("/stations/readings")
def add_reading(
    data: ReadingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    readings_data = {
        "ph": data.ph,
        "turbidity": data.turbidity,
        "dissolved_oxygen": data.do,
        "lead": data.lead,
        "arsenic": data.arsenic
    }

    for param, value in readings_data.items():
        if value is not None:
            new_reading = WaterReading(
                station_id=data.station_id,
                parameter=param,
                value=value,
                recorded_at=datetime.utcnow()
            )
            db.add(new_reading)

    db.commit()

    # ✅ STEP 6 MAGIC
    background_tasks.add_task(process_alerts, data.station_id, db)

    return {"message": "Reading added successfully"}