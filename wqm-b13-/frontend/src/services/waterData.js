/**
 * waterData.js
 * Realistic Water Quality Monitoring Service
 * 
 * Provides:
 * - Structured mock data for 40 stations across India
 * - WQI (Water Quality Index) calculation logic
 * - Real-time jitter simulation for sensor data
 */

// Parameters weights for WQI (Total = 1.0)
const WEIGHTS = {
    pH: 0.25,
    turbidity: 0.2,
    dissolvedOxygen: 0.3,
    contaminationLevel: 0.25
};

// Ideal values for parameters
const IDEALS = {
    pH: 7.0,
    turbidity: 0,
    dissolvedOxygen: 9.0,
    contaminationLevel: 0
};

/**
 * Calculates a simplified Water Quality Index (WQI)
 * returns { index: number, status: 'safe'|'warning'|'critical' }
 */
export const calculateWQI = (params) => {
    const { pH, turbidity, dissolvedOxygen, contaminationLevel } = params;

    // Normalize scores (0-100, where 100 is best)
    // pH: closer to 7 is better
    const phScore = 100 - (Math.abs(pH - 7) * 20);

    // Turbidity: lower is better (0 NTU is perfect, 10+ is bad)
    const turbidityScore = Math.max(0, 100 - (turbidity * 10));

    // Dissolved Oxygen: higher is better (9+ mg/L is perfect, <4 is bad)
    const doScore = Math.min(100, (dissolvedOxygen / 9) * 100);

    // Contamination: lower is better (0 mg/L is perfect, 50+ is critical)
    const contScore = Math.max(0, 100 - (contaminationLevel * 2));

    // Weighted Average
    const wqi = (
        (phScore * WEIGHTS.pH) +
        (turbidityScore * WEIGHTS.turbidity) +
        (doScore * WEIGHTS.dissolvedOxygen) +
        (contScore * WEIGHTS.contaminationLevel)
    );

    const finalWqi = Math.max(0, Math.min(100, Math.round(wqi)));

    let status = "safe";
    if (finalWqi < 50) status = "critical";
    else if (finalWqi < 75) status = "warning";

    return { wqi: finalWqi, status };
};

const stationNames = [
    "Yamuna - Delhi Central", "Ganges - Varanasi Ghat", "Godavari - Rajahmundry",
    "Narmada - Jabalpur", "Cauvery - Tiruchirappalli", "Brahmaputra - Guwahati",
    "Krishna - Vijayawada", "Hooghly - Kolkata", "Mahanadi - Cuttack",
    "Sabarmati - Ahmedabad", "Tapi - Surat", "Zuari - Goa",
    "Indus - Leh", "Jhelum - Srinagar", "Periyar - Kochi",
    "Shipra - Ujjain", "Gomti - Lucknow", "Chambal - Kota",
    "Musi - Hyderabad", "Ulhas - Mumbai", "Adyar - Chennai",
    "Vaigai - Madurai", "Tunga - Shimoga", "Netravati - Mangalore",
    "Mandi - Himachal", "Chenab - Jammu", "Sutlej - Ludhiana",
    "Pennar - Nellore", "Mahananda - Siliguri", "Teesta - Jalpaiguri",
    "Damodar - Durgapur", "Rapti - Gorakhpur", "Betwa - Vidisha",
    "Ken - Panna", "Son - Rewa", "Sharavati - Jog Falls",
    "Kali - Karwar", "Bharathapuzha - Palakkad", "Pamba - Sabarimala",
    "Chaliyar - Kozhikode"
];

/**
 * Generates initial realistic stations
 */
export const getInitialStations = () => {
    return stationNames.map((name, i) => {
        // Distribute across India box: lat [10, 30], lng [70, 90]
        const lat = 10 + (Math.random() * 20);
        const lng = 70 + (Math.random() * 20);

        const params = {
            pH: 6.5 + (Math.random() * 2),
            turbidity: Math.random() * 8,
            dissolvedOxygen: 5 + (Math.random() * 4),
            contaminationLevel: Math.random() * 30
        };

        const wqiData = calculateWQI(params);

        return {
            id: i,
            name: name,
            lat,
            lng,
            ...params,
            wqi: wqiData.wqi,
            status: wqiData.status,
            alerts: wqiData.status === "critical" ? 1 : 0,
            reports: Math.floor(Math.random() * 5)
        };
    });
};

/**
 * Simulates a small sensor reading jitter
 */
export const simulateStationUpdate = (station) => {
    const jitter = (val, max) => val + (Math.random() * max - (max / 2));

    const newParams = {
        pH: Math.max(0, Math.min(14, jitter(station.pH, 0.2))),
        turbidity: Math.max(0, jitter(station.turbidity, 0.5)),
        dissolvedOxygen: Math.max(0, jitter(station.dissolvedOxygen, 0.3)),
        contaminationLevel: Math.max(0, jitter(station.contaminationLevel, 2))
    };

    const wqiData = calculateWQI(newParams);

    return {
        ...station,
        ...newParams,
        wqi: wqiData.wqi,
        status: wqiData.status,
        alerts: wqiData.status === "critical" ? station.alerts + 1 : station.alerts
    };
};
