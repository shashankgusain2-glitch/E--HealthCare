"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Clock, Play, Square, FileText, Send, Calendar as CalendarIcon, Loader2, Brain, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrainTumorPrediction from '@/components/BrainTumorPrediction';

export default function DoctorWorkspace() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [sendingPrescription, setSendingPrescription] = useState(false);
    const [showTumorTool, setShowTumorTool] = useState(false);

    // Timer interval ref
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchAppointments();
        }
    }, [status]);

    // Handle active appointment timer
    useEffect(() => {
        const active = appointments.find(a => a.status === 'PENDING' && a.actualStartTime);
        if (active && !activeAppointmentId) {
            setActiveAppointmentId(active.id);
            const diffInSeconds = Math.floor((new Date().getTime() - new Date(active.actualStartTime).getTime()) / 1000);
            setTimerSeconds(diffInSeconds > 0 ? diffInSeconds : 0);
        }
    }, [appointments]);

    useEffect(() => {
        if (activeAppointmentId) {
            timerRef.current = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerSeconds(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activeAppointmentId]);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('/api/doctor/workspace/appointments');
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startConsultation = async (id: string) => {
        try {
            const res = await fetch(`/api/doctor/workspace/${id}/timer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'START' })
            });
            if (res.ok) {
                setActiveAppointmentId(id);
                setTimerSeconds(0);
                fetchAppointments();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const endConsultation = async () => {
        if (!activeAppointmentId) return;
        try {
            const res = await fetch(`/api/doctor/workspace/${activeAppointmentId}/timer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'STOP' })
            });
            if (res.ok) {
                setShowPrescriptionModal(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const updateMedication = (index: number, field: string, value: string) => {
        const newMeds = [...medications];
        newMeds[index] = { ...newMeds[index], [field]: value };
        setMedications(newMeds);
    };

    const sendPrescription = async () => {
        if (!activeAppointmentId) return;
        setSendingPrescription(true);
        try {
            const appointment = appointments.find(a => a.id === activeAppointmentId);
            const res = await fetch(`/api/doctor/workspace/${activeAppointmentId}/prescription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: appointment.patientId,
                    medications,
                    notes
                })
            });
            if (res.ok) {
                setShowPrescriptionModal(false);
                setActiveAppointmentId(null);
                setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
                setNotes('');
                fetchAppointments();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSendingPrescription(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    const pendingAppointments = appointments.filter(a => a.status === 'PENDING' && a.id !== activeAppointmentId);
    const activeAppointment = appointments.find(a => a.id === activeAppointmentId);
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');

    // Calculate estimated wait time delay
    let estimatedDelayMinutes = 0;
    if (activeAppointment && activeAppointment.actualStartTime) {
        const start = new Date(activeAppointment.actualStartTime);
        const expectedEnd = new Date(activeAppointment.endTime);
        const now = new Date();
        // If we are past the expected end time, that difference is the delay
        if (now > expectedEnd) {
            estimatedDelayMinutes = Math.floor((now.getTime() - expectedEnd.getTime()) / 60000);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dedicated Doctor Workspace</h1>
                        <p className="text-gray-500 mt-2">Manage your daily schedule, consultation timers, and digital prescriptions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setShowTumorTool(!showTumorTool)} variant={showTumorTool ? "default" : "outline"} className="flex items-center gap-2">
                            <Brain className="w-4 h-4" /> {showTumorTool ? 'Back to Schedule' : 'Brain Tumor Analysis'}
                        </Button>
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-emerald-700 flex items-center gap-2 border border-emerald-100 hidden md:flex">
                            <CalendarIcon className="w-5 h-5" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {showTumorTool ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Brain className="w-6 h-6 text-purple-600" /> AI Diagnostic Suite</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowTumorTool(false)}><X className="w-4 h-4 mr-2" /> Close</Button>
                        </div>
                        <BrainTumorPrediction />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Main Workspace Area */}
                        <div className="col-span-2 space-y-6">

                            {/* Active Consultation Box */}
                            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Play className="w-5 h-5 text-emerald-500" /> Active Consultation
                                    </h2>

                                    {activeAppointment ? (
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{activeAppointment.patient.name}</h3>
                                                <p className="text-gray-500">{activeAppointment.service.name}</p>
                                                <div className="mt-4 flex items-center gap-2 text-emerald-700 font-mono text-3xl font-bold tracking-wider">
                                                    <Clock className="w-7 h-7" /> {formatTime(timerSeconds)}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={endConsultation}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-16 px-8 rounded-xl font-bold text-lg"
                                            >
                                                <Square className="w-5 h-5 mr-no-2 fill-current" /> Finish & Write E-Rx
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No active consultation.</p>
                                            <p className="text-sm mt-1">Select a patient from the waiting list to begin.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Waiting List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Up Next / Waiting List ({pendingAppointments.length})</h2>

                                <div className="space-y-4">
                                    {pendingAppointments.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No waiting patients.</p>
                                    ) : (
                                        pendingAppointments.map((apt, idx) => {
                                            const scheduledStart = new Date(apt.startTime);
                                            const isNextInLine = idx === 0;

                                            // Add Estimated Delay to Scheduled Start
                                            const estStart = new Date(scheduledStart.getTime() + estimatedDelayMinutes * 60000);

                                            return (
                                                <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:shadow-sm transition-all bg-gray-50/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                                                            {apt.patient.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 leading-tight">{apt.patient.name}</h4>
                                                            <p className="text-sm text-gray-500">{apt.service.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Sched: {scheduledStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        {estimatedDelayMinutes > 0 && isNextInLine && (
                                                            <div className="text-xs font-bold text-orange-600 mt-1 bg-orange-50 px-2 py-0.5 rounded-full inline-block">
                                                                Est wait: {estimatedDelayMinutes} mins
                                                            </div>
                                                        )}
                                                    </div>

                                                    {!activeAppointment && isNextInLine && (
                                                        <Button onClick={() => startConsultation(apt.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6">
                                                            Begin
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Completed Today ({completedAppointments.length})</h2>
                                <div className="space-y-3">
                                    {completedAppointments.map(apt => (
                                        <div key={apt.id} className="p-3 border rounded-lg bg-gray-50 text-sm flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-gray-900">{apt.patient.name}</div>
                                                <div className="text-gray-500 text-xs mt-1 bg-green-100 text-green-700 w-fit px-2 rounded-full border border-green-200">
                                                    Prescription Sent
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Prescription Modal */}
                {showPrescriptionModal && activeAppointment && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">

                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-blue-600" /> Digital Prescription (E-Rx)
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Patient: <strong>{activeAppointment.patient.name}</strong></p>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 space-y-6">

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-800">Medications</h3>
                                        <Button variant="outline" size="sm" onClick={addMedication}>+ Add Medicine</Button>
                                    </div>

                                    <div className="space-y-3">
                                        {medications.map((med, idx) => (
                                            <div key={idx} className="flex gap-3 items-center">
                                                <input className="flex-1 w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none block bg-transparent" placeholder="Medicine Name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
                                                <input className="w-32 border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none block bg-transparent" placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} />
                                                <input className="w-32 border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none block bg-transparent" placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)} />
                                                <input className="w-32 border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none block bg-transparent" placeholder="Duration" value={med.duration} onChange={(e) => updateMedication(idx, 'duration', e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">Doctor's Notes / Advice</h3>
                                    <textarea
                                        className="w-full border rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                                        placeholder="Enter any additional advice, diet instructions, or next visit recommendations..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
                                <Button
                                    disabled={sendingPrescription}
                                    onClick={sendPrescription}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 flex items-center gap-2 text-md font-medium"
                                >
                                    {sendingPrescription ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Save & Send Receipt to Patient
                                </Button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
