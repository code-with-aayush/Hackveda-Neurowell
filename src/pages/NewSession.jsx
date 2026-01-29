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
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New Session Setup</h1>
                <p className="text-slate-500 mt-1">Configure patient details and device connection before beginning therapy.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Steps 1 & 3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Step 1: Patient Selection */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg border border-primary-100 shadow-sm">1</div>
                            <h2 className="text-xl font-bold text-slate-800">Patient Selection</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 appearance-none text-slate-700 font-medium transition-all hover:bg-slate-100"
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                    >
                                        <option value="">Select a patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight className="h-4 w-4 rotate-90" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard/patients')}
                                    className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-slate-200 text-primary-600 font-bold rounded-xl hover:bg-slate-50 hover:text-primary-700 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Add New</span>
                                </button>
                            </div>

                            {selectedPatientId && (
                                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start space-x-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Info className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-primary-700">Patient Confirmed</h4>
                                        <p className="text-sm text-primary-600/80 mt-1 leading-relaxed">
                                            Selected patient is ready for sesssion initiation. Biofeedback data will be recorded under this profile.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Pre-session Notes */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg border border-primary-100 shadow-sm">3</div>
                            <h2 className="text-xl font-bold text-slate-800">Pre-session Notes & Goals</h2>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Objectives</label>
                            <textarea
                                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 resize-none text-slate-700 placeholder:text-slate-400 font-medium transition-all"
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
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg border border-primary-100 shadow-sm">2</div>
                                <h2 className="text-xl font-bold text-slate-800">Device Status</h2>
                            </div>
                            <button
                                onClick={handleCheckConnection}
                                className={clsx("transition-all p-2 rounded-lg hover:bg-slate-100", deviceStatus === 'checking' ? "animate-spin text-primary-600" : "text-slate-400 hover:text-primary-600")}
                                disabled={deviceStatus === 'checking'}
                                title="Refresh Connection"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3">
                                <span className={clsx(
                                    "inline-flex items-center space-x-1.5 px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-300",
                                    deviceStatus === 'connected' ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm" : "bg-rose-50 border-rose-200 text-rose-600"
                                )}>
                                    {deviceStatus === 'connected' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                    <span>{deviceStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
                                </span>
                            </div>

                            <div className="mb-5 relative z-10">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 flex items-center gap-2">
                                    <Wifi className="h-3 w-3" /> Device ID
                                </p>
                                <input
                                    type="text"
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    className="text-sm font-mono font-bold text-slate-700 bg-transparent border-b border-slate-300 focus:border-primary-600 focus:outline-none w-full pb-1 transition-colors"
                                />
                            </div>

                            {deviceStatus === 'connected' && (
                                <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sensors Ready</span>
                                        <Battery className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Heart Rate', 'HRV', 'GSR', 'SpO2'].map(sensor => (
                                            <div key={sensor} className="flex items-center gap-2 px-2 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">{sensor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex items-start gap-2 text-rose-600 text-xs font-medium">
                                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckConnection}
                            className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-bold py-3 rounded-xl w-full transition-all shadow-sm active:scale-95"
                        >
                            {deviceStatus === 'checking' ? 'Establishing Connection...' : 'Check Connection'}
                        </button>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm shadow-primary-600/5">
                        <div className="flex items-start space-x-3 mb-6 bg-primary-50 p-4 rounded-xl border border-primary-100">
                            <Activity className="h-5 w-5 text-primary-500 mt-0.5" />
                            <p className="text-xs text-primary-700/80 leading-relaxed font-medium">
                                Ensure patient is seated comfortably. Device readings will stabilize automatically once the session begins.
                            </p>
                        </div>

                        <button
                            onClick={handleStartSession}
                            disabled={!selectedPatientId || deviceStatus !== 'connected' || isSubmitting}
                            className={clsx(
                                "w-full flex items-center justify-center space-x-2 py-4 font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] duration-200 border",
                                (!selectedPatientId || deviceStatus !== 'connected' || isSubmitting)
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                                    : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20 border-primary-600"
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
