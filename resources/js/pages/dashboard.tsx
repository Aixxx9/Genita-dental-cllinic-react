import { Head, router } from '@inertiajs/react';
import { Calendar, DollarSign, Info, Users } from 'lucide-react';
import AdminShell from '@/components/admin/admin-shell';

type DashboardProps = {
    stats: {
        totalClients: number;
        pendingAppointments: number;
        totalAppointments: number;
        outstandingBalance: number;
    };
    recentClients: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    }[];
    recentPendingAppointments: {
        id: number;
        full_name: string;
        preferred_date: string;
        preferred_time: string;
        treatment_type: string;
    }[];
};

export default function Dashboard({
    stats,
    recentClients,
    recentPendingAppointments,
}: DashboardProps) {
    const formatMoney = (value: number) =>
        `₱${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    const formatIsoDate = (value?: string | null) => {
        if (!value) return '-';
        return value.split('T')[0];
    };

    return (
        <AdminShell active="dashboard">
            <Head title="Dashboard" />
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Welcome to GENITA Dental Clinic Admin
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <button
                    type="button"
                    onClick={() => router.visit('/clients')}
                    className="rounded-2xl bg-white p-5 text-left shadow-md shadow-purple-100/50 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {stats.totalClients}
                            </p>
                            <p className="text-sm text-slate-500">
                                Total Clients
                            </p>
                        </div>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => router.visit('/appointments?status=pending')}
                    className="rounded-2xl bg-white p-5 text-left shadow-md shadow-purple-100/50 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {stats.pendingAppointments}
                            </p>
                            <p className="text-sm text-slate-500">
                                Pending Appointments
                            </p>
                        </div>
                    </div>
                </button>
                <div className="rounded-2xl bg-white p-5 shadow-md shadow-purple-100/50">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {formatMoney(stats.outstandingBalance)}
                            </p>
                            <p className="text-sm text-slate-500">
                                Outstanding Balance
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-md shadow-purple-100/50">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                            <Info className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-semibold">
                                {stats.totalAppointments}
                            </p>
                            <p className="text-sm text-slate-500">
                                Total Appointments
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-md shadow-purple-100/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Recent Clients
                        </h2>
                        <button
                            type="button"
                            onClick={() => router.visit('/clients')}
                            className="text-sm font-medium text-purple-600 no-underline transition hover:text-purple-700 hover:underline hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.45)]"
                        >
                            View All
                        </button>
                    </div>
                    {recentClients.length === 0 ? (
                        <p className="mt-10 text-center text-sm text-slate-500">
                            No clients yet
                        </p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {recentClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm shadow-sm"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {client.first_name} {client.last_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-md shadow-purple-100/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Pending Appointments
                        </h2>
                        <button
                            type="button"
                            onClick={() => router.visit('/appointments')}
                            className="text-sm font-medium text-purple-600 no-underline transition hover:text-purple-700 hover:underline hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.45)]"
                        >
                            View All
                        </button>
                    </div>
                    {recentPendingAppointments.length === 0 ? (
                        <p className="mt-10 text-center text-sm text-slate-500">
                            No pending appointments
                        </p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {recentPendingAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm shadow-sm"
                                >
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {appointment.full_name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {appointment.treatment_type}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-slate-500">
                                        <p>
                                            {formatIsoDate(
                                                appointment.preferred_date
                                            )}
                                        </p>
                                        <p>{appointment.preferred_time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
