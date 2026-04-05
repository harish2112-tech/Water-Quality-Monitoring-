from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:admin143@localhost:5432/water_db')
with engine.connect() as conn:
    try:
        res = conn.execute(text("SELECT 1"))
        print(f"Connection OK: {res.first()}")
        # Check if column exists
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='collaborations'"))
        cols = [r[0] for r in res.all()]
        print(f"Current columns: {cols}")
    except Exception as e:
        print(f"Error: {e}")
