import os
import psycopg2
from dotenv import load_dotenv

# Path to the .env.vercel file in the root directory
# Assuming the script is run from the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env.vercel')

if os.path.exists(dotenv_path):
    print(f"Loading environment from {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    print(f"Warning: {dotenv_path} not found. Using existing environment variables.")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in environment.")
    exit(1)

def fix_schema():
    try:
        # Connect to the database
        print(f"Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cur = conn.cursor()

        # Fix 'reports' table
        print("Checking 'reports' table for 'station_id'...")
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='reports' AND column_name='station_id';")
        if not cur.fetchone():
            print("Adding 'station_id' to 'reports' table...")
            cur.execute("ALTER TABLE reports ADD COLUMN station_id INTEGER;")
            print("Successfully added 'station_id' to 'reports'.")
        else:
            print("'station_id' already exists in 'reports'.")

        # Fix 'alerts' table
        print("Checking 'alerts' table for 'parameter' and 'source'...")
        
        # Check 'parameter'
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='alerts' AND column_name='parameter';")
        if not cur.fetchone():
            print("Adding 'parameter' to 'alerts' table...")
            cur.execute("ALTER TABLE alerts ADD COLUMN parameter VARCHAR(50);")
            print("Successfully added 'parameter' to 'alerts'.")
        else:
            print("'parameter' already exists in 'alerts'.")

        # Check 'source'
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='alerts' AND column_name='source';")
        if not cur.fetchone():
            print("Adding 'source' to 'alerts' table...")
            cur.execute("ALTER TABLE alerts ADD COLUMN source VARCHAR(50);")
            print("Successfully added 'source' to 'alerts'.")
        else:
            print("'source' already exists in 'alerts'.")

        cur.close()
        conn.close()
        print("\nAll database schema fixes completed successfully!")

    except Exception as e:
        print(f"Error fixing database schema: {e}")

if __name__ == "__main__":
    fix_schema()
