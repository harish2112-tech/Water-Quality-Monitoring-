import sys
import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.station import WaterStation
from app.models.reading import WaterReading, WaterParameter

def seed_ngo_readings():
    db: Session = SessionLocal()
    
    try:
        # Get all stations containing "NGO"
        ngo_stations = db.query(WaterStation).filter(WaterStation.managed_by.ilike("%NGO%")).all()
        
        if not ngo_stations:
            print("No NGO stations found")
            return
            
        now = datetime.utcnow()
        hours_back = 24
        
        parameters = [
            WaterParameter.PH,
            WaterParameter.TURBIDITY,
            WaterParameter.DISSOLVED_OXYGEN,
            WaterParameter.TEMPERATURE,
            WaterParameter.LEAD,
            WaterParameter.ARSENIC
        ]
        
        count = 0
        for station in ngo_stations:
            # Generate 24 hours of data
            for i in range(hours_back):
                recorded_time = now - timedelta(hours=hours_back - i)
                
                # Base values from the station or defaults
                base_ph = station.ph if station.ph else 7.0
                base_turbidity = station.turbidity if station.turbidity else 10.0
                base_do = station.dissolved_oxygen if station.dissolved_oxygen else 6.0
                base_temp = station.temperature if station.temperature else 25.0
                base_lead = station.lead if station.lead else 0.01
                base_arsenic = station.arsenic if station.arsenic else 0.005
                
                for param in parameters:
                    value = 0
                    is_safe = True
                    
                    if param == WaterParameter.PH:
                        value = base_ph + random.uniform(-0.5, 0.5)
                        is_safe = 6.5 <= value <= 8.5
                    elif param == WaterParameter.TURBIDITY:
                        value = base_turbidity + random.uniform(-5.0, 5.0)
                        is_safe = value <= 5.0
                    elif param == WaterParameter.DISSOLVED_OXYGEN:
                        value = base_do + random.uniform(-1.0, 1.0)
                        is_safe = value >= 6.0
                    elif param == WaterParameter.TEMPERATURE:
                        value = base_temp + random.uniform(-2.0, 2.0)
                        is_safe = value <= 30.0
                    elif param == WaterParameter.LEAD:
                        value = max(0, base_lead + random.uniform(-0.005, 0.005))
                        is_safe = value <= 0.015
                    elif param == WaterParameter.ARSENIC:
                        value = max(0, base_arsenic + random.uniform(-0.002, 0.002))
                        is_safe = value <= 0.010

                    reading = WaterReading(
                        station_id=station.id,
                        parameter=param.value,
                        value=round(value, 3),
                        recorded_at=recorded_time,
                        is_safe=is_safe
                    )
                    db.add(reading)
                    count += 1
        
        db.commit()
        print(f"Successfully seeded {count} historical readings for {len(ngo_stations)} NGO stations.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding readings: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_ngo_readings()
