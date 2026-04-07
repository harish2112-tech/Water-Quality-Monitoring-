import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load the Vercel-specific environment variables
load_dotenv(".env.vercel")

def verify_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[ERROR] DATABASE_URL not found in .env.vercel")
        return

    print(f"Testing connection to: {db_url.split('@')[-1]}") # Hide credentials
    
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("[SUCCESS] Successfully connected to Neon database!")
            
            # Check for existing tables
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
            tables = [row[0] for row in result]
            if tables:
                print(f"[INFO] Found {len(tables)} tables: {', '.join(tables)}")
            else:
                print("[INFO] No tables found in the public schema.")
                
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        print("\nSuggestions:")
        print("1. Check if your IP is allowed in Neon (usually neon allows all by default if not configured otherwise)")
        print("2. Verify the DATABASE_URL in .env.vercel is correct")
        print("3. Ensure you have 'psycopg2-binary' or similar driver installed")

if __name__ == "__main__":
    verify_connection()
