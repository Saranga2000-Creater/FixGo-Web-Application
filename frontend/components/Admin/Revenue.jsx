import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMoneyBillWave, faChartLine, faStore, faDownload, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

// Shared color/font tokens used across this page
const T = {
    green:    "#16A34A",
    greenBg:  "#EDF9F0",
    orange:   "#FF6B1A",
    orangeBg: "#FFF4EE",
    blue:     "#2563EB",
    blueBg:   "#EDF3FF",
    slate900: "#111827",
    slate700: "#374151",
    slate500: "#6B7280",
    slate400: "#9CA3AF",
    slate200: "#E5E7EB",
    slate100: "#F3F4F6",
    slate50:  "#F9FAFB",
    white:    "#FFFFFF",
    font:     "'Segoe UI', system-ui, sans-serif",
};

// Sample per-shop revenue data (would normally come from the backend API)
const REVENUE_ROWS = [
    { id: "#SHP-9021", initials: "KM", shop: "Kandy Motors Ltd.",   bookings: 124, revenue: "LKR 248,000", commission: "LKR 37,200", status: "Paid"    },
    { id: "#SHP-8842", initials: "GR", shop: "Galle Road Repairs",  bookings:  87, revenue: "LKR 174,000", commission: "LKR 26,100", status: "Pending" },
    { id: "#SHP-7710", initials: "SA", shop: "Speedy Autos",        bookings:  63, revenue: "LKR 126,000", commission: "LKR 18,900", status: "Paid"    },
    { id: "#SHP-7401", initials: "PG", shop: "Perera Garage",       bookings:  42, revenue: "LKR  84,000", commission: "LKR 12,600", status: "Overdue" },
    { id: "#SHP-7308", initials: "CS", shop: "City Service Center", bookings:  31, revenue: "LKR  62,000", commission: "LKR  9,300", status: "Paid"    },
    { id: "#SHP-7201", initials: "EA", shop: "Elite Auto Care",     bookings:  58, revenue: "LKR 116,000", commission: "LKR 17,400", status: "Pending" },
];

// Reusable top summary card (Gross Revenue / Total Commission / Active Billing)
function AdminSummaryCard({ accent, icon, title, count, meta }) {
    const styles = {
        green:  { iconBg: T.greenBg,  iconColor: T.green,  metaColor: T.green  },
        blue:   { iconBg: T.blueBg,   iconColor: T.blue,   metaColor: T.blue   },
        orange: { iconBg: T.orangeBg, iconColor: T.orange, metaColor: T.orange },
    };
    const s = styles[accent];
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, padding: "20px 24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: s.iconColor }} />
                </div>
                <div>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: "4px 0" }}>{count}</p>
                    {meta && (
                        <p style={{ fontSize: 12, fontWeight: 600, color: s.metaColor, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} style={{ fontSize: 10 }} />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Generic white card wrapper with optional title and header action (e.g. a button)
function PageCard({ title, action, children }) {
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {(title || action) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${T.slate100}` }}>
                    {title && <h2 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h2>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}

// Page title + subtitle block
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h1>
            {sub && <p style={{ color: T.slate500, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
        </div>
    );
}

// Column headers for the revenue table
function TableHeader({ cols }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "10px 24px", background: T.slate50, borderBottom: `1px solid ${T.slate100}`, fontSize: 11, fontWeight: 700, color: T.slate500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {cols.map(c => <span key={c}>{c}</span>)}
        </div>
    );
}

// One row in the revenue table: shop info, bookings, revenue, commission, and payment status
function RevenueRow({ row, isLast }) {
    // Color-codes the status badge (green=Paid, orange=Pending, red=Overdue)
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

// Style object for the dark "Export CSV" button
function darkBtn() {
    return { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: T.slate900, fontSize: 13, fontWeight: 600, color: T.white, cursor: "pointer", fontFamily: T.font };
}

// Main Revenue & Ledger page: period filter, 3 summary cards, and a per-shop revenue table
function Revenue() {
    // Currently selected time period for the report (not wired to real filtering yet)
    const [filter, setFilter] = useState("This Month");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Heading + period dropdown */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <PageHeading title="Revenue & Ledger" sub="Monthly billing and commission tracking across all shops." />
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: T.slate700, background: "transparent", fontFamily: T.font, cursor: "pointer" }}>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Top summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="green"  icon={faMoneyBillWave} title="Gross Revenue"    count="LKR 42,000" meta="+18% vs last month" />
                <AdminSummaryCard accent="blue"   icon={faChartLine}     title="Total Commission" count="LKR 6,300" meta="15% avg rate"       />
                <AdminSummaryCard accent="orange" icon={faStore}         title="Active Billing"   count="10"    meta="Shops billed"       />
            </div>

            {/* Per-shop revenue table with CSV export */}
            <PageCard
                title="Shop Revenue Breakdown"
                action={<button style={darkBtn()}><FontAwesomeIcon icon={faDownload} style={{ fontSize: 11 }} /> Export CSV</button>}
            >
                <TableHeader cols={["Shop", "Bookings", "Revenue", "Commission", "Status"]} />
                {REVENUE_ROWS.map((row, idx) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === REVENUE_ROWS.length - 1} />
                ))}
            </PageCard>
        </div>
    );
}

export default Revenue;