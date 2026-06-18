
// ============================================================
// FILE: Admin.jsx
// PURPOSE: Admin dashboard for FixGo — matches Customer.jsx
//          color/font theme (green #16a34a primary, slate tones,
//          rounded-[28px] cards, FontAwesome icons).
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faBell,
    faChevronRight,
    faCircleCheck,
    faCircleExclamation,
    faFileLines,
    faFlag,
    faGear,
    faShieldHalved,
    faStore,
    faUsers,
    faTriangleExclamation,
    faChartLine,
    faMagnifyingGlass,
    faDownload,
    faFilter,
    faCheck,
    faXmark,
    faEye,
    faClipboardList,
    faMoneyBillWave,
    faRotate,
    faUser,
    faChevronDown,
    faCalendarDays,
    faStar,
    faArrowTrendUp,
    faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";

// ── Nav items for the sidebar
const NAV_ITEMS = [
    { key: "dashboard",     icon: faChartLine,      label: "Dashboard" },
    { key: "verification",  icon: faShieldHalved,   label: "Verification Queue" },
    { key: "moderation",    icon: faFlag,            label: "Moderation" },
    { key: "revenue",       icon: faMoneyBillWave,   label: "Revenue & Ledger" },
    { key: "settings",      icon: faGear,            label: "Settings" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
function Admin() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("dashboard");

    return (
        <div
            style={{
                position: "fixed",
                top: "64px",
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                background: "#f6f7fb",
                color: "#0f172a",
            }}
        >
            <div className="flex w-full h-full overflow-hidden">

                {/* ── SIDEBAR ── */}
                <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col overflow-y-auto">
                    <div className="px-4 py-5">

                        {/* Admin profile card */}
                        <div className="rounded-[28px] border border-slate-200 bg-white px-4 py-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-[#16a34a] flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    FA
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">FixGo Admin</p>
                                    <p className="text-xs text-slate-500">Automotive Management</p>
                                    <div className="mt-1 flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                                        <span className="text-xs text-[#16a34a] font-medium">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 space-y-1 text-sm">
                            {NAV_ITEMS.map((item) => (
                                <AdminSidebarLink
                                    key={item.key}
                                    active={currentPage === item.key}
                                    icon={item.icon}
                                    label={item.label}
                                    badge={item.key === "verification" ? "42" : item.key === "moderation" ? "3" : undefined}
                                    onClick={() => setCurrentPage(item.key)}
                                />
                            ))}
                        </nav>
                    </div>

                    {/* Emergency Request button */}
                    <div className="mt-auto px-4 pb-4">
                        <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#16a34a] text-white py-3 text-sm font-semibold hover:bg-[#15803d] transition">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Emergency Request
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="px-4 pb-5">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                navigate("/");
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                        >
                            <FontAwesomeIcon icon={faArrowRight} className="rotate-180 text-slate-500" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 overflow-y-auto">
                    <div className="px-4 py-5 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1180px]">
                            {currentPage === "dashboard"    && <DashboardView />}
                            {currentPage === "verification" && <VerificationView />}
                            {currentPage === "moderation"   && <ModerationView />}
                            {currentPage === "revenue"      && <RevenueView />}
                            {currentPage === "settings"     && <AdminSettingsView />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// ============================================================
// PAGE: DASHBOARD
// ============================================================
function DashboardView() {
    return (
        <div className="space-y-5">

            {/* Header */}
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-slate-500">System overview and key metrics at a glance.</p>
                </div>
                <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
                </div>
            </section>

            {/* Summary Cards */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <AdminSummaryCard
                    accent="green"
                    icon={faStore}
                    title="Active Shops"
                    count="1,248"
                    meta="+12% this week"
                    metaPositive
                />
                <AdminSummaryCard
                    accent="orange"
                    icon={faShieldHalved}
                    title="Verification Queue"
                    count="42"
                    meta="High Priority"
                    metaPositive={false}
                />
                <AdminSummaryCard
                    accent="blue"
                    icon={faMoneyBillWave}
                    title="Gross Revenue (MTD)"
                    count="LKR 4.2M"
                    meta="Live"
                    metaPositive
                />
                <AdminSummaryCard
                    accent="violet"
                    icon={faCircleExclamation}
                    title="Active Alerts"
                    count="07"
                    meta="System Normal"
                    metaPositive
                />
            </section>

            {/* Main two-column section */}
            <section className="grid gap-5 xl:grid-cols-[1fr_340px]">

                {/* Verification Table */}
                <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">New Shop Verification</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Credentials awaiting administrative approval</p>
                        </div>
                        <button className="text-sm font-medium text-[#16a34a] hover:underline flex items-center gap-1">
                            View All Queue <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                        </button>
                    </div>

                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Shop Name / ID</span>
                        <span>Submitted Docs</span>
                        <span>Flags</span>
                        <span>Actions</span>
                    </div>

                    {/* Rows */}
                    {VERIFICATION_QUEUE.map((shop, idx) => (
                        <VerificationRow key={shop.id} shop={shop} isLast={idx === VERIFICATION_QUEUE.length - 1} />
                    ))}
                </div>

                {/* Moderation Alerts */}
                <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-base font-semibold text-slate-900">Moderation Alerts</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Reported content needing action</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {MODERATION_ALERTS.map((alert) => (
                            <ModerationAlertCard key={alert.id} alert={alert} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Revenue table */}
            <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">Automated Revenue & Ledger</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Monthly shop billing and performance metrics</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition">
                            <FontAwesomeIcon icon={faFilter} className="text-slate-400 text-xs" />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition">
                            <FontAwesomeIcon icon={faDownload} className="text-xs" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Revenue table header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Shop</span>
                    <span>Bookings</span>
                    <span>Revenue</span>
                    <span>Commission</span>
                    <span>Status</span>
                </div>

                {REVENUE_ROWS.map((row, idx) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === REVENUE_ROWS.length - 1} />
                ))}
            </section>

            <PageFooter />
        </div>
    );
}

// ============================================================
// PAGE: VERIFICATION QUEUE
// ============================================================
function VerificationView() {
    const [search, setSearch] = useState("");
    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Verification Queue</h1>
                <p className="mt-2 text-sm text-slate-500">Review and approve shop credentials before they go live.</p>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm w-full sm:max-w-sm">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400" />
                    <input
                        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        placeholder="Search by shop name or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-[#fff4ee] px-3 py-1 text-xs font-medium text-[#ff6b1a]">42 Pending</span>
                    <span className="rounded-full bg-[#edf9f0] px-3 py-1 text-xs font-medium text-[#16a34a]">8 Approved today</span>
                </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Shop Name / ID</span>
                    <span>Submitted Docs</span>
                    <span>Flags</span>
                    <span>Actions</span>
                </div>
                {[...VERIFICATION_QUEUE, ...VERIFICATION_QUEUE_EXTRA]
                    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
                    .map((shop, idx, arr) => (
                        <VerificationRow key={shop.id} shop={shop} isLast={idx === arr.length - 1} />
                    ))}
            </section>

            <PageFooter />
        </div>
    );
}

// ============================================================
// PAGE: MODERATION
// ============================================================
function ModerationView() {
    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Moderation</h1>
                <p className="mt-2 text-sm text-slate-500">Reported content, fraud signals, and profile flags.</p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <AdminSummaryCard accent="orange" icon={faFlag} title="Review Reports" count="3" meta="Needs action" metaPositive={false} />
                <AdminSummaryCard accent="violet" icon={faUsers} title="Profile Flags" count="2" meta="Duplicate profiles" metaPositive={false} />
                <AdminSummaryCard accent="green" icon={faShieldHalved} title="Fraud Signals" count="1" meta="Rating manipulation" metaPositive={false} />
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">All Moderation Alerts</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {[...MODERATION_ALERTS, ...MODERATION_ALERTS_EXTRA].map((alert) => (
                        <ModerationAlertCard key={alert.id} alert={alert} expanded />
                    ))}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}

// ============================================================
// PAGE: REVENUE & LEDGER
// ============================================================
function RevenueView() {
    const [filter, setFilter] = useState("This Month");
    return (
        <div className="space-y-5">
            <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Revenue & Ledger</h1>
                    <p className="mt-2 text-sm text-slate-500">Monthly billing and commission tracking across all shops.</p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-slate-400" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="appearance-none bg-transparent pr-5 text-sm text-slate-700 focus:outline-none">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none -ml-4 text-xs text-slate-400" />
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <AdminSummaryCard accent="green"  icon={faMoneyBillWave} title="Gross Revenue"   count="LKR 4.2M" meta="+18% vs last month" metaPositive />
                <AdminSummaryCard accent="blue"   icon={faChartLine}     title="Total Commission" count="LKR 630K" meta="15% avg rate"       metaPositive />
                <AdminSummaryCard accent="orange" icon={faStore}         title="Active Billing"   count="1,248"    meta="Shops billed"       metaPositive />
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">Shop Revenue Breakdown</h2>
                    <button className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition">
                        <FontAwesomeIcon icon={faDownload} className="text-xs" />
                        Export CSV
                    </button>
                </div>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Shop</span>
                    <span>Bookings</span>
                    <span>Revenue</span>
                    <span>Commission</span>
                    <span>Status</span>
                </div>
                {[...REVENUE_ROWS, ...REVENUE_ROWS_EXTRA].map((row, idx, arr) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === arr.length - 1} />
                ))}
            </section>

            <PageFooter />
        </div>
    );
}

// ============================================================
// PAGE: ADMIN SETTINGS
// ============================================================
function AdminSettingsView() {
    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">Settings</h1>
                <p className="mt-2 text-sm text-slate-500">Manage system configuration and admin preferences.</p>
            </section>

            {[
                {
                    icon: faUser,
                    color: "bg-[#edf9f0] text-[#16a34a]",
                    title: "Admin Account",
                    subtitle: "Manage admin profile and access.",
                    rows: [
                        { icon: faUser, label: "Edit Profile" },
                        { icon: faShieldHalved, label: "Change Password" },
                        { icon: faFileLines, label: "Activity Log" },
                    ],
                },
                {
                    icon: faGear,
                    color: "bg-[#edf3ff] text-[#2563eb]",
                    title: "System Settings",
                    subtitle: "Platform-level configuration.",
                    rows: [
                        { icon: faStore,   label: "Commission Rates" },
                        { icon: faClipboardList, label: "Verification Rules" },
                        { icon: faRotate,  label: "API & Integrations" },
                    ],
                },
                {
                    icon: faBell,
                    color: "bg-[#fff4ee] text-[#ff6b1a]",
                    title: "Notifications",
                    subtitle: "Alert and notification preferences.",
                    rows: [
                        { icon: faBell,  label: "Email Alerts" },
                        { icon: faFlag,  label: "Moderation Alerts" },
                    ],
                },
            ].map((section) => (
                <section key={section.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex items-center gap-5 border-b border-slate-100 px-6 py-6 sm:w-[280px] sm:shrink-0 sm:border-b-0 sm:border-r">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${section.color}`}>
                                <FontAwesomeIcon icon={section.icon} className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-900">{section.title}</p>
                                <p className="mt-1 text-xs text-slate-500">{section.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex-1 divide-y divide-slate-100">
                            {section.rows.map((row, i) => (
                                <button key={row.label} className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={row.icon} className="w-4 text-slate-400" />
                                        <span className="text-sm text-slate-700">{row.label}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            <PageFooter />
        </div>
    );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function AdminSidebarLink({ active, icon, label, badge, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                active
                    ? "border-l-4 border-[#16a34a] bg-[#f0fdf4] font-medium text-[#16a34a]"
                    : "text-slate-700 hover:bg-slate-50"
            }`}
        >
            <FontAwesomeIcon icon={icon} className={active ? "text-[#16a34a]" : "text-slate-500"} />
            <span>{label}</span>
            {badge && (
                <span className="ml-auto rounded-full bg-[#16a34a] px-2 py-0.5 text-xs font-semibold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}

function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    const s = {
        green:  { iconWrap: "bg-[#edf9f0] text-[#16a34a]",  meta: "text-[#16a34a]" },
        orange: { iconWrap: "bg-[#fff4ee] text-[#ff6b1a]",  meta: "text-[#ff6b1a]" },
        blue:   { iconWrap: "bg-[#edf3ff] text-[#2563eb]",  meta: "text-[#2563eb]" },
        violet: { iconWrap: "bg-[#f5edff] text-[#a855f7]",  meta: "text-[#a855f7]" },
    };
    return (
        <article className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${s[accent].iconWrap}`}>
                    <FontAwesomeIcon icon={icon} className="text-2xl" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">{count}</p>
                    {meta && (
                        <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${s[accent].meta}`}>
                            <FontAwesomeIcon icon={metaPositive ? faArrowTrendUp : faArrowTrendDown} className="text-xs" />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

function DocBadge({ label }) {
    return (
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
            {label}
        </span>
    );
}

function VerificationRow({ shop, isLast }) {
    return (
        <div className={`grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-6 py-4 ${!isLast ? "border-b border-slate-100" : ""}`}>
            {/* Shop info */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                    {shop.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{shop.name}</p>
                    <p className="text-xs text-slate-400">{shop.id}</p>
                </div>
            </div>

            {/* Docs */}
            <div className="flex flex-wrap gap-1">
                {shop.docs.map((d) => <DocBadge key={d} label={d} />)}
            </div>

            {/* Flag */}
            <div>
                {shop.flag === "Verified" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#16a34a]">
                        <FontAwesomeIcon icon={faCircleCheck} /> Verified
                    </span>
                )}
                {shop.flag === "IP Match" && (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#ff6b1a]">
                        <FontAwesomeIcon icon={faTriangleExclamation} /> IP Match
                    </span>
                )}
                {shop.flag === "Pending Scan" && (
                    <span className="text-xs text-slate-400 italic">Pending Scan</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {shop.action === "approve" ? (
                    <button className="rounded-xl bg-[#16a34a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#15803d] transition">
                        Approve
                    </button>
                ) : (
                    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                        Review
                    </button>
                )}
            </div>
        </div>
    );
}

function ModerationAlertCard({ alert, expanded }) {
    const typeStyle = {
        "REVIEW REPORT":  "text-[#ff6b1a] bg-[#fff4ee]",
        "PROFILE FLAG":   "text-[#2563eb] bg-[#edf3ff]",
        "FRAUD SIGNAL":   "text-[#a855f7] bg-[#f5edff]",
    };
    return (
        <div className={`px-6 py-4 ${alert.type === "REVIEW REPORT" ? "border-l-4 border-[#ff6b1a]" : ""}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeStyle[alert.type] || "text-slate-500 bg-slate-100"}`}>
                            {alert.type}
                        </span>
                        <span className="text-xs text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-sm text-slate-700">{alert.desc}</p>
                    {alert.user && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {alert.user[0]}
                            </div>
                            <span>User: {alert.user}</span>
                            {alert.shop && <><FontAwesomeIcon icon={faArrowRight} className="text-[10px]" /><span className="text-[#16a34a] font-medium">{alert.shop}</span></>}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-3 flex gap-3">
                {alert.actions.map((action) => (
                    <button
                        key={action}
                        className={`text-xs font-medium ${
                            action === "Dismiss Review" || action === "Investigate" || action === "Audit Logs"
                                ? "text-[#16a34a] hover:underline"
                                : "text-slate-500 hover:underline"
                        }`}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
}

function RevenueRow({ row, isLast }) {
    const statusStyle = {
        Paid:    "bg-[#edf9f0] text-[#16a34a]",
        Pending: "bg-[#fff4ee] text-[#ff6b1a]",
        Overdue: "bg-[#fee2e2] text-[#dc2626]",
    };
    return (
        <div className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 ${!isLast ? "border-b border-slate-100" : ""}`}>
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#edf9f0] flex items-center justify-center text-xs font-bold text-[#16a34a] shrink-0">
                    {row.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{row.shop}</p>
                    <p className="text-xs text-slate-400">{row.id}</p>
                </div>
            </div>
            <p className="text-sm text-slate-700">{row.bookings}</p>
            <p className="text-sm font-semibold text-slate-900">{row.revenue}</p>
            <p className="text-sm text-slate-700">{row.commission}</p>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyle[row.status]}`}>
                {row.status}
            </span>
        </div>
    );
}

function PageFooter() {
    return (
        <footer className="flex flex-col gap-2 py-1 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 FixGo. All rights reserved.</p>
            <p>Version 1.0.0</p>
        </footer>
    );
}

// ============================================================
// STATIC DATA
// ============================================================

const VERIFICATION_QUEUE = [
    { id: "#SHP-9021", initials: "KM", name: "Kandy Motors Ltd.",  docs: ["BR_CERT", "TAX_ID"],          flag: "Verified",     action: "approve" },
    { id: "#SHP-8842", initials: "GR", name: "Galle Road Repairs", docs: ["BR_CERT"],                    flag: "IP Match",     action: "review"  },
    { id: "#SHP-7710", initials: "SA", name: "Speedy Autos",       docs: ["BANK_ST", "OWN_ID"],          flag: "Pending Scan", action: "review"  },
];

const VERIFICATION_QUEUE_EXTRA = [
    { id: "#SHP-7401", initials: "PG", name: "Perera Garage",         docs: ["BR_CERT", "OWN_ID", "TAX_ID"], flag: "Verified",     action: "approve" },
    { id: "#SHP-7308", initials: "CS", name: "City Service Center",   docs: ["BR_CERT"],                     flag: "IP Match",     action: "review"  },
];

const MODERATION_ALERTS = [
    {
        id: 1,
        type: "REVIEW REPORT",
        time: "2 mins ago",
        desc: '"The shop overcharged me and the mechanic was rude..."',
        user: "Saman P.",
        shop: "Elite Auto",
        actions: ["Dismiss Review", "Ignore"],
    },
    {
        id: 2,
        type: "PROFILE FLAG",
        time: "45 mins ago",
        desc: 'Suspected duplicate profile for "Vantage Service Center".',
        user: null,
        shop: null,
        actions: ["Investigate"],
    },
    {
        id: 3,
        type: "FRAUD SIGNAL",
        time: "2 hours ago",
        desc: "Unusual surge in 5-star ratings (50 reviews in 10 mins) for Shop ID #2214.",
        user: null,
        shop: null,
        actions: ["Audit Logs"],
    },
];

const MODERATION_ALERTS_EXTRA = [
    {
        id: 4,
        type: "REVIEW REPORT",
        time: "3 hours ago",
        desc: '"Parts were substandard. Will not return."',
        user: "Nimal K.",
        shop: "QuickFix Auto",
        actions: ["Dismiss Review", "Ignore"],
    },
];

const REVENUE_ROWS = [
    { id: "#SHP-9021", initials: "KM", shop: "Kandy Motors Ltd.",       bookings: 124, revenue: "LKR 248,000", commission: "LKR 37,200", status: "Paid"    },
    { id: "#SHP-8842", initials: "GR", shop: "Galle Road Repairs",      bookings:  87, revenue: "LKR 174,000", commission: "LKR 26,100", status: "Pending" },
    { id: "#SHP-7710", initials: "SA", shop: "Speedy Autos",            bookings:  63, revenue: "LKR 126,000", commission: "LKR 18,900", status: "Paid"    },
    { id: "#SHP-7401", initials: "PG", shop: "Perera Garage",           bookings:  42, revenue: "LKR  84,000", commission: "LKR 12,600", status: "Overdue" },
];

const REVENUE_ROWS_EXTRA = [
    { id: "#SHP-7308", initials: "CS", shop: "City Service Center",     bookings:  31, revenue: "LKR  62,000", commission: "LKR  9,300", status: "Paid"    },
    { id: "#SHP-7201", initials: "EA", shop: "Elite Auto Care",         bookings:  58, revenue: "LKR 116,000", commission: "LKR 17,400", status: "Pending" },
];

export default Admin;