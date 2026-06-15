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
                        {/*  API: Replace src with profile.avatarUrl */}
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                            alt="Irushi An."
                            className="h-28 w-28 shrink-0 rounded-full object-cover ring-2 ring-[#16a34a]/20"
                        />
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                {/*  API: Replace with profile.name */}
                                <h2 className="text-2xl font-semibold text-[#14532d]">Irushi An.</h2>
                                <span className="rounded-full bg-[#16a34a]/10 px-3 py-1 text-xs font-mono font-medium text-[#16a34a]">Customer</span>
                            </div>
                            {/*  API: Replace with profile.memberSince */}
                            <p className="mt-1 text-sm font-mono text-[#274c3a]/60">Member since May 10, 2026</p>
                            <div className="mt-3 space-y-2 text-sm font-mono text-[#274c3a]/70">
                                {/*  API: Replace with profile.email, profile.phone, profile.dateOfBirth */}
                                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope}     className="w-4 text-[#16a34a]/50" /><span>irushi.an@example.com</span></div>
                                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faPhone}        className="w-4 text-[#16a34a]/50" /><span>+94 77 123 4567</span></div>
                                <div className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendarDays} className="w-4 text-[#16a34a]/50" /><span>May 10, 1995</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Account overview */}
                    <div className="rounded-[18px] bg-[#f0f7f2] border border-[#d1e7d7] p-5 md:w-[420px]">
                        <h3 className="text-sm font-mono font-semibold text-[#14532d]">Account Overview</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {/*  API: Replace values with profile.totalRepairs, etc. */}
                            <StatsCard icon={faCar}          title="Total Repairs"         value="8"  color="green" />
                            <StatsCard icon={faCircleCheck}  title="Completed Repairs"     value="5"  color="teal" />
                            <StatsCard icon={faCalendarDays} title="Upcoming Appointments" value="1"  color="blue" />
                            <StatsCard icon={faStar}         title="Reviews Given"         value="12" color="violet" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Personal Info + Addresses ── */}
            <section className="grid gap-4 md:grid-cols-2">

                {/* Personal Information */}
                <div className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#16a34a]/60" />
                        <h3 className="text-base font-semibold text-[#14532d]">Personal Information</h3>
                    </div>
                    <div className="mt-5 space-y-4">
                        {/* API: Replace each value with profile.fieldName */}
                        <InfoRow label="Full Name"          value="Irushi An." />
                        <InfoRow label="Email Address"      value="irushi.an@example.com" />
                        <InfoRow label="Phone Number"       value="+94 77 123 4567" />
                        <InfoRow label="Date of Birth"      value="May 10, 1995" />
                        <InfoRow label="Gender"             value="Female" />
                        <InfoRow label="Preferred Language" value="English" />
                    </div>
                </div>

                {/* Addresses */}
                <div className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapPin} className="text-[#16a34a]/60" />
                            <h3 className="text-base font-semibold text-[#14532d]">Addresses</h3>
                        </div>
                        {/*  API: POST /api/customer/addresses */}
                        <button className="flex items-center gap-1 text-sm font-mono font-medium text-[#16a34a] hover:underline">
                            <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add New Address
                        </button>
                    </div>
                    <div className="mt-5">
                        {/*  API: Replace with .map() over addresses from GET /api/customer/addresses */}
                        <div className="rounded-lg border border-[#d1e7d7] bg-[#f0f7f2] p-4">
                            <span className="rounded-full bg-[#16a34a]/10 px-3 py-1 text-xs font-mono font-medium text-[#16a34a]">Default</span>
                            <p className="mt-2 text-sm font-semibold text-[#14532d]">Home</p>
                            <p className="mt-1 text-sm font-mono text-[#274c3a]/70">No. 123, Park Road,<br />Colombo 07,<br />Sri Lanka.</p>
                            <p className="mt-2 text-sm font-mono text-[#274c3a]/70">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-[#16a34a]/50" />+94 77 123 4567
                            </p>
                            <div className="mt-4 flex gap-2">
                                {/*  API: PUT /api/customer/addresses/:id */}
                                <button className="text-sm font-mono font-medium text-[#16a34a] hover:underline">Edit</button>
                                <span className="text-[#d1e7d7]">·</span>
                                {/*  API: DELETE /api/customer/addresses/:id */}
                                <button className="text-sm font-mono font-medium text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    </div>
                    {/* API: POST /api/customer/addresses */}
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
                    {/*  API: lastLogin from GET /api/customer/security-info */}
                    <SecurityRow label="Password"      value="••••••••••" />
                    <SecurityRow label="Last Login"    value="May 25, 2026, 10:30 AM" />
                    <SecurityRow label="Login Devices" value="2 Devices" hasArrow />
                </div>
            </section>

            <PageFooter />
        </div>
    );
}

export default Profile;