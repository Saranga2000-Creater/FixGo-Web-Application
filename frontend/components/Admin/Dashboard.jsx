import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStore,
    faShieldHalved,
    faMoneyBillWave,
    faCircleExclamation,
    faArrowTrendUp,
    faArrowTrendDown,
    faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

// Design tokens: centralized colors, backgrounds, and font used across the dashboard

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

// Reusable card component for the 4 summary metrics on the dashboard

function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    // Maps each accent name to its matching background/icon/text colors
    const styles = {
        green:  { iconBg: T.greenBg,  iconColor: T.green,  metaColor: T.green  },
        orange: { iconBg: T.orangeBg, iconColor: T.orange, metaColor: T.orange },
        blue:   { iconBg: T.blueBg,   iconColor: T.blue,   metaColor: T.blue   },
        violet: { iconBg: T.violetBg, iconColor: T.violet, metaColor: T.violet },
    };
    const s = styles[accent]; // pick the color set for this card

    return (
        <div style={{
            background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`,
            padding: "20px 24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.25s ease", cursor: "pointer",
        }}
            // Hover effect: lifts the card slightly and enlarges the shadow
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Icon circle */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: s.iconColor }} />
                </div>
                {/* Text block: title, big number, and trend meta line */}
                <div>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: "4px 0" }}>{count}</p>
                    {meta && (
                        <p style={{ fontSize: 12, fontWeight: 600, color: s.metaColor, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            {/* Shows up-arrow or down-arrow depending on metaPositive */}
                            <FontAwesomeIcon icon={metaPositive ? faArrowTrendUp : faArrowTrendDown} style={{ fontSize: 10 }} />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Main Dashboard page: landing page admins see first when they click "Dashboard".
function Dashboard() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Header: page title, subtitle, and today's date badge */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)", borderRadius: 18, padding: "24px",
                border: `1px solid ${T.slate200}`, boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Dashboard</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>System overview and key metrics at a glance.</p>
                </div>
                {/* Auto-generates today's date, no need to update manually */}
                <div style={{ fontSize: 14, fontWeight: 600, color: T.slate700, background: T.white, padding: "10px 16px", borderRadius: 12, border: `1px solid ${T.slate200}`, display: "flex", alignItems: "center", gap: 8 }}>
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                </div>
            </div>

            {/* Summary Cards: the 4 key metrics, laid out in a responsive grid
                (wraps to fewer columns automatically on smaller screens) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="green"  icon={faStore}             title="Active Shops"        count="10"         meta="+12% this week" metaPositive />
                <AdminSummaryCard accent="orange" icon={faShieldHalved}      title="Verification Queue"  count="3"          meta="High Priority"  metaPositive={false} />
                <AdminSummaryCard accent="blue"   icon={faMoneyBillWave}     title="Gross Revenue (MTD)" count="LKR 42,000" meta="Live"           metaPositive />
                <AdminSummaryCard accent="violet" icon={faCircleExclamation} title="Active Alerts"       count="2"          meta="System Normal"  metaPositive />
            </div>
        </div>
    );
}

export default Dashboard;