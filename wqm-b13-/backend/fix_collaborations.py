"""
Fix collaborations table by dropping and recreating with raw SQL.
"""
from app.core.database import engine
from sqlalchemy import text

def fix():
    with engine.connect() as conn:
        # Show current columns
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name = 'collaborations' ORDER BY ordinal_position"
        ))
        print("Current columns:", [row[0] for row in result])

        # Drop old table
        conn.execute(text("DROP TABLE IF EXISTS collaborations CASCADE"))
        conn.commit()
        print("Old table dropped.")

        # Recreate with correct schema
        conn.execute(text("""
            CREATE TABLE collaborations (
                id SERIAL PRIMARY KEY,
                ngo_user_id INTEGER NOT NULL REFERENCES users(id),
                station_id INTEGER REFERENCES water_stations(id),
                project_name VARCHAR(120) NOT NULL,
                ngo_name VARCHAR NOT NULL,
                contact_email VARCHAR NOT NULL,
                status VARCHAR DEFAULT 'active',
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))
        conn.commit()
        print("New table created successfully!")

        # Verify
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name = 'collaborations' ORDER BY ordinal_position"
        ))
        print("New columns:", [row[0] for row in result])

if __name__ == "__main__":
    fix()
