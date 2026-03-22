import os
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.models.reading import WaterReading, WaterParameter
from app.models.station import WaterStation
from app.services.report_service import create_reading
from app.schemas.reading import ReadingCreate

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

def seed_data():
    db = Session(engine)
    try:
        stations = db.query(WaterStation).all()
        if not stations:
            print("No stations found. Please create some stations first.")
            return

        print(f"Seeding data for {len(stations)} stations...")
        
        # Parameters to seed
        params = [
            WaterParameter.PH,
            WaterParameter.TURBIDITY,
            WaterParameter.DISSOLVED_OXYGEN,
            WaterParameter.TEMPERATURE,
            WaterParameter.LEAD,
            WaterParameter.ARSENIC
        ]

        # Generate data for the last 48 hours
        now = datetime.utcnow()
        for station in stations:
            print(f"Generating readings for {station.name}...")
            for hour in range(48):
                timestamp = now - timedelta(hours=hour)
                
                # Base values for this station (with some randomness)
                base_values = {
                    WaterParameter.PH: 7.0 + random.uniform(-0.5, 0.5),
                    WaterParameter.TURBIDITY: 3.0 + random.uniform(-1.0, 2.0),
                    WaterParameter.DISSOLVED_OXYGEN: 8.0 + random.uniform(-1.5, 1.0),
                    WaterParameter.TEMPERATURE: 22.0 + random.uniform(-2.0, 2.0),
                    WaterParameter.LEAD: 0.01 + random.uniform(0, 0.005),
                    WaterParameter.ARSENIC: 0.005 + random.uniform(0, 0.002)
                }

                for param in params:
                    val = base_values[param]
                    # Add some "spikes" occasionally
                    if random.random() < 0.05:
                        if param == WaterParameter.PH: val -= 1.5
                        if param == WaterParameter.TURBIDITY: val += 10.0
                    
                    create_reading(db, ReadingCreate(
                        station_id=station.id,
                        parameter=param,
                        value=val,
                        recorded_at=timestamp
                    ))

                    # If this is the 'now' timestamp, update the station's current values
                    if hour == 0:
                        if param == WaterParameter.PH: station.ph = val
                        if param == WaterParameter.TURBIDITY: station.turbidity = val
                        if param == WaterParameter.DISSOLVED_OXYGEN: station.dissolved_oxygen = val
                        if param == WaterParameter.TEMPERATURE: station.temperature = val
                        if param == WaterParameter.LEAD: station.lead = val
                        if param == WaterParameter.ARSENIC: station.arsenic = val
            
            # Simple WQI calculation for demo
            station.wqi = random.randint(45, 95)
            station.status = "safe" if station.wqi > 70 else ("warning" if station.wqi > 50 else "critical")
            station.last_transmission = now
            db.add(station)
        
        db.commit()
        print("Seeding completed successfully with updated station telemetry.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
