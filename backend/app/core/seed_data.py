
import os
import sys
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import math

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models.station import WaterStation

def seed_stations():
    db = SessionLocal()
    try:
        # Check if stations exist to avoid massive duplicates on re-run
        has_stations = db.query(WaterStation).first() is not None
        
        stations_data = [
            # --- INDIA AUTHORITY STATIONS ---
            # --- INDIA STATIONS ---
            # Ganga River
            {"name": "Ganga – Rishikesh", "river": "Ganga", "city": "Rishikesh", "lat": 30.0869, "lng": 78.2676, "country": "India"},
            {"name": "Ganga – Haridwar", "river": "Ganga", "city": "Haridwar", "lat": 29.9457, "lng": 78.1642, "country": "India"},
            {"name": "Ganga – Kanpur", "river": "Ganga", "city": "Kanpur", "lat": 26.4499, "lng": 80.3319, "country": "India"},
            {"name": "Ganga – Prayagraj", "river": "Ganga", "city": "Prayagraj", "lat": 25.4358, "lng": 81.8463, "country": "India"},
            {"name": "Ganga – Varanasi", "river": "Ganga", "city": "Varanasi", "lat": 25.3176, "lng": 82.9739, "country": "India"},
            {"name": "Ganga – Patna", "river": "Ganga", "city": "Patna", "lat": 25.5941, "lng": 85.1376, "country": "India"},
            {"name": "Ganga – Farakka", "river": "Ganga", "city": "Farakka", "lat": 24.8118, "lng": 87.8931, "country": "India"},
            
            # Yamuna River
            {"name": "Yamuna – Delhi (ITO)", "river": "Yamuna", "city": "New Delhi", "lat": 28.6272, "lng": 77.2472, "country": "India"},
            {"name": "Yamuna – Agra", "river": "Yamuna", "city": "Agra", "lat": 27.1767, "lng": 78.0081, "country": "India"},
            {"name": "Yamuna – Mathura", "river": "Yamuna", "city": "Mathura", "lat": 27.4924, "lng": 77.6737, "country": "India"},
            {"name": "Yamuna – Etawah", "river": "Yamuna", "city": "Etawah", "lat": 26.7725, "lng": 79.0232, "country": "India"},
            
            # South India Rivers
            {"name": "Godavari – Rajahmundry", "river": "Godavari", "city": "Rajahmundry", "lat": 17.0005, "lng": 81.7835, "country": "India"},
            {"name": "Godavari – Nashik", "river": "Godavari", "city": "Nashik", "lat": 19.9975, "lng": 73.7898, "country": "India"},
            {"name": "Krishna – Vijayawada", "river": "Krishna", "city": "Vijayawada", "lat": 16.5062, "lng": 80.6480, "country": "India"},
            {"name": "Cauvery – Srirangapatna", "river": "Cauvery", "city": "Srirangapatna", "lat": 12.4243, "lng": 76.6908, "country": "India"},
            {"name": "Cauvery – Erode", "river": "Cauvery", "city": "Erode", "lat": 11.3410, "lng": 77.7172, "country": "India"},
            {"name": "Periyar – Aluva", "river": "Periyar", "city": "Aluva", "lat": 10.1076, "lng": 76.3512, "country": "India"},
            
            # West India Rivers
            {"name": "Narmada – Jabalpur", "river": "Narmada", "city": "Jabalpur", "lat": 23.1815, "lng": 79.9864, "country": "India"},
            {"name": "Narmada – Bharuch", "river": "Narmada", "city": "Bharuch", "lat": 21.7143, "lng": 72.9959, "country": "India"},
            {"name": "Sabarmati – Ahmedabad", "river": "Sabarmati", "city": "Ahmedabad", "lat": 23.0225, "lng": 72.5714, "country": "India"},
            
            # East & Northeast India
            {"name": "Brahmaputra – Guwahati", "river": "Brahmaputra", "city": "Guwahati", "lat": 26.1445, "lng": 91.7362, "country": "India"},
            {"name": "Brahmaputra – Dibrugarh", "river": "Brahmaputra", "city": "Dibrugarh", "lat": 27.4728, "lng": 94.9120, "country": "India"},
            {"name": "Teesta – Siliguri", "river": "Teesta", "city": "Siliguri", "lat": 26.7271, "lng": 88.3953, "country": "India"},
            {"name": "Hooghly – Kolkata", "river": "Hooghly", "city": "Kolkata", "lat": 22.5726, "lng": 88.3639, "country": "India"},
            {"name": "Mahanadi – Cuttack", "river": "Mahanadi", "city": "Cuttack", "lat": 20.4625, "lng": 85.8830, "country": "India"},
            
            # Lakes
            {"name": "Dal Lake – Srinagar", "river": "N/A", "city": "Srinagar", "lat": 34.0837, "lng": 74.7973, "country": "India"},
            {"name": "Chilika Lake – Rambha", "river": "N/A", "city": "Rambha", "lat": 19.5218, "lng": 85.1054, "country": "India"},
            {"name": "Loktak Lake – Moirang", "river": "N/A", "city": "Moirang", "lat": 24.5000, "lng": 93.7667, "country": "India"},
            {"name": "Vembanad Lake – Kochi", "river": "N/A", "city": "Kochi", "lat": 9.9312, "lng": 76.2673, "country": "India"},
            {"name": "Pushkar Lake – Ajmer", "river": "N/A", "city": "Pushkar", "lat": 26.4891, "lng": 74.5511, "country": "India"},
            
            # Additional Indian Stations
            {"name": "Tapti – Surat", "river": "Tapti", "city": "Surat", "lat": 21.1702, "lng": 72.8311, "country": "India"},
            {"name": "Kshipra – Ujjain", "river": "Kshipra", "city": "Ujjain", "lat": 23.1760, "lng": 75.7885, "country": "India"},
            {"name": "Musi – Hyderabad", "river": "Musi", "city": "Hyderabad", "lat": 17.3850, "lng": 78.4867, "country": "India"},
            {"name": "Vaigai – Madurai", "river": "Vaigai", "city": "Madurai", "lat": 9.9252, "lng": 78.1198, "country": "India"},
            {"name": "Gomti – Lucknow", "river": "Gomti", "city": "Lucknow", "lat": 26.8467, "lng": 80.9462, "country": "India"},
            {"name": "Pennar – Nellore", "river": "Pennar", "city": "Nellore", "lat": 14.4426, "lng": 79.9865, "country": "India"},
            {"name": "Indravati – Jagdalpur", "river": "Indravati", "city": "Jagdalpur", "lat": 19.0700, "lng": 82.0300, "country": "India"},
            {"name": "Beas – Mandi", "river": "Beas", "city": "Mandi", "lat": 31.7087, "lng": 76.9320, "country": "India"},
            {"name": "Sutlej – Ludhiana", "river": "Sutlej", "city": "Ludhiana", "lat": 30.9010, "lng": 75.8573, "country": "India"},
            {"name": "Betwa – Vidisha", "river": "Betwa", "city": "Vidisha", "lat": 23.5239, "lng": 77.8133, "country": "India"},
            {"name": "Chambal – Kota", "river": "Chambal", "city": "Kota", "lat": 25.2138, "lng": 75.8648, "country": "India"},
            {"name": "Jhelum – Baramulla", "river": "Jhelum", "city": "Baramulla", "lat": 34.2000, "lng": 74.3400, "country": "India"},
            {"name": "Mandovi – Panaji", "river": "Mandovi", "city": "Panaji", "lat": 15.4909, "lng": 73.8278, "country": "India"},
            
            # --- NEW REAL-WORLD INDIA STATIONS ---
            {"name": "Hindon – Ghaziabad", "river": "Hindon", "city": "Ghaziabad", "lat": 28.6692, "lng": 77.4538, "country": "India", "force_status": "critical"},
            {"name": "Periyar – Eloor", "river": "Periyar", "city": "Eloor", "lat": 10.0763, "lng": 76.3005, "country": "India", "force_status": "warning"},
            {"name": "Damodar – Dhanbad", "river": "Damodar", "city": "Dhanbad", "lat": 23.7957, "lng": 86.4304, "country": "India", "force_status": "warning"},
            {"name": "Tungabhadra – Hosapete", "river": "Tungabhadra", "city": "Hosapete", "lat": 15.2689, "lng": 76.3909, "country": "India", "force_status": "safe"},
            {"name": "Ganga – Munger", "river": "Ganga", "city": "Munger", "lat": 25.3748, "lng": 86.4735, "country": "India"},
            {"name": "Ganga – Bhagalpur", "river": "Ganga", "city": "Bhagalpur", "lat": 25.2425, "lng": 87.0135, "country": "India"},

            # --- USA STATIONS ---
            {"name": "Hudson River Station", "river": "Hudson River", "city": "New York", "lat": 40.7128, "lng": -74.0060, "country": "USA"},
            {"name": "Mississippi River Station", "river": "Mississippi River", "city": "St Louis", "lat": 38.6270, "lng": -90.1994, "country": "USA"},
            {"name": "Lake Michigan Station", "river": "Lake Michigan", "city": "Chicago", "lat": 41.8781, "lng": -87.6298, "country": "USA", "force_safe": True},
            {"name": "Colorado River Station", "river": "Colorado River", "city": "Arizona", "lat": 36.1070, "lng": -112.1130, "country": "USA"},
            {"name": "Lake Erie Station", "river": "Lake Erie", "city": "Cleveland", "lat": 41.4993, "lng": -81.6944, "country": "USA"},
            {"name": "Sacramento River Station", "river": "Sacramento River", "city": "California", "lat": 38.5816, "lng": -121.4944, "country": "USA"},
            {"name": "Potomac River Station", "river": "Potomac River", "city": "Washington DC", "lat": 38.9072, "lng": -77.0369, "country": "USA"},
            {"name": "Delaware River Station", "river": "Delaware River", "city": "Philadelphia", "lat": 39.9526, "lng": -75.1652, "country": "USA"},
            {"name": "Willamette River Station", "river": "Willamette River", "city": "Oregon", "lat": 45.5152, "lng": -122.6784, "country": "USA"},
            {"name": "Lake Tahoe Station", "river": "Lake Tahoe", "city": "Nevada", "lat": 39.0968, "lng": -120.0324, "country": "USA", "force_safe": True},
            {"name": "Rio Grande Station", "river": "Rio Grande", "city": "New Mexico", "lat": 35.0844, "lng": -106.6504, "country": "USA"},
            {"name": "Ohio River Station", "river": "Ohio River", "city": "Ohio", "lat": 39.1031, "lng": -84.5120, "country": "USA"},
            {"name": "Missouri River Station", "river": "Missouri River", "city": "Missouri", "lat": 39.0997, "lng": -94.5786, "country": "USA"},
            {"name": "Columbia River Station", "river": "Columbia River", "city": "Washington", "lat": 45.6278, "lng": -122.6739, "country": "USA"},
            {"name": "Tennessee River Station", "river": "Tennessee River", "city": "Tennessee", "lat": 35.0456, "lng": -85.3097, "country": "USA"},
            {"name": "Chattahoochee River Station", "river": "Chattahoochee River", "city": "Georgia", "lat": 33.7490, "lng": -84.3880, "country": "USA"},
            {"name": "Charles River Station", "river": "Charles River", "city": "Massachusetts", "lat": 42.3601, "lng": -71.0589, "country": "USA"},
            {"name": "Snake River Station", "river": "Snake River", "city": "Idaho", "lat": 43.6150, "lng": -116.2023, "country": "USA"},
            {"name": "Arkansas River Station", "river": "Arkansas River", "city": "Arkansas", "lat": 34.7465, "lng": -92.2896, "country": "USA"},
            {"name": "Susquehanna River Station", "river": "Susquehanna River", "city": "Pennsylvania", "lat": 40.2732, "lng": -76.8867, "country": "USA"},
            
            # --- INTERNATIONAL STATIONS ---
            {"name": "Thames – London", "river": "Thames", "city": "London", "lat": 51.5074, "lng": -0.1278, "country": "UK", "force_status": "safe"},
            {"name": "Seine – Paris", "river": "Seine", "city": "Paris", "lat": 48.8566, "lng": 2.3522, "country": "France", "force_status": "warning"},
            {"name": "Rhine – Cologne", "river": "Rhine", "city": "Cologne", "lat": 50.9375, "lng": 6.9603, "country": "Germany", "force_status": "safe"},
            {"name": "Amazon – Manaus", "river": "Amazon", "city": "Manaus", "lat": -3.1190, "lng": -60.0217, "country": "Brazil", "force_status": "safe"},
            {"name": "Nile – Cairo", "river": "Nile", "city": "Cairo", "lat": 30.0444, "lng": 31.2357, "country": "Egypt", "force_status": "warning"},
            {"name": "Yangtze – Shanghai", "river": "Yangtze", "city": "Shanghai", "lat": 31.2304, "lng": 121.4737, "country": "China", "force_status": "critical"},
            {"name": "Murray – Adelaide", "river": "Murray", "city": "Adelaide", "lat": -34.9285, "lng": 138.6007, "country": "Australia", "force_status": "safe"},
            {"name": "Danube – Budapest", "river": "Danube", "city": "Budapest", "lat": 47.4979, "lng": 19.0402, "country": "Hungary", "force_status": "safe"},
            {"name": "Mekong – Phnom Penh", "river": "Mekong", "city": "Phnom Penh", "lat": 11.5564, "lng": 104.9282, "country": "Cambodia"},
            {"name": "Volga – Volgograd", "river": "Volga", "city": "Volgograd", "lat": 48.7080, "lng": 44.5133, "country": "Russia"},
            
            # --- NGO MANAGED STATIONS ---
            {"name": "Bellandur Lake Watch", "river": "N/A", "city": "Bangalore", "lat": 12.9304, "lng": 77.6784, "country": "India", "force_status": "critical", "managed_by": "NGO - Bangalore Eco Watch"},
            {"name": "Cooum Watch – Chennai", "river": "Cooum", "city": "Chennai", "lat": 13.0827, "lng": 80.2707, "country": "India", "force_status": "critical", "managed_by": "NGO - City Water Watch"},
            {"name": "Ulhas River Watch", "river": "Ulhas", "city": "Kalyan", "lat": 19.2435, "lng": 73.1312, "country": "India", "force_status": "warning", "managed_by": "NGO - River Protectors"},
            {"name": "Musi Clean-up Unit", "river": "Musi", "city": "Hyderabad", "lat": 17.3850, "lng": 78.4867, "country": "India", "force_status": "critical", "managed_by": "NGO - Musi Revitalization"},
            {"name": "Save Powai Lake", "river": "N/A", "city": "Mumbai", "lat": 19.1256, "lng": 72.9031, "country": "India", "force_status": "warning", "managed_by": "NGO - Lake Warriors"},
            {"name": "Jal Shakti – Kanpur", "river": "Ganga", "city": "Kanpur", "lat": 26.4499, "lng": 80.3319, "country": "India", "force_status": "warning", "managed_by": "NGO - Clean Water Trust"},
            {"name": "Save The Ganges – Varanasi", "river": "Ganga", "city": "Varanasi", "lat": 25.3176, "lng": 83.0062, "country": "India", "force_status": "warning", "managed_by": "NGO - Clean Water Trust"},
            
            # --- GLOBAL SAFE STATIONS ---
            {"name": "Lake Superior", "river": "Lake Superior", "city": "Ontario/Michigan", "lat": 47.7231, "lng": -86.9407, "country": "USA/Canada", "force_safe": True},
            {"name": "Lake Ontario", "river": "Lake Ontario", "city": "Toronto", "lat": 43.6532, "lng": -79.3832, "country": "Canada", "force_safe": True},
            {"name": "Lake Geneva", "river": "Lake Geneva", "city": "Geneva", "lat": 46.2044, "lng": 6.1432, "country": "Switzerland", "force_safe": True},
            {"name": "Lake Wakatipu", "river": "Lake Wakatipu", "city": "Queenstown", "lat": -45.0312, "lng": 168.6626, "country": "New Zealand", "force_safe": True},
            {"name": "Lake Baikal", "river": "Lake Baikal", "city": "Siberia", "lat": 53.5587, "lng": 108.1650, "country": "Russia", "force_safe": True},
            {"name": "Lake Louise", "river": "Lake Louise", "city": "Alberta", "lat": 51.4254, "lng": -116.1773, "country": "Canada", "force_safe": True},
            {"name": "Lake Bled", "river": "Lake Bled", "city": "Bled", "lat": 46.3625, "lng": 14.0938, "country": "Slovenia", "force_safe": True},
            {"name": "Lake Rotorua", "river": "Lake Rotorua", "city": "Rotorua", "lat": -38.0833, "lng": 176.2500, "country": "New Zealand", "force_safe": True},
            {"name": "Crater Lake", "river": "Crater Lake", "city": "Oregon", "lat": 42.9468, "lng": -122.1105, "country": "USA", "force_safe": True},
            {"name": "Plitvice Lakes", "river": "Plitvice", "city": "Plitvice", "lat": 44.8654, "lng": 15.5820, "country": "Croatia", "force_safe": True},
            {"name": "Lake Wanaka", "river": "Lake Wanaka", "city": "Wanaka", "lat": -44.5000, "lng": 169.1500, "country": "New Zealand", "force_safe": True},
            {"name": "Loch Lomond", "river": "Loch Lomond", "city": "Scotland", "lat": 56.0833, "lng": -4.6333, "country": "UK", "force_safe": True},
            {"name": "Lake Como", "river": "Lake Como", "city": "Lombardy", "lat": 46.0160, "lng": 9.2572, "country": "Italy", "force_safe": True},
            {"name": "Peyto Lake", "river": "Peyto Lake", "city": "Alberta", "lat": 51.7266, "lng": -116.5204, "country": "Canada", "force_safe": True},
            {"name": "Lake Pehoé", "river": "Lake Pehoé", "city": "Patagonia", "lat": -51.0967, "lng": -73.0033, "country": "Chile", "force_safe": True},
            {"name": "Lake Tekapo", "river": "Lake Tekapo", "city": "Tekapo", "lat": -43.8833, "lng": 170.5167, "country": "New Zealand", "force_safe": True},
            {"name": "Lake Pukaki", "river": "Lake Pukaki", "city": "Pukaki", "lat": -44.1333, "lng": 170.1500, "country": "New Zealand", "force_safe": True},
            {"name": "Moraine Lake", "river": "Moraine Lake", "city": "Alberta", "lat": 51.3217, "lng": -116.1860, "country": "Canada", "force_safe": True},
        ]

        from app.models.reading import WaterReading, WaterParameter

        # Balance stations: ~50% Safe, 33% Warning, 17% Critical
        total_stations = len(stations_data)
        target_safe = max(2, total_stations // 2)
        target_warning = max(1, int(total_stations * 0.33))
        target_critical = total_stations - target_safe - target_warning
        
        # Build status array
        # First allocate "safe" to all force_safe
        forced_safe_count = sum(1 for s in stations_data if s.get("force_safe"))
        remaining_safe = max(0, target_safe - forced_safe_count)
        
        flexible_statuses = ["safe"] * remaining_safe + ["warning"] * target_warning + ["critical"] * target_critical
        random.shuffle(flexible_statuses)

        status_pool = iter(flexible_statuses)

        def get_realistic_val(base, hour, variance_factor=0.05):
            """Generates a value with a natural daily sinusoidal oscillation + small noise."""
            # Use hour to create a wave (period 24h)
            wave = 0.2 * math.sin(hour * 2 * math.pi / 24)
            noise = random.uniform(-variance_factor, variance_factor)
            return base * (1 + wave + noise)

        for s in stations_data:
            # Check if name exists
            existing = db.query(WaterStation).filter_by(name=s["name"]).first()
            if existing:
                continue

            if s.get("force_status"):
                assigned_status = s["force_status"]
            elif s.get("force_safe"):
                assigned_status = "safe"
            else:
                assigned_status = next(status_pool, "warning")
            
            # Generate stats conforming to standard
            if assigned_status == "safe":
                wqi = random.randint(75, 95)
                ph = round(random.uniform(6.5, 8.0), 2)
                turbidity = round(random.uniform(1.0, 4.5), 2)
                do = round(random.uniform(6.5, 9.0), 2)
            elif assigned_status == "warning":
                wqi = random.randint(45, 69)
                ph = round(random.choice([random.uniform(5.5, 6.4), random.uniform(8.1, 9.0)]), 2)
                turbidity = round(random.uniform(5.0, 8.5), 2)
                do = round(random.uniform(4.0, 5.5), 2)
            else: # critical
                wqi = random.randint(20, 44)
                ph = round(random.choice([random.uniform(4.0, 5.5), random.uniform(8.6, 10.0)]), 2)
                turbidity = round(random.uniform(8.6, 15.0), 2)
                do = round(random.uniform(1.0, 3.9), 2)

            temp = round(random.uniform(18.0, 32.0), 2)
            lead = round(random.uniform(0.001, 0.05), 4)
            arsenic = round(random.uniform(0.001, 0.05), 4)

            station = WaterStation(
                name=s["name"],
                river=s.get("river"),
                city=s.get("city"),
                latitude=s["lat"],
                longitude=s["lng"],
                managed_by=s.get("managed_by", "Water Quality Authority"),
                wqi=wqi,
                ph=ph,
                turbidity=turbidity,
                dissolved_oxygen=do,
                temperature=temp,
                lead=lead,
                arsenic=arsenic,
                status=assigned_status
            )
            db.add(station)
            db.flush() # Get the ID
            
            # Check and generate automated alerts
            from app.services import alert_service
            alert_service.check_and_generate_alerts(db, station)
            
            # Seed 24 hours of historical data for charts
            for h in range(24):
                time_point = datetime.utcnow() - timedelta(hours=23-h)
                hour_of_day = (datetime.utcnow().hour - (23-h)) % 24
                
                # Use the new realistic generator for smoother curves
                r_ph = get_realistic_val(ph, hour_of_day, 0.01)
                r_turb = get_realistic_val(turbidity, hour_of_day, 0.05)
                r_do = get_realistic_val(do, hour_of_day, 0.03)
                r_temp = get_realistic_val(temp, hour_of_day, 0.02)

                params = [
                    (WaterParameter.PH, r_ph),
                    (WaterParameter.TURBIDITY, r_turb),
                    (WaterParameter.DISSOLVED_OXYGEN, r_do),
                    (WaterParameter.TEMPERATURE, r_temp)
                ]
                for p_type, p_val in params:
                    reading = WaterReading(
                        station_id=station.id,
                        parameter=p_type.value if hasattr(p_type, 'value') else p_type,
                        value=round(p_val, 2),
                        recorded_at=time_point,
                        is_safe=True # Simplified for seed
                    )
                    db.add(reading)
        
        db.commit()
        print(f"Successfully seeded {len(stations_data)} stations.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_stations()
