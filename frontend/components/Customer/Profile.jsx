import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api, UPLOADS_URL } from "../../src/services/api";

import {
    faCalendarDays,
    faCar,
    faChevronRight,
    faCircleCheck,
    faEnvelope,
    faLock,
    faMapPin,
    faPhone,
    faPlus,
    faStar,
    faUser,
    faPen,
    faCamera,
    faXmark,
    faSave,
    faSpinner,
    faCheckCircle,
    faExclamationCircle,
    faTrash,
    faCarSide,
} from "@fortawesome/free-solid-svg-icons";

const FONT = "'Segoe UI', system-ui, sans-serif";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=16a34a&color=fff&name=";

function StatsCard({ icon, title, value, iconBg, iconColor }) {
    return (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl py-3 px-3.5">
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: iconBg }}>
                <FontAwesomeIcon icon={icon} className="text-[15px]" style={{ color: iconColor }} />
            </div>
            <div>
                <p className="text-[11px] text-gray-500 font-mono m-0">{title}</p>
                <p className="text-xl font-bold text-gray-900 m-0">{value}</p>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
            <p className="text-[13px] text-gray-500 m-0">{label}</p>
            <p className="text-[13px] font-semibold text-gray-900 m-0">{value}</p>
        </div>
    );
}

function SecurityRow({ label, value, actionLabel, onAction }) {
    return (
        <div className="flex justify-between items-center bg-gray-50 rounded-[10px] py-3 px-4 border border-gray-100">
            <div>
                <p className="text-[13px] text-gray-500 m-0">{label}</p>
                <p className="text-[13px] font-semibold text-gray-900 m-0">{value}</p>
            </div>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer hover:underline"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

function Profile({ initialModalOpen = false, initialTab = "info" }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Account Overview stats
    const [stats, setStats] = useState({
        totalRepairs:  0,
        completed:     0,
        appointments:  0,
        reviewsGiven:  0,
    });

    // Edit modal states
    const [isModalOpen, setIsModalOpen] = useState(initialModalOpen);
    const [activeTab, setActiveTab] = useState(initialTab); // "info" | "password"
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [vehicleCategories, setVehicleCategories] = useState([]);
    const [vehicleFormData, setVehicleFormData] = useState({ id: null, brand: "", color: "", vehicle_category_id: "" });
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    useEffect(() => {
        if (initialModalOpen) {
            setIsModalOpen(true);
        }
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialModalOpen, initialTab]);

    const fetchProfile = () => {
        api.get("customer/getCustomerProfile.php")
            .then((data) => {
                if (data.success) {
                    setCustomer(data);
                    setFormData({
                        name: data.name || "",
                        phone: data.contactNumber || "",
                        address: data.address || "",
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    });
                } else {
                    setError(data.message || "Failed to load profile");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Could not connect to server");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProfile();
        api.get("customer/getVehicles.php").then(res => {
            if (res.success) setVehicles(res.vehicles || []);
        });
        api.get("search/getCategories.php").then(res => {
            if (res.vehicles) setVehicleCategories(res.vehicles);
        });
    }, []);
    
    const fetchVehicles = () => {
        api.get("customer/getVehicles.php").then(res => {
            if (res.success) setVehicles(res.vehicles || []);
        });
    };

    // Fetch Account Overview stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [requestsData, reviewsData] = await Promise.all([
                    api.get("customer/getCustomerRequest.php"),
                    api.get("customer/getCustomerReviews.php"),
                ]);

                const all = (requestsData?.data || []);
                setStats({
                    totalRepairs:  all.length,
                    completed:     all.filter(r => r.status === "Completed").length,
                    appointments:  all.filter(r => ["Confirmed", "Accepted"].includes(r.status)).length,
                    reviewsGiven:  (reviewsData?.data || reviewsData?.reviews || []).length,
                });
            } catch {
                // silently fail — stats remain 0
            }
        };
        fetchStats();
    }, []);

    const openEditModal = (tab = "info") => {
        if (customer) {
            setFormData({
                name: customer.name || "",
                phone: customer.contactNumber || "",
                address: customer.address || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setModalError("");
        setModalSuccess("");
        setActiveTab(tab);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setModalError("Profile photo must be under 5MB.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setModalError("");
        }
    };

    const handleSaveVehicle = async (e) => {
        e.preventDefault();
        setModalError(""); setModalSuccess(""); setSaving(true);
        try {
            const url = vehicleFormData.id ? "customer/updateVehicle.php" : "customer/addVehicle.php";
            const res = await api.post(url, vehicleFormData);
            if (res.success) {
                setModalSuccess(res.message);
                fetchVehicles();
                setIsEditingVehicle(false);
            } else {
                setModalError(res.message || "Failed to save vehicle.");
            }
        } catch (err) {
            setModalError(err.message || "An error occurred.");
        } finally {
            setSaving(false);
        }
    };
    
    const handleDeleteVehicle = async (id) => {
        try {
            const res = await api.post("customer/deleteVehicle.php", { id });
            if (res.success) {
                setModalSuccess("Vehicle deleted successfully.");
                fetchVehicles();
                setDeleteConfirmId(null);
                setTimeout(() => setModalSuccess(""), 2000);
            } else {
                setModalError(res.message || "Failed to delete vehicle.");
            }
        } catch (err) {
            setModalError(err.message || "An error occurred.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setModalError("");
        setModalSuccess("");

        if (!formData.name.trim()) {
            setModalError("Name is required.");
            return;
        }

        if (!formData.phone.trim()) {
            setModalError("Phone number is required.");
            return;
        }

        const phoneRegex = /^(?:\+94\d{9}|0\d{9})$/;
        if (!phoneRegex.test(formData.phone.trim())) {
            setModalError("Invalid Sri Lankan phone format (e.g., 0771234567 or +94771234567).");
            return;
        }

        if (!formData.address.trim()) {
            setModalError("Address is required.");
            return;
        }

        if (activeTab === "password" || formData.newPassword.trim() !== "") {
            if (!formData.currentPassword) {
                setModalError("Current password is required to set a new password.");
                return;
            }
            if (formData.newPassword.length < 6) {
                setModalError("New password must be at least 6 characters long.");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setModalError("New password and confirm password do not match.");
                return;
            }
        }

        setSaving(true);

        try {
            const body = new FormData();
            body.append("name", formData.name.trim());
            body.append("phone", formData.phone.trim());
            body.append("address", formData.address.trim());

            if (selectedFile) {
                body.append("profilePic", selectedFile);
            }

            if (formData.newPassword.trim() !== "") {
                body.append("currentPassword", formData.currentPassword);
                body.append("newPassword", formData.newPassword.trim());
            }

            const res = await api.post("customer/updateCustomerProfile.php", body);

            if (res.success) {
                setCustomer(res);
                setModalSuccess("Profile updated successfully!");
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSaving(false);
                    setModalSuccess("");
                }, 1200);
            } else {
                setModalError(res.message || "Failed to update profile.");
                setSaving(false);
            }
        } catch (err) {
            setModalError(err.message || "Failed to save changes. Please try again.");
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <p className="text-[13px] text-gray-500">Loading profile...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center py-20">
            <p className="text-[13px] text-red-600">{error}</p>
        </div>
    );

    // Strip out quotes and old IPs
    const cleanProfilePhoto = customer.profilePhoto ? customer.profilePhoto.replace(/['"]/g, '') : null;
    let avatarSrc = DEFAULT_AVATAR + encodeURIComponent(customer.name);

    if (cleanProfilePhoto) {
        if (cleanProfilePhoto.startsWith("http")) {
            try {
                const urlObj = new URL(cleanProfilePhoto);
                avatarSrc = `${UPLOADS_URL}${urlObj.pathname}`;
            } catch (error) {
                avatarSrc = cleanProfilePhoto;
            }
        } else {
            avatarSrc = `${UPLOADS_URL}/${cleanProfilePhoto.replace(/^\//, '')}`;
        }
    }

    return (
        <div className="flex flex-col gap-5" style={{ fontFamily: FONT }}>

            {/* ── Page heading — mirrors Admin DashboardView header ── */}
            <div
                className="rounded-[18px] p-6 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex justify-between items-center"
                style={{ background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)" }}
            >
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 m-0">My Profile</h1>
                    <p className="text-gray-500 mt-1.5 mb-0 text-sm">
                        Manage your personal information, addresses and preferences.
                    </p>
                </div>
                <button
                    onClick={() => openEditModal("info")}
                    className="flex items-center gap-2 bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl border-none shadow-sm hover:bg-green-700 cursor-pointer transition-all duration-150"
                >
                    <FontAwesomeIcon icon={faPen} className="text-xs" /> Edit Profile
                </button>
            </div>

            {/* ── Profile hero card ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex flex-wrap gap-6 items-start">

                    {/* Avatar + contact details */}
                    <div className="flex gap-6 flex-1 min-w-[280px] items-start">
                        <div className="relative group cursor-pointer" onClick={() => openEditModal("info")}>
                            <img
                                src={avatarSrc}
                                alt={customer.name}
                                className="w-[100px] h-[100px] rounded-full object-cover flex-shrink-0"
                                style={{ outline: "3px solid rgba(22,163,74,0.08)", outlineOffset: 2 }}
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FontAwesomeIcon icon={faCamera} className="text-white text-lg" />
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-[22px] font-bold text-gray-900 m-0">{customer.name}</h2>
                                <span className="rounded-full py-[3px] px-3 text-[11px] font-bold text-green-600" style={{ background: "rgba(22,163,74,0.08)" }}>
                                    Customer
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 mb-3">
                                Member since {customer.memberSince}
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {[
                                    { icon: faEnvelope, val: customer.email },
                                    { icon: faPhone, val: customer.contactNumber || "Not provided" },
                                    { icon: faMapPin, val: customer.address || "Not provided" },
                                ].map(({ icon, val }) => (
                                    <div key={val} className="flex items-center gap-2 text-[13px] text-gray-500">
                                        <FontAwesomeIcon icon={icon} className="text-green-600 opacity-60 w-3.5" />
                                        <span>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account overview */}
                    <div className="bg-gray-50 border border-gray-200 rounded-[18px] p-5 min-w-[280px] w-[400px] flex-shrink-0">
                        <p className="text-[13px] font-bold text-gray-900 mb-3.5 mt-0">Account Overview</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            <StatsCard icon={faCar} title="Total Repairs" value={String(stats.totalRepairs)} iconBg="rgba(22,163,74,0.08)" iconColor="#16A34A" />
                            <StatsCard icon={faCircleCheck} title="Completed" value={String(stats.completed)} iconBg="rgba(22, 163, 74,0.08)" iconColor="#16A34A" />
                            <StatsCard icon={faCalendarDays} title="Appointments" value={String(stats.appointments)} iconBg="#EDF3FF" iconColor="#2563EB" />
                            <StatsCard icon={faStar} title="Reviews Given" value={String(stats.reviewsGiven)} iconBg="#F5EDFF" iconColor="#A855F7" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Personal info + Addresses ── */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

                {/* Personal Info */}
                <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                            <h3 className="text-[15px] font-bold text-gray-900 m-0">Personal Information</h3>
                        </div>
                        <button
                            onClick={() => openEditModal("info")}
                            className="flex items-center gap-[5px] text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer hover:underline"
                        >
                            <FontAwesomeIcon icon={faPen} className="text-[10px]" /> Edit
                        </button>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        <InfoRow label="Full Name" value={customer.name} />
                        <InfoRow label="Email Address" value={customer.email} />
                        <InfoRow label="Phone Number" value={customer.contactNumber || "Not provided"} />
                        <InfoRow label="Address" value={customer.address || "Not provided"} />
                        <InfoRow label="Member Since" value={customer.memberSince} />
                    </div>
                </div>

                {/* Addresses */}
                <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapPin} className="text-gray-400" />
                            <h3 className="text-[15px] font-bold text-gray-900 m-0">Addresses</h3>
                        </div>
                        <button
                            onClick={() => openEditModal("info")}
                            className="flex items-center gap-[5px] text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer"
                            style={{ fontFamily: FONT }}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Edit Address
                        </button>
                    </div>

                    {customer.address ? (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <span className="rounded-full py-[3px] px-3 text-[11px] font-bold text-green-600" style={{ background: "rgba(22,163,74,0.08)" }}>
                                Primary Address
                            </span>
                            <p className="text-[13px] text-gray-700 mt-2.5 mb-2">
                                {customer.address}
                            </p>
                            <p className="text-[13px] text-gray-500 m-0">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600 opacity-60" />
                                {customer.contactNumber || "No number"}
                            </p>
                        </div>
                    ) : (
                        <p className="text-[13px] text-gray-400">No address saved yet.</p>
                    )}

                    <button
                        onClick={() => openEditModal("info")}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-transparent text-[13px] font-bold text-green-600 cursor-pointer transition-colors duration-150 hover:bg-[rgba(22,163,74,0.08)]"
                        style={{ border: "1.5px dashed rgba(22,163,74,0.33)", fontFamily: FONT }}
                    >
                        <FontAwesomeIcon icon={faPen} className="text-[11px]" /> Update Address
                    </button>
                </div>
            </div>

            {/* ── Lower Section (Security & Vehicles) ── */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {/* My Vehicles */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCarSide} className="text-gray-400" />
                        <h3 className="text-[15px] font-bold text-gray-900 m-0">My Vehicles</h3>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditingVehicle(false);
                            setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" });
                            openEditModal("vehicles");
                        }}
                        className="flex items-center gap-[5px] text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer"
                        style={{ fontFamily: FONT }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Vehicle
                    </button>
                </div>

                {vehicles.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {vehicles.map(v => {
                            const cat = vehicleCategories.find(c => c.id == v.vehicle_category_id);
                            return (
                                <div key={v.id} className="flex justify-between items-center p-3.5 bg-gray-50 border border-gray-200 rounded-[10px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[rgba(22,163,74,0.08)] flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCarSide} className="text-green-600 text-[15px]" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-gray-900 m-0">{v.brand}</p>
                                            <p className="text-[12px] text-gray-500 m-0">{v.color} • {cat ? cat.name : "Vehicle"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id });
                                                setIsEditingVehicle(true);
                                                openEditModal("vehicles");
                                            }}
                                            className="text-[11px] font-bold text-green-600 bg-transparent border-none cursor-pointer hover:underline"
                                        >
                                            Edit
                                        </button>
                                        {deleteConfirmId === v.id ? (
                                            <button 
                                                onClick={() => handleDeleteVehicle(v.id)} 
                                                className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 cursor-pointer"
                                            >
                                                Confirm?
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setDeleteConfirmId(v.id)} 
                                                className="text-[11px] font-bold text-gray-400 hover:text-red-600 bg-transparent border-none cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                            <FontAwesomeIcon icon={faCarSide} className="text-gray-300 text-lg" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-700 m-0">Your garage is empty</p>
                        <p className="text-[12px] text-gray-500 mt-1 mb-4">Add your vehicles for faster service requests.</p>
                        <button
                            onClick={() => {
                                setIsEditingVehicle(false);
                                setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" });
                                openEditModal("vehicles");
                            }}
                            className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            Add Your First Vehicle
                        </button>
                    </div>
                )}
            </div>

            {/* Security */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2 mb-5">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                    <h3 className="text-[15px] font-bold text-gray-900 m-0">Security</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                    <SecurityRow
                        label="Password"
                        value="••••••••••"
                        actionLabel="Change Password"
                        onAction={() => openEditModal("password")}
                    />
                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </div>

            
            </div>

            {/* ── Edit Profile Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[540px] overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 m-0">Edit Profile</h3>
                                <p className="text-xs text-gray-500 m-0 mt-0.5">Update your personal account details and password.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 border-none bg-transparent cursor-pointer transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} className="text-base" />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-gray-100 bg-white px-6">
                            <button
                                onClick={() => { setActiveTab("info"); setModalError(""); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "info" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Personal Info & Photo
                            </button>
                            <button
                                onClick={() => { setActiveTab("password"); setModalError(""); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "password" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                Security & Password
                            </button>
                            <button
                                onClick={() => { setActiveTab("vehicles"); setModalError(""); setIsEditingVehicle(false); setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" }); }}
                                className={`py-3 px-4 text-xs font-bold border-b-2 bg-transparent cursor-pointer transition-colors ${activeTab === "vehicles" ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                            >
                                My Vehicles
                            </button>
                        </div>

                        <form onSubmit={activeTab === "vehicles" ? (isEditingVehicle ? handleSaveVehicle : handleSaveVehicle) : handleSave} className="p-6 flex flex-col gap-4">

                            {modalError && (
                                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="flex-shrink-0" />
                                    <span>{modalError}</span>
                                </div>
                            )}

                            {modalSuccess && (
                                <div className="flex items-center gap-2 p-3 text-xs bg-green-50 text-green-700 rounded-xl border border-green-200">
                                    <FontAwesomeIcon icon={faCheckCircle} className="flex-shrink-0" />
                                    <span>{modalSuccess}</span>
                                </div>
                            )}

                            {activeTab === "info" && (
                                <>
                                    {/* Profile Photo Upload */}
                                    <div className="flex items-center gap-4 py-2 border-b border-gray-100">
                                        <div className="relative">
                                            <img
                                                src={previewUrl || avatarSrc}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                                                <FontAwesomeIcon icon={faCamera} /> Change Photo
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-[11px] text-gray-400 mt-1 m-0">Max 5MB. JPG, PNG or WEBP.</p>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">Phone Number *</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                            placeholder="077XXXXXXX or +9477XXXXXXX"
                                            required
                                        />
                                        <p className="text-[11px] text-gray-400 m-0">Valid Sri Lankan phone number format.</p>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">Address *</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                                            placeholder="Enter your primary address"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === "vehicles" && (
                                <>
                                    {!isEditingVehicle && vehicles.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-bold text-gray-900 m-0">Saved Vehicles</h4>
                                                <button type="button" onClick={() => { setIsEditingVehicle(true); setVehicleFormData({ id: null, brand: "", color: "", vehicle_category_id: "" }); }} className="text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer">
                                                    + Add New
                                                </button>
                                            </div>
                                            {vehicles.map(v => {
                                                const cat = vehicleCategories.find(c => c.id == v.vehicle_category_id);
                                                return (
                                                    <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                        <div>
                                                            <p className="text-[13px] font-bold text-gray-900 m-0">{v.brand}</p>
                                                            <p className="text-[11px] text-gray-500 m-0">{v.color} • {cat ? cat.name : "Vehicle"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button type="button" onClick={() => { setVehicleFormData({ id: v.id, brand: v.brand, color: v.color, vehicle_category_id: v.vehicle_category_id }); setIsEditingVehicle(true); }} className="text-[11px] font-bold text-blue-600 bg-transparent border-none cursor-pointer hover:underline">Edit</button>
                                                            {deleteConfirmId === v.id ? (
                                                                <button type="button" onClick={() => handleDeleteVehicle(v.id)} className="text-[11px] font-bold text-white bg-red-600 px-2 py-1 rounded cursor-pointer hover:bg-red-700 border-none">Sure?</button>
                                                            ) : (
                                                                <button type="button" onClick={() => setDeleteConfirmId(v.id)} className="text-[11px] font-bold text-red-600 bg-transparent border-none cursor-pointer hover:underline"><FontAwesomeIcon icon={faTrash} /></button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-bold text-gray-900 m-0">{vehicleFormData.id ? "Edit Vehicle" : "Add New Vehicle"}</h4>
                                                {vehicles.length > 0 && (
                                                    <button type="button" onClick={() => setIsEditingVehicle(false)} className="text-[11px] text-gray-500 bg-transparent border-none cursor-pointer hover:underline">Cancel Edit</button>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Vehicle Type *</label>
                                                <select
                                                    value={vehicleFormData.vehicle_category_id}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, vehicle_category_id: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    required
                                                >
                                                    <option value="">Select Type</option>
                                                    {vehicleCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Brand / Make *</label>
                                                <input
                                                    type="text"
                                                    value={vehicleFormData.brand}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, brand: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    placeholder="e.g. Toyota Camry"
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-gray-700">Color *</label>
                                                <input
                                                    type="text"
                                                    value={vehicleFormData.color}
                                                    onChange={e => setVehicleFormData({...vehicleFormData, color: e.target.value})}
                                                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                                                    placeholder="e.g. Silver"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {activeTab === "password" && (
                                <>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                                        To change your password, please enter your current password and your new password.
                                    </div>

                                    {/* Current Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">Current Password *</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">New Password *</label>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                            placeholder="Minimum 6 characters"
                                        />
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700">Confirm New Password *</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Actions */}
                            <div className="flex justify-end items-center gap-3 pt-3 mt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl border-none cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl border-none cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                                >
                                    {saving ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="text-xs" /> {activeTab === "vehicles" && !isEditingVehicle && vehicles.length > 0 ? "Done" : "Save Changes"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;