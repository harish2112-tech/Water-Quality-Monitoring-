import os
import random
import math
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

def seed_live_data():
    db = Session(engine)
    try:
        stations = db.query(WaterStation).all()
        if not stations:
            print("No stations found. Please create some stations first.")
            return

        print(f"Seeding ENHANCED live data for {len(stations)} stations...")
        
        params = [
            WaterParameter.PH,
            WaterParameter.TURBIDITY,
            WaterParameter.DISSOLVED_OXYGEN,
            WaterParameter.TEMPERATURE,
            WaterParameter.LEAD,
            WaterParameter.ARSENIC
        ]

        # Clear old readings to keep DB clean for demo if needed
        # db.query(WaterReading).delete()
        # print("Cleared existing readings for fresh start.")

        now = datetime.utcnow()
        count = 0
        for station in stations:
            print(f"Generating unique trend for {station.name} (ID: {station.id})...")
            
            # 1. Create a unique 'fingerprint' for this station so they don't look identical
            # We'll use the ID to offset the base values
            random.seed(station.id * 100) # Deterministic but unique per station
            
            # Base personality of this station
            base_ph = 7.0 + random.uniform(-1.0, 1.0)
            base_turb = 2.0 + random.uniform(0, 5.0)
            base_do = 8.5 + random.uniform(-2.0, 1.0)
            base_temp = 20.0 + random.uniform(-5.0, 10.0)
            base_lead = 0.005 + random.uniform(0, 0.015)
            base_arsenic = 0.002 + random.uniform(0, 0.008)

            # 2. Tracking 'drift' (random walk)
            drifts = {p: 0.0 for p in params}

            for hour in range(72):
                timestamp = now - timedelta(hours=hour)
                
                # Hour-of-day for sinusoidal cycles (0 to 2*PI)
                cycle = 2 * math.pi * (timestamp.hour / 24.0)
                
                # 3. Apply variations
                # Temp follows a sine wave (+/- 3 degrees)
                temp = base_temp + 3.0 * math.sin(cycle - math.pi/2) # Low at 6am, peak at 6pm
                
                # DO is inversely related to temp (typically)
                do = base_do - 1.0 * math.sin(cycle - math.pi/2)
                
                # pH slightly acidic at night, basic during day (+/- 0.2)
                ph = base_ph + 0.3 * math.sin(cycle)
                
                # 4. Add 'Drift' (Random Walk) so it looks natural
                # We update drift for the next iteration (but here we are going backwards in time)
                for p in params:
                    drifts[p] += random.uniform(-0.05, 0.05) if p != WaterParameter.TURBIDITY else random.uniform(-0.1, 0.1)
                
                # Final values with noise
                current_values = {
                    WaterParameter.PH: round(ph + drifts[WaterParameter.PH] + random.uniform(-0.05, 0.05), 2),
                    WaterParameter.TURBIDITY: max(0, round(base_turb + drifts[WaterParameter.TURBIDITY] + random.uniform(-0.5, 1.5), 2)),
                    WaterParameter.DISSOLVED_OXYGEN: round(do + drifts[WaterParameter.DISSOLVED_OXYGEN] + random.uniform(-0.2, 0.2), 2),
                    WaterParameter.TEMPERATURE: round(temp + drifts[WaterParameter.TEMPERATURE] + random.uniform(-0.1, 0.1), 2),
                    WaterParameter.LEAD: max(0, round(base_lead + drifts[WaterParameter.LEAD]/10 + random.uniform(0, 0.002), 4)),
                    WaterParameter.ARSENIC: max(0, round(base_arsenic + drifts[WaterParameter.ARSENIC]/10 + random.uniform(0, 0.001), 4))
                }

                # 5. Occasional Anomalies (Spikes)
                # Randomize seed back to real random for spikes
                random.seed(None)
                if random.random() < 0.02: # 2% chance of an event
                    event_type = random.choice(['pollution', 'rain', 'sensor_error'])
                    if event_type == 'pollution':
                        current_values[WaterParameter.LEAD] *= 5
                    elif event_type == 'rain':
                        current_values[WaterParameter.TURBIDITY] += 15.0
                    elif event_type == 'sensor_error':
                        current_values[WaterParameter.PH] = 0.0

                for param in params:
                    val = current_values[param]
                    
                    create_reading(db, ReadingCreate(
                        station_id=station.id,
                        parameter=param,
                        value=val,
                        recorded_at=timestamp
                    ))
                    count += 1

                    # Update station telemetry for the 'current' view
                    if hour == 0:
                        setattr(station, param.value if hasattr(param, 'value') else str(param), val)
            
            # Simple WQI calculation for demo (weighted avg)
            station.wqi = random.randint(45, 95)
            station.status = "safe" if station.wqi > 70 else ("warning" if station.wqi > 50 else "critical")
            station.last_transmission = now
            db.add(station)
        
        db.commit()
        print(f"\nENHANCED Seeding completed! Generated {count} readings with unique trends.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_live_data()
