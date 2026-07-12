import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faShieldHalved,
    faFlag,
    faMoneyBillWave,
    faGear,
} from "@fortawesome/free-solid-svg-icons";

const T = {
    green:      "#16A34A",
    greenLight: "#F0FDF4",
    slate900:   "#111827",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate100:   "#F3F4F6",
    white:      "#FFFFFF",
    font:       "'Segoe UI', system-ui, sans-serif",
};


const NAV_ITEMS = [
    { key: "dashboard",    icon: faChartLine,     label: "Dashboard" },
    { key: "verification", icon: faShieldHalved,  label: "Verification Queue", badge: undefined },
    { key: "moderation",   icon: faFlag,          label: "Moderation",         badge: undefined },
    { key: "revenue",      icon: faMoneyBillWave, label: "Revenue & Ledger" },
    { key: "settings",     icon: faGear,          label: "Settings" },
];

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
            {badge != null && (
                <span style={{
                    background: T.green, color: T.white,
                    borderRadius: 99, fontSize: 11, fontWeight: 700,
                    padding: "2px 7px", minWidth: 20, textAlign: "center",
                }}>{badge}</span>
            )}
        </button>
    );
}

function AdminSidebar({ currentPage, setCurrentPage }) {
    return (
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
                        badge={item.badge}
                        onClick={() => setCurrentPage(item.key)}
                    />
                ))}
            </nav>
        </aside>
    );
}

export default AdminSidebar;