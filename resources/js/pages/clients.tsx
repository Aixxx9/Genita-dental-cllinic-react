import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import AdminShell from '@/components/admin/admin-shell';

type Treatment = {
    id: number;
    type: string;
    date: string;
    description: string | null;
    total_cost: string;
    amount_paid: string | null;
    notes: string | null;
};

type Client = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string | null;
    address: string | null;
    allergies: string | null;
    medical_conditions: string | null;
    maintenance: string | null;
    treatments: Treatment[];
};

type ClientsPageProps = {
    clients: Client[];
};

export default function Clients({ clients }: ClientsPageProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<
        'newest' | 'oldest' | 'name-asc' | 'name-desc'
    >('newest');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [activeClientId, setActiveClientId] = useState<number | null>(null);
    const [editingClientId, setEditingClientId] = useState<number | null>(null);
    const [editingTreatmentId, setEditingTreatmentId] = useState<number | null>(
        null
    );

    const clientForm = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        allergies: '',
        medical_conditions: '',
        maintenance: '',
    });

    const treatmentForm = useForm({
        type: '',
        date: '',
        description: '',
        total_cost: '',
        amount_paid: '',
        notes: '',
    });

    const filteredClients = useMemo(() => {
        const term = search.trim().toLowerCase();
        const matchedClients = !term
            ? clients
            : clients.filter((client) => {
                  const fullName = `${client.first_name} ${client.last_name}`
                      .trim()
                      .toLowerCase();
                  return (
                      fullName.includes(term) ||
                      client.email.toLowerCase().includes(term)
                  );
              });

        return [...matchedClients].sort((left, right) => {
            const leftName = `${left.first_name} ${left.last_name}`
                .trim()
                .toLowerCase();
            const rightName = `${right.first_name} ${right.last_name}`
                .trim()
                .toLowerCase();

            switch (sortBy) {
                case 'oldest':
                    return left.id - right.id;
                case 'name-asc':
                    return leftName.localeCompare(rightName);
                case 'name-desc':
                    return rightName.localeCompare(leftName);
                case 'newest':
                default:
                    return right.id - left.id;
            }
        });
    }, [clients, search, sortBy]);

    const handleOpenClientModal = () => {
        clientForm.reset();
        setEditingClientId(null);
        setShowClientModal(true);
    };

    const handleEditClient = (client: Client) => {
        setEditingClientId(client.id);
        clientForm.setData({
            first_name: client.first_name ?? '',
            last_name: client.last_name ?? '',
            email: client.email ?? '',
            phone: client.phone ?? '',
            date_of_birth: client.date_of_birth ?? '',
            address: client.address ?? '',
            allergies: client.allergies === 'N/A' ? '' : (client.allergies ?? ''),
            medical_conditions:
                client.medical_conditions === 'N/A'
                    ? ''
                    : (client.medical_conditions ?? ''),
            maintenance:
                client.maintenance === 'N/A'
                    ? ''
                    : (client.maintenance ?? ''),
        });
        setShowClientModal(true);
    };

    const handleCloseClientModal = () => {
        setShowClientModal(false);
        setEditingClientId(null);
        clientForm.reset();
    };

    const handleSubmitClient = () => {
        if (editingClientId) {
            clientForm.put(`/clients/${editingClientId}`, {
                onSuccess: () => {
                    clientForm.reset();
                    setShowClientModal(false);
                    setEditingClientId(null);
                },
            });
            return;
        }

        clientForm.post('/clients', {
            onSuccess: () => {
                clientForm.reset();
                setShowClientModal(false);
            },
        });
    };

    const handleDeleteClient = (id: number) => {
        const shouldDelete = window.confirm(
            'Delete this client? This will remove all their treatments.'
        );
        if (!shouldDelete) return;
        router.delete(`/clients/${id}`, {
            onSuccess: () => {
                if (expandedId === id) {
                    setExpandedId(null);
                }
            },
        });
    };

    const handleOpenTreatmentModal = (clientId: number) => {
        setActiveClientId(clientId);
        setEditingTreatmentId(null);
        treatmentForm.reset();
        setShowTreatmentModal(true);
    };

    const handleEditTreatment = (clientId: number, treatment: Treatment) => {
        setActiveClientId(clientId);
        setEditingTreatmentId(treatment.id);
        treatmentForm.setData({
            type: treatment.type ?? '',
            date: treatment.date ?? '',
            description: treatment.description ?? '',
            total_cost: treatment.total_cost ?? '',
            amount_paid: treatment.amount_paid ?? '',
            notes: treatment.notes ?? '',
        });
        setShowTreatmentModal(true);
    };

    const handleCloseTreatmentModal = () => {
        setShowTreatmentModal(false);
        setActiveClientId(null);
        setEditingTreatmentId(null);
        treatmentForm.reset();
    };

    const handleSubmitTreatment = () => {
        if (!activeClientId) return;
        if (editingTreatmentId) {
            treatmentForm.put(
                `/clients/${activeClientId}/treatments/${editingTreatmentId}`,
                {
                    onSuccess: () => {
                        treatmentForm.reset();
                        setShowTreatmentModal(false);
                        setEditingTreatmentId(null);
                    },
                }
            );
            return;
        }
        treatmentForm.post(`/clients/${activeClientId}/treatments`, {
            onSuccess: () => {
                treatmentForm.reset();
                setShowTreatmentModal(false);
            },
        });
    };

    const handleDeleteTreatment = (clientId: number, treatmentId: number) => {
        const shouldDelete = window.confirm(
            'Delete this treatment? This action cannot be undone.'
        );
        if (!shouldDelete) return;
        router.delete(`/clients/${clientId}/treatments/${treatmentId}`);
    };

    const getTotals = (client: Client) => {
        const totalCost = client.treatments.reduce(
            (sum, item) => sum + Number(item.total_cost || 0),
            0
        );
        const totalPaid = client.treatments.reduce(
            (sum, item) => sum + Number(item.amount_paid || 0),
            0
        );
        return {
            totalCost,
            totalPaid,
            balance: totalCost - totalPaid,
        };
    };

    const formatMoney = (value: number) =>
        `₱${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    const formatDate = (value?: string | null) => {
        if (!value) return '-';
        return value.split('T')[0];
    };
    const formatIsoDate = (value?: string | null) => {
        if (!value) return '-';
        return value.split('T')[0];
    };

    return (
        <AdminShell active="clients">
            <Head title="Clients" />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Clients
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your dental clinic clients
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenClientModal}
                    className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Client
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md shadow-purple-100/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex w-full flex-col gap-3 md:max-w-2xl md:flex-row">
                        <div className="flex w-full items-center gap-2 rounded-2xl border border-purple-100 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full bg-transparent text-slate-600 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
                            <label
                                htmlFor="client-sort"
                                className="whitespace-nowrap font-medium text-slate-600"
                            >
                                Sort By
                            </label>
                            <select
                                id="client-sort"
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(
                                        event.target.value as
                                            | 'newest'
                                            | 'oldest'
                                            | 'name-asc'
                                            | 'name-desc'
                                    )
                                }
                                className="bg-transparent text-slate-600 focus:outline-none"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        {filteredClients.length}{' '}
                        {filteredClients.length === 1 ? 'client' : 'clients'}
                    </p>
                </div>

                {filteredClients.length === 0 ? (
                    <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center text-sm text-slate-500">
                        <p>No clients found</p>
                        <button
                            type="button"
                            onClick={handleOpenClientModal}
                            className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Your First Client
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {filteredClients.map((client) => {
                            const totals = getTotals(client);
                            const isExpanded = expandedId === client.id;
                            const fullName = `${client.first_name} ${client.last_name}`.trim();
                            const initials = `${client.first_name.charAt(0)}${client.last_name.charAt(0)}`
                                .trim()
                                .toUpperCase();

                            return (
                                <div
                                    key={client.id}
                                    className="rounded-2xl border border-purple-100 bg-white shadow-sm"
                                >
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            setExpandedId((prev) =>
                                                prev === client.id ? null : client.id
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setExpandedId((prev) =>
                                                    prev === client.id ? null : client.id
                                                );
                                            }
                                        }}
                                        className="flex cursor-pointer flex-wrap items-center justify-between gap-4 px-6 py-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {fullName}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {client.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right text-sm">
                                                <p className="text-slate-500">Balance</p>
                                                <p className="font-semibold text-orange-500">
                                                    {formatMoney(totals.balance)}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleEditClient(client);
                                                }}
                                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleDeleteClient(client.id);
                                                }}
                                                className="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedId((prev) =>
                                                        prev === client.id
                                                            ? null
                                                            : client.id
                                                    )
                                                }
                                                onClickCapture={(event) => event.stopPropagation()}
                                                className={`rounded-full p-2 text-slate-400 transition duration-300 hover:bg-slate-100 hover:text-slate-600 ${
                                                    isExpanded ? 'rotate-180' : ''
                                                }`}
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`grid transition-all duration-300 ease-out ${
                                            isExpanded
                                                ? 'grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div
                                                className={`border-t border-purple-100 px-6 py-6 transition duration-300 ease-out ${
                                                    isExpanded
                                                        ? 'translate-y-0'
                                                        : '-translate-y-2'
                                                }`}
                                            >
                                            <div className="grid gap-4 lg:grid-cols-3">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">Phone</p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {client.phone || '-'}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Date of Birth
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {formatDate(client.date_of_birth)}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">Address</p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {client.address || '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid gap-4 lg:grid-cols-3">
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">Allergies</p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {client.allergies || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Medical Conditions
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {client.medical_conditions || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-slate-50 p-4">
                                                    <p className="text-xs text-slate-500">
                                                        Maintenance
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {client.maintenance || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                                                <div className="rounded-2xl bg-purple-50 p-4">
                                                    <p className="text-xs text-slate-500">Total Cost</p>
                                                    <p className="mt-2 text-lg font-semibold text-slate-800">
                                                        {formatMoney(totals.totalCost)}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-emerald-50 p-4">
                                                    <p className="text-xs text-slate-500">Total Paid</p>
                                                    <p className="mt-2 text-lg font-semibold text-emerald-600">
                                                        {formatMoney(totals.totalPaid)}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl bg-orange-50 p-4">
                                                    <p className="text-xs text-slate-500">Balance Due</p>
                                                    <p className="mt-2 text-lg font-semibold text-orange-500">
                                                        {formatMoney(totals.balance)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-slate-800">
                                                    Treatments
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenTreatmentModal(
                                                            client.id
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add Treatment
                                                </button>
                                            </div>

                                            <div className="mt-6 space-y-3">
                                                {client.treatments.length === 0 ? (
                                                    <div className="rounded-2xl bg-slate-50 py-10 text-center text-sm text-slate-500">
                                                        No treatments recorded
                                                    </div>
                                                ) : (
                                                    client.treatments.map((treatment) => {
                                                        const due =
                                                            Number(treatment.total_cost || 0) -
                                                            Number(treatment.amount_paid || 0);
                                                        return (
                                                            <div
                                                                key={treatment.id}
                                                                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-white px-5 py-4 shadow-sm"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                                                        {treatment.type}
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-slate-800">
                                                                            {treatment.description || 'Treatment'}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {formatIsoDate(treatment.date)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-6 text-sm">
                                                                    <div className="text-right">
                                                                        <p className="text-slate-500">
                                                                            Paid:{' '}
                                                                            <span className="font-semibold text-emerald-600">
                                                                                {formatMoney(
                                                                                    Number(
                                                                                        treatment.amount_paid || 0
                                                                                    )
                                                                                )}
                                                                            </span>{' '}
                                                                            /{' '}
                                                                            {formatMoney(
                                                                                Number(
                                                                                    treatment.total_cost || 0
                                                                                )
                                                                            )}
                                                                        </p>
                                                                        <p className="text-orange-500">
                                                                            Due:{' '}
                                                                            {formatMoney(due)}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleEditTreatment(
                                                                                client.id,
                                                                                treatment
                                                                            )
                                                                        }
                                                                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteTreatment(
                                                                                client.id,
                                                                                treatment.id
                                                                            )
                                                                        }
                                                                        className="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showClientModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-purple-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingClientId ? 'Edit Client' : 'Add New Client'}
                            </h2>
                            <button
                                type="button"
                                onClick={handleCloseClientModal}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4 px-6 py-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.first_name}
                                        onChange={(event) =>
                                            clientForm.setData('first_name', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.last_name}
                                        onChange={(event) =>
                                            clientForm.setData('last_name', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={clientForm.data.email}
                                    onChange={(event) =>
                                        clientForm.setData('email', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Phone *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.phone}
                                        onChange={(event) =>
                                            clientForm.setData('phone', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Date of Birth
                                    </label>
                                    <div className="relative mt-2">
                                        <input
                                            type="date"
                                            id="client-dob"
                                            value={clientForm.data.date_of_birth}
                                            onChange={(event) =>
                                                clientForm.setData(
                                                    'date_of_birth',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-2xl border border-purple-100 px-4 py-2 pr-10 text-sm focus:border-purple-400 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById(
                                                    'client-dob'
                                                ) as HTMLInputElement & {
                                                    showPicker?: () => void;
                                                };
                                                input?.showPicker?.();
                                                input?.focus();
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-purple-50 hover:text-purple-600"
                                        >
                                            <Calendar className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">Address</label>
                                <input
                                    type="text"
                                    value={clientForm.data.address}
                                    onChange={(event) =>
                                        clientForm.setData('address', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Allergies
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.allergies}
                                        onChange={(event) =>
                                            clientForm.setData('allergies', event.target.value)
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Medical Conditions
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.medical_conditions}
                                        onChange={(event) =>
                                            clientForm.setData(
                                                'medical_conditions',
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Maintenance
                                    </label>
                                    <input
                                        type="text"
                                        value={clientForm.data.maintenance}
                                        onChange={(event) =>
                                            clientForm.setData(
                                                'maintenance',
                                                event.target.value
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-purple-100 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleCloseClientModal}
                                className="w-full rounded-2xl border border-purple-300 px-4 py-2 text-sm font-semibold text-purple-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitClient}
                                className="w-full rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                            >
                                {editingClientId ? 'Save Changes' : 'Add Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTreatmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-purple-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editingTreatmentId ? 'Edit Treatment' : 'Add Treatment'}
                            </h2>
                            <button
                                type="button"
                                onClick={handleCloseTreatmentModal}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Treatment Type *
                                </label>
                                <select
                                    value={treatmentForm.data.type}
                                    onChange={(event) =>
                                        treatmentForm.setData('type', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                >
                                    <option value="">Select treatment type</option>
                                    <option>General Checkup</option>
                                    <option>Teeth Cleaning</option>
                                    <option>Teeth Whitening</option>
                                    <option>Dental Filling</option>
                                    <option>Root Canal</option>
                                    <option>Tooth Extraction</option>
                                    <option>Orthodontic treatment</option>
                                    <option>Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Date *
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        type="date"
                                        id="treatment-date"
                                        value={treatmentForm.data.date}
                                        onChange={(event) =>
                                            treatmentForm.setData(
                                                'date',
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-purple-100 px-4 py-2 pr-10 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById(
                                                'treatment-date'
                                            ) as HTMLInputElement & {
                                                showPicker?: () => void;
                                            };
                                            input?.showPicker?.();
                                            input?.focus();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        <Calendar className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Description
                                </label>
                                <textarea
                                    value={treatmentForm.data.description}
                                    onChange={(event) =>
                                        treatmentForm.setData('description', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    rows={4}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Total Cost ($) *
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={treatmentForm.data.total_cost}
                                        onChange={(event) =>
                                            treatmentForm.setData(
                                                'total_cost',
                                                event.target.value.replace(/^0+(?=\\d)/, '')
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-600">
                                        Amount Paid ($)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={treatmentForm.data.amount_paid}
                                        onChange={(event) =>
                                            treatmentForm.setData(
                                                'amount_paid',
                                                event.target.value.replace(/^0+(?=\\d)/, '')
                                            )
                                        }
                                        className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm text-slate-600">
                                Balance Due:{' '}
                                <span className="float-right font-semibold text-emerald-600">
                                    $
                                    {Math.max(
                                        0,
                                        Number(treatmentForm.data.total_cost || 0) -
                                            Number(treatmentForm.data.amount_paid || 0)
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-600">
                                    Notes
                                </label>
                                <textarea
                                    value={treatmentForm.data.notes}
                                    onChange={(event) =>
                                        treatmentForm.setData('notes', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-purple-100 px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-purple-100 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleCloseTreatmentModal}
                                className="w-full rounded-2xl border border-purple-300 px-4 py-2 text-sm font-semibold text-purple-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitTreatment}
                                className="w-full rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                            >
                                {editingTreatmentId ? 'Save Changes' : 'Add Treatment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
