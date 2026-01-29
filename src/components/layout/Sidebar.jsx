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
            navigate('/');
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
        <aside className="w-72 bg-white text-slate-800 h-screen flex flex-col border-r border-slate-200 relative overflow-hidden shadow-sm">

            {/* Header */}
            <div className="p-6 relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-600/20">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 block">Neurowell</span>
                        <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">Clinician Portal</span>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-100 mb-6"></div>

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
                                        ? 'bg-blue-50 border-blue-100 text-primary-700 font-medium'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                                        <span className={clsx("text-sm", isActive ? "font-bold" : "font-medium")}>{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary-600" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Footer / User Profile */}
            <div className="mt-auto p-4 border-t border-slate-200 relative z-10 bg-slate-50/50">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-700 font-bold border border-slate-200">
                            {currentUser?.email?.[0].toUpperCase() || 'D'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.email || 'Doctor'}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
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
