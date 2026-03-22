import React, { useState } from 'react';
import {
    X,
    Upload,
    Check,
    Send,
    MapPin,
    Crosshair,
    Waves
} from 'lucide-react';
import GlassCard from './GlassCard';
import MapSelectModal from './MapSelectModal';
import { reportService } from '../services/reportService';

const ReportForm = ({ onClose }) => {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        latitude: '22.5076',
        longitude: '88.3639',
        source: '',
        photo: null
    });

    const [preview, setPreview] = useState(null);
    const [showMapSelect, setShowMapSelect] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude.toFixed(6).toString(),
                    longitude: position.coords.longitude.toFixed(6).toString()
                });
                setLoading(false);
            },
            (error) => {
                console.error("Error detecting location:", error);
                alert("Unable to retrieve your location. Please check your browser permissions.");
                setLoading(false);
            }
        );
    };

    // IMAGE SELECT FUNCTION
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFormData({
                ...formData,
                photo: file
            });

            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await reportService.submit(formData);
            setSuccess(true);

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
                <GlassCard className="max-w-md w-full p-10 text-center border-safe/30">
                    <div className="w-20 h-20 bg-safe/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-safe" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Report Submitted</h3>
                    <p className="text-primary-gray text-sm">
                        Your data has been sent for verification.
                    </p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl">

            <GlassCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-custom border-accent-gold/20 flex flex-col p-0 overflow-hidden shadow-2xl">

                {/* Header */}

                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">

                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent-gold rounded-lg">
                            <Send className="w-5 h-5 text-background" />
                        </div>

                        <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            Submit New Water Quality Report
                        </h2>
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-primary-gray hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>

                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Title */}

                    <div className="space-y-2">

                        <label className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">
                            Subject/Title
                        </label>

                        <input
                            required
                            type="text"
                            placeholder="Brief summary of the issue, e.g., 'Unusual discoloration in local river'"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-accent-gold/50 transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />

                    </div>


                    {/* PHOTO UPLOAD */}

                    <div className="space-y-2">

                        <label className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">
                            Upload Photo
                        </label>

                        <label className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-accent-gold/30 transition-all bg-white/5 group">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="preview"
                                    className="max-h-48 rounded-lg mb-3 shadow-lg"
                                />

                            ) : (

                                <>
                                    <Upload className="w-10 h-10 text-primary-gray mb-3 group-hover:text-accent-gold transition-all" />

                                    <p className="text-sm font-bold text-white">
                                        Drag 'n' drop photo here, or click to select file
                                    </p>

                                    <p className="text-[10px] text-primary-gray uppercase tracking-widest mt-1">
                                        PNG, JPG, up to 10MB
                                    </p>
                                </>

                            )}

                        </label>

                    </div>


                    {/* Location Information */}

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">
                            Location Information
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-primary-gray">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 34.0522"
                                    value={formData.latitude}
                                    onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-accent-gold/50 transition-all font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-primary-gray">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., -118.2437"
                                    value={formData.longitude}
                                    onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-accent-gold/50 transition-all font-mono"
                                />
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setShowMapSelect(true)}
                                className="flex items-center space-x-2 py-2.5 px-4 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/20 hover:border-accent-gold/30 transition-all"
                            >
                                <MapPin className="w-4 h-4 text-accent-gold" />
                                <span>Select on Map</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                className="flex items-center space-x-2 py-2.5 px-4 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/20 hover:border-accent-gold/30 transition-all"
                            >
                                <Crosshair className="w-4 h-4 text-accent-gold" />
                                <span>Detect Current Location</span>
                            </button>
                        </div>
                    </div>


                    {/* Observation Details */}

                    <div className="space-y-6">
                        <label className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">
                            Observation Details
                        </label>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray">
                                Water Source
                            </label>
                            <select
                                value={formData.source}
                                onChange={e => setFormData({ ...formData, source: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-accent-gold/50 transition-all appearance-none"
                            >
                                <option value="" disabled className="bg-background">Select water source</option>
                                <option value="River" className="bg-background">River</option>
                                <option value="Lake" className="bg-background">Lake</option>
                                <option value="Well" className="bg-background">Well</option>
                                <option value="Tap Water" className="bg-background">Tap Water</option>
                                <option value="Coastal" className="bg-background">Coastal</option>
                                <option value="Other" className="bg-background">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray">
                                Detailed Description
                            </label>
                            <textarea
                                rows="4"
                                required
                                value={formData.description}
                                placeholder="Describe what you observed about the water quality, including any unusual color, odor, or presence of debris. Be as specific as possible."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm mt-2 focus:border-accent-gold/50 transition-all"
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Report Status & Notes */}
                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <label className="text-[10px] uppercase font-black text-accent-gold tracking-[0.2em]">
                            Report Status & Notes
                        </label>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray">
                                Current Status
                            </label>
                            <div className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-accent-gold/50 mr-2 animate-pulse"></div>
                                <span className="text-[10px] text-primary-gray uppercase font-black tracking-widest">Pending Review</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-primary-gray">
                                Moderation Notes (Read-Only)
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-primary-gray text-xs italic">
                                Your report is currently being reviewed by our team of specialists. We will notify you once a determination has been made or if further information is required. Thank you for your contribution to water quality monitoring.
                            </div>
                        </div>
                    </div>


                    {/* Submit Actions */}

                    <div className="flex space-x-4 pt-8 border-t border-white/5">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 rounded-xl bg-accent-gold text-background font-black text-xs uppercase flex items-center justify-center space-x-2 shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all"
                        >

                            {loading ? (
                                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Report</span>
                                </>
                            )}

                        </button>

                    </div>

                </form>

                {showMapSelect && (
                    <MapSelectModal
                        initialPosition={[parseFloat(formData.latitude) || 22.5, parseFloat(formData.longitude) || 82.0]}
                        onSelect={(lat, lng) => {
                            setFormData({
                                ...formData,
                                latitude: lat.toFixed(6).toString(),
                                longitude: lng.toFixed(6).toString()
                            });
                            setShowMapSelect(false);
                        }}
                        onClose={() => setShowMapSelect(false)}
                    />
                )}

            </GlassCard>

        </div>
    );
};

export default ReportForm;
