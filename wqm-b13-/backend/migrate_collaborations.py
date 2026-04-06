"""
Migration script: Fix collaborations table schema in PostgreSQL.
Adds missing columns if they don't exist.
"""
from app.core.database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        # Check existing columns
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'collaborations'
        """))
        existing_cols = {row[0] for row in result}
        print(f"Existing columns: {existing_cols}")

        # Collaborations table might exist from an old schema - drop and recreate
        # OR add missing columns safely
        missing = []

        if 'ngo_user_id' not in existing_cols:
            missing.append("ADD COLUMN ngo_user_id INTEGER REFERENCES users(id)")
        if 'station_id' not in existing_cols:
            missing.append("ADD COLUMN station_id INTEGER REFERENCES water_stations(id)")
        if 'project_name' not in existing_cols:
            missing.append("ADD COLUMN project_name VARCHAR(120) NOT NULL DEFAULT ''")
        if 'ngo_name' not in existing_cols:
            missing.append("ADD COLUMN ngo_name VARCHAR NOT NULL DEFAULT ''")
        if 'contact_email' not in existing_cols:
            missing.append("ADD COLUMN contact_email VARCHAR NOT NULL DEFAULT ''")
        if 'status' not in existing_cols:
            missing.append("ADD COLUMN status VARCHAR DEFAULT 'active'")
        if 'created_at' not in existing_cols:
            missing.append("ADD COLUMN created_at TIMESTAMP DEFAULT NOW()")

        if missing:
            alter_sql = f"ALTER TABLE collaborations {', '.join(missing)}"
            print(f"Running: {alter_sql}")
            conn.execute(text(alter_sql))
            conn.commit()
            print("Migration completed successfully!")
        else:
            print("All columns already exist. Checking for schema mismatch...")
            # If table exists but is completely wrong schema, recreate it
            print(f"Current columns: {existing_cols}")

if __name__ == "__main__":
    run_migration()
