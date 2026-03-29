import { Link, useForm } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import SiteFooter from '@/components/marketing/site-footer';
import {
    Calendar,
    Check,
    CircleDot,
    Clock,
    Crown,
    Mail,
    MessageSquare,
    Phone,
    RotateCcw,
    Ruler,
    Sparkles,
    Stethoscope,
    Sun,
    Syringe,
    X,
    User,
} from 'lucide-react';

const services = [
    {
        title: 'General Checkup',
        description: 'Regular exams to maintain optimal oral health',
        icon: <Stethoscope className="h-6 w-6" />,
    },
    {
        title: 'Teeth Cleaning',
        description:
            'Professional cleaning to remove plaque and tartar buildup',
        icon: <Sparkles className="h-6 w-6" />,
    },
    {
        title: 'Teeth Whitening',
        description: 'Brighten your smile with professional whitening',
        icon: <Sun className="h-6 w-6" />,
    },
    {
        title: 'Dental Filling',
        description:
            'Restore damaged teeth with durable, natural-looking fillings',
        icon: <CircleDot className="h-6 w-6" />,
    },
    {
        title: 'Dental Crown',
        description: 'Custom dental crowns for strength and beauty',
        icon: <Crown className="h-6 w-6" />,
    },
    {
        title: 'Root Canal',
        description: 'Save infected teeth with modern root canal therapy',
        icon: <RotateCcw className="h-6 w-6" />,
    },
    {
        title: 'Tooth Extraction',
        description: 'Safe and gentle tooth removal when necessary',
        icon: <Syringe className="h-6 w-6" />,
    },
    {
        title: 'Braces/Orthodontics',
        description: 'Straighten teeth with modern orthodontic solutions',
        icon: <Ruler className="h-6 w-6" />,
    },
];

type BookedSlot = {
    date: string | null;
    time: string;
};

type WelcomeProps = {
    canRegister: boolean;
    bookedSlots: BookedSlot[];
};

const buildTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 8; hour <= 21; hour += 1) {
        for (const minute of [0, 30]) {
            if (hour === 21 && minute > 0) continue;
            const suffix = hour >= 12 ? 'PM' : 'AM';
            const displayHour = ((hour + 11) % 12) + 1;
            const displayMinute = minute.toString().padStart(2, '0');
            options.push(`${displayHour}:${displayMinute} ${suffix}`);
        }
    }
    return options;
};

const timeOptions = buildTimeOptions();

const Welcome = ({ bookedSlots }: WelcomeProps) => {
    const [showSentModal, setShowSentModal] = useState(false);
    const [showDeveloperModal, setShowDeveloperModal] = useState(false);
    const appointmentForm = useForm({
        full_name: '',
        email: '',
        phone: '',
        treatment_type: '',
        allergies: '',
        medical_conditions: '',
        maintenance: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
    });

    const bookedTimesForDate = useMemo(() => {
        if (!appointmentForm.data.preferred_date) return new Set<string>();
        return new Set(
            bookedSlots
                .filter(
                    (slot) => slot.date === appointmentForm.data.preferred_date,
                )
                .map((slot) => slot.time),
        );
    }, [appointmentForm.data.preferred_date, bookedSlots]);

    useEffect(() => {
        if (
            appointmentForm.data.preferred_time &&
            bookedTimesForDate.has(appointmentForm.data.preferred_time)
        ) {
            appointmentForm.setData('preferred_time', '');
        }
    }, [appointmentForm, bookedTimesForDate]);

    const handleScrollToSection = (sectionId: string) => {
        const target = document.getElementById(sectionId);
        if (target) {
            const headerOffset = 96;
            const targetTop =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetTop,
                behavior: 'smooth',
            });
        }
    };

    const handleScrollToAppointment = () => {
        handleScrollToSection('appointment');
    };

    return (
        <div className="min-h-screen scroll-smooth bg-[#f7f4fb] text-slate-800">
            <header className="sticky top-0 z-20 border-b border-purple-100 bg-white/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-semibold text-white shadow">
                            G
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900">
                                GENITA
                            </p>
                            <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                                Dental Clinic
                            </p>
                        </div>
                    </div>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                        <button
                            type="button"
                            onClick={() => handleScrollToSection('services')}
                            className="hover:text-purple-600"
                        >
                            Services
                        </button>
                        <button
                            type="button"
                            onClick={() => handleScrollToSection('about')}
                            className="hover:text-purple-600"
                        >
                            About
                        </button>
                        <button
                            type="button"
                            onClick={() => handleScrollToSection('contact')}
                            className="hover:text-purple-600"
                        >
                            Contact
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeveloperModal(true)}
                            className="hover:text-purple-600"
                        >
                            Developer
                        </button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
                            <Phone className="h-4 w-4 text-purple-500" />
                            <span>+639604193809</span>
                        </div>
                        <Link
                            href="/login"
                            className="rounded-full border border-purple-400 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                        >
                            Staff Login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-6">
                <section className="relative pt-14 pb-16 text-center md:pt-20">
                    <div className="absolute top-10 left-1/2 h-36 w-[32rem] -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl md:h-40" />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-600">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-purple-600">
                                <Check className="h-4 w-4" />
                            </span>
                            Your Trusted Dental Care Partner
                        </span>
                        <h1 className="mt-6 text-4xl font-bold text-slate-900 md:text-6xl">
                            Beautiful Smiles Start at{' '}
                            <span className="text-purple-600">GENITA</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
                            Experience exceptional dental care with our team of
                            skilled professionals. We are committed to giving
                            you the healthy, confident smile you deserve.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button
                                onClick={handleScrollToAppointment}
                                className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                            >
                                Book Appointment
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handleScrollToSection('services')
                                }
                                className="rounded-full border border-purple-400 px-6 py-3 text-sm font-semibold text-purple-600 transition hover:border-purple-600 hover:bg-purple-600 hover:text-white"
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Open 7 Days a Week
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                Patient-Centered Care
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                Modern Equipment
                            </div>
                        </div>
                    </div>
                </section>

                <section id="services" className="pb-20">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Our Services
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
                            Comprehensive dental care tailored to your needs.
                            From routine checkups to advanced treatments, we
                            have got you covered.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="group rounded-3xl bg-white p-6 shadow-lg shadow-purple-100 transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                                    {service.icon}
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                                    {service.title}
                                </h3>
                                <p className="mt-3 text-sm text-slate-500">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    id="appointment"
                    className="rounded-[32px] bg-white px-6 py-12 shadow-2xl shadow-purple-100 md:px-12"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Book an Appointment
                        </h2>
                        <p className="mt-2 text-slate-500">
                            Schedule your visit with us. Pending and approved
                            time slots are unavailable.
                        </p>
                    </div>
                    <form
                        className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            appointmentForm.post('/appointments', {
                                onSuccess: () => {
                                    appointmentForm.reset();
                                    setShowSentModal(true);
                                },
                            });
                        }}
                    >
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4 text-purple-500" />
                                Full Name *
                            </span>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={appointmentForm.data.full_name}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'full_name',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-purple-500" />
                                Email Address *
                            </span>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={appointmentForm.data.email}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-purple-500" />
                                Phone Number *
                            </span>
                            <input
                                type="tel"
                                placeholder="+639604193809"
                                value={appointmentForm.data.phone}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'phone',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-500" />
                                Treatment Type *
                            </span>
                            <select
                                value={appointmentForm.data.treatment_type}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'treatment_type',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-purple-400 focus:outline-none"
                            >
                                <option value="">Select treatment</option>
                                <option>General Checkup</option>
                                <option>Teeth Cleaning</option>
                                <option>Teeth Whitening</option>
                                <option>Dental Filling</option>
                                <option>Root Canal</option>
                                <option>Tooth Extraction</option>
                                <option>Orthodontic treatment</option>
                                <option>Others</option>
                            </select>
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                Allergies
                            </span>
                            <input
                                type="text"
                                placeholder="Optional"
                                value={appointmentForm.data.allergies}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'allergies',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                Medical Conditions
                            </span>
                            <input
                                type="text"
                                placeholder="Optional"
                                value={appointmentForm.data.medical_conditions}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'medical_conditions',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700 md:col-span-2">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                Maintenance
                            </span>
                            <input
                                type="text"
                                placeholder="Optional"
                                value={appointmentForm.data.maintenance}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'maintenance',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                Preferred Date *
                            </span>
                            <div className="relative mt-3">
                                <input
                                    type="date"
                                    id="preferred-date"
                                    value={appointmentForm.data.preferred_date}
                                    onChange={(event) =>
                                        appointmentForm.setData(
                                            'preferred_date',
                                            event.target.value,
                                        )
                                    }
                                    className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 pr-11 text-sm text-slate-700 shadow-sm focus:border-purple-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById(
                                            'preferred-date',
                                        ) as HTMLInputElement & {
                                            showPicker?: () => void;
                                        };
                                        input?.showPicker?.();
                                        input?.focus();
                                    }}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-purple-50 hover:text-purple-600"
                                >
                                    <Calendar className="h-4 w-4" />
                                </button>
                            </div>
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-500" />
                                Preferred Time *
                            </span>
                            <select
                                value={appointmentForm.data.preferred_time}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'preferred_time',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-purple-400 focus:outline-none"
                            >
                                <option value="">Select time</option>
                                {timeOptions.map((time) => (
                                    <option
                                        key={time}
                                        value={time}
                                        disabled={bookedTimesForDate.has(time)}
                                    >
                                        {time}
                                        {bookedTimesForDate.has(time)
                                            ? ' (Booked)'
                                            : ''}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm font-medium text-slate-700 md:col-span-2">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-purple-500" />
                                Additional Notes (Optional)
                            </span>
                            <textarea
                                rows={4}
                                placeholder="Tell us about any specific concerns or questions..."
                                value={appointmentForm.data.notes}
                                onChange={(event) =>
                                    appointmentForm.setData(
                                        'notes',
                                        event.target.value,
                                    )
                                }
                                className="mt-3 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-purple-400 focus:outline-none"
                            />
                        </label>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={appointmentForm.processing}
                                className="w-full rounded-2xl bg-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                            >
                                Request Appointment
                            </button>
                            <p className="mt-3 text-center text-xs text-slate-400">
                                We will contact you to confirm your appointment
                                within 24 hours.
                            </p>
                        </div>
                    </form>
                </section>

                <section id="about" className="mt-16">
                    <div className="mx-auto flex w-full max-w-4xl justify-center">
                        <div className="flex w-full max-w-2xl flex-wrap items-center gap-8 rounded-3xl bg-white px-8 py-6 shadow-xl shadow-purple-100/70 md:flex-nowrap">
                            <div className="h-28 w-28 overflow-hidden rounded-2xl bg-purple-50">
                                <img
                                    src="/photo/download.jpeg"
                                    alt="Dr. Denniel Mariane G. Genita"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
                                    Owner
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-slate-900">
                                    Denniel Mariane G. Genita
                                </h3>
                                <div className="mt-2 space-y-1 text-sm text-slate-500">
                                    <p>+63 960 419 3809</p>
                                    <p>Ubojan, Tubigon, Bohol</p>
                                    <p>genitadenniel@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter
                onBookAppointment={handleScrollToAppointment}
                onNavigateToSection={handleScrollToSection}
            />

            {showSentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Check className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            Appointment Sent
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Thanks! We will review your request and contact you
                            soon.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowSentModal(false)}
                            className="mt-6 w-full rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showDeveloperModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
                                    Developer
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                                    Website & System Development
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeveloperModal(false)}
                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Close developer modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
                            <img
                                src="/photo/image.png"
                                alt="Developer portrait"
                                className="h-32 w-32 rounded-2xl object-cover shadow-md"
                            />
                            <div className="flex-1">
                                <p className="text-sm leading-7 text-slate-500">
                                    This clinic website and admin system were
                                    developed to make appointment handling,
                                    client records, and clinic operations easier
                                    to manage.
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Facebook:
                                        </span>{' '}
                                        Alampayam Jose Victor
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Email:
                                        </span>{' '}
                                        Alampayanjose@gmail.com
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-800">
                                            Instagram:
                                        </span>{' '}
                                        alampayan.jv
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeveloperModal(false)}
                            className="mt-6 w-full rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Welcome;
