"""
Test collaboration creation using a real user ID from the database.
"""
import traceback
import sys
from app.core.database import SessionLocal
from app.services import collaboration_service
from app.schemas.collaboration import CollaborationCreate
from sqlalchemy import text

try:
    db = SessionLocal()

    # Get first real user ID from DB
    result = db.execute(text("SELECT id, name, email, role FROM users LIMIT 5"))
    users = result.fetchall()
    print("Users in DB:")
    for u in users:
        print(f"  id={u[0]}, name={u[1]}, email={u[2]}, role={u[3]}")

    if not users:
        print("No users found! Cannot test.")
        sys.exit(1)

    admin_user = next((u for u in users if u[3] in ('admin', 'ngo')), users[0])
    print(f"\nUsing user: id={admin_user[0]}, role={admin_user[3]}")

    data = CollaborationCreate(
        project_name='Nile Basin Preservation V2',
        ngo_name='Global Water Watch Org.',
        contact_email='operations@waterwatch.ngo',
        station_id=None
    )
    result = collaboration_service.create_collaboration(db, data, admin_user[0])
    print(f"\nSUCCESS! Created collaboration ID={result.id}, project={result.project_name}")

except Exception:
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)
