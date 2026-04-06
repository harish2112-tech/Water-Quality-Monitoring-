"""Test if the backend can import properly"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

print("Testing backend imports...\n")

try:
    print("1. Importing config...")
    from app.core.config import settings
    print("   [OK] Config imported successfully")
    print(f"   Database URL: {settings.DATABASE_URL[:50]}...")
except Exception as e:
    print(f"   [ERROR] {e}")
    exit(1)

try:
    print("\n2. Importing database...")
    from app.core.database import engine, get_db
    print("   [OK] Database imported successfully")
except Exception as e:
    print(f"   [ERROR] {e}")
    exit(1)

try:
    print("\n3. Importing models...")
    from app.models.user import User
    from app.models.report import Report
    print("   [OK] Models imported successfully")
except Exception as e:
    print(f"   [ERROR] {e}")
    exit(1)

try:
    print("\n4. Importing schemas...")
    from app.schemas.user import UserCreate
    print("   [OK] Schemas imported successfully")
except Exception as e:
    print(f"   [ERROR] {e}")
    exit(1)

try:
    print("\n5. Importing routes...")
    from app.routes import auth
    print("   [OK] Routes imported successfully")
except Exception as e:
    print(f"   [ERROR] {e}")
    exit(1)

try:
    print("\n6. Importing main app...")
    from main import app
    print("   [OK] Main app imported successfully")
    print(f"\n[SUCCESS] All imports successful! Backend should start without errors.")
except Exception as e:
    print(f"   [ERROR] {e}")
    import traceback
    traceback.print_exc()
    exit(1)
