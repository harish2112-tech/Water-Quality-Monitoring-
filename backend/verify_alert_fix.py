from app.core.database import SessionLocal
from app.services import station_service
from app.schemas.station import StationUpdate

db = SessionLocal()
try:
    # Try updating station 3 (referenced in logs)
    station_id = 3
    update_data = StationUpdate(ph=6.5) # Trigger a minor change
    print(f"Verifying update for station {station_id}...")
    updated = station_service.update_station(db, station_id, update_data)
    print(f"Success: Station {updated.id} updated. Current pH: {updated.ph}")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
