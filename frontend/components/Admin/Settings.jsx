import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faGear,
    faBell,
    faShieldHalved,
    faFileLines,
    faStore,
    faClipboardList,
    faRotate,
    faFlag,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Shared color/font tokens, plus a base card style reused for each settings section
const T = {
    green:    "#16A34A",
    greenBg:  "#EDF9F0",
    blue:     "#2563EB",
    blueBg:   "#EDF3FF",
    orange:   "#FF6B1A",
    orangeBg: "#FFF4EE",
    slate900: "#111827",
    slate700: "#374151",
    slate500: "#6B7280",
    slate400: "#9CA3AF",
    slate100: "#F3F4F6",
    slate50:  "#F9FAFB",
    white:    "#FFFFFF",
    font:     "'Segoe UI', system-ui, sans-serif",
    card: {
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
};

// Page title + subtitle block
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h1>
            {sub && <p style={{ color: T.slate500, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
        </div>
    );
}

// Main Settings page: renders a list of setting groups

function Settings() {

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

            {/* One block per section, built from the `sections` array above */}
            {sections.map((sec) => (
                <div key={sec.title} style={{ ...T.card, borderRadius: 14, overflow: "hidden", display: "flex" }}>

                    {/* Left side: section icon, title, and description */}
                    <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${T.slate100}`, display: "flex", alignItems: "center", gap: 16, padding: "24px 20px" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: sec.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FontAwesomeIcon icon={sec.icon} style={{ fontSize: 22, color: sec.iconColor }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: T.slate900 }}>{sec.title}</div>
                            <div style={{ fontSize: 12, color: T.slate500, marginTop: 3 }}>{sec.subtitle}</div>
                        </div>
                    </div>

                    {/* Right side: clickable rows for this section (not wired to routes yet) */}
                    <div style={{ flex: 1 }}>
                        {sec.rows.map((row) => (
                            <button key={row.label} style={{
                                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "16px 20px", background: "transparent", border: "none",
                                borderBottom: `1px solid ${T.slate100}`, cursor: "pointer", fontFamily: T.font,
                            }}
                                // Simple hover highlight since inline styles don't support :hover
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

export default Settings;