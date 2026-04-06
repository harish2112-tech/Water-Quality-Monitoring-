import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const StationMap = ({ stations }) => {
    const navigate = useNavigate();
    const center = [20.5937, 78.9629]; // Center of India

    const getMarkerIcon = (status) => {
        let color = '#10b981'; // safe
        if (status === 'warning') color = '#f59e0b';
        else if (status === 'critical') color = '#ef4444';
        else if (status === 'safe') color = '#10b981';

        return new L.DivIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 10px ${color}88;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -7]
        });
    };

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <style>
                {`
                    .leaflet-popup-content-wrapper {
                        background: rgba(15, 23, 42, 0.8) !important;
                        backdrop-filter: blur(12px) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        border-radius: 16px !important;
                        color: white !important;
                        padding: 0 !important;
                    }
                    .leaflet-popup-tip {
                        background: rgba(15, 23, 42, 0.8) !important;
                    }
                    .leaflet-popup-content {
                        margin: 0 !important;
                        width: 240px !important;
                    }
                `}
            </style>
<<<<<<< HEAD
            <MapContainer center={center} zoom={5} minZoom={3} maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%', background: '#0f172a' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    noWrap={true}
=======
            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', background: '#0f172a' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
                />
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.latitude, station.longitude]}
                        icon={getMarkerIcon(station.status)}
                    >
                        <Popup>
                            <div className="p-5 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            station.status === 'critical' ? 'text-critical' : 
                                            station.status === 'warning' ? 'text-warning' : 'text-safe'
                                        }`}>
                                            {station.river || 'Monitoring Station'}
                                        </span>
                                        <ShieldCheck className={`w-4 h-4 ${
                                            station.status === 'critical' ? 'text-critical' : 
                                            station.status === 'warning' ? 'text-warning' : 'text-safe'
                                        }`} />
                                    </div>
                                    <h3 className="font-black text-lg text-white leading-tight uppercase tracking-tight">{station.name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-3">
                                    <div>
                                        <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest mb-0.5">WQI Index</p>
                                        <p className="text-xl font-black text-accent-gold">{station.wqi || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/50 uppercase font-bold tracking-widest mb-0.5">Status</p>
                                        <p className={`text-xs font-bold uppercase ${
                                            station.status === 'critical' ? 'text-critical' : 
                                            station.status === 'warning' ? 'text-warning' : 'text-safe'
                                        }`}>
                                            {station.status || 'unknown'}
                                        </p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate(`/stations/${station.id}`)}
                                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center space-x-2 transition-all group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">View Full Analytics</span>
                                    <ArrowRight className="w-3 h-3 text-accent-gold group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default StationMap;
