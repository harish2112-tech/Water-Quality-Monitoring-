import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    X,
    Check
} from 'lucide-react';
import GlassCard from './GlassCard';

const FilterPanel = ({ onApply, onClear }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [filters, setFilters] = useState({
        parameter: '',
        status: '',
        source: '',
        region: '',
        area: '',
        search: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        const cleared = {
            parameter: '',
            status: '',
            source: '',
            region: '',
            area: '',
            search: ''
        };
        setFilters(cleared);
        onClear(cleared);
    };

    return (
        <div className="w-full transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-white font-bold mb-4 hover:text-accent-gold transition-colors"
            >
                <Filter className="w-4 h-4" />
                <span>Filter Panel</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
                <GlassCard className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 border-accent-gold/10">
                    {/* Station Name/ID Search */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-primary-gray font-bold">Search Station</label>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-gray group-focus-within:text-accent-gold transition-colors" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleChange}
                                placeholder="Name or ID..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    {/* Water Parameters */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-primary-gray font-bold">Water Parameter</label>
                        <select
                            name="parameter"
                            value={filters.parameter}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 appearance-none"
                        >
                            <option value="" className="bg-background">All Parameters</option>
                            <option value="ph" className="bg-background">pH Level</option>
                            <option value="turbidity" className="bg-background">Turbidity</option>
                            <option value="do" className="bg-background">Dissolved Oxygen</option>
                        </select>
                    </div>

                    {/* Report Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-primary-gray font-bold">Status Badge</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 appearance-none"
                        >
                            <option value="" className="bg-background">All Status</option>
                            <option value="safe" className="bg-background">Safe</option>
                            <option value="warning" className="bg-background">Warning</option>
                            <option value="critical" className="bg-background">Critical</option>
                        </select>
                    </div>

                    {/* Region */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-primary-gray font-bold">Region</label>
                        <select
                            name="region"
                            value={filters.region}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-gold/50 focus:bg-white/10 appearance-none"
                        >
                            <option value="" className="bg-background">All Regions</option>
                            <option value="north" className="bg-background">North Region</option>
                            <option value="south" className="bg-background">South Region</option>
                            <option value="east" className="bg-background">East Region</option>
                            <option value="west" className="bg-background">West Region</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="lg:col-span-2 flex items-end space-x-4">
                        <button
                            onClick={handleClear}
                            className="flex-1 py-2.5 px-6 rounded-xl border border-accent-gold text-accent-gold font-bold hover:bg-accent-gold/10 transition-all flex items-center justify-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear Filters</span>
                        </button>
                        <button
                            onClick={() => onApply(filters)}
                            className="flex-[2] py-2.5 px-6 rounded-xl bg-accent-gold text-background font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-accent-gold/20"
                        >
                            <Check className="w-4 h-4" />
                            <span>Apply Filters</span>
                        </button>
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default FilterPanel;
