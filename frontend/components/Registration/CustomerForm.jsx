import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        vehicleType: "",
        vehicleModel: "",
        plateNumber: ""
    });
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            // Mock backend API call delay
            await new Promise((resolve) => setTimeout(resolve, 1200));

            console.log("Customer registration payload:", {
                ...formData,
                profilePicture: profilePic ? profilePic.name : null
            });
            setSuccess(true);
            
            // Redirect after showing success message
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-gray-500 text-sm">Welcome to FixGo! Redirecting you to the home page...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                    {error}
                </div>
            )}

            {/* Personal Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Personal Details
                </h3>

                {/* Profile Picture Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-4 py-2 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                    <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-white flex items-center justify-center shrink-0">
                        {profilePicPreview ? (
                            <img src={profilePicPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-3xl font-bold">👤</span>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                            id="profile-pic-upload"
                        />
                        <label
                            htmlFor="profile-pic-upload"
                            className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all shadow-sm"
                        >
                            {profilePicPreview ? "Change Photo" : "Upload Photo"}
                        </label>
                        <span className="block text-[10px] text-gray-400 mt-1">PNG, JPG, or WEBP up to 5MB</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. +94 77 123 4567"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Security */}
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Registering...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </div>
        </form>
    );
}