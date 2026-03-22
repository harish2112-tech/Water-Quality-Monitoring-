import React from 'react';
import { Marker, Tooltip, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import StatusBadge from './StatusBadge';

const createCustomIcon = (status) => {
    const colors = {
        safe: '#10b981',
        warning: '#f59e0b',
        critical: '#ef4444',
    };

    const color = colors[status?.toLowerCase()] || '#e6d28c';

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

const MapMarker = ({ station }) => {
    const navigate = useNavigate();

    // Defensive check - allow 0 as a valid coordinate
    const hasLat = station?.latitude !== undefined && station?.latitude !== null;
    const hasLng = station?.longitude !== undefined && station?.longitude !== null;
    if (!hasLat || !hasLng) return null;

    const position = [station.latitude, station.longitude];
    const icon = createCustomIcon(station.status);

    return (
        <Marker
            position={position}
            icon={icon}
        >
            <Popup className="custom-popup">
                <div className="p-3 min-w-[180px] bg-card-bg text-white rounded-xl">
                    <h3 className="text-sm font-bold mb-2 border-b border-white/10 pb-1">{station.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">Status</span>
                        <StatusBadge status={station.status} className="scale-75 origin-right" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">WQI Index</span>
                        <span className="text-sm font-black text-accent-gold">{station.waterQualityIndex}</span>
                    </div>
                    <button
                        onClick={() => navigate(`/stations/${station.id}`)}
                        className="w-full py-2 bg-accent-gold text-background text-[10px] font-black uppercase rounded-lg hover:opacity-90 transition-all shadow-lg shadow-accent-gold/20"
                    >
                        View Details
                    </button>
                </div>
            </Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <p className="font-bold text-xs">{station.name}</p>
            </Tooltip>
        </Marker>
    );
};

export default MapMarker;
