import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const verifyToken = async (e) => {
        if (e) e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            setStatus("error");
            setMessage("Please enter a valid 6-digit OTP.");
            return;
        }

        setStatus("loading");
        try {
            const host = window.location.hostname;
            const response = await fetch(`http://${host}:8000/api/verifyEmail.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: otp })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message || "Your email has been verified successfully!");
            } else {
                setStatus("error");
                setMessage(data.message || "Failed to verify email. The OTP may be invalid or expired.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("A network error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Decorative background element for premium aesthetic */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600"></div>

                {status !== "success" && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner transform scale-100 transition-transform duration-500 hover:scale-110">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verify Your Email</h2>
                        <p className="mt-3 text-sm text-gray-500 px-2 leading-relaxed">
                            We've sent a 6-digit One-Time Password (OTP) to your email. Please enter it below to activate your account.
                        </p>
                    </div>
                )}

                {status === "success" ? (
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
                ) : (
                    <form onSubmit={verifyToken} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="otp" className="sr-only">One-Time Password</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="appearance-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 text-center text-2xl tracking-widest font-semibold transition-all duration-200 shadow-sm"
                                placeholder="------"
                            />
                        </div>

                        {status === "error" && (
                            <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === "loading" ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                "Verify Email"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
