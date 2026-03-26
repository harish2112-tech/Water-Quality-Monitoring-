import httpx
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.station import WaterStation
from app.models.reading import WaterReading, WaterParameter
from app.services.report_service import _is_safe

logger = logging.getLogger(__name__)

# USGS Parameter Codes
# 00400: pH
# 00300: Dissolved Oxygen (mg/L)
# 00010: Temperature (C)
# 00095: Specific Conductance (uS/cm)
# 00630: Nitrate + Nitrite (mg/L)
# 00065: Gage height (ft) - for context
USGS_PARAM_MAP = {
    "00400": WaterParameter.PH,
    "00300": WaterParameter.DISSOLVED_OXYGEN,
    "00010": WaterParameter.TEMPERATURE,
    "00095": WaterParameter.CONDUCTIVITY,
    "00630": WaterParameter.NITRATES,
}

async def fetch_usgs_data(site_id: str):
    """
    Fetch the latest measurements from USGS NWIS API.
    """
    params = ",".join(USGS_PARAM_MAP.keys())
    url = f"https://waterservices.usgs.gov/nwis/iv/?format=json&sites={site_id}&parameterCd={params}&siteStatus=all"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching USGS data for site {site_id}: {e}")
            return None

async def sync_station_with_usgs(db: Session, station_id: int):
    """
    Sync a specific station with USGS real-time data.
    """
    station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
    if not station or not station.external_site_id:
        return None
    
    data = await fetch_usgs_data(station.external_site_id)
    if not data or "value" not in data:
        return None
    
    time_series = data["value"].get("timeSeries", [])
    if not time_series:
        return None

    new_readings_count = 0
    
    for ts in time_series:
        variable_code = ts["variable"]["variableCode"][0]["value"]
        internal_param = USGS_PARAM_MAP.get(variable_code)
        
        if not internal_param:
            continue
            
        values = ts.get("values", [])
        if not values or not values[0].get("value"):
            continue
            
        latest_val_entry = values[0]["value"][-1] # Get latest point
        value = float(latest_val_entry["value"])
        timestamp_str = latest_val_entry["dateTime"]
        # USGS format: 2026-03-26T10:15:00.000-04:00
        timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))

        # Check if we already have this specific measurement (simplified check by timestamp and parameter)
        existing = db.query(WaterReading).filter(
            WaterReading.station_id == station_id,
            WaterReading.parameter == internal_param,
            WaterReading.recorded_at == timestamp
        ).first()

        if not existing:
            new_reading = WaterReading(
                station_id=station_id,
                parameter=internal_param,
                value=value,
                recorded_at=timestamp,
                is_safe=_is_safe(internal_param, value),
                data_source="usgs"
            )
            db.add(new_reading)
            new_readings_count += 1
            
            # Update the station's current snapshot value if it's the latest
            if internal_param == WaterParameter.PH:
                station.ph = value
            elif internal_param == WaterParameter.DISSOLVED_OXYGEN:
                station.dissolved_oxygen = value
            elif internal_param == WaterParameter.TEMPERATURE:
                station.temperature = value

    if new_readings_count > 0:
        station.data_source = "usgs"
        station.last_transmission = datetime.utcnow()
        db.commit()
        db.refresh(station)
        
    return {"synced": True, "new_readings": new_readings_count, "station": station.name}
