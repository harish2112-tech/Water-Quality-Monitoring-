from app.core.database import SessionLocal
from app.routes.stations import list_stations

try:
    print("Testing list_stations...")
    db = SessionLocal()
    result = list_stations(skip=0, limit=10, db=db)
    print("Success:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
