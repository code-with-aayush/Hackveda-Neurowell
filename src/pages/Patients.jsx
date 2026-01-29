import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Trash2, User, ChevronRight } from 'lucide-react';
import { getPatients, addPatient, deletePatient } from '../utils/database';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Patients = () => {
    const { currentUser } = useAuth();
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPatientName, setNewPatientName] = useState('');

    const fetchPatientsList = React.useCallback(async () => {
        if (currentUser) {
            const data = await getPatients(currentUser.uid);
            setPatients(data);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchPatientsList();
    }, [fetchPatientsList]);

    const handleAddPatient = async (e) => {
        e.preventDefault();
        if (!newPatientName || !currentUser) return;

        await addPatient(currentUser.uid, {
            name: newPatientName,
            joinedAt: Date.now()
        });
        setNewPatientName('');
        setIsModalOpen(false);
        fetchPatientsList();
    };

    const handleDeletePatient = async (patientId) => {
        if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
            await deletePatient(currentUser.uid, patientId);
            fetchPatientsList();
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Patients</h1>
                    <p className="text-zinc-400 mt-1">Manage your patient roster, monitor vitals, and initiate therapy sessions.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right mr-2 bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5">
                        <div className="text-sm font-bold text-white">{currentUser?.email || 'Dr. Smith'}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Clinical Psychologist</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="glass-panel p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 placeholder-zinc-600 text-zinc-200 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-zinc-800 border border-white/5 rounded-xl text-zinc-400 hover:bg-zinc-700 hover:text-white text-sm font-bold transition-colors">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="premium-button flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Patient</span>
                    </button>
                </div>
            </div>

            {/* Simple Add Patient Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative">
                        <h2 className="text-xl font-bold text-white mb-2">Add New Patient</h2>
                        <p className="text-zinc-400 text-sm mb-6">Create a new patient record to start tracking vitals.</p>

                        <form onSubmit={handleAddPatient}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Patient Name</label>
                                <input
                                    type="text"
                                    className="premium-input w-full"
                                    placeholder="e.g. John Doe"
                                    value={newPatientName}
                                    onChange={e => setNewPatientName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-zinc-400 hover:text-white font-medium transition-colors">Cancel</button>
                                <button type="submit" className="premium-button">Create Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-zinc-500">
                                        <div className="flex flex-col items-center">
                                            <User className="h-12 w-12 text-zinc-800 mb-3" />
                                            <p className="font-medium">No patients found</p>
                                            <p className="text-sm mt-1 opacity-70">Add a new patient to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg text-white font-bold text-sm">
                                                    {patient.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{patient.name}</div>
                                                    <div className="text-xs text-zinc-500">Added {new Date(patient.joinedAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-mono font-medium text-zinc-400 bg-black/40 px-2 py-1 rounded-md inline-block border border-white/5">
                                                #{patient.displayId || patient.id.slice(-4).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePatient(patient.id)}
                                                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                    title="Delete Patient"
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
            </div>
        </div>
    );
};

export default Patients;
