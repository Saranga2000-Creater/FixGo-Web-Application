import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { 
    FaFileSignature, 
    FaGavel, 
    FaUserShield, 
    FaShieldAlt, 
    FaEdit, 
    FaBookOpen
} from "react-icons/fa";

function TermsConditions() {
    const [activeSection, setActiveSection] = useState(1);

    const sections = [
        {
            id: 1,
            title: "Acceptance of Terms",
            icon: FaFileSignature,
            content: "By accessing or using the FixGo platform (including our website, services, and mobile application), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services. Your continued use of the platform signifies your acceptance of any future amendments to these terms."
        },
        {
            id: 2,
            title: "Description of Services",
            icon: FaBookOpen,
            content: "FixGo connects vehicle owners seeking repair and maintenance services with third-party service providers (workshop owners). FixGo does not perform repairs, guarantee workshop availability, or take responsibility for repair quality. All repair agreements, appointments, and financial transactions are made directly between the customer and the workshop."
        },
        {
            id: 3,
            title: "User Obligations & Conduct",
            icon: FaUserShield,
            content: "As a user of our platform, you agree to provide accurate, complete, and current information when registering an account. You must maintain the confidentiality of your account credentials and are fully responsible for all activities occurring under your account. You agree to interact with workshops and other platform users respectfully and in good faith, avoiding any fraudulent or harmful activity."
        },
        {
            id: 4,
            title: "Limitation of Liability",
            icon: FaShieldAlt,
            content: "To the maximum extent permitted by law, FixGo shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our platform, or from service quality, pricing disputes, or vehicle damage caused by registered workshops. Workshops are independent businesses and are not agents or employees of FixGo."
        },
        {
            id: 5,
            title: "Modifications to Terms",
            icon: FaEdit,
            content: "We reserve the right to modify these terms at any time. Updates will be posted on this page with an updated 'Last Updated' date. Your continued use of the platform after updates are posted constitutes your acceptance of the revised terms. We recommend reviewing this document periodically to stay informed of any changes."
        }
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(`section-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
            <NavBar />
            
            {/* Background Aesthetic Blobs */}
            <div className="absolute top-24 -left-48 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none" />
            <div className="absolute top-96 -right-48 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse pointer-events-none" />

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 md:px-8 py-12 relative z-10">
                {/* Hero / Header Section */}
                <div 
                    className="rounded-[32px] p-8 md:p-12 border border-white/80 shadow-[0_20px_50px_rgba(22,163,74,0.04)] mb-8 text-center relative overflow-hidden backdrop-blur-md"
                    style={{ background: "linear-gradient(135deg, rgba(238,247,240,0.9) 0%, rgba(255,255,255,0.9) 100%)" }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full" />
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-700 bg-green-100/80 px-4 py-2 rounded-full mb-4">
                        <FaGavel className="text-[10px]" /> FixGo Legal Documentation
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 mb-3 tracking-tight leading-none">
                        Terms & <span className="text-green-600">Conditions</span>
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium">
                        Please review our agreement terms. They outline rules, responsibilities, and guidelines for using the FixGo platform.
                    </p>
                </div>

                {/* Horizontal Navigation Bar (replacing vertical sidebar & search) */}
                <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md rounded-2xl p-2 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-10 flex flex-wrap items-center justify-center gap-1.5">
                    {sections.map((sec) => {
                        const IconComponent = sec.icon;
                        return (
                            <button
                                key={sec.id}
                                onClick={() => scrollToSection(sec.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 border-none cursor-pointer ${activeSection === sec.id ? "bg-green-600 text-white shadow-md shadow-green-500/20" : "bg-transparent text-slate-600 hover:bg-green-50 hover:text-green-700"}`}
                            >
                                <IconComponent className="text-sm shrink-0" />
                                <span>{sec.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Policy Sections List */}
                <div className="space-y-6">
                    {sections.map((sec) => {
                        const IconComponent = sec.icon;
                        return (
                            <article 
                                key={sec.id} 
                                id={`section-${sec.id}`}
                                className={`bg-white rounded-3xl p-6 md:p-8 border transition-all duration-300 ${activeSection === sec.id ? "border-green-400 shadow-md shadow-green-500/5 ring-1 ring-green-500/20" : "border-slate-100 hover:border-slate-200 shadow-xs"}`}
                                onClick={() => setActiveSection(sec.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${activeSection === sec.id ? "bg-green-600 text-white" : "bg-green-50 text-green-600"}`}>
                                        <IconComponent className="text-lg" />
                                    </div>
                                    <div className="space-y-3 flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                                Section 0{sec.id}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{sec.title}</h2>
                                        <p className="text-slate-600 text-sm leading-relaxed font-sans">
                                            {sec.content}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default TermsConditions;
