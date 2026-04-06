import sqlalchemy as sa
from sqlalchemy import text
import os
from dotenv import load_dotenv

# Load settings
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin143@localhost:5432/water_db")

def apply_migration():
    engine = sa.create_engine(DATABASE_URL)
    raw_conn = engine.raw_connection()
    try:
        with raw_conn.cursor() as cur:
            print("Connected to database.")
            
            # Add station_id column to reports table
            print("Adding station_id column to reports table...")
            cur.execute("ALTER TABLE reports ADD COLUMN IF NOT EXISTS station_id INTEGER")
            
            # Add Foreign Key constraint
            print("Adding foreign key constraint for station_id...")
            try:
                # We try to add the constraint, but ignore if it already exists
                cur.execute("ALTER TABLE reports ADD CONSTRAINT fk_report_station FOREIGN KEY (station_id) REFERENCES water_stations(id)")
            except Exception as e:
                print(f"Note: Could not add constraint (it may already exist): {e}")
            
            raw_conn.commit()
            print("Migration applied successfully.")
    except Exception as e:
        print(f"Error applying migration: {e}")
        raw_conn.rollback()
    finally:
        raw_conn.close()

if __name__ == "__main__":
    apply_migration()
