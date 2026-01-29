import React, { useEffect, useState } from 'react';
import { Search, Calendar, Filter, Trash2, Clock, CheckCircle, Activity, User, FileText, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getSessions, deleteSession } from '../utils/database';
import { useAuth } from '../context/AuthContext';

const Sessions = () => {
    const { currentUser } = useAuth();
    const [sessionsData, setSessionsData] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            if (currentUser) {
                const data = await getSessions(currentUser.uid);
                const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
                setSessionsData(sorted);
            }
        };

        fetchSessions();
    }, [currentUser]);

    const handleDeleteSession = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            await deleteSession(currentUser.uid, sessionId);
            const data = await getSessions(currentUser.uid);
            setSessionsData(data.sort((a, b) => b.timestamp - a.timestamp));
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString();
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Session History</h1>
                    <p className="text-slate-500 mt-1">Review past biofeedback sessions, analyze trends, and export patient vitals.</p>
                </div>
                <Link to="/dashboard" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center space-x-2 shadow-lg shadow-primary-600/20 transition-all active:scale-95">
                    <span>+ New Session</span>
                </Link>
            </div>


            {/* Filters */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, notes, or tags..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600/50 text-slate-700 transition-all text-sm font-medium placeholder-slate-400"
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative w-full md:w-48 group">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                        <select className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 text-sm text-slate-700 appearance-none cursor-pointer hover:bg-slate-100 transition-colors font-medium">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>Last 24 Hours</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-bold whitespace-nowrap shadow-sm">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden min-h-[400px] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Peak HR</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sessionsData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <FileText className="h-12 w-12 text-slate-300 mb-3" />
                                            <p className="font-medium">No sessions found</p>
                                            <button className="mt-4 text-primary-600 text-sm font-bold hover:underline hover:text-primary-700">Start new session</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sessionsData.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{formatDate(session.timestamp)}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{formatTime(session.timestamp)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded">#{session.patientId}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span className="font-mono text-sm font-medium">{session.stats?.duration || '0'}s</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    session.status === 'active' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                            )}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1.5">
                                                <Activity className="h-4 w-4 text-rose-500" />
                                                <span className="text-sm font-bold text-slate-900">{session.stats?.hr || '--'}</span>
                                                <span className="text-xs text-slate-500 font-medium">BPM</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDeleteSession(session.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete Session"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Showing all records</span>
                </div>
            </div>
        </div>
    );
};

export default Sessions;
