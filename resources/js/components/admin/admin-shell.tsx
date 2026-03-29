import type { PropsWithChildren } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';

type AdminShellProps = PropsWithChildren<{
    active: 'dashboard' | 'clients' | 'appointments';
}>;

export default function AdminShell({ active, children }: AdminShellProps) {
    return (
        <div className="min-h-screen bg-[#f7f6fb] text-slate-800">
            <div className="w-full lg:pl-64">
                <AdminSidebar active={active} />
                <main className="flex-1 bg-white px-8 py-8">
                    <div className="w-full space-y-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
