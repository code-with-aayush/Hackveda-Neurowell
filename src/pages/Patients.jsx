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
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
                    <p className="text-slate-500 mt-1">Manage your patient roster, monitor vitals, and initiate therapy sessions.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right mr-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        <div className="text-sm font-bold text-slate-800">{currentUser?.email || 'Dr. Smith'}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Clinical Psychologist</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600/50 placeholder-slate-400 text-slate-700 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-bold transition-colors shadow-sm">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 w-full sm:w-auto shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Patient</span>
                    </button>
                </div>
            </div>

            {/* Simple Add Patient Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Add New Patient</h2>
                        <p className="text-slate-500 text-sm mb-6">Create a new patient record to start tracking vitals.</p>

                        <form onSubmit={handleAddPatient}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                                    placeholder="e.g. John Doe"
                                    value={newPatientName}
                                    onChange={e => setNewPatientName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:text-slate-700 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-primary-600/20 transition-all">Create Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <User className="h-12 w-12 text-slate-300 mb-3" />
                                            <p className="font-medium">No patients found</p>
                                            <p className="text-sm mt-1 opacity-70">Add a new patient to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200 text-primary-700 font-bold text-sm">
                                                    {patient.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{patient.name}</div>
                                                    <div className="text-xs text-slate-500">Added {new Date(patient.joinedAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md inline-block border border-slate-200">
                                                #{patient.displayId || patient.id.slice(-4).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePatient(patient.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
