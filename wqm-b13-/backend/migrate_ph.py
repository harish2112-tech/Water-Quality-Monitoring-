
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            print("Adding 'ph' column to 'water_stations' table...")
            conn.execute(text("ALTER TABLE water_stations ADD COLUMN ph FLOAT;"))
            conn.commit()
            print("SUCCESS: 'ph' column added.")
    except Exception as e:
        print(f"MIGRATION ERROR: {e}")

if __name__ == "__main__":
    migrate()
