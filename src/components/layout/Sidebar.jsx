import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, FileText, ChevronRight, Brain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/live-session', label: 'Live Session', icon: Activity },
        { path: '/dashboard/patients', label: 'Patients', icon: Users },
        { path: '/dashboard/sessions', label: 'History', icon: FileText },
    ];

    return (
        <aside className="w-72 bg-[#09090b] text-zinc-100 h-screen flex flex-col border-r border-white/5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

            {/* Header */}
            <div className="p-6 relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-white block">Neurowell</span>
                        <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Clinician Portal</span>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                clsx(
                                    'group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 border border-transparent',
                                    isActive
                                        ? 'bg-zinc-900 border-white/5 shadow-inner text-white'
                                        : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="mt-auto p-4 border-t border-white/5 relative z-10 bg-[#09090b]/50 backdrop-blur-sm">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/10">
                            {currentUser?.email?.[0].toUpperCase() || 'D'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{currentUser?.email || 'Doctor'}</p>
                            <p className="text-xs text-green-500 flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
