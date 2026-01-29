import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Info, Battery, Wifi, Activity, CheckCircle, ArrowRight, RefreshCw, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getPatients, checkDeviceConnection, createSession } from '../utils/database';
import { useAuth } from '../context/AuthContext';

const NewSession = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [deviceStatus, setDeviceStatus] = useState('disconnected'); // disconnected, checking, connected
    const [deviceId, setDeviceId] = useState('ESP32_NEUROWELL_01');
    const [sessionNotes, setSessionNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            if (currentUser) {
                const data = await getPatients(currentUser.uid);
                setPatients(data);
            }
        };
        fetchPatients();
    }, [currentUser]);

    const handleCheckConnection = async () => {
        setDeviceStatus('checking');
        try {
            const isConnected = await checkDeviceConnection(deviceId);
            setDeviceStatus(isConnected ? 'connected' : 'disconnected');
            if (!isConnected) setError('Device not found or not connected to WiFi.');
            else setError('');
        } catch (err) {
            setDeviceStatus('disconnected');
            setError('Error checking device: ' + err.message);
        }
    };

    const handleStartSession = async () => {
        if (!selectedPatientId || deviceStatus !== 'connected' || !currentUser) return;

        setIsSubmitting(true);
        try {
            const sessionId = await createSession(currentUser.uid, selectedPatientId, deviceId, sessionNotes);
            // Initiate session in local storage or context if needed, but for now just redirect
            localStorage.setItem('activeSessionId', sessionId);
            localStorage.setItem('activeDeviceId', deviceId);
            navigate('/dashboard/live-session');
        } catch (err) {
            setError('Failed to start session: ' + err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">New Session Setup</h1>
                <p className="text-zinc-400 mt-1">Configure patient details and device connection before beginning therapy.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Steps 1 & 3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Step 1: Patient Selection */}
                    <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/10">1</div>
                            <h2 className="text-xl font-bold text-white">Patient Selection</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3.5 bg-zinc-900/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none text-zinc-200 font-medium transition-all hover:bg-zinc-900/80"
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                    >
                                        <option value="">Select a patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <ChevronRight className="h-4 w-4 rotate-90" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard/patients')}
                                    className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-zinc-800 border border-white/5 text-indigo-400 font-bold rounded-xl hover:bg-zinc-700 hover:text-indigo-300 transition-colors shadow-lg whitespace-nowrap"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Add New</span>
                                </button>
                            </div>

                            {selectedPatientId && (
                                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 flex items-start space-x-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-300">Patient Confirmed</h4>
                                        <p className="text-sm text-indigo-400/70 mt-1 leading-relaxed">
                                            Selected patient is ready for sesssion initiation. Biofeedback data will be recorded under this profile.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Pre-session Notes */}
                    <div className="glass-panel rounded-2xl p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/10">3</div>
                            <h2 className="text-xl font-bold text-white">Pre-session Notes & Goals</h2>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Session Objectives</label>
                            <textarea
                                className="w-full h-40 p-4 bg-zinc-900/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none text-zinc-300 placeholder:text-zinc-600 font-medium transition-all"
                                placeholder="Enter specific therapy goals, baseline observations, or patient-reported status..."
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Column (Step 2 & Action) */}
                <div className="space-y-8">

                    {/* Step 2: Device Status */}
                    <div className="glass-panel rounded-2xl p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/10">2</div>
                                <h2 className="text-xl font-bold text-white">Device Status</h2>
                            </div>
                            <button
                                onClick={handleCheckConnection}
                                className={clsx("transition-all p-2 rounded-lg hover:bg-white/5", deviceStatus === 'checking' ? "animate-spin text-indigo-500" : "text-zinc-500 hover:text-indigo-400")}
                                disabled={deviceStatus === 'checking'}
                                title="Refresh Connection"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="bg-black/30 rounded-xl p-5 border border-white/5 mb-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className={clsx(
                                    "inline-flex items-center space-x-1.5 px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300",
                                    deviceStatus === 'connected' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                )}>
                                    {deviceStatus === 'connected' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                    <span>{deviceStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
                                </span>
                            </div>

                            <div className="mb-5 relative z-10">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1.5 flex items-center gap-2">
                                    <Wifi className="h-3 w-3" /> Device ID
                                </p>
                                <input
                                    type="text"
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="text-sm font-mono font-bold text-zinc-200 bg-transparent border-b border-zinc-700/50 focus:border-indigo-500 focus:outline-none w-full pb-1 transition-colors"
                                />
                            </div>

                            {deviceStatus === 'connected' && (
                                <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Sensors Ready</span>
                                        <Battery className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Heart Rate', 'HRV', 'GSR', 'SpO2'].map(sensor => (
                                            <div key={sensor} className="flex items-center gap-2 px-2 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">{sensor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 flex items-start gap-2 text-rose-400 text-xs font-medium">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckConnection}
                            className="bg-zinc-800 border border-white/5 text-zinc-300 hover:bg-zinc-700 hover:text-white text-sm font-bold py-3 rounded-xl w-full transition-all shadow-lg active:scale-95"
                        >
                            {deviceStatus === 'checking' ? 'Establishing Connection...' : 'Check Connection'}
                        </button>
                    </div>

                    {/* Action Card */}
                    <div className="glass-panel rounded-2xl p-8 border-indigo-500/20 shadow-indigo-500/5">
                        <div className="flex items-start space-x-3 mb-6 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                            <Activity className="h-5 w-5 text-indigo-400 mt-0.5" />
                            <p className="text-xs text-indigo-300/80 leading-relaxed font-medium">
                                Ensure patient is seated comfortably. Device readings will stabilize automatically once the session begins.
                            </p>
                        </div>

                        <button
                            onClick={handleStartSession}
                            disabled={!selectedPatientId || deviceStatus !== 'connected' || isSubmitting}
                            className={clsx(
                                "w-full flex items-center justify-center space-x-2 py-4 font-bold rounded-xl shadow-xl transition-all transform active:scale-[0.98] duration-200 border",
                                (!selectedPatientId || deviceStatus !== 'connected' || isSubmitting)
                                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed border-white/5"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 border-indigo-500/50"
                            )}
                        >
                            <span>{isSubmitting ? 'Initializing Session...' : 'Start Neurowell Session'}</span>
                            {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewSession;
