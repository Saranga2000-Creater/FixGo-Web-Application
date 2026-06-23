import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faCalendarDays, faChevronDown,
    faClockRotateLeft, faMapPin, faWrench,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenBg:   "#EDF9F0",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.10)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    violet:    "#A855F7",
    violetBg:  "#F5EDFF",
    yellow:    "#D97706",
    yellowBg:  "rgba(217,119,6,0.10)",
    slate900:  "#111827",
    slate700:  "#374151",
    slate500:  "#6B7280",
    slate400:  "#9CA3AF",
    slate200:  "#E5E7EB",
    slate100:  "#F3F4F6",
    slate50:   "#F9FAFB",
    white:     "#FFFFFF",
    font:      "'Segoe UI', system-ui, sans-serif",
    card: {
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
};

const ACCENT_CYCLE = ["green", "teal", "blue", "violet", "yellow"];
const ACCENT = {
    green:  { iconBg: T.greenBg,  iconColor: T.green,  badgeBg: T.greenBg,  badgeColor: T.green,  dot: T.green  },
    teal:   { iconBg: T.tealBg,   iconColor: T.teal,   badgeBg: T.tealBg,   badgeColor: T.teal,   dot: T.teal   },
    blue:   { iconBg: T.blueBg,   iconColor: T.blue,   badgeBg: T.blueBg,   badgeColor: T.blue,   dot: T.blue   },
    violet: { iconBg: T.violetBg, iconColor: T.violet, badgeBg: T.violetBg, badgeColor: T.violet, dot: T.violet },
    yellow: { iconBg: T.yellowBg, iconColor: T.yellow, badgeBg: T.yellowBg, badgeColor: T.yellow, dot: T.yellow },
};

const FILTERS = ["All Time", "Last 3 Months", "Last 6 Months", "This Year"];

const isWithinFilter = (dateStr, filter) => {
    if (filter === "All Time" || !dateStr) return true;
    const date   = new Date(dateStr);
    const now    = new Date();
    const months = filter === "Last 3 Months" ? 3 : filter === "Last 6 Months" ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    return date >= cutoff;
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "";

export default function ServiceHistory({ customerId }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState("All Time");

    useEffect(() => {
        if (!customerId) return;
        const fetchHistory = async () => {
            try {
                const res  = await fetch(`http://localhost:8000/api/getCustomerServiceHistory.php?customer_id=${customerId}`);
                const data = await res.json();
                if (data.success) setHistory(data.data || []);
            } catch (err) {
                console.error("ServiceHistory fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [customerId]);

    const filtered = history.filter(r => isWithinFilter(r.completed_at, filter));

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 256 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: 36, color: T.green, opacity: 0.3 }} />
                    <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading service history…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Page heading ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18,
                padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Service History</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        View your past vehicle services and repair details.
                    </p>
                </div>

                {/* Filter dropdown */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.white, border: `1px solid ${T.slate200}`,
                    borderRadius: 12, padding: "10px 16px",
                    fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{
                            border: "none", outline: "none",
                            fontSize: 14, color: T.slate700,
                            background: "transparent",
                            fontFamily: T.font, cursor: "pointer",
                        }}
                    >
                        {FILTERS.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, color: T.slate400 }} />
                </div>
            </div>

            {/* ── Empty state ── */}
            {filtered.length === 0 ? (
                <div style={{ ...T.card, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                    <FontAwesomeIcon icon={faClockRotateLeft} style={{ fontSize: 48, color: T.slate200 }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: T.slate900, margin: 0 }}>No service history yet</p>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>
                        {filter !== "All Time" ? "Try a different time range." : "Your completed repairs will appear here."}
                    </p>
                </div>
            ) : (
                /* ── History list card ── */
                <div style={{ ...T.card, overflow: "hidden" }}>
                    {filtered.map((record, idx) => {
                        const a      = ACCENT[ACCENT_CYCLE[idx % ACCENT_CYCLE.length]];
                        const isLast = idx === filtered.length - 1;

                        return (
                            <div
                                key={record.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "20px 24px",
                                    borderBottom: !isLast ? `1px solid ${T.slate100}` : "none",
                                }}
                            >
                                {/* Timeline dot + line */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
                                    <div style={{
                                        width: 10, height: 10, borderRadius: "50%",
                                        background: a.dot, flexShrink: 0, marginTop: 4,
                                    }} />
                                    {!isLast && (
                                        <div style={{ width: 1, flex: 1, background: T.slate200, marginTop: 4 }} />
                                    )}
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                                    background: a.iconBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={faWrench} style={{ fontSize: 20, color: a.iconColor }} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: T.slate900, margin: 0 }}>
                                            {record.issue_category || record.description || "Service Completed"}
                                        </p>
                                        <span style={{
                                            borderRadius: 99, padding: "3px 10px",
                                            fontSize: 11, fontWeight: 700,
                                            background: a.badgeBg, color: a.badgeColor,
                                        }}>
                                            Completed
                                        </span>
                                    </div>
                                    <div style={{
                                        marginTop: 6, display: "flex", flexWrap: "wrap",
                                        alignItems: "center", gap: "4px 16px",
                                        fontSize: 12, color: T.slate500,
                                    }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400, fontSize: 11 }} />
                                            {formatDate(record.completed_at)}
                                            {formatTime(record.completed_at) && ` · ${formatTime(record.completed_at)}`}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FontAwesomeIcon icon={faMapPin} style={{ color: T.slate400, fontSize: 11 }} />
                                            {record.shop_name || "—"}
                                        </span>
                                    </div>
                                    {record.vehicle_brand && (
                                        <p style={{ marginTop: 4, fontSize: 12, color: T.slate400, margin: "4px 0 0" }}>
                                            {record.vehicle_brand}{record.vehicle_color ? ` · ${record.vehicle_color}` : ""}
                                        </p>
                                    )}
                                </div>

                                {/* View Details button */}
                                <button
                                    style={{
                                        flexShrink: 0,
                                        display: "flex", alignItems: "center", gap: 8,
                                        borderRadius: 10,
                                        border: `1px solid ${a.iconColor}`,
                                        padding: "8px 14px",
                                        fontSize: 13, fontWeight: 600,
                                        color: a.iconColor,
                                        background: "transparent",
                                        cursor: "pointer", fontFamily: T.font,
                                        transition: "background 0.15s ease",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = a.iconBg}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    View Details <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
