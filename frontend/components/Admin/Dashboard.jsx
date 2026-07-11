import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faStore,
    faShieldHalved,
    faMoneyBillWave,
    faCircleExclamation,
    faCircleCheck,
    faTriangleExclamation,
    faArrowTrendUp,
    faArrowTrendDown,
    faDownload,
    faFilter,
    faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const T = {
    green:      "#16A34A",
    greenBg:    "#EDF9F0",
    orange:     "#FF6B1A",
    orangeBg:   "#FFF4EE",
    blue:       "#2563EB",
    blueBg:     "#EDF3FF",
    violet:     "#A855F7",
    violetBg:   "#F5EDFF",
    slate900:   "#111827",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate400:   "#9CA3AF",
    slate200:   "#E5E7EB",
    slate100:   "#F3F4F6",
    slate50:    "#F9FAFB",
    white:      "#FFFFFF",
    font:       "'Segoe UI', system-ui, sans-serif",
};

const VERIFICATION_QUEUE = [
    { id: "#SHP-9021", initials: "KM", name: "Kandy Motors Ltd.",  docs: ["BR_CERT", "TAX_ID"], flag: "Verified",     action: "approve" },
    { id: "#SHP-8842", initials: "GR", name: "Galle Road Repairs", docs: ["BR_CERT"],           flag: "IP Match",     action: "review"  },
    { id: "#SHP-7710", initials: "SA", name: "Speedy Autos",       docs: ["BANK_ST", "OWN_ID"], flag: "Pending Scan", action: "review"  },
];

const MODERATION_ALERTS = [
    { id: 1, type: "REVIEW REPORT", time: "2 mins ago",  desc: '"The shop overcharged me and the mechanic was rude..."', user: "Saman P.", shop: "Elite Auto",   actions: ["Dismiss Review", "Ignore"] },
    { id: 2, type: "PROFILE FLAG",  time: "45 mins ago", desc: 'Suspected duplicate profile for "Vantage Service Center".', user: null, shop: null,            actions: ["Investigate"] },
    { id: 3, type: "FRAUD SIGNAL",  time: "2 hours ago", desc: "Unusual surge in 5-star ratings (50 reviews in 10 mins) for Shop ID #2214.", user: null, shop: null, actions: ["Audit Logs"] },
];

const REVENUE_ROWS = [
    { id: "#SHP-9021", initials: "KM", shop: "Kandy Motors Ltd.",  bookings: 124, revenue: "LKR 248,000", commission: "LKR 37,200", status: "Paid"    },
    { id: "#SHP-8842", initials: "GR", shop: "Galle Road Repairs", bookings:  87, revenue: "LKR 174,000", commission: "LKR 26,100", status: "Pending" },
    { id: "#SHP-7710", initials: "SA", shop: "Speedy Autos",       bookings:  63, revenue: "LKR 126,000", commission: "LKR 18,900", status: "Paid"    },
    { id: "#SHP-7401", initials: "PG", shop: "Perera Garage",      bookings:  42, revenue: "LKR  84,000", commission: "LKR 12,600", status: "Overdue" },
];

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
            background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`,
            padding: "20px 24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.25s ease", cursor: "pointer",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

function TableHeader({ cols, five }) {
    return (
        <div style={{
            display: "grid", gridTemplateColumns: five ? "2fr 1fr 1fr 1fr 1fr" : "2fr 1.5fr 1fr 1fr",
            gap: 16, padding: "10px 24px", background: T.slate50, borderBottom: `1px solid ${T.slate100}`,
            fontSize: 11, fontWeight: 700, color: T.slate500, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
            {cols.map(c => <span key={c}>{c}</span>)}
        </div>
    );
}

function DocBadge({ label }) {
    return (
        <span style={{ borderRadius: 6, border: `1px solid ${T.slate200}`, background: T.slate50, padding: "3px 8px", fontSize: 11, fontWeight: 600, color: T.slate500 }}>{label}</span>
    );
}

function VerificationRow({ shop, isLast }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: !isLast ? `1px solid ${T.slate100}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.slate100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.slate500, flexShrink: 0 }}>{shop.initials}</div>
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
                    <button key={action} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 600, fontFamily: T.font, color: (action === "Dismiss Review" || action === "Investigate" || action === "Audit Logs") ? T.green : T.slate500 }}>{action}</button>
                ))}
            </div>
        </div>
    );
}

function RevenueRow({ row, isLast }) {
    const statusStyle = {
        Paid:    { bg: T.greenBg,  color: T.green  },
        Pending: { bg: T.orangeBg, color: T.orange },
        Overdue: { bg: "#FEE2E2",  color: "#DC2626" },
    };
    const ss = statusStyle[row.status] || {};
    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: !isLast ? `1px solid ${T.slate100}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.green, flexShrink: 0 }}>{row.initials}</div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{row.shop}</p>
                    <p style={{ fontSize: 11, color: T.slate400, margin: 0 }}>{row.id}</p>
                </div>
            </div>
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{row.bookings}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{row.revenue}</p>
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{row.commission}</p>
            <span style={{ display: "inline-block", borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 600, background: ss.bg, color: ss.color }}>{row.status}</span>
        </div>
    );
}

function linkBtn() {
    return { background: "none", border: "none", cursor: "pointer", color: T.green, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, fontFamily: T.font };
}
function outlineBtn() {
    return { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.slate200}`, background: T.white, fontSize: 13, fontWeight: 600, color: T.slate700, cursor: "pointer", fontFamily: T.font };
}
function darkBtn() {
    return { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: T.slate900, fontSize: 13, fontWeight: 600, color: T.white, cursor: "pointer", fontFamily: T.font };
}

function Dashboard() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)", borderRadius: 18, padding: "24px",
                border: `1px solid ${T.slate200}`, boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Dashboard</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>System overview and key metrics at a glance.</p>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.slate700, background: T.white, padding: "10px 16px", borderRadius: 12, border: `1px solid ${T.slate200}`, display: "flex", alignItems: "center", gap: 8 }}>
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

export default Dashboard;
