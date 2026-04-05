import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Map as MapIcon, 
  Activity, 
  Globe, 
  Save, 
  AlertTriangle,
  Info,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import settingsService from "../services/settingsService";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [thresholds, setThresholds] = useState([]);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    webhook_url: "",
    unit_system: "metric",
    timezone: "UTC",
    default_lat: 20.5937,
    default_lng: 78.9629,
    default_zoom: 5,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tData, pData] = await Promise.all([
        settingsService.getThresholds(),
        settingsService.getPreferences(),
      ]);
      setThresholds(tData);
      setPreferences(pData);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setStatus({ type: "error", message: "Failed to load settings data." });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThresholdChange = (index, field, value) => {
    const newThresholds = [...thresholds];
    newThresholds[index][field] = parseFloat(value);
    setThresholds(newThresholds);
  };

  const saveSettings = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      if (activeTab === "thresholds") {
        await settingsService.updateThresholds(thresholds);
      } else {
        await settingsService.updatePreferences(preferences);
      }
      setStatus({ type: "success", message: "Settings updated successfully!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setStatus({ type: "error", message: "Failed to save settings. Check your permissions." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin" || user?.role === "authority";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-light/80 to-ocean-deep/90 border border-white/10 p-8 shadow-2xl">
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-accent-gold/10 border border-accent-gold/20">
            <SettingsIcon className="w-10 h-10 text-accent-gold" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              Control <span className="text-accent-gold">Panel</span>
            </h1>
            <p className="text-primary-gray italic text-sm">Configure your monitoring experience and system rules.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 p-1 bg-ocean-light/30 rounded-2xl border border-white/5 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "preferences" 
                ? "bg-accent-gold text-ocean-deep shadow-lg shadow-accent-gold/20" 
                : "text-primary-gray hover:bg-white/5"
              }`}
            >
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab("display")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "display" 
                ? "bg-accent-gold text-ocean-deep shadow-lg shadow-accent-gold/20" 
                : "text-primary-gray hover:bg-white/5"
              }`}
            >
              <Globe className="w-4 h-4" /> Units & Local
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "map" 
                ? "bg-accent-gold text-ocean-deep shadow-lg shadow-accent-gold/20" 
                : "text-primary-gray hover:bg-white/5"
              }`}
            >
              <MapIcon className="w-4 h-4" /> Map Config
            </button>
            <button
              onClick={() => setActiveTab("thresholds")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === "thresholds" 
                ? "bg-accent-gold text-ocean-deep shadow-lg shadow-accent-gold/20" 
                : "text-primary-gray hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4" /> Alert Rules
            </button>
          </nav>
        </div>

        {/* Settings Form Area */}
        <div className="flex-1 space-y-6">
          <div className="p-8 rounded-3xl bg-ocean-light/60 border border-white/10 shadow-xl backdrop-blur-sm min-h-[500px] flex flex-col">
            
            {/* Tab: Preferences */}
            {activeTab === "preferences" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center gap-4 text-white border-b border-white/5 pb-4">
                  <Bell className="text-accent-gold" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">Notification Channels</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-center justify-between p-6 rounded-2xl bg-ocean-deep/50 border border-white/5 hover:border-accent-gold/30 transition-all cursor-pointer group">
                    <div className="space-y-1">
                      <span className="text-white font-bold block">Email Alerts</span>
                      <span className="text-xs text-primary-gray italic">Monthly reports & critical breaches</span>
                    </div>
                    <input 
                      type="checkbox" 
                      name="email_notifications"
                      checked={preferences.email_notifications}
                      onChange={handlePreferenceChange}
                      className="w-6 h-6 rounded accent-accent-gold"
                    />
                  </label>

                  <label className="flex items-center justify-between p-6 rounded-2xl bg-ocean-deep/50 border border-white/5 hover:border-accent-gold/30 transition-all cursor-pointer group">
                    <div className="space-y-1">
                      <span className="text-white font-bold block">SMS Alerts</span>
                      <span className="text-xs text-primary-gray italic">Instant critical sensor triggers</span>
                    </div>
                    <input 
                      type="checkbox" 
                      name="sms_notifications"
                      checked={preferences.sms_notifications}
                      onChange={handlePreferenceChange}
                      className="w-6 h-6 rounded accent-accent-gold"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Webhook URL (Slack/Discord)</label>
                  <input 
                    type="url" 
                    name="webhook_url"
                    value={preferences.webhook_url || ""}
                    onChange={handlePreferenceChange}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-gold/50 outline-none transition-all"
                  />
                  <p className="text-[10px] text-primary-gray/60 italic">Send automated breaches to your organization's messaging channel.</p>
                </div>
              </div>
            )}

            {/* Tab: Display */}
            {activeTab === "display" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center gap-4 text-white border-b border-white/5 pb-4">
                  <Globe className="text-accent-gold" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">Localization</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Unit System</label>
                    <select 
                      name="unit_system"
                      value={preferences.unit_system}
                      onChange={handlePreferenceChange}
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold/50 cursor-pointer appearance-none"
                    >
                      <option value="metric">Metric (mg/L, NTU, Celsius)</option>
                      <option value="imperial">Imperial (PPM, NTU, Fahrenheit)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Timezone</label>
                    <select 
                      name="timezone"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold/50 cursor-pointer appearance-none"
                    >
                      <option value="UTC">Universal Coordinated Time (UTC)</option>
                      <option value="IST">India Standard Time (IST)</option>
                      <option value="EST">Eastern Standard Time (EST)</option>
                      <option value="PST">Pacific Standard Time (PST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Map */}
            {activeTab === "map" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center gap-4 text-white border-b border-white/5 pb-4">
                  <MapIcon className="text-accent-gold" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">Default Map View</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Latitude</label>
                    <input 
                      type="number" 
                      name="default_lat"
                      step="0.0001"
                      value={preferences.default_lat}
                      onChange={handlePreferenceChange}
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Longitude</label>
                    <input 
                      type="number" 
                      name="default_lng"
                      step="0.0001"
                      value={preferences.default_lng}
                      onChange={handlePreferenceChange}
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-gray uppercase tracking-widest">Zoom Level</label>
                    <input 
                      type="number" 
                      name="default_zoom"
                      value={preferences.default_zoom}
                      onChange={handlePreferenceChange}
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-gold/50"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-accent-gold/5 border border-accent-gold/10 flex items-start gap-4">
                   <Info className="w-5 h-5 text-accent-gold shrink-0 mt-1" />
                   <p className="text-xs text-primary-gray leading-relaxed italic">
                      These coordinates define your starting point when the dashboard map loads. India is set as default (20.59, 78.96).
                   </p>
                </div>
              </div>
            )}

            {/* Tab: Thresholds */}
            {activeTab === "thresholds" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4 text-white">
                    <Activity className="text-accent-gold" />
                    <h2 className="text-xl font-bold uppercase tracking-widest">System Thresholds</h2>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-safe/10 border border-safe/20 text-safe text-[10px] font-bold uppercase">
                      <ShieldCheck className="w-3 h-3" /> Root Access
                    </div>
                  )}
                </div>

                {!isAdmin ? (
                   <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                      <AlertTriangle className="w-16 h-16 text-warning/50" />
                      <p className="text-primary-gray text-center max-w-sm italic">You don't have authority to modify global system thresholds. Contact an administrator to adjust monitoring rules.</p>
                   </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-[10px] uppercase font-black text-primary-gray tracking-widest">
                          <th className="px-4 pb-2">Parameter</th>
                          <th className="px-4 pb-2 text-center">Warning (Low/High)</th>
                          <th className="px-4 pb-2 text-center">Critical (Low/High)</th>
                          <th className="px-4 pb-2">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-4">
                        {thresholds.map((t, idx) => (
                          <tr key={t.id} className="bg-ocean-deep/40 rounded-xl group hover:bg-ocean-deep/60 transition-colors">
                            <td className="px-4 py-4 rounded-l-xl font-bold text-white uppercase">{t.parameter.replace('_', ' ')}</td>
                            <td className="px-4 py-4">
                              <input 
                                type="number" 
                                step="0.1" 
                                value={t.warning_value} 
                                onChange={(e) => handleThresholdChange(idx, 'warning_value', e.target.value)}
                                className="w-24 mx-auto block bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-white text-center focus:border-accent-gold/40 outline-none"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <input 
                                type="number" 
                                step="0.1" 
                                value={t.critical_value} 
                                onChange={(e) => handleThresholdChange(idx, 'critical_value', e.target.value)}
                                className="w-24 mx-auto block bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-white text-center focus:border-accent-gold/40 outline-none"
                              />
                            </td>
                            <td className="px-4 py-4 rounded-r-xl text-primary-gray font-mono text-xs">{t.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Error/Success Feedback */}
            {status.message && (
              <div className={`mt-auto flex items-center gap-3 p-4 rounded-2xl animate-shake ${
                status.type === "success" ? "bg-safe/10 border border-safe/20 text-safe" : "bg-critical/10 border border-critical/20 text-critical"
              }`}>
                {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <p className="text-sm font-bold uppercase tracking-wider">{status.message}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className={`mt-8 pt-6 border-t border-white/5 flex justify-end ${(!isAdmin && activeTab === 'thresholds') ? 'hidden' : ''}`}>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-3 bg-accent-gold text-ocean-deep font-black uppercase rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-gold/20 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-ocean-deep border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
