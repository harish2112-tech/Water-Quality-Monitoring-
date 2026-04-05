import sqlalchemy as sa
from sqlalchemy import text

# Database URL
DATABASE_URL = "postgresql://postgres:admin143@localhost:5432/water_db"

def apply_migration():
    engine = sa.create_engine(DATABASE_URL)
    # Use raw connection to bypass SQLAlchemy's SQL parsing
    raw_conn = engine.raw_connection()
    try:
        with raw_conn.cursor() as cur:
            print("Connected to database via raw connection.")
            
            # 1. Update collaborations table structure
            print("Updating collaborations table structure...")
            cur.execute("ALTER TABLE collaborations ADD COLUMN IF NOT EXISTS ngo_user_id INTEGER")
            cur.execute("UPDATE collaborations SET ngo_user_id = 2 WHERE ngo_user_id IS NULL")
            cur.execute("ALTER TABLE collaborations ALTER COLUMN ngo_user_id SET NOT NULL")
            
            cur.execute("ALTER TABLE collaborations ADD COLUMN IF NOT EXISTS station_id INTEGER")
            cur.execute("ALTER TABLE collaborations ADD COLUMN IF NOT EXISTS ngo_name VARCHAR DEFAULT 'NGO Name'")
            cur.execute("UPDATE collaborations SET ngo_name = 'NGO Name' WHERE ngo_name IS NULL")
            cur.execute("ALTER TABLE collaborations ALTER COLUMN ngo_name SET NOT NULL")
            
            cur.execute("ALTER TABLE collaborations ADD COLUMN IF NOT EXISTS contact_email VARCHAR DEFAULT 'ngo@example.com'")
            cur.execute("UPDATE collaborations SET contact_email = 'ngo@example.com' WHERE contact_email IS NULL")
            cur.execute("ALTER TABLE collaborations ALTER COLUMN contact_email SET NOT NULL")
            
            # Foreign Keys
            try:
                cur.execute("ALTER TABLE collaborations ADD CONSTRAINT fk_collaboration_ngo_user FOREIGN KEY (ngo_user_id) REFERENCES users(id)")
            except Exception as e: print(f"Skipping FK: {e}")
            try:
                cur.execute("ALTER TABLE collaborations ADD CONSTRAINT fk_collaboration_station FOREIGN KEY (station_id) REFERENCES water_stations(id)")
            except Exception as e: print(f"Skipping FK: {e}")

            # 2. Status Enum
            print("Handling status enum...")
            cur.execute("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'collaborationstatus') THEN CREATE TYPE collaborationstatus AS ENUM ('active', 'inactive'); END IF; END $$;")
            cur.execute("UPDATE collaborations SET status = 'active' WHERE status IS NULL OR status NOT IN ('active', 'inactive')")
            cur.execute("ALTER TABLE collaborations ALTER COLUMN status TYPE collaborationstatus USING status::collaborationstatus")

            # 3. Cleanup
            print("Cleaning up old columns...")
            try:
                cur.execute("ALTER TABLE collaborations DROP COLUMN IF EXISTS ngo_id")
            except Exception: pass
            try:
                cur.execute("ALTER TABLE collaborations DROP COLUMN IF EXISTS updated_at")
            except Exception: pass

            # 4. Index for aggregation (B1-5)
            print("Creating index for aggregation...")
            try:
                cur.execute("CREATE INDEX IF NOT EXISTS idx_station_readings_station_recorded ON water_readings (station_id, recorded_at)")
            except Exception: pass

            raw_conn.commit()
            print("Migration applied successfully via raw connection.")
    except Exception as e:
        print(f"Error applying migration: {e}")
        raw_conn.rollback()
    finally:
        raw_conn.close()

if __name__ == "__main__":
    apply_migration()
