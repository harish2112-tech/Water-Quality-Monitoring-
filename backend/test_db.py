"""
Simple script to test database connection and create tables.
Run this to verify your database setup is working.
"""
import sys
sys.path.insert(0, 'D:\Job\wqm-b13\backend')

from app.core.database import engine, Base
from sqlalchemy import text

def test_connection():
    """Test if we can connect to the database."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("[SUCCESS] Database connection successful!")
            return True
    except Exception as e:
        print(f"[ERROR] Database connection failed: {e}")
        print("\nPossible fixes:")
        print("1. Make sure PostgreSQL is running")
        print("2. Verify password in .env file")
        print("3. Check if database 'water_db' exists:")
        print("   psql -U postgres")
        print("   CREATE DATABASE water_db;")
        return False

def create_all_tables():
    """Create all database tables."""
    try:
        # Import all models to register them
        from app.models.user import User
        from app.models.report import Report
        from app.models.station import WaterStation
        from app.models.reading import WaterReading
        from app.models.alert import Alert
        # from app.models.collaboration import Collaboration
        
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] All database tables created successfully!")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to create tables: {e}")
        return False

if __name__ == "__main__":
    print("Testing Water Quality Monitor Database Setup\n")
    
    if test_connection():
        print("\nCreating database tables...")
        create_all_tables()
        print("\nSetup complete! You can now run the backend.")
    else:
        print("\nPlease fix database connection issues first.")
