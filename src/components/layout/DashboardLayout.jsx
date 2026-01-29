import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-[#09090b] overflow-hidden text-zinc-100 font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Global Ambient Glow for Main Content */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
