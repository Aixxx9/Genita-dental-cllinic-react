import { Link, usePage } from '@inertiajs/react';
import { Calendar, Home, LogOut, Users } from 'lucide-react';
import { logout } from '@/routes';
import type { SharedData } from '@/types';

type AdminNavKey = 'dashboard' | 'clients' | 'appointments';

type AdminSidebarProps = {
    active: AdminNavKey;
};

const navItems: Array<{
    key: AdminNavKey;
    label: string;
    href: string;
    icon: typeof Home;
}> = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Home },
    { key: 'clients', label: 'Clients', href: '/clients', icon: Users },
    {
        key: 'appointments',
        label: 'Appointments',
        href: '/appointments',
        icon: Calendar,
    },
];

export default function AdminSidebar({ active }: AdminSidebarProps) {
    const { pendingAppointmentsCount } = usePage<SharedData>().props;

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-purple-100 lg:bg-[#f8f6fb] lg:px-6 lg:py-8 lg:overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-purple-100 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-semibold text-white shadow">
                    G
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        GENITA
                    </p>
                    <p className="text-xs text-slate-500">Admin Panel</p>
                </div>
            </div>

            <div className="mt-6 space-y-2 text-sm font-medium text-slate-700">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;
                    const baseClasses =
                        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition';
                    if (isActive) {
                        return (
                            <div
                                key={item.key}
                                className={`${baseClasses} bg-purple-600 text-white shadow-sm shadow-purple-200`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="flex-1">{item.label}</span>
                                {item.key === 'appointments' &&
                                    pendingAppointmentsCount > 0 && (
                                        <span className="flex min-w-6 items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                            {pendingAppointmentsCount}
                                        </span>
                                    )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`${baseClasses} text-slate-700 hover:bg-purple-100/70 hover:text-purple-700`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{item.label}</span>
                            {item.key === 'appointments' &&
                                pendingAppointmentsCount > 0 && (
                                    <span className="flex min-w-6 items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                        {pendingAppointmentsCount}
                                    </span>
                                )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto space-y-2 pt-6">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-purple-100/70 hover:text-purple-700"
                >
                    <Home className="h-4 w-4" />
                    Back to Website
                </Link>
                <Link
                    href={logout()}
                    as="button"
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
