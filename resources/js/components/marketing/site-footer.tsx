type SiteFooterProps = {
    onBookAppointment: () => void;
    onNavigateToSection: (sectionId: string) => void;
};

export default function SiteFooter({
    onBookAppointment,
    onNavigateToSection,
}: SiteFooterProps) {
    return (
        <footer
            id="contact"
            className="mt-20 bg-[#221728] pb-12 pt-16 text-slate-300"
        >
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-4">
                <div>
                    <div className="flex items-center gap-3">
                        <img
                            src="/photo/download.jpeg"
                            alt="Genita profile"
                            className="h-12 w-12 rounded-2xl object-cover"
                        />
                        <div>
                            <p className="text-lg font-semibold text-white">
                                GENITA
                            </p>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Dental Clinic
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">
                        Providing quality dental care with a gentle touch. Your
                        smile is our priority.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">
                        Contact Us
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                        <p>+639604193809</p>
                        <p>genitadenniel@gmail.com</p>
                        <p>Ubojan, Tubigon, Bohol</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">Hours</h3>
                        <div className="mt-4 space-y-3 text-sm text-slate-400">
                            <p>Mon - Fri: 8AM - 9PM</p>
                            <p>Sat - Sun: 9AM - 8PM</p>
                        </div>
                </div>
                <div id="about">
                    <h3 className="text-sm font-semibold text-white">
                        Quick Links
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                        <button
                            type="button"
                            onClick={() => onNavigateToSection('services')}
                            className="block text-left hover:text-white"
                        >
                            Services
                        </button>
                        <button
                            type="button"
                            onClick={onBookAppointment}
                            className="text-left hover:text-white"
                        >
                            Book Appointment
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigateToSection('about')}
                            className="block text-left hover:text-white"
                        >
                            About Us
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-12 w-full max-w-6xl px-6">
                <div className="h-px w-full bg-white/10" />
                <p className="mt-6 text-center text-xs text-slate-500">
                    (c) 2026 GENITA Dental Clinic. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
