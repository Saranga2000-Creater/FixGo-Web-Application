import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faFileLines,
    faLock,
    faMapPin,
    faMobile,
    faShield,
    faShieldHalved,
    faUser,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";


const T = {
    green:      "#16A34A",
    greenMuted: "rgba(22,163,74,0.08)",
    blue:       "#2563EB",
    blueBg:     "rgba(37,99,235,0.10)",
    amber:      "#D97706",
    amberBg:    "rgba(217,119,6,0.10)",
    slate900:   "#111827",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate400:   "#9CA3AF",
    slate200:   "#E5E7EB",
    slate100:   "#F3F4F6",
    white:      "#FFFFFF",
    font:       "'Segoe UI', system-ui, sans-serif",
    card: {
        background:   "#FFFFFF",
        border:       "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow:    "0 1px 4px rgba(0,0,0,0.06)",
    },
};

function SettingsRow({ icon, label, meta }) {
    return (
        <button
            style={{
                display: "flex", width: "100%",
                alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px",
                background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
                fontFamily: T.font,
                transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.greenMuted}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FontAwesomeIcon icon={icon} style={{ width: 16, color: `${T.green}80` }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.slate700 }}>{label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {meta && <span style={{ fontSize: 13, color: T.slate400 }}>{meta}</span>}
                <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 11, color: `${T.green}66` }} />
            </div>
        </button>
    );
}

function SettingsSection({ iconBg, iconColor, icon, title, description, children }) {
    return (
        <div style={{
            ...T.card,
            overflow: "hidden",
            display: "flex",
            flexWrap: "wrap",
        }}>
            {/* Left panel */}
            <div style={{
                display: "flex", alignItems: "center", gap: 20,
                padding: "24px",
                borderRight: `1px solid ${T.slate100}`,
                width: 260,
                flexShrink: 0,
                boxSizing: "border-box",
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                    background: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 22, color: iconColor }} />
                </div>
                <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 12, color: T.slate500, marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>{description}</p>
                </div>
            </div>

            {/* Right rows */}
            <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column" }}>
                {children}
            </div>
        </div>
    );
}

function Settings() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Page heading ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18,
                padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Settings</h1>
                <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                    Manage your account, preferences and app settings.
                </p>
            </div>

            {/* ── Account Settings ── */}
            <SettingsSection
                icon={faUser}
                iconBg={T.greenMuted}
                iconColor={T.green}
                title="Account Settings"
                description="Manage your personal information and account details."
            >
                <SettingsRow icon={faUser}   label="Edit Profile" />
                <div style={{ borderTop: `1px solid ${T.slate100}` }}>
                    <SettingsRow icon={faMapPin} label="Addresses" />
                </div>
                <div style={{ borderTop: `1px solid ${T.slate100}` }}>
                    <SettingsRow icon={faLock}   label="Change Password" />
                </div>
            </SettingsSection>

            {/* ── Security ── */}
            <SettingsSection
                icon={faShieldHalved}
                iconBg={T.blueBg}
                iconColor={T.blue}
                title="Security"
                description="Manage your account security and login settings."
            >
                <SettingsRow icon={faLock} label="Password Update" />
            </SettingsSection>

            {/* ── App Settings ── */}
            <SettingsSection
                icon={faMobile}
                iconBg={T.amberBg}
                iconColor={T.amber}
                title="App Settings"
                description="Manage app behavior and data."
            >
                <SettingsRow icon={faShield}     label="Privacy Policy" />
                <div style={{ borderTop: `1px solid ${T.slate100}` }}>
                    <SettingsRow icon={faFileLines}  label="Terms & Conditions" />
                </div>
                <div style={{ borderTop: `1px solid ${T.slate100}` }}>
                    <SettingsRow icon={faCircleInfo} label="About FixGo" meta="Version 1.0.0" />
                </div>
            </SettingsSection>

        </div>
    );
}

export default Settings;
