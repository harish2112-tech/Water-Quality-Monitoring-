from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import traceback

from app.core.database import engine, Base
from app.routes import (
    auth_router,
    user_router,
    stations_router,
    reports_router,
    readings_router,
    alerts_router,
    collaborations_router,
)
from app.dependencies.role_guard import require_role
from app.api import alerts, readings, websocket


# Import all models so SQLAlchemy will create the tables
import app.models.user       # noqa: F401
import app.models.station    # noqa: F401
import app.models.reading    # noqa: F401
import app.models.report     # noqa: F401
import app.models.alert      # noqa: F401
import app.models.collaboration # noqa: F401

load_dotenv()

app = FastAPI(title="Water Quality Monitor API", version="1.0.0")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Create DB tables ----------
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# ---------- Routers ----------
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(user_router, prefix="/api")
app.include_router(stations_router)
app.include_router(stations_router, prefix="/api")
app.include_router(reports_router)
app.include_router(readings_router)
app.include_router(alerts_router)
app.include_router(collaborations_router, dependencies=[Depends(require_role("ngo", "admin"))])

# Versioned API support
app.include_router(reports_router, prefix="/v1")
app.include_router(alerts_router, prefix="/v1")
app.include_router(stations_router, prefix="/v1")

app.include_router(alerts.router, prefix="/api/v1/alerts")
app.include_router(readings.router, prefix="/api/v1")
app.include_router(websocket.router, prefix="/api/v1")

# ---------- Health ----------
@app.get("/")
async def root():
    return {"message": "Water Quality Monitor API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global Exception Handler Caught error: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

