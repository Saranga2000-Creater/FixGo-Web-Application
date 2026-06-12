

import { Outlet, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Form() {
    const location = useLocation();
    const isCustomer = location.pathname.includes("customer");

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white border-b border-gray-100 shadow-sm">
                <Link to="/" className="text-2xl font-black text-green-700 tracking-tight flex items-center gap-2">
                    Fix<span className="text-black">Go</span>
                </Link>
                <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to Home
                </Link>
            </header>

            {/* Container for Forms */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <span className="inline-block px-3 py-1 mb-3 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider">
                            {isCustomer ? "Vehicle Owner" : "Workshop Partner"}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
                            {isCustomer ? "Register as a Customer" : "Register Your Workshop"}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            {isCustomer 
                                ? "Join FixGo to manage your vehicle services and get roadside support." 
                                : "Digitize your automotive business, schedule appointments, and grow."
                            }
                        </p>
                    </div>

                    <Outlet />
                </div>
            </main>
        </div>
    );
}