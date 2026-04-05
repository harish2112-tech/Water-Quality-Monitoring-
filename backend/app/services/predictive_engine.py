from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.reading import WaterReading

WHO_THRESHOLDS = {
    "ph_low": 6.5,
    "ph_high": 8.5,
    "turbidity": 4,
    "do": 6,
    "lead": 0.01,
    "arsenic": 0.01
}

def analyse_station(station_id: int, db: Session):
    alerts = []
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    readings = db.query(WaterReading)\
        .filter(WaterReading.station_id == station_id)\
        .filter(WaterReading.recorded_at >= seven_days_ago)\
        .all()

    if len(readings) < 3:
        return alerts

    parameters = ["ph", "turbidity", "do", "lead", "arsenic"]

    for param in parameters:
        #values = [getattr(r, param) for r in readings if getattr(r, param) is not None]
        values = [
              r.value for r in readings
              if r.parameter == param and r.value is not None
        ]

        if len(values) < 3:
            continue

        avg = sum(values) / len(values)
        last3 = values[-3:]

        threshold = WHO_THRESHOLDS.get(param)

        # BREACH rule
        if param == "do":
            breach = all(v < threshold for v in last3)
        elif param == "ph":
            breach = all(v < WHO_THRESHOLDS["ph_low"] or v > WHO_THRESHOLDS["ph_high"] for v in last3)
        else:
            breach = all(v > threshold for v in last3)

        if breach:
            alerts.append({
                "station_id": station_id,
                "parameter": param,
                "rule_triggered": "BREACH",
                "current_avg": avg,
                "threshold": threshold,
                "alert_message": f"{param} exceeded safe levels"
            })
            continue

        # APPROACHING rule
        if param != "ph" and avg > 0.8 * threshold:
            alerts.append({
                "station_id": station_id,
                "parameter": param,
                "rule_triggered": "APPROACHING",
                "current_avg": avg,
                "threshold": threshold,
                "alert_message": f"{param} approaching unsafe levels"
            })

    return alerts