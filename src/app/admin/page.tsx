"use client";

import React, { useState } from 'react';
import { Calendar, Clock, LayoutDashboard, Settings, UserCircle, LogOut } from 'lucide-react';
import WeeklyCalendar from '@/components/admin/WeeklyCalendar';
import AvailabilityEditor from '@/components/admin/AvailabilityEditor';
import Link from 'next/link';
import ManualAppointmentForm from '@/components/admin/ManualAppointmentForm';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'calendar' | 'availability'>('calendar');
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div className="flex h-screen bg-gray-50/50 flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-display font-bold text-brand-primary">NutriAdmin</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        label="Turnos"
                        active={activeTab === 'calendar'}
                        onClick={() => setActiveTab('calendar')}
                    />
                    <SidebarItem
                        icon={<Clock className="h-5 w-5" />}
                        label="Disponibilidad"
                        active={activeTab === 'availability'}
                        onClick={() => setActiveTab('availability')}
                    />
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors w-full px-4 py-2">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between shrink-0">

                    {/* Mobile Logo replacing search on small screens */}
                    <div className="md:hidden font-display font-bold text-brand-primary text-xl">
                        NutriAdmin
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold">Luciana Cresia</p>
                            <p className="text-xs text-brand-primary font-medium">Nutricionista</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-brand-primary font-bold">
                            MN
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {activeTab === 'calendar' ? (
                        <WeeklyCalendar
                            key={refreshKey}
                            onOpenManual={() => setIsManualModalOpen(true)}
                            onEditManual={(appt) => {
                                setAppointmentToEdit(appt);
                                setIsManualModalOpen(true);
                            }}
                        />
                    ) : (
                        <AvailabilityEditor />
                    )}
                </div>
            </main>

            {isManualModalOpen && (
                <ManualAppointmentForm
                    initialData={appointmentToEdit}
                    onClose={() => {
                        setIsManualModalOpen(false);
                        setAppointmentToEdit(null);
                    }}
                    onSuccess={() => {
                        setRefreshKey(prev => prev + 1);
                        setAppointmentToEdit(null);
                    }}
                />
            )}

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center p-2 z-40 pb-safe">
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'calendar' ? 'text-brand-primary' : 'text-gray-400'}`}
                >
                    <LayoutDashboard className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold">Turnos</span>
                </button>
                <button
                    onClick={() => setActiveTab('availability')}
                    className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'availability' ? 'text-brand-primary' : 'text-gray-400'}`}
                >
                    <Clock className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold">Horarios</span>
                </button>
                <Link
                    href="/"
                    className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-red-500"
                >
                    <LogOut className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold">Salir</span>
                </Link>
            </nav>

        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${active
                ? 'bg-emerald-50 text-brand-primary shadow-sm'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
        >
            {icon}
            <span className="font-bold">{label}</span>
        </button>
    );
}
