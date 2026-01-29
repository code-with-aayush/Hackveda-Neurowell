import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Zap, Heart, Thermometer, Clock, AlertTriangle, AlertCircle, Info, History, User, Sparkles, TrendingUp, Timer, Brain } from 'lucide-react';
import { subscribeToDeviceData, getDeviceStatus } from '../utils/database';
import { analyzeVitals } from '../utils/aiService';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { LineChart, Line, ResponsiveContainer, Tooltip, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();

    // State
    const [hrData, setHrData] = useState([]);
    const [currentStats, setCurrentStats] = useState({ hr: 0, hrv: 0, gsr: 0, stress: 0, spo2: 0 });
    const [activeSession, setActiveSession] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // AI Manual Analysis
    const handleManualAnalysis = async () => {
        setIsAnalyzing(true);
        const result = await analyzeVitals({
            hr: currentStats.hr,
            stress: currentStats.stress,
            gsr: currentStats.gsr,
            hrv: currentStats.hrv,
            spo2: currentStats.spo2
        });

        if (result && !result.error) {
            setAiInsight(result);
        } else if (result && result.error) {
            console.warn("AI Error:", result.error);
            setAiInsight({ error: result.error });
        }
        setIsAnalyzing(false);
    };

    // Auto-poll logic
    useEffect(() => {
        if (!activeSession || !isDeviceConnected) return;
        const aiInterval = setInterval(handleManualAnalysis, 30000);
        return () => clearInterval(aiInterval);
    }, [activeSession, isDeviceConnected, currentStats]);

    // Refs & Sync
    const isDeviceConnectedRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => {
        isDeviceConnectedRef.current = isDeviceConnected;
    }, [isDeviceConnected]);

    // Timer Logic
    useEffect(() => {
        if (activeSession && isDeviceConnected) {
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [activeSession, isDeviceConnected]);

    // Format Time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Connection & Data Logic
    useEffect(() => {
        const deviceId = localStorage.getItem('activeDeviceId');
        const sessionId = localStorage.getItem('activeSessionId');

        if (deviceId && sessionId) {
            setActiveSession(true);

            // 1. Connection Monitor
            const checkConn = async () => {
                const status = await getDeviceStatus(deviceId);
                setIsDeviceConnected(status.connected);
            };
            checkConn();
            const connTimer = setInterval(checkConn, 2000);

            // 2. Data Listener
            const unsubscribe = subscribeToDeviceData(deviceId, (data) => {
                if (!isDeviceConnectedRef.current) return;

                const newStats = {
                    hr: data.heartRate || 0,
                    hrv: data.hrv || 0,
                    gsr: data.gsr || 0,
                    stress: data.stress || 0,
                    spo2: data.spo2 || 0
                };
                setCurrentStats(newStats);

                const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

                // Update Graph Data (Limit to last 30 points)
                setHrData(prev => {
                    const newData = [...prev, { time: now, ...newStats }];
                    return newData.slice(-30);
                });
            });

            return () => {
                clearInterval(connTimer);
                unsubscribe();
            };
        }
    }, []);

    const handleEndSession = () => {
        if (window.confirm("End this session?")) {
            localStorage.removeItem('activeSessionId');
            navigate('/dashboard/sessions');
        }
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">

            {/* TOP BAR */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Activity className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Patient Monitoring
                            {activeSession && <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200 shadow-sm animate-pulse">LIVE SESSION</span>}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Real-time biofeedback stream & AI analysis</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className={clsx("px-4 py-2 rounded-full flex items-center gap-2 border transition-all duration-500 shadow-sm",
                        isDeviceConnected ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700")}>
                        <div className="relative flex h-2.5 w-2.5">
                            <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDeviceConnected ? "bg-emerald-400" : "bg-rose-400")}></span>
                            <span className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", isDeviceConnected ? "bg-emerald-500" : "bg-rose-500")}></span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">{isDeviceConnected ? "Stream Active" : "Stream Offline"}</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2"></div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Session Timer</span>
                        <div className="font-mono text-xl font-bold text-slate-800 leading-none tabular-nums tracking-wide">
                            {formatTime(elapsedTime)}
                        </div>
                    </div>

                    <button
                        onClick={handleEndSession}
                        className="ml-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all uppercase tracking-wide shadow-sm hover:shadow-md active:scale-95">
                        End Session
                    </button>
                </div>
            </header>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT COLUMN: VITALS (3/4 Width) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Vitals Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <VitalCard
                            title="HEART RATE"
                            value={currentStats.hr}
                            unit="BPM"
                            icon={Heart}
                            color="rose"
                            data={hrData}
                            dataKey="hr"
                        />
                        <VitalCard
                            title="BLOOD OXYGEN"
                            value={currentStats.spo2}
                            unit="%"
                            icon={Activity}
                            color="emerald"
                            data={hrData}
                            dataKey="spo2"
                        />
                        <VitalCard
                            title="HRV"
                            value={currentStats.hrv}
                            unit="ms"
                            icon={Timer}
                            color="amber"
                            data={hrData}
                            dataKey="hrv"
                        />
                        <VitalCard
                            title="GSR"
                            value={currentStats.gsr}
                            unit="µS"
                            icon={Zap}
                            color="purple"
                            data={hrData}
                            dataKey="gsr"
                        />
                    </div>

                    {/* Main Chart Section */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[500px] flex flex-col relative overflow-hidden shadow-sm">

                        <div className="flex justify-between items-center mb-6 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Physiological Trends</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div> Heart Rate
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> HRV
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={hrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHrMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorHrvMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: '500' }}
                                        labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHrMain)" name="Heart Rate" />
                                    <Area type="monotone" dataKey="hrv" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorHrvMain)" name="HRV" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: AI & STRESS (1/4 Width) */}
                <div className="space-y-6 flex flex-col">

                    {/* Stress Level Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Composite Stress Score</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-5xl font-bold text-slate-900 tracking-tighter">{currentStats.stress}</span>
                                <span className="text-lg text-slate-400 font-medium mb-1.5">/ 10</span>
                            </div>

                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${(currentStats.stress / 10) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                {currentStats.stress > 7 ? "High stress detected. Consider breathing exercises." : "Patient state is optimal."}
                            </p>
                        </div>
                    </div>

                    {/* AI Sidebar */}
                    <div className="bg-white border border-slate-200 flex-1 rounded-2xl flex flex-col p-0 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-primary-100 flex justify-between items-center bg-primary-50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary-600" />
                                AI Insights
                            </h3>
                            {isAnalyzing && <div className="h-2 w-2 bg-primary-500 rounded-full animate-ping"></div>}
                        </div>

                        <div className="p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-slate-50/50">
                            {/* Content */}
                            {aiInsight && !aiInsight.error ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <InsightCard
                                        type="warning"
                                        title={`Risk Level: ${aiInsight.risk || 'Analyzing...'}`}
                                        desc={aiInsight.insight}
                                        time={new Date().toLocaleTimeString()}
                                    />
                                    <InsightCard
                                        type="info"
                                        title="Recommendation"
                                        desc={aiInsight.recommendation}
                                        time={new Date().toLocaleTimeString()}
                                    />
                                </div>
                            ) : aiInsight && aiInsight.error ? (
                                <InsightCard
                                    type="error"
                                    title="Connection Error"
                                    desc={aiInsight.error}
                                    time={new Date().toLocaleTimeString()}
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-10">
                                    <Sparkles className="h-10 w-10 text-primary-300 mb-3" />
                                    <p className="text-sm text-slate-400 font-medium">Waiting for analysis...</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-200">
                            <button
                                onClick={handleManualAnalysis}
                                disabled={isAnalyzing}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
                                {isAnalyzing ? 'Analyzing...' : <> <Zap className="h-4 w-4" /> Generate Insight </>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Sub-components
const VitalCard = ({ title, value, unit, icon: Icon, color, data, dataKey }) => {
    const colorMap = {
        rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', stroke: '#e11d48' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', stroke: '#059669' },
        amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', stroke: '#d97706' },
        purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', stroke: '#9333ea' },
    };
    const theme = colorMap[color] || colorMap.rose;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</span>
                        <span className="text-xs font-medium text-slate-400">{unit}</span>
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${theme.bg} ${theme.text} transition-colors group-hover:scale-110 duration-300`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="h-12 w-full mt-2 -mb-2 opacity-30 group-hover:opacity-60 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={theme.stroke} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={theme.stroke} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey={dataKey} stroke={theme.stroke} strokeWidth={2} fill={`url(#grad-${dataKey})`} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const InsightCard = ({ type, title, desc, time }) => {
    const styles = {
        warning: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
        info: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', icon: Info },
        error: { border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-700', icon: AlertCircle },
        success: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Sparkles },
    };
    const s = styles[type] || styles.info;
    const Icon = s.icon;

    return (
        <div className={`p-4 rounded-xl border ${s.border} ${s.bg} backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 ${s.text} mt-1`} />
                <div>
                    <h4 className={`text-sm font-bold ${s.text} mb-1`}>{title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-2 block opacity-70">{time}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
