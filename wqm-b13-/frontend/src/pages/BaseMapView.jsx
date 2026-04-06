import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MapMarker from '../components/MapMarker';
import { stationService } from '../services/stationService';
import { Locate, Loader2, Layers } from 'lucide-react';
import { useMap } from '../context/MapContext';

const BaseMapView = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNGOStations, setShowNGOStations } = useMap();

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const data = await stationService.getAll();
                console.log("Stations loaded:", data);
                setStations(data || []);
            } catch (error) {
                console.error("Failed to fetch stations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStations();
    }, []);

    const center = stations.length
        ? [stations[0].latitude, stations[0].longitude]
        : [22.5, 82.0];

    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin mb-4" />
                <p className="text-white/60 font-bold uppercase tracking-[0.2em] animate-pulse">Initializing Map Layers...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] space-y-6 relative">
            <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 relative shadow-inner h-full">
                <MapContainer
                    key={stations.length} // Force re-render with new center when data loads
                    center={center}
                    zoom={stations.length > 0 ? 4 : 5}
                    className="h-full w-full"
                    zoomControl={false}
                    minZoom={3}
                    maxBounds={[[-90, -180], [90, 180]]}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        noWrap={true}
                    />
                    <ZoomControl position="bottomleft" />

                    {!loading && stations
                        .filter(s => showNGOStations || (s.managed_by?.toLowerCase() !== 'ngo' && !s.managed_by?.toLowerCase().includes('ngo')))
                        .map(station => (
                            <MapMarker key={station.id} station={station} />
                        ))}
                </MapContainer>

                {/* Map Overlay Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
                    <button 
                        onClick={() => setShowNGOStations(!showNGOStations)}
                        className={`p-3 backdrop-blur-md rounded-xl border transition-all shadow-lg group ${
                            showNGOStations ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                        title="Toggle NGO Stations"
                    >
                        <Layers className={`w-5 h-5 group-hover:scale-110 transition-transform ${showNGOStations ? 'animate-pulse' : ''}`} />
                    </button>
                    <button className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg group">
                        <Locate className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-6 right-6 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 z-[1000] hidden md:block">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Status Legend</p>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-safe shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] text-primary-gray font-bold uppercase">Safe / Optimal</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                            <span className="text-[10px] text-primary-gray font-bold uppercase">Minor Warning</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-[10px] text-primary-gray font-bold uppercase">Critical Alert</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/5">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
                                <span className="text-[10px] text-primary-gray font-bold uppercase italic">NGO Managed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaseMapView;
