import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Search, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import AdminShell from '@/components/admin/admin-shell';

type Appointment = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    treatment_type: string;
    preferred_date: string;
    preferred_time: string;
    notes: string | null;
    status: 'pending' | 'approved' | 'completed' | 'cancelled';
};

type AppointmentsPageProps = {
    appointments: Appointment[];
};

const statusStyles: Record<Appointment['status'], string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-slate-50 text-slate-600 border-slate-200',
};

const resolveInitialStatus = (): 'all' | Appointment['status'] => {
    if (typeof window === 'undefined') return 'all';
    const status = new URLSearchParams(window.location.search).get('status');
    if (!status) return 'all';
    if (
        status === 'pending' ||
        status === 'approved' ||
        status === 'completed' ||
        status === 'cancelled'
    ) {
        return status;
    }
    return 'all';
};

export default function Appointments({ appointments }: AppointmentsPageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | Appointment['status']
    >(resolveInitialStatus);
    const pendingCount = useMemo(
        () =>
            appointments.filter((appointment) => appointment.status === 'pending')
                .length,
        [appointments]
    );

    const formatIsoDate = (value?: string | null) => {
        if (!value) return '-';
        return value.split('T')[0];
    };

    const updateStatus = (appointmentId: number, status: Appointment['status']) => {
        router.put(`/appointments/${appointmentId}`, { status });
    };

    const approveAppointment = (appointmentId: number) => {
        const shouldApprove = window.confirm(
            'Confirm this appointment? The client will be added to Clients.'
        );
        if (!shouldApprove) return;
        router.post(`/appointments/${appointmentId}/approve`);
    };

    const deleteAppointment = (appointmentId: number) => {
        const shouldDelete = window.confirm(
            'Delete this appointment? This action cannot be undone.'
        );
        if (!shouldDelete) return;
        router.delete(`/appointments/${appointmentId}`);
    };

    const filteredAppointments = useMemo(() => {
        const term = search.trim().toLowerCase();
        return appointments.filter((appointment) => {
            if (statusFilter !== 'all' && appointment.status !== statusFilter) {
                return false;
            }
            if (!term) return true;
            return (
                appointment.full_name.toLowerCase().includes(term) ||
                appointment.email.toLowerCase().includes(term) ||
                appointment.phone.toLowerCase().includes(term) ||
                appointment.treatment_type.toLowerCase().includes(term)
            );
        });
    }, [appointments, search, statusFilter]);

    return (
        <AdminShell active="appointments">
            <Head title="Appointments" />
            <div>
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Appointments
                        </h1>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {pendingCount} Pending
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage appointment requests from patients
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white p-6 shadow-md shadow-purple-100/50">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
                        Pending requests: {pendingCount}
                    </div>
                    <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-purple-100 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full bg-transparent text-slate-600 placeholder:text-slate-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as
                                            | 'all'
                                            | Appointment['status']
                                    )
                                }
                                className="rounded-2xl border border-purple-100 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm focus:border-purple-400 focus:outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        {filteredAppointments.length}{' '}
                        {filteredAppointments.length === 1
                            ? 'appointment'
                            : 'appointments'}
                    </p>
                </div>

                <div className="mt-6 space-y-4">
                    {filteredAppointments.length === 0 ? (
                        <div className="rounded-2xl border border-purple-100 bg-white py-10 text-center text-sm text-slate-500">
                            No appointment requests yet
                        </div>
                    ) : (
                        filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {appointment.full_name}
                                        </p>
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() +
                                                appointment.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {appointment.status !== 'approved' && (
                                            <button
                                                type="button"
                                                onClick={() => approveAppointment(appointment.id)}
                                                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                                            >
                                                <CheckIcon />
                                                Confirm
                                            </button>
                                        )}
                                        {appointment.status !== 'cancelled' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateStatus(appointment.id, 'cancelled')
                                                }
                                                className="inline-flex items-center gap-2 rounded-full border border-purple-400 px-4 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-50"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteAppointment(appointment.id)}
                                            className="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                                            aria-label="Delete appointment"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            Email
                                        </p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {appointment.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            Phone
                                        </p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {appointment.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            Treatment
                                        </p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {appointment.treatment_type}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <Calendar className="h-4 w-4 text-purple-500" />
                                            {formatIsoDate(
                                                appointment.preferred_date
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <Clock className="h-4 w-4 text-purple-500" />
                                            {appointment.preferred_time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminShell>
    );
}

function CheckIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M3 8L6.2 11L13 4.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
