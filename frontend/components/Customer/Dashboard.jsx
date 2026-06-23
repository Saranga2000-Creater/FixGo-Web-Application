import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faArrowTrendUp,
    faBell,
    faCalendarCheck,
    faCalendarDays,
    faCircleCheck,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

// ── Shared design tokens (mirrors Admin) ─────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenLight:"#F0FDF4",
    greenBg:   "#EDF9F0",
    orange:    "#FF6B1A",
    orangeBg:  "#FFF4EE",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    violet:    "#A855F7",
    violetBg:  "#F5EDFF",
    slate900:  "#111827",
    slate700:  "#374151",
    slate500:  "#6B7280",
    slate400:  "#9CA3AF",
    slate200:  "#E5E7EB",
    slate100:  "#F3F4F6",
    slate50:   "#F9FAFB",
    white:     "#FFFFFF",
    pageBg:    "#F4F8F5",
    font:      "'Segoe UI', system-ui, sans-serif",
};

const ACCENT = {
    green:  { iconBg: T.greenBg,  iconColor: T.green,  linkColor: T.green,  metaColor: T.green  },
    orange: { iconBg: T.orangeBg, iconColor: T.orange, linkColor: T.orange, metaColor: T.orange },
    blue:   { iconBg: T.blueBg,   iconColor: T.blue,   linkColor: T.blue,   metaColor: T.blue   },
    violet: { iconBg: T.violetBg, iconColor: T.violet, linkColor: T.violet, metaColor: T.violet },
};

function SummaryCard({ accent, icon, title, count, linkText, meta, onClick }) {
    const a = ACCENT[accent];
    return (
        <div
            style={{
                background: T.white,
                borderRadius: 18,
                border: `1px solid ${T.slate200}`,
                padding: "20px 24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transition: "all 0.25s ease",
                cursor: "pointer",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{
                    width: 52, height: 52,
                    borderRadius: "50%",
                    background: a.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: a.iconColor }} />
                </div>
                <div>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: "4px 0" }}>{count}</p>
                    {meta && (
                        <p style={{ fontSize: 12, fontWeight: 600, color: a.metaColor, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} style={{ fontSize: 10 }} />
                            {meta}
                        </p>
                    )}
                    {linkText && (
                        <button onClick={onClick} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 13, fontWeight: 600, color: a.linkColor,
                            background: "none", border: "none", cursor: "pointer",
                            padding: 0, marginTop: 6, fontFamily: T.font,
                        }}>
                            {linkText} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function Dashboard({ customerId }) {
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8000/api/getCustomerProfile.php", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setFirstName(data.name.split(" ")[0]);
            })
            .catch(() => {});
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Header banner ── */}
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
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>
                        {getGreeting()}{firstName ? `, ${firstName}` : ""}! 👋
                    </h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Here&apos;s what&apos;s happening with your vehicle services.
                    </p>
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
                    {today}
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
            }}>
                <SummaryCard
                    accent="green"
                    icon={faCircleInfo}
                    title="Active Repairs"
                    count="0"
                    meta="Up to date"
                    linkText="View details"
                />
                <SummaryCard
                    accent="blue"
                    icon={faCircleCheck}
                    title="Completed Repairs"
                    count="0"
                    linkText="View history"
                />
                <SummaryCard
                    accent="orange"
                    icon={faCalendarCheck}
                    title="Upcoming Appointments"
                    count="0"
                    linkText="View calendar"
                />
                <SummaryCard
                    accent="violet"
                    icon={faBell}
                    title="Notifications"
                    count="0"
                    linkText="View all"
                />
            </div>

        </div>
    );
}

export default Dashboard;
