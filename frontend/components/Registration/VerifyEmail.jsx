import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("No verification token was provided.");
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/verifyEmail.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus("success");
                    setMessage(data.message || "Your email has been verified successfully!");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to verify email. The token may be invalid or expired.");
                }
            } catch (err) {
                setStatus("error");
                setMessage("A network error occurred. Please try again later.");
            }
        };

        // Small delay to make the micro-animations and loading state feel natural and premium
        const timer = setTimeout(() => {
            verifyToken();
        }, 1500);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Decorative background element for premium aesthetic */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"></div>

                {status === "loading" && (
                    <div className="text-center py-6 flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            {/* Outer animated ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
                            {/* Inner spinning element */}
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
                        </div>
                        <h2 className="mt-6 text-xl font-bold text-gray-900 animate-pulse">Verifying Your Email</h2>
                        <p className="mt-2 text-sm text-gray-500">Please wait while we validate your activation token...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transform scale-100 transition-transform duration-500 hover:scale-110">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account Activated!</h2>
                        <p className="mt-3 text-sm text-gray-500 px-2 leading-relaxed">{message}</p>
                        
                        <div className="mt-8">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                                Sign In Now
                            </button>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transform scale-100 transition-transform duration-500 hover:scale-110">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Failed</h2>
                        <p className="mt-3 text-sm text-gray-500 px-2 leading-relaxed">{message}</p>
                        
                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-4 bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
