
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

export default function ShopForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ownerName: "",
        shopName: "",
        email: "",
        phone: "",
        address: "",
        licenseNumber: "",
        openTime: "08:00",
        closeTime: "17:00",
        providesCarriage: false,
        category: "",
        vehicleCategory: "",
        description: "",
        latitude: 6.9271,
        longitude: 79.8612,
        password: "",
        confirmPassword: "",
        defaultDriverName: "",
        defaultDriverPhone: "",
        defaultTruckBrand: "",
        defaultTruckColor: "",
        towTruckPlate: ""
    });
    const [shopImage, setShopImage] = useState(null);
    const [shopImagePreview, setShopImagePreview] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load the Google Maps API Script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            if ((name === 'category' && value !== 'Garages') || (name === 'providesCarriage' && !checked)) {
                updated.providesCarriage = false;
                updated.defaultDriverName = "";
                updated.defaultDriverPhone = "";
                updated.defaultTruckBrand = "";
                updated.defaultTruckColor = "";
                updated.towTruckPlate = "";
            }
            return updated;
        });
    };

    const handleShopImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setShopImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setShopImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = (e) => {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        setFormData(prev => ({
            ...prev,
            latitude: clickedLat,
            longitude: clickedLng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.category) {
            setError("Please select a workshop category.");
            return;
        }

        if (!formData.vehicleCategory) {
            setError("Please select a vehicle category.");
            return;
        }

        if (!formData.description.trim()) {
            setError("Please provide a description for your shop.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (formData.providesCarriage) {
            if (!formData.defaultDriverName.trim()) {
                setError("Please provide the truck driver's name.");
                return;
            }
            if (!formData.defaultDriverPhone.trim()) {
                setError("Please provide the driver's phone number.");
                return;
            }
            if (!formData.defaultTruckBrand.trim()) {
                setError("Please provide the truck brand name.");
                return;
            }
            if (!formData.defaultTruckColor.trim()) {
                setError("Please provide the truck color.");
                return;
            }
            if (!formData.towTruckPlate.trim()) {
                setError("Please provide the truck vehicle plate number.");
                return;
            }
        }

        if (!shopImage) {
            setError("Please upload a workshop photo.");
            return;
        }

        setLoading(true);

        const payload = new FormData();
        payload.append("ownerName", formData.ownerName);
        payload.append("shopName", formData.shopName);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("address", formData.address);
        payload.append("licenseNumber", formData.licenseNumber);
        payload.append("openTime", formData.openTime);
        payload.append("closeTime", formData.closeTime);
        payload.append("providesCarriage", formData.providesCarriage ? "1" : "0");
        payload.append("category", formData.category);
        payload.append("vehicleCategory", formData.vehicleCategory);
        payload.append("description", formData.description);
        payload.append("latitude", formData.latitude);
        payload.append("longitude", formData.longitude);
        payload.append("password", formData.password);
        payload.append("shopImage", shopImage);
        payload.append("defaultDriverName", formData.defaultDriverName);
        payload.append("defaultDriverPhone", formData.defaultDriverPhone);
        payload.append("defaultTruckBrand", formData.defaultTruckBrand);
        payload.append("defaultTruckColor", formData.defaultTruckColor);
        payload.append("towTruckPlate", formData.towTruckPlate);

        try {
            const response = await fetch("http://localhost:8000/api/registerShop.php", {
                method: "POST",
                body: payload,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 8000);
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8 animate-fade-in max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Verification Email Sent!</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Thank you for registering! We've sent a verification link to <strong className="text-gray-800">{formData.email}</strong>. 
                    Please check your inbox and verify your email to activate your account.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200"
                >
                    Go to Login
                </button>
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

            {/* Owner Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Owner Information
                </h3>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Owner Full Name</label>
                    <input
                        type="text"
                        name="ownerName"
                        required
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Shop Details */}
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Workshop Information
                </h3>

                {/* Shop Image Upload */}
                <div className="flex flex-col md:flex-row items-center gap-4 py-2 bg-slate-50 p-4 rounded-2xl border border-gray-100">
                    <div className="relative group w-full md:w-40 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center shrink-0">
                        {shopImagePreview ? (
                            <img src={shopImagePreview} alt="Shop Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-3xl font-bold">🏢</span>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Workshop Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleShopImageChange}
                            className="hidden"
                            id="shop-image-upload"
                        />
                        <label
                            htmlFor="shop-image-upload"
                            className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all shadow-sm"
                        >
                            {shopImagePreview ? "Change Photo" : "Upload Photo"}
                        </label>
                        <span className="block text-[10px] text-gray-400 mt-1">PNG, JPG, or WEBP up to 5MB</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Workshop / Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            required
                            value={formData.shopName}
                            onChange={handleChange}
                            placeholder="FixGo Auto Care"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Business License / BRN</label>
                        <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            placeholder="e.g. BR-12345-X"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Shop Category</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        >
                            <option value="">Select Category</option>
                            <option value="Garages">Garages</option>
                            <option value="Service centers">Service centers</option>
                            <option value="Spare parts">Spare parts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Vehicle Category</label>
                        <select
                            name="vehicleCategory"
                            required
                            value={formData.vehicleCategory}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        >
                            <option value="">Select Vehicle Category</option>
                            <option value="3 wheelers and bikes">3 Wheelers and Bikes</option>
                            <option value="4 wheelers">4 Wheelers</option>
                            <option value="commercial vehicles">Commercial Vehicles</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Shop Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. +94 11 234 5678"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Shop Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="shop@fixgo.com"
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Shop Physical Address</label>
                    <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Galle Road, Colombo 03"
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    />
                </div>

                {/* Shop Location Picker */}
                <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Shop Coordinates (Click map to pin location or drag marker)</label>
                    <div className="w-full h-[300px] rounded-2xl border border-gray-200 overflow-hidden relative bg-gray-50">
                        {loadError && <div className="p-4 text-xs font-semibold text-red-500">Error loading maps API</div>}
                        {!isLoaded && <div className="p-4 text-xs font-semibold text-green-600 animate-pulse">Loading Map...</div>}
                        {isLoaded && (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={{ lat: formData.latitude, lng: formData.longitude }}
                                zoom={11}
                                onClick={handleMapClick}
                                options={{
                                    disableDefaultUI: false,
                                    zoomControl: true,
                                }}
                            >
                                <Marker
                                    position={{ lat: formData.latitude, lng: formData.longitude }}
                                    draggable={true}
                                    onDragEnd={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: e.latLng.lat(),
                                            longitude: e.latLng.lng()
                                        }));
                                    }}
                                />
                            </GoogleMap>
                        )}
                    </div>
                    <div className="flex gap-4 text-[10px] text-gray-500 font-mono pt-1">
                        <span>Lat: {formData.latitude.toFixed(6)}</span>
                        <span>Lng: {formData.longitude.toFixed(6)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Opening Time</label>
                        <input
                            type="time"
                            name="openTime"
                            required
                            value={formData.openTime}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Closing Time</label>
                        <input
                            type="time"
                            name="closeTime"
                            required
                            value={formData.closeTime}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Vehicle Carriage Services */}
            {formData.category === "Garages" && (
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                        Vehicle Carriage Services
                    </h3>
                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all bg-white mb-2">
                        <input
                            type="checkbox"
                            name="providesCarriage"
                            checked={formData.providesCarriage}
                            onChange={handleChange}
                            className="mt-1 rounded text-green-600 focus:ring-green-500 w-5 h-5 shrink-0"
                        />
                        <div>
                            <span className="block text-sm font-semibold text-gray-950">Do you offer vehicle carriage / towing services?</span>
                            <span className="block text-xs text-gray-500">Check this if your shop provides roadside assistance, towing, or flatbed transport.</span>
                        </div>
                    </label>

                    {formData.providesCarriage && (
                        <div className="p-4 bg-slate-50 border border-gray-200 rounded-2xl space-y-4 animate-fade-in">
                            <h4 className="text-sm font-bold text-gray-800">Towing Truck & Driver Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase">Truck Driver Name</label>
                                    <input
                                        type="text"
                                        name="defaultDriverName"
                                        required={formData.providesCarriage}
                                        value={formData.defaultDriverName}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase">Driver Phone Number</label>
                                    <input
                                        type="tel"
                                        name="defaultDriverPhone"
                                        required={formData.providesCarriage}
                                        value={formData.defaultDriverPhone}
                                        onChange={handleChange}
                                        placeholder="e.g. +94 77 123 4567"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase">Truck Brand Name</label>
                                    <input
                                        type="text"
                                        name="defaultTruckBrand"
                                        required={formData.providesCarriage}
                                        value={formData.defaultTruckBrand}
                                        onChange={handleChange}
                                        placeholder="e.g. Isuzu, Toyota"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase">Truck Color</label>
                                    <input
                                        type="text"
                                        name="defaultTruckColor"
                                        required={formData.providesCarriage}
                                        value={formData.defaultTruckColor}
                                        onChange={handleChange}
                                        placeholder="e.g. White, Blue"
                                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase">Truck Vehicle Plate Number</label>
                                <input
                                    type="text"
                                    name="towTruckPlate"
                                    required={formData.providesCarriage}
                                    value={formData.towTruckPlate}
                                    onChange={handleChange}
                                    placeholder="e.g. WP GA-1234"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Shop Description */}
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Shop Description
                </h3>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Your Shop</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Provide details about the services you offer, experience, or any other features of your workshop..."
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all resize-y"
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
                            Registering Shop...
                        </>
                    ) : (
                        "Register Workshop"
                    )}
                </button>
            </div>
        </form>
    );
}