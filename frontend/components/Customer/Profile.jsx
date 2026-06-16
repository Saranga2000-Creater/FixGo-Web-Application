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

// default avatar if customer has no profile photo
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=16a34a&color=fff&name=";

// ── PageFooter ────────────────────────────────────────────────
function PageFooter() {
    return (
        <footer className="flex flex-col gap-2 py-1 text-xs text-[#274c3a]/50 font-mono md:flex-row md:items-center md:justify-between">
            <p>© 2026 FixGo. All rights reserved.</p>
            <p>Version 1.0.0</p>
        </footer>
    );
}

// ── StatsCard ─────────────────────────────────────────────────
function StatsCard({ icon, title, value, color }) {
    const s = {
        green:  { bg: "bg-[#16a34a]/10", text: "text-[#16a34a]",  border: "border-[#d1e7d7]" },
        teal:   { bg: "bg-[#0d9488]/10", text: "text-[#0d9488]",  border: "border-[#99f6e4]/60" },
        blue:   { bg: "bg-[#2563eb]/10", text: "text-[#2563eb]",  border: "border-[#bfdbfe]/60" },
        violet: { bg: "bg-[#a855f7]/10", text: "text-[#a855f7]",  border: "border-[#e9d5ff]/60" },
    };
    return (
        <div className={`flex items-center gap-3 rounded-lg border ${s[color].border} bg-white p-3`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${s[color].bg}`}>
                <FontAwesomeIcon icon={icon} className={`text-base ${s[color].text}`} />
            </div>
            <div>
                <p className="text-xs font-mono text-[#274c3a]/60">{title}</p>
                <p className="text-xl font-semibold text-[#14532d]">{value}</p>
            </div>
        </div>
    );
}

// ── InfoRow ───────────────────────────────────────────────────
function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-[#d1e7d7]/60 pb-4 last:border-0 last:pb-0">
            <p className="text-sm font-mono text-[#274c3a]/60">{label}</p>
            <p className="text-sm font-medium text-[#14532d]">{value}</p>
        </div>
    );
}

// ── SecurityRow ───────────────────────────────────────────────
function SecurityRow({ label, value, hasArrow = false }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-[#16a34a]/5 px-4 py-3">
            <p className="text-sm font-mono text-[#274c3a]">{label}</p>
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#14532d]">{value}</p>
                {hasArrow && <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[#16a34a]/50" />}
            </div>
        </div>
    );
}

// ── Profile (page) ────────────────────────────────────────────
function Profile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        fetch('http://localhost:8000/api/getCustomerProfile.php', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCustomer(data);
                } else {
                    setError(data.message || 'Failed to load profile');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Could not connect to server');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm font-mono text-[#274c3a]/60">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm font-mono text-red-500">{error}</p>
            </div>
        );
    }

    // Build avatar URL — use profilePhoto from DB, or a generated avatar using the name
    const avatarSrc = customer.profilePhoto
        ? customer.profilePhoto
        : DEFAULT_AVATAR + encodeURIComponent(customer.name);

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">My Profile</h1>
                <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Manage your personal information, addresses and preferences.</p>
            </section>

            {/* ── Profile header card ── */}
            <section className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex flex-1 items-start gap-6">
                        {/* Profile photo from DB */}
                        <img
                            src={avatarSrc}
                            alt={customer.name}
                            className="h-28 w-28 shrink-0 rounded-full object-cover ring-2 ring-[#16a34a]/20"
                        />
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Name from DB */}
                                <h2 className="text-2xl font-semibold text-[#14532d]">{customer.name}</h2>
                                <span className="rounded-full bg-[#16a34a]/10 px-3 py-1 text-xs font-mono font-medium text-[#16a34a]">Customer</span>
                            </div>
                            {/* Member since from DB */}
                            <p className="mt-1 text-sm font-mono text-[#274c3a]/60">Member since {customer.memberSince}</p>
                            <div className="mt-3 space-y-2 text-sm font-mono text-[#274c3a]/70">
                                {/* Email, phone, address from DB */}
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="w-4 text-[#16a34a]/50" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPhone} className="w-4 text-[#16a34a]/50" />
                                    <span>{customer.contactNumber || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapPin} className="w-4 text-[#16a34a]/50" />
                                    <span>{customer.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account overview — static for now */}
                    <div className="rounded-[18px] bg-[#f0f7f2] border border-[#d1e7d7] p-5 md:w-[420px]">
                        <h3 className="text-sm font-mono font-semibold text-[#14532d]">Account Overview</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <StatsCard icon={faCar}          title="Total Repairs"         value="0"  color="green" />
                            <StatsCard icon={faCircleCheck}  title="Completed Repairs"     value="0"  color="teal" />
                            <StatsCard icon={faCalendarDays} title="Upcoming Appointments" value="0"  color="blue" />
                            <StatsCard icon={faStar}         title="Reviews Given"         value="0"  color="violet" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Personal Info + Addresses ── */}
            <section className="grid gap-4 md:grid-cols-2">

                {/* Personal Information — from DB */}
                <div className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#16a34a]/60" />
                        <h3 className="text-base font-semibold text-[#14532d]">Personal Information</h3>
                    </div>
                    <div className="mt-5 space-y-4">
                        <InfoRow label="Full Name"     value={customer.name} />
                        <InfoRow label="Email Address" value={customer.email} />
                        <InfoRow label="Phone Number"  value={customer.contactNumber || 'Not provided'} />
                        <InfoRow label="Address"       value={customer.address       || 'Not provided'} />
                        <InfoRow label="Member Since"  value={customer.memberSince} />
                    </div>
                </div>

                {/* Addresses — static placeholder for now */}
                <div className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapPin} className="text-[#16a34a]/60" />
                            <h3 className="text-base font-semibold text-[#14532d]">Addresses</h3>
                        </div>
                        <button className="flex items-center gap-1 text-sm font-mono font-medium text-[#16a34a] hover:underline">
                            <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address
                        </button>
                    </div>
                    <div className="mt-5">
                        {customer.address ? (
                            <div className="rounded-lg border border-[#d1e7d7] bg-[#f0f7f2] p-4">
                                <span className="rounded-full bg-[#16a34a]/10 px-3 py-1 text-xs font-mono font-medium text-[#16a34a]">Default</span>
                                <p className="mt-2 text-sm font-mono text-[#274c3a]/70">{customer.address}</p>
                                <p className="mt-2 text-sm font-mono text-[#274c3a]/70">
                                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-[#16a34a]/50" />
                                    {customer.contactNumber || 'No number'}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm font-mono text-[#274c3a]/40">No address saved yet.</p>
                        )}
                    </div>
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#16a34a]/30 py-3 text-sm font-mono font-medium text-[#16a34a] hover:bg-[#16a34a]/5">
                        <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address
                    </button>
                </div>
            </section>

            {/* ── Security ── */}
            <section className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className="text-[#16a34a]/60" />
                    <h3 className="text-base font-semibold text-[#14532d]">Security</h3>
                </div>
                <div className="mt-5 space-y-3">
                    <SecurityRow label="Password"   value="••••••••••" />
                    <SecurityRow label="Member Since" value={customer.memberSince} />
                </div>
            </section>

            <PageFooter />
        </div>
    );
}

export default Profile;