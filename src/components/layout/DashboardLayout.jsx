import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Global Ambient Glow for Main Content */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
