import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    engine = create_engine(DATABASE_URL)
    commands = [
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS river VARCHAR;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS city VARCHAR;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS wqi INTEGER;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS ph FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS turbidity FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS dissolved_oxygen FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS temperature FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS lead FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS arsenic FLOAT;",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'safe';",
        "ALTER TABLE water_stations ADD COLUMN IF NOT EXISTS last_transmission TIMESTAMP;",
    ]
    
    with engine.begin() as conn:
        for cmd in commands:
            try:
                conn.execute(text(cmd))
                print(f"Executed: {cmd.split('ADD COLUMN IF NOT EXISTS ')[-1]}")
            except Exception as e:
                print(f"Error on {cmd}: {e}")
                
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
