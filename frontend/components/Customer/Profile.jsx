import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

function SecurityRow({ label, value }) {
    return (
        <div className="flex justify-between items-center bg-gray-50 rounded-[10px] py-3 px-4 border border-gray-100">
            <p className="text-[13px] text-gray-500 m-0">{label}</p>
            <p className="text-[13px] font-semibold text-gray-900 m-0">{value}</p>
        </div>
    );
}

function Profile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8000/api/getCustomerProfile.php", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCustomer(data);
                else setError(data.message || "Failed to load profile");
                setLoading(false);
            })
            .catch(() => {
                setError("Could not connect to server");
                setLoading(false);
            });
    }, []);

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

    const avatarSrc = customer.profilePhoto
        ? customer.profilePhoto
        : DEFAULT_AVATAR + encodeURIComponent(customer.name);

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
            </div>

            {/* ── Profile hero card ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex flex-wrap gap-6 items-start">

                    {/* Avatar + contact details */}
                    <div className="flex gap-6 flex-1 min-w-[280px] items-start">
                        <img
                            src={avatarSrc}
                            alt={customer.name}
                            className="w-[100px] h-[100px] rounded-full object-cover flex-shrink-0"
                            style={{ outline: "3px solid rgba(22,163,74,0.08)", outlineOffset: 2 }}
                        />
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
                                    { icon: faPhone,    val: customer.contactNumber || "Not provided" },
                                    { icon: faMapPin,   val: customer.address       || "Not provided" },
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
                            <StatsCard icon={faCar}          title="Total Repairs"     value="0" iconBg="rgba(22,163,74,0.08)"  iconColor="#16A34A" />
                            <StatsCard icon={faCircleCheck}  title="Completed"         value="0" iconBg="rgba(13,148,136,0.08)" iconColor="#0D9488" />
                            <StatsCard icon={faCalendarDays} title="Appointments"      value="0" iconBg="#EDF3FF" iconColor="#2563EB" />
                            <StatsCard icon={faStar}         title="Reviews Given"     value="0" iconBg="#F5EDFF" iconColor="#A855F7" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Personal info + Addresses ── */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

                {/* Personal Info */}
                <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        <h3 className="text-[15px] font-bold text-gray-900 m-0">Personal Information</h3>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        <InfoRow label="Full Name"     value={customer.name} />
                        <InfoRow label="Email Address" value={customer.email} />
                        <InfoRow label="Phone Number"  value={customer.contactNumber || "Not provided"} />
                        <InfoRow label="Address"       value={customer.address       || "Not provided"} />
                        <InfoRow label="Member Since"  value={customer.memberSince} />
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
                            className="flex items-center gap-[5px] text-xs font-bold text-green-600 bg-transparent border-none cursor-pointer"
                            style={{ fontFamily: FONT }}
                        >
                            <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add New
                        </button>
                    </div>

                    {customer.address ? (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <span className="rounded-full py-[3px] px-3 text-[11px] font-bold text-green-600" style={{ background: "rgba(22,163,74,0.08)" }}>
                                Default
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
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-[10px] bg-transparent text-[13px] font-bold text-green-600 cursor-pointer transition-colors duration-150 hover:bg-[rgba(22,163,74,0.08)]"
                        style={{ border: "1.5px dashed rgba(22,163,74,0.33)", fontFamily: FONT }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-[11px]" /> Add New Address
                    </button>
                </div>
            </div>

            {/* ── Security ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2 mb-5">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                    <h3 className="text-[15px] font-bold text-gray-900 m-0">Security</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                    <SecurityRow label="Password"     value="••••••••••" />
                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </div>

        </div>
    );
}

export default Profile;