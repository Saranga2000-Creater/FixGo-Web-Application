import { useState } from "react";
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
    faClipboardList,
    faMoneyBillWave,
    faRotate,
    faUser,
    faChevronDown,
    faCalendarDays,
    faArrowTrendUp,
    faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
    { key: "dashboard",    icon: faChartLine,    label: "Dashboard" },
    { key: "verification", icon: faShieldHalved, label: "Verification Queue" },
    { key: "moderation",   icon: faFlag,         label: "Moderation" },
    { key: "revenue",      icon: faMoneyBillWave,label: "Revenue & Ledger" },
    { key: "settings",     icon: faGear,         label: "Settings" },
];

// ── Shared style tokens ──────────────────────────────────────────────────────
const T = {
    green:      "#16A34A",
    greenLight: "#F0FDF4",
    greenBg:    "#EDF9F0",
    orange:     "#FF6B1A",
    orangeBg:   "#FFF4EE",
    blue:       "#2563EB",
    blueBg:     "#EDF3FF",
    violet:     "#A855F7",
    violetBg:   "#F5EDFF",
    red:        "#DC2626",
    redBg:      "#FEE2E2",
    slate900:   "#111827",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate400:   "#9CA3AF",
    slate200:   "#E5E7EB",
    slate100:   "#F3F4F6",
    slate50:    "#F9FAFB",
    white:      "#FFFFFF",
    pageBg:     "#F4F8F5",
    font:       "'Segoe UI', system-ui, sans-serif",
    card:       {
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
};

function Admin() {
    const [currentPage, setCurrentPage] = useState("dashboard");

    return (
        <div style={{
            minHeight: "100vh",
            background: T.pageBg,
            color: T.slate900,
            fontFamily: T.font,
        }}>
                {/* ── SIDEBAR ── fixed, always visible ── */}
                <aside style={{
                    width: 240,
                    display: "flex",
                    flexDirection: "column",
                    background: T.white,
                    borderRight: `1px solid ${T.slate100}`,
                    boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
                    height: "calc(100vh - 65px)",
                    position: "fixed",
                    top: 65,
                    left: 0,
                    zIndex: 50,
                    overflowY: "auto",
                }}>
                    {/* Profile block */}
                    <div style={{
                        padding: "20px 16px 16px",
                        borderBottom: `1px solid ${T.slate100}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: T.slate900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: T.white,
                            fontWeight: 700,
                            fontSize: 14,
                            flexShrink: 0,
                        }}>FA</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: T.slate900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                FixGo Admin
                            </div>
                            <div style={{ fontSize: 12, color: T.slate500 }}>Automotive Management</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
                                <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
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
                </aside>

                {/* ── MAIN CONTENT ── offset by sidebar width and navbar height ── */}
                <main style={{ marginLeft: 240, minHeight: "calc(100vh - 65px)", padding: "24px", boxSizing: "border-box" }}>
                    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                        {currentPage === "dashboard"    && <DashboardView />}
                        {currentPage === "verification" && <VerificationView />}
                        {currentPage === "moderation"   && <ModerationView />}
                        {currentPage === "revenue"      && <RevenueView />}
                        {currentPage === "settings"     && <AdminSettingsView />}
                    </div>
                </main>
        </div>
    );
}

// ============================================================
// PAGE: DASHBOARD
// ============================================================
function DashboardView() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18,
                padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Dashboard</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>System overview and key metrics at a glance.</p>
                </div>
                <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.slate700,
                    background: T.white,
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: `1px solid ${T.slate200}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="green"  icon={faStore}             title="Active Shops"        count="1,248"    meta="+12% this week" metaPositive />
                <AdminSummaryCard accent="orange" icon={faShieldHalved}      title="Verification Queue"  count="42"       meta="High Priority"  metaPositive={false} />
                <AdminSummaryCard accent="blue"   icon={faMoneyBillWave}     title="Gross Revenue (MTD)" count="LKR 4.2M" meta="Live"           metaPositive />
                <AdminSummaryCard accent="violet" icon={faCircleExclamation} title="Active Alerts"       count="07"       meta="System Normal"  metaPositive />
            </div>

            {/* Verification + Moderation */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
                <PageCard
                    title="New Shop Verification"
                    subtitle="Credentials awaiting administrative approval"
                    action={<button style={linkBtn()}>View All Queue <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} /></button>}
                >
                    <TableHeader cols={["Shop Name / ID", "Submitted Docs", "Flags", "Actions"]} />
                    {VERIFICATION_QUEUE.map((shop, idx) => (
                        <VerificationRow key={shop.id} shop={shop} isLast={idx === VERIFICATION_QUEUE.length - 1} />
                    ))}
                </PageCard>

                <PageCard title="Moderation Alerts" subtitle="Reported content needing action">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {MODERATION_ALERTS.map((alert) => (
                            <ModerationAlertCard key={alert.id} alert={alert} />
                        ))}
                    </div>
                </PageCard>
            </div>

            {/* Revenue */}
            <PageCard
                title="Automated Revenue & Ledger"
                subtitle="Monthly shop billing and performance metrics"
                action={
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={outlineBtn()}><FontAwesomeIcon icon={faFilter} style={{ fontSize: 11 }} /> Filter</button>
                        <button style={darkBtn()}><FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} /> Export CSV</button>
                    </div>
                }
            >
                <TableHeader cols={["Shop", "Bookings", "Revenue", "Commission", "Status"]} five />
                {REVENUE_ROWS.map((row, idx) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === REVENUE_ROWS.length - 1} />
                ))}
            </PageCard>
        </div>
    );
}

// ============================================================
// PAGE: VERIFICATION QUEUE
// ============================================================
function VerificationView() {
    const [search, setSearch] = useState("");
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PageHeading title="Verification Queue" sub="Review and approve shop credentials before they go live." />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 12,
                    padding: "10px 16px", fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    width: "100%", maxWidth: 320,
                }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: T.slate400 }} />
                    <input
                        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: T.slate700, background: "transparent", fontFamily: T.font }}
                        placeholder="Search by shop name or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Pill bg={T.orangeBg} color={T.orange}>42 Pending</Pill>
                    <Pill bg={T.greenBg} color={T.green}>8 Approved today</Pill>
                </div>
            </div>
            <PageCard>
                <TableHeader cols={["Shop Name / ID", "Submitted Docs", "Flags", "Actions"]} />
                {[...VERIFICATION_QUEUE, ...VERIFICATION_QUEUE_EXTRA]
                    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
                    .map((shop, idx, arr) => (
                        <VerificationRow key={shop.id} shop={shop} isLast={idx === arr.length - 1} />
                    ))}
            </PageCard>
        </div>
    );
}

// ============================================================
// PAGE: MODERATION
// ============================================================
function ModerationView() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PageHeading title="Moderation" sub="Reported content, fraud signals, and profile flags." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="orange" icon={faFlag}         title="Review Reports" count="3" meta="Needs action"        metaPositive={false} />
                <AdminSummaryCard accent="violet" icon={faUsers}        title="Profile Flags"  count="2" meta="Duplicate profiles"  metaPositive={false} />
                <AdminSummaryCard accent="green"  icon={faShieldHalved} title="Fraud Signals"  count="1" meta="Rating manipulation" metaPositive={false} />
            </div>
            <PageCard title="All Moderation Alerts">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {[...MODERATION_ALERTS, ...MODERATION_ALERTS_EXTRA].map((alert) => (
                        <ModerationAlertCard key={alert.id} alert={alert} expanded />
                    ))}
                </div>
            </PageCard>
        </div>
    );
}

// ============================================================
// PAGE: REVENUE & LEDGER
// ============================================================
function RevenueView() {
    const [filter, setFilter] = useState("This Month");
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <PageHeading title="Revenue & Ledger" sub="Monthly billing and commission tracking across all shops." />
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 12,
                    padding: "10px 16px", fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: T.slate700, background: "transparent", fontFamily: T.font, cursor: "pointer" }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="green"  icon={faMoneyBillWave} title="Gross Revenue"    count="LKR 4.2M" meta="+18% vs last month" metaPositive />
                <AdminSummaryCard accent="blue"   icon={faChartLine}     title="Total Commission" count="LKR 630K" meta="15% avg rate"       metaPositive />
                <AdminSummaryCard accent="orange" icon={faStore}         title="Active Billing"   count="1,248"    meta="Shops billed"       metaPositive />
            </div>
            <PageCard
                title="Shop Revenue Breakdown"
                action={<button style={darkBtn()}><FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} /> Export CSV</button>}
            >
                <TableHeader cols={["Shop", "Bookings", "Revenue", "Commission", "Status"]} five />
                {[...REVENUE_ROWS, ...REVENUE_ROWS_EXTRA].map((row, idx, arr) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === arr.length - 1} />
                ))}
            </PageCard>
        </div>
    );
}

// ============================================================
// PAGE: ADMIN SETTINGS
// ============================================================
function AdminSettingsView() {
    const sections = [
        {
            icon: faUser,
            iconBg: T.greenBg,
            iconColor: T.green,
            title: "Admin Account",
            subtitle: "Manage admin profile and access.",
            rows: [
                { icon: faUser,         label: "Edit Profile" },
                { icon: faShieldHalved, label: "Change Password" },
                { icon: faFileLines,    label: "Activity Log" },
            ],
        },
        {
            icon: faGear,
            iconBg: T.blueBg,
            iconColor: T.blue,
            title: "System Settings",
            subtitle: "Platform-level configuration.",
            rows: [
                { icon: faStore,         label: "Commission Rates" },
                { icon: faClipboardList, label: "Verification Rules" },
                { icon: faRotate,        label: "API & Integrations" },
            ],
        },
        {
            icon: faBell,
            iconBg: T.orangeBg,
            iconColor: T.orange,
            title: "Notifications",
            subtitle: "Alert and notification preferences.",
            rows: [
                { icon: faBell, label: "Email Alerts" },
                { icon: faFlag, label: "Moderation Alerts" },
            ],
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PageHeading title="Settings" sub="Manage system configuration and admin preferences." />
            {sections.map((sec) => (
                <div key={sec.title} style={{ ...T.card, borderRadius: 14, overflow: "hidden", display: "flex" }}>
                    {/* Left label */}
                    <div style={{
                        width: 260,
                        flexShrink: 0,
                        borderRight: `1px solid ${T.slate100}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "24px 20px",
                    }}>
                        <div style={{
                            width: 52, height: 52,
                            borderRadius: 14,
                            background: sec.iconBg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <FontAwesomeIcon icon={sec.icon} style={{ fontSize: 22, color: sec.iconColor }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.slate900 }}>{sec.title}</div>
                            <div style={{ fontSize: 12, color: T.slate500, marginTop: 3 }}>{sec.subtitle}</div>
                        </div>
                    </div>
                    {/* Rows */}
                    <div style={{ flex: 1 }}>
                        {sec.rows.map((row) => (
                            <button key={row.label} style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "16px 20px",
                                background: "transparent",
                                border: "none",
                                borderBottom: `1px solid ${T.slate100}`,
                                cursor: "pointer",
                                fontFamily: T.font,
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = T.slate50}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <FontAwesomeIcon icon={row.icon} style={{ color: T.slate400, width: 16 }} />
                                    <span style={{ fontSize: 14, color: T.slate700 }}>{row.label}</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 11, color: T.slate400 }} />
                            </button>
                        ))}
                    </div>
                </div>
            ))}
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
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: active ? T.greenLight : "transparent",
                color: active ? T.green : T.slate700,
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
                fontFamily: T.font,
                borderLeft: active ? `4px solid ${T.green}` : "4px solid transparent",
                transition: "all 0.15s ease",
            }}
        >
            <FontAwesomeIcon icon={icon} style={{ color: active ? T.green : T.slate500, fontSize: 16 }} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
                <span style={{
                    background: T.green, color: T.white,
                    borderRadius: 99, fontSize: 11, fontWeight: 700,
                    padding: "2px 7px", minWidth: 20, textAlign: "center",
                }}>{badge}</span>
            )}
        </button>
    );
}

function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    const styles = {
        green:  { iconBg: T.greenBg,  iconColor: T.green,  metaColor: T.green  },
        orange: { iconBg: T.orangeBg, iconColor: T.orange, metaColor: T.orange },
        blue:   { iconBg: T.blueBg,   iconColor: T.blue,   metaColor: T.blue   },
        violet: { iconBg: T.violetBg, iconColor: T.violet, metaColor: T.violet },
    };
    const s = styles[accent];
    return (
        <div style={{
            background: T.white,
            borderRadius: 18,
            border: `1px solid ${T.slate200}`,
            padding: "20px 24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.25s ease",
            cursor: "pointer",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{
                    width: 52, height: 52,
                    borderRadius: "50%",
                    background: s.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: s.iconColor }} />
                </div>
                <div>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: "4px 0" }}>{count}</p>
                    {meta && (
                        <p style={{ fontSize: 12, fontWeight: 600, color: s.metaColor, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            <FontAwesomeIcon icon={metaPositive ? faArrowTrendUp : faArrowTrendDown} style={{ fontSize: 10 }} />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PageCard({ title, subtitle, action, children }) {
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {(title || action) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${T.slate100}` }}>
                    <div>
                        {title && <h2 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h2>}
                        {subtitle && <p style={{ fontSize: 12, color: T.slate500, margin: "3px 0 0" }}>{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}

function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h1>
            {sub && <p style={{ color: T.slate500, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
        </div>
    );
}

function TableHeader({ cols, five }) {
    const cols4 = "2fr 1.5fr 1fr 1fr";
    const cols5 = "2fr 1fr 1fr 1fr 1fr";
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: five ? cols5 : cols4,
            gap: 16,
            padding: "10px 24px",
            background: T.slate50,
            borderBottom: `1px solid ${T.slate100}`,
            fontSize: 11,
            fontWeight: 700,
            color: T.slate500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        }}>
            {cols.map(c => <span key={c}>{c}</span>)}
        </div>
    );
}

function DocBadge({ label }) {
    return (
        <span style={{
            borderRadius: 6, border: `1px solid ${T.slate200}`,
            background: T.slate50, padding: "3px 8px",
            fontSize: 11, fontWeight: 600, color: T.slate500,
        }}>{label}</span>
    );
}

function VerificationRow({ shop, isLast }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr",
            gap: 16,
            alignItems: "center",
            padding: "14px 24px",
            borderBottom: !isLast ? `1px solid ${T.slate100}` : "none",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: T.slate100, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 700,
                    color: T.slate500, flexShrink: 0,
                }}>{shop.initials}</div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{shop.name}</p>
                    <p style={{ fontSize: 11, color: T.slate400, margin: 0 }}>{shop.id}</p>
                </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {shop.docs.map((d) => <DocBadge key={d} label={d} />)}
            </div>
            <div>
                {shop.flag === "Verified"     && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: T.green }}><FontAwesomeIcon icon={faCircleCheck} /> Verified</span>}
                {shop.flag === "IP Match"     && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: T.orange }}><FontAwesomeIcon icon={faTriangleExclamation} /> IP Match</span>}
                {shop.flag === "Pending Scan" && <span style={{ fontSize: 12, color: T.slate400, fontStyle: "italic" }}>Pending Scan</span>}
            </div>
            <div>
                {shop.action === "approve"
                    ? <button style={{ borderRadius: 10, background: T.green, color: T.white, border: "none", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>Approve</button>
                    : <button style={{ borderRadius: 10, background: T.white, color: T.slate700, border: `1px solid ${T.slate200}`, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>Review</button>
                }
            </div>
        </div>
    );
}

function ModerationAlertCard({ alert }) {
    const typeStyle = {
        "REVIEW REPORT": { color: T.orange, bg: T.orangeBg, borderLeft: `4px solid ${T.orange}` },
        "PROFILE FLAG":  { color: T.blue,   bg: T.blueBg,   borderLeft: "none" },
        "FRAUD SIGNAL":  { color: T.violet, bg: T.violetBg, borderLeft: "none" },
    };
    const ts = typeStyle[alert.type] || { color: T.slate500, bg: T.slate100, borderLeft: "none" };
    return (
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.slate100}`, borderLeft: ts.borderLeft }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: ts.color, background: ts.bg }}>{alert.type}</span>
                <span style={{ fontSize: 11, color: T.slate400 }}>{alert.time}</span>
            </div>
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{alert.desc}</p>
            {alert.user && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.slate500 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.slate200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.slate500 }}>
                        {alert.user[0]}
                    </div>
                    <span>User: {alert.user}</span>
                    {alert.shop && <><FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 10 }} /><span style={{ color: T.green, fontWeight: 600 }}>{alert.shop}</span></>}
                </div>
            )}
            <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
                {alert.actions.map((action) => (
                    <button key={action} style={{
                        background: "none", border: "none", cursor: "pointer", padding: 0,
                        fontSize: 12, fontWeight: 600, fontFamily: T.font,
                        color: (action === "Dismiss Review" || action === "Investigate" || action === "Audit Logs") ? T.green : T.slate500,
                    }}>{action}</button>
                ))}
            </div>
        </div>
    );
}

function RevenueRow({ row, isLast }) {
    const statusStyle = {
        Paid:    { bg: T.greenBg,  color: T.green  },
        Pending: { bg: T.orangeBg, color: T.orange },
        Overdue: { bg: T.redBg,    color: T.red    },
    };
    const ss = statusStyle[row.status] || {};
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 16,
            alignItems: "center",
            padding: "14px 24px",
            borderBottom: !isLast ? `1px solid ${T.slate100}` : "none",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: T.greenBg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 700,
                    color: T.green, flexShrink: 0,
                }}>{row.initials}</div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{row.shop}</p>
                    <p style={{ fontSize: 11, color: T.slate400, margin: 0 }}>{row.id}</p>
                </div>
            </div>
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{row.bookings}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{row.revenue}</p>
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{row.commission}</p>
            <span style={{
                display: "inline-block", borderRadius: 99,
                padding: "4px 12px", fontSize: 12, fontWeight: 600,
                background: ss.bg, color: ss.color,
            }}>{row.status}</span>
        </div>
    );
}

function Pill({ bg, color, children }) {
    return (
        <span style={{ borderRadius: 99, background: bg, color, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{children}</span>
    );
}

// ── Button helpers ───────────────────────────────────────────────────────────
function linkBtn() {
    return { background: "none", border: "none", cursor: "pointer", color: T.green, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontFamily: T.font };
}
function outlineBtn() {
    return { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.slate200}`, background: T.white, fontSize: 13, fontWeight: 600, color: T.slate700, cursor: "pointer", fontFamily: T.font };
}
function darkBtn() {
    return { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: T.slate900, fontSize: 13, fontWeight: 600, color: T.white, cursor: "pointer", fontFamily: T.font };
}

// ============================================================
// STATIC DATA
// ============================================================
const VERIFICATION_QUEUE = [
    { id: "#SHP-9021", initials: "KM", name: "Kandy Motors Ltd.",  docs: ["BR_CERT", "TAX_ID"],      flag: "Verified",     action: "approve" },
    { id: "#SHP-8842", initials: "GR", name: "Galle Road Repairs", docs: ["BR_CERT"],                flag: "IP Match",     action: "review"  },
    { id: "#SHP-7710", initials: "SA", name: "Speedy Autos",       docs: ["BANK_ST", "OWN_ID"],      flag: "Pending Scan", action: "review"  },
];
const VERIFICATION_QUEUE_EXTRA = [
    { id: "#SHP-7401", initials: "PG", name: "Perera Garage",       docs: ["BR_CERT", "OWN_ID", "TAX_ID"], flag: "Verified",  action: "approve" },
    { id: "#SHP-7308", initials: "CS", name: "City Service Center", docs: ["BR_CERT"],                     flag: "IP Match",  action: "review"  },
];
const MODERATION_ALERTS = [
    { id: 1, type: "REVIEW REPORT", time: "2 mins ago",  desc: '"The shop overcharged me and the mechanic was rude..."', user: "Saman P.", shop: "Elite Auto",   actions: ["Dismiss Review", "Ignore"] },
    { id: 2, type: "PROFILE FLAG",  time: "45 mins ago", desc: 'Suspected duplicate profile for "Vantage Service Center".', user: null, shop: null,            actions: ["Investigate"] },
    { id: 3, type: "FRAUD SIGNAL",  time: "2 hours ago", desc: "Unusual surge in 5-star ratings (50 reviews in 10 mins) for Shop ID #2214.", user: null, shop: null, actions: ["Audit Logs"] },
];
const MODERATION_ALERTS_EXTRA = [
    { id: 4, type: "REVIEW REPORT", time: "3 hours ago", desc: '"Parts were substandard. Will not return."', user: "Nimal K.", shop: "QuickFix Auto", actions: ["Dismiss Review", "Ignore"] },
];
const REVENUE_ROWS = [
    { id: "#SHP-9021", initials: "KM", shop: "Kandy Motors Ltd.",  bookings: 124, revenue: "LKR 248,000", commission: "LKR 37,200", status: "Paid"    },
    { id: "#SHP-8842", initials: "GR", shop: "Galle Road Repairs", bookings:  87, revenue: "LKR 174,000", commission: "LKR 26,100", status: "Pending" },
    { id: "#SHP-7710", initials: "SA", shop: "Speedy Autos",       bookings:  63, revenue: "LKR 126,000", commission: "LKR 18,900", status: "Paid"    },
    { id: "#SHP-7401", initials: "PG", shop: "Perera Garage",      bookings:  42, revenue: "LKR  84,000", commission: "LKR 12,600", status: "Overdue" },
];
const REVENUE_ROWS_EXTRA = [
    { id: "#SHP-7308", initials: "CS", shop: "City Service Center", bookings: 31, revenue: "LKR  62,000", commission: "LKR  9,300", status: "Paid"    },
    { id: "#SHP-7201", initials: "EA", shop: "Elite Auto Care",     bookings: 58, revenue: "LKR 116,000", commission: "LKR 17,400", status: "Pending" },
];

export default Admin;
