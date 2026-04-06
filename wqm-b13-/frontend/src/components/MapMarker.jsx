import React, { useState, useEffect } from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import StatusBadge from './StatusBadge';
import api from '../services/api';
import { Loader2, Activity } from 'lucide-react';

const createCustomIcon = (status, isNGO) => {
    let color = '#3b82f6'; // Default BLUE
    
    if (isNGO) {
        color = '#2dd4bf'; // NGO TEAL
    } else {
        const statusColors = {
            safe: '#10b981',
            warning: '#f59e0b',
            critical: '#ef4444',
        };
        color = statusColors[status?.toLowerCase()] || '#3b82f6';
    }

    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" style="background-color: ${color}"></div>
        <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const PopupContent = ({ station }) => {
    const navigate = useNavigate();
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReadings = async () => {
            try {
                // Using the specific endpoint requested: GET /api/v1/stations/:id/readings?limit=3
                const response = await api.get(`/api/v1/stations/${station.id}/readings?limit=3`);
                setReadings(response.data || []);
            } catch (err) {
                console.error("Failed to fetch last 3 readings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReadings();
    }, [station.id]);

    return (
        <div className="p-3 min-w-[220px] bg-card-bg text-white rounded-xl space-y-3">
            <div className="border-b border-white/10 pb-2">
                <h3 className="text-sm font-black uppercase tracking-tight">{station.name}</h3>
                <p className="text-[9px] font-bold text-accent-gold uppercase tracking-widest mt-0.5">
                    Managed by: {station.managed_by || 'Government Authority'}
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">Current Status</span>
                    <StatusBadge status={station.status} className="scale-75 origin-right" />
                </div>
            </div>

            <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center">
                    <Activity className="w-3 h-3 mr-1 text-accent-gold" />
                    Last 3 Readings
                </p>
                {loading ? (
                    <div className="flex justify-center py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />
                    </div>
                ) : readings.length === 0 ? (
                    <p className="text-[10px] italic text-primary-gray text-center py-1">No recent data</p>
                ) : (
                    <div className="space-y-1.5">
                        {readings.map((r, i) => (
                            <div key={i} className="flex justify-between text-[10px] border-b border-white/5 pb-1 last:border-0">
                                <span className="text-white/60 font-medium">{r.parameter?.toUpperCase()}</span>
                                <span className="font-bold text-white">{r.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate(`/stations/${station.id}`)}
                className="w-full py-2 bg-accent-gold text-background text-[10px] font-black uppercase rounded-lg hover:opacity-90 transition-all shadow-lg shadow-accent-gold/20 flex items-center justify-center space-x-1"
            >
                <span>Full Analytics</span>
            </button>
        </div>
    );
};

const MapMarker = ({ station }) => {
    // Defensive check
    const hasLat = station?.latitude !== undefined && station?.latitude !== null;
    const hasLng = station?.longitude !== undefined && station?.longitude !== null;
    if (!hasLat || !hasLng) return null;

    const isNGO = station.managed_by?.toLowerCase().includes('ngo');
    const position = [station.latitude, station.longitude];
    const icon = createCustomIcon(station.status, isNGO);

    return (
        <Marker
            position={position}
            icon={icon}
        >
            <Popup className="custom-popup">
                <PopupContent station={station} />
            </Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <p className="font-bold text-xs">{station.name}</p>
            </Tooltip>
        </Marker>
    );
};

export default MapMarker;
