import sys
import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.station import WaterStation

def seed_ngo_stations():
    db: Session = SessionLocal()
    
    # Sample NGO stations
    ngo_stations = [
        {
            "name": "Save The Ganges Foundation - Varanasi Site",
            "river": "Ganges",
            "city": "Varanasi",
            "latitude": 25.3176,
            "longitude": 83.0062,
            "managed_by": "NGO - Clean Water Trust",
            "status": "warning",
            "wqi": 65,
            "ph": 7.8,
            "turbidity": 45.2,
            "dissolved_oxygen": 6.1
        },
        {
            "name": "Clean Yamuna Initiative - Agra",
            "river": "Yamuna",
            "city": "Agra",
            "latitude": 27.1767,
            "longitude": 78.0081,
            "managed_by": "NGO - Green Earth",
            "status": "critical",
            "wqi": 40,
            "ph": 8.2,
            "turbidity": 80.5,
            "dissolved_oxygen": 4.2
        },
        {
            "name": "Narmada Conservation Group - Hoshangabad",
            "river": "Narmada",
            "city": "Hoshangabad",
            "latitude": 22.7562,
            "longitude": 77.7289,
            "managed_by": "NGO - Eco Save Narmada",
            "status": "safe",
            "wqi": 88,
            "ph": 7.2,
            "turbidity": 12.4,
            "dissolved_oxygen": 8.5
        },
        {
            "name": "Brahmaputra Lifeline - Guwahati",
            "river": "Brahmaputra",
            "city": "Guwahati",
            "latitude": 26.1445,
            "longitude": 91.7362,
            "managed_by": "NGO - Brahmaputra Relief",
            "status": "warning",
            "wqi": 70,
            "ph": 7.5,
            "turbidity": 55.0,
            "dissolved_oxygen": 7.0
        },
        {
            "name": "Cauvery River Watch - Tiruchirappalli",
            "river": "Cauvery",
            "city": "Tiruchirappalli",
            "latitude": 10.7905,
            "longitude": 78.7047,
            "managed_by": "NGO - Cauvery Trust",
            "status": "safe",
            "wqi": 92,
            "ph": 7.1,
            "turbidity": 8.5,
            "dissolved_oxygen": 9.2
        }
    ]

    try:
        count = 0
        for station_data in ngo_stations:
            # Check if exists by name
            existing = db.query(WaterStation).filter_by(name=station_data["name"]).first()
            if not existing:
                station = WaterStation(**station_data)
                db.add(station)
                count += 1
        
        db.commit()
        print(f"Successfully seeded {count} NGO stations.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding stations: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_ngo_stations()
