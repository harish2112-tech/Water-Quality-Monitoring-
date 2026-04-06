import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { X, Check, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const MapSelectModal = ({ initialPosition, onSelect, onClose }) => {
    const [selectedPosition, setSelectedPosition] = useState(initialPosition);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <GlassCard className="w-full max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden border-white/10 shadow-2xl">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent-gold rounded-lg">
                            <MapPin className="w-4 h-4 text-background" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">Select Location</h3>
                            <p className="text-[10px] text-primary-gray font-bold">Click on the map to drop a location marker</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-primary-gray hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    <MapContainer
                        center={selectedPosition}
                        zoom={13}
                        className="h-full w-full"
                        zoomControl={false}
<<<<<<< HEAD
                        minZoom={3}
                        maxBounds={[[-90, -180], [90, 180]]}
                        maxBoundsViscosity={1.0}
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
<<<<<<< HEAD
                            noWrap={true}
=======
>>>>>>> 9f82e7e5f8c36504b270f509af7d2ffeea6ddc29
                        />
                        <LocationPicker position={selectedPosition} setPosition={setSelectedPosition} />
                        <ZoomControl position="bottomleft" />
                    </MapContainer>

                    {/* Coordinates Display Overlay */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-ocean-deep/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center space-x-6 shadow-2xl">
                        <div>
                            <p className="text-[9px] uppercase font-black text-accent-gold tracking-widest text-center">Latitude</p>
                            <p className="text-sm font-mono text-white text-center font-bold tracking-tight">{selectedPosition[0].toFixed(6)}</p>
                        </div>
                        <div className="w-px h-6 bg-white/10"></div>
                        <div>
                            <p className="text-[9px] uppercase font-black text-accent-gold tracking-widest text-center">Longitude</p>
                            <p className="text-sm font-mono text-white text-center font-bold tracking-tight">{selectedPosition[1].toFixed(6)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-white/5 flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-xs font-bold uppercase transition-all hover:bg-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSelect(selectedPosition[0], selectedPosition[1])}
                        className="px-8 py-2.5 rounded-xl bg-accent-gold text-background text-xs font-black uppercase flex items-center space-x-2 shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all"
                    >
                        <Check className="w-4 h-4" />
                        <span>Confirm Location</span>
                    </button>
                </div>

            </GlassCard>
        </div>
    );
};

export default MapSelectModal;
