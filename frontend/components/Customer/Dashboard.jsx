import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faBell,
    faCalendarCheck,
    faCalendarDays,
    faCircleCheck,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

// ── Accent palette (kept functional, styled to match shop owner greens) ──────
const ACCENT = {
    green:  { iconBg: "#EEF7F0", iconColor: "#16A34A", linkColor: "#16A34A" },
    orange: { iconBg: "#FFF4EE", iconColor: "#FF6B1A", linkColor: "#FF6B1A" },
    blue:   { iconBg: "#EDF3FF", iconColor: "#2563EB", linkColor: "#2563EB" },
    violet: { iconBg: "#F5EDFF", iconColor: "#A855F7", linkColor: "#A855F7" },
};

function SummaryCard({ accent, icon, title, count, linkText, onClick }) {
    const a = ACCENT[accent];
    return (
        <div
            style={{
                borderRadius: 18,
                border: "1px solid #E7EFE8",
                background: "#FFFFFF",
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
                    width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                    background: a.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 22, color: a.iconColor }} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{title}</p>
                    <p style={{
                        fontSize: 32, fontWeight: 700, color: "#111827",
                        margin: "4px 0", lineHeight: 1,
                    }}>{count}</p>
                    <button
                        onClick={onClick}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 13, fontWeight: 600, color: a.linkColor,
                            background: "none", border: "none", cursor: "pointer",
                            padding: 0, marginTop: 6,
                        }}
                    >
                        {linkText} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                    </button>
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
        <div style={{ width: "100%", display: "block" }}>

            {/* ── Header banner ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18,
                padding: "24px",
                marginBottom: 24,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                }}>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#111827",
                        margin: 0,
                    }}>
                        {getGreeting()}{firstName ? `, ${firstName}` : ""}! 👋
                    </h1>

                    <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#374151",
                        background: "#FFFFFF",
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        {today}
                        <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#9CA3AF" }} />
                    </span>
                </div>
                <p style={{
                    color: "#6B7280",
                    marginTop: 8,
                    marginBottom: 0,
                    fontSize: 15,
                }}>
                    Here&apos;s what&apos;s happening with your vehicle services.
                </p>
            </div>

            {/* ── Summary Cards ── */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
                width: "100%",
            }}>
                <SummaryCard
                    accent="green"
                    icon={faCircleInfo}
                    title="Active Repairs"
                    count="0"
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
