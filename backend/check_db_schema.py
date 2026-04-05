
import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def check_db():
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        columns = [c['name'] for c in inspector.get_columns('water_stations')]
        print(f"Columns in 'water_stations': {columns}")
        if 'ph' in columns:
            print("SUCCESS: 'ph' column exists.")
        else:
            print("ERROR: 'ph' column is missing!")
    except Exception as e:
        print(f"DATABASE ERROR: {e}")

if __name__ == "__main__":
    check_db()
