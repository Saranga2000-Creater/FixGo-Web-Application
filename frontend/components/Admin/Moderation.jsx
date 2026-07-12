import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faUsers, faShieldHalved, faArrowRight, faArrowTrendUp, faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";

// Design tokens: shared colors and font used throughout this page,
// kept in one place so styling stays consistent.
const T = {
    green:    "#16A34A",
    greenBg:  "#EDF9F0",
    orange:   "#FF6B1A",
    orangeBg: "#FFF4EE",
    blue:     "#2563EB",
    blueBg:   "#EDF3FF",
    violet:   "#A855F7",
    violetBg: "#F5EDFF",
    slate900: "#111827",
    slate700: "#374151",
    slate500: "#6B7280",
    slate200: "#E5E7EB",
    slate100: "#F3F4F6",
    white:    "#FFFFFF",
    font:     "'Segoe UI', system-ui, sans-serif",
};

// Mock/sample data for the moderation alert feed.

const MODERATION_ALERTS = [
    { id: 1, type: "REVIEW REPORT", time: "2 mins ago",  desc: '"The shop overcharged me and the mechanic was rude..."', user: "Saman P.", shop: "Elite Auto",   actions: ["Dismiss Review", "Ignore"] },
    { id: 2, type: "PROFILE FLAG",  time: "45 mins ago", desc: 'Suspected duplicate profile for "Vantage Service Center".', user: null, shop: null,            actions: ["Investigate"] },
    { id: 3, type: "FRAUD SIGNAL",  time: "2 hours ago", desc: "Unusual surge in 5-star ratings (50 reviews in 10 mins) for Shop ID #2214.", user: null, shop: null, actions: ["Audit Logs"] },
    { id: 4, type: "REVIEW REPORT", time: "3 hours ago", desc: '"Parts were substandard. Will not return."', user: "Nimal K.", shop: "QuickFix Auto", actions: ["Dismiss Review", "Ignore"] },
];

// Reusable stat card used for the 3 top summary numbers

function AdminSummaryCard({ accent, icon, title, count, meta, metaPositive }) {
    const styles = {
        green:  { iconBg: T.greenBg,  iconColor: T.green,  metaColor: T.green  },
        orange: { iconBg: T.orangeBg, iconColor: T.orange, metaColor: T.orange },
        violet: { iconBg: T.violetBg, iconColor: T.violet, metaColor: T.violet },
    };
    const s = styles[accent]; // pick colors matching this card's accent
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, padding: "20px 24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Icon circle */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: s.iconColor }} />
                </div>
                {/* Title, big number, and trend line */}
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

// Generic white card wrapper with an optional header title.
// Used here to wrap the "All Moderation Alerts" list.
function PageCard({ title, children }) {
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {title && (
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.slate100}` }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}

// Simple page title + subtitle block, shown at the top of the page.
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h1>
            {sub && <p style={{ color: T.slate500, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
        </div>
    );
}

// Renders one row in the moderation alert feed.

function ModerationAlertCard({ alert }) {
    // Color styling per alert type; falls back to gray if type is unknown
    const typeStyle = {
        "REVIEW REPORT": { color: T.orange, bg: T.orangeBg, borderLeft: `4px solid ${T.orange}` },
        "PROFILE FLAG":  { color: T.blue,   bg: T.blueBg,   borderLeft: "none" },
        "FRAUD SIGNAL":  { color: T.violet, bg: T.violetBg, borderLeft: "none" },
    };
    const ts = typeStyle[alert.type] || { color: T.slate500, bg: T.slate100, borderLeft: "none" };
    return (
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.slate100}`, borderLeft: ts.borderLeft }}>
            {/* Type badge + timestamp */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: ts.color, background: ts.bg }}>{alert.type}</span>
                <span style={{ fontSize: 11, color: T.slate500 }}>{alert.time}</span>
            </div>

            {/* Alert description text */}
            <p style={{ fontSize: 13, color: T.slate700, margin: 0 }}>{alert.desc}</p>

            {/* Only shown for alerts tied to a specific user/shop (e.g. review reports) */}
            {alert.user && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.slate500 }}>
                    {/* Avatar circle using the user's first initial */}
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.slate200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.slate500 }}>
                        {alert.user[0]}
                    </div>
                    <span>User: {alert.user}</span>
                    {alert.shop && <><FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 10 }} /><span style={{ color: T.green, fontWeight: 600 }}>{alert.shop}</span></>}
                </div>
            )}

            {/* Action buttons (e.g. Dismiss Review, Investigate, Audit Logs) */}
            <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
                {alert.actions.map((action) => (
                    <button
                        key={action}
                        style={{
                            background: "none", border: "none", cursor: "pointer", padding: 0,
                            fontSize: 12, fontWeight: 600, fontFamily: T.font,
                            
                            color: (action === "Dismiss Review" || action === "Investigate" || action === "Audit Logs") ? T.green : T.slate500,
                        }}
                    >
                        {action}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Main Moderation page: shows 3 summary cards 

function Moderation() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Page title */}
            <PageHeading title="Moderation" sub="Reported content, fraud signals, and profile flags." />

            {/* Top summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <AdminSummaryCard accent="orange" icon={faFlag}         title="Review Reports" count="3" meta="Needs action"        metaPositive={false} />
                <AdminSummaryCard accent="violet" icon={faUsers}        title="Profile Flags"  count="2" meta="Duplicate profiles"  metaPositive={false} />
                <AdminSummaryCard accent="green"  icon={faShieldHalved} title="Fraud Signals"  count="1" meta="Rating manipulation" metaPositive={false} />
            </div>

            {/* Full alert feed, one card per moderation item */}
            <PageCard title="All Moderation Alerts">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {MODERATION_ALERTS.map((alert) => (
                        <ModerationAlertCard key={alert.id} alert={alert} />
                    ))}
                </div>
            </PageCard>
        </div>
    );
}

export default Moderation;