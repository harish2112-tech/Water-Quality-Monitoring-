from app.core.database import SessionLocal, engine
from app.models.settings import SystemThreshold, UserPreference, Base
from app.models.user import User # Import User to ensure it's in the metadata

def seed_thresholds():
    # This will create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # List of initial thresholds based on WHO standards
    thresholds = [
        {"parameter": "ph_low", "warning_value": 6.8, "critical_value": 6.5, "unit": "pH"},
        {"parameter": "ph_high", "warning_value": 8.2, "critical_value": 8.5, "unit": "pH"},
        {"parameter": "turbidity", "warning_value": 4.0, "critical_value": 5.0, "unit": "NTU"},
        {"parameter": "do", "warning_value": 7.0, "critical_value": 6.0, "unit": "mg/L"}, # Lower is worse
        {"parameter": "lead", "warning_value": 0.008, "critical_value": 0.01, "unit": "mg/L"},
        {"parameter": "arsenic", "warning_value": 0.008, "critical_value": 0.01, "unit": "mg/L"}
    ]

    for t in thresholds:
        existing = db.query(SystemThreshold).filter(SystemThreshold.parameter == t["parameter"]).first()
        if not existing:
            new_threshold = SystemThreshold(**t)
            db.add(new_threshold)
            print(f"Seeding threshold: {t['parameter']}")
    
    db.commit()
    db.close()
    print("Threshold seeding completed.")

if __name__ == "__main__":
    seed_thresholds()
