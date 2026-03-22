import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import { stationService } from '../services/stationService';
import { Droplets, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Stations = () => {
    const [stations, setStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            const data = await stationService.getAll();
            setStations(data);
            setFilteredStations(data);
        };
        fetchStations();
    }, []);

    const handleApplyFilters = (filters) => {
        let results = stations;

        if (filters.search) {
            results = results.filter(s =>
                (s.name && s.name.toLowerCase().includes(filters.search.toLowerCase())) ||
                (s.id && String(s.id).toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        if (filters.status) {
            results = results.filter(s => s.status === filters.status);
        }

        setFilteredStations(results);
    };

    const handleClearFilters = () => {
        setFilteredStations(stations);
    };

    return (
        <div className="space-y-8">
            <FilterPanel onApply={handleApplyFilters} onClear={handleClearFilters} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map(station => (
                    <GlassCard
                        key={station.id}
                        className="group relative overflow-hidden"
                        onClick={() => navigate(`/stations/${station.id}`)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-accent-gold/50 transition-colors">
                                <Droplets className="w-6 h-6 text-accent-gold" />
                            </div>
                            <StatusBadge status={station.status} />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">{station.name}</h3>

                        <div className="flex items-center text-primary-gray text-xs mb-6">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{station.latitude?.toFixed?.(2) || '0.00'}, {station.longitude?.toFixed?.(2) || '0.00'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                            <div>
                                <p className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">Station ID</p>
                                <p className="text-white font-mono text-xs">{station.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-primary-gray uppercase tracking-widest font-bold">WQI INDEX</p>
                                <p className="text-lg font-bold text-accent-gold">{station.waterQualityIndex}</p>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4 text-accent-gold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </GlassCard>
                ))}
            </div>

            {filteredStations.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-primary-gray italic">No stations found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default Stations;
