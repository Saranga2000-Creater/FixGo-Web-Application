import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faCalendarDays, faChevronDown,
    faClockRotateLeft, faMapPin, faWrench,
    faXmark, faCar, faClock, faCircleCheck,
    faHandshake, faFlag, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenBg:   "#EDF9F0",
    greenMuted:"rgba(22,163,74,0.08)",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.10)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    violet:    "#A855F7",
    violetBg:  "#F5EDFF",
    amber:     "#D97706",
    amberBg:   "rgba(217,119,6,0.10)",
    red:       "#DC2626",
    redBg:     "#FEF2F2",
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

// ── Status config for modal ───────────────────────────────────────────────────
const STATUS_CONFIG = {
    Pending:       { label: "Pending",     color: T.amber,   bg: T.amberBg,               icon: faClock       },
    Accepted:      { label: "Accepted",    color: T.blue,    bg: T.blueBg,                icon: faCircleCheck },
    Confirmed:     { label: "Confirmed",   color: T.teal,    bg: T.tealBg,                icon: faHandshake   },
    "In Progress": { label: "In Progress", color: "#A855F7", bg: "rgba(168,85,247,0.10)", icon: faWrench      },
    Completed:     { label: "Completed",   color: T.green,   bg: T.greenMuted,            icon: faFlag        },
    Cancelled:     { label: "Cancelled",   color: T.red,     bg: T.redBg,                 icon: faCircleXmark },
};

const ACCENT_CYCLE = ["green", "teal", "blue", "violet", "yellow"];
const ACCENT = {
    green:  { iconBg: T.greenBg,  iconColor: T.green,  badgeBg: T.greenBg,  badgeColor: T.green  },
    teal:   { iconBg: T.tealBg,   iconColor: T.teal,   badgeBg: T.tealBg,   badgeColor: T.teal   },
    blue:   { iconBg: T.blueBg,   iconColor: T.blue,   badgeBg: T.blueBg,   badgeColor: T.blue   },
    violet: { iconBg: T.violetBg, iconColor: T.violet, badgeBg: T.violetBg, badgeColor: T.violet },
    yellow: { iconBg: T.yellowBg, iconColor: T.yellow, badgeBg: T.yellowBg, badgeColor: T.yellow },
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

// ── Format reference ID: REQ-2026-00021 ──────────────────────────────────────
const formatRefId = (id, createdAt) => {
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `REQ-${year}-${String(id).padStart(5, "0")}`;
};

// ── Detail row inside modal ───────────────────────────────────────────────────
function DetailRow({ label, value }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            gap: 16, paddingBottom: 14, borderBottom: `1px solid ${T.slate100}`,
        }}>
            <p style={{ fontSize: 13, color: T.slate500, margin: 0, flexShrink: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.slate900, margin: 0, textAlign: "right" }}>
                {value || "—"}
            </p>
        </div>
    );
}

// ── Details Modal ─────────────────────────────────────────────────────────────
function DetailsModal({ record, onClose }) {
    const cfg = STATUS_CONFIG[record.status] || STATUS_CONFIG["Completed"];

    // Close on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            onClick={handleBackdrop}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
                backdropFilter: "blur(2px)",
            }}
        >
            <div style={{
                background: T.white,
                borderRadius: 20,
                width: "100%",
                maxWidth: 520,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                fontFamily: T.font,
            }}>
                {/* ── Modal header ── */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: `1px solid ${T.slate100}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                    borderRadius: "20px 20px 0 0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: cfg.bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <FontAwesomeIcon icon={cfg.icon} style={{ fontSize: 20, color: cfg.color }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                {formatRefId(record.id, record.created_at)}
                            </h2>
                            <p style={{ fontSize: 13, color: T.slate500, margin: "3px 0 0" }}>
                                {record.vehicle_brand || "Vehicle"}{record.vehicle_color ? ` · ${record.vehicle_color}` : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: `1px solid ${T.slate200}`,
                            background: T.white,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: T.slate500,
                            flexShrink: 0,
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = T.slate100}
                        onMouseLeave={e => e.currentTarget.style.background = T.white}
                    >
                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: 14 }} />
                    </button>
                </div>

                {/* ── Modal body ── */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Status badge */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: cfg.bg, borderRadius: 12,
                        border: `1px solid ${cfg.color}33`,
                        padding: "12px 16px",
                    }}>
                        <FontAwesomeIcon icon={cfg.icon} style={{ fontSize: 16, color: cfg.color }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>

                    {/* Request info */}
                    <div style={{
                        background: T.slate50, borderRadius: 14,
                        border: `1px solid ${T.slate200}`, padding: 20,
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.slate700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 11 }}>
                            Request Information
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <DetailRow label="Reference ID"     value={formatRefId(record.id, record.created_at)} />
                            <DetailRow label="Issue / Service"  value={record.issue_category || record.description} />
                            <DetailRow label="Workshop"         value={record.shop_name} />
                            <DetailRow label="Vehicle"          value={`${record.vehicle_brand || "—"} · ${record.vehicle_color || "—"}`} />
                            <DetailRow label="Preferred Date"   value={record.preferred_date ? formatDate(record.preferred_date) : null} />
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div style={{
                        background: T.slate50, borderRadius: 14,
                        border: `1px solid ${T.slate200}`, padding: 20,
                    }}>
                        <h3 style={{ fontSize: 11, fontWeight: 700, color: T.slate700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Timeline
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <DetailRow
                                label="Submitted On"
                                value={record.created_at ? `${formatDate(record.created_at)} · ${formatTime(record.created_at)}` : null}
                            />
                            {record.completed_at && (
                                <DetailRow
                                    label="Completed On"
                                    value={`${formatDate(record.completed_at)} · ${formatTime(record.completed_at)}`}
                                />
                            )}
                            {record.cancellation_reason && (
                                <DetailRow label="Cancellation Reason" value={record.cancellation_reason} />
                            )}
                        </div>
                    </div>

                    {/* Description if available */}
                    {record.description && record.issue_category && (
                        <div style={{
                            background: T.slate50, borderRadius: 14,
                            border: `1px solid ${T.slate200}`, padding: 20,
                        }}>
                            <h3 style={{ fontSize: 11, fontWeight: 700, color: T.slate700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Description
                            </h3>
                            <p style={{ fontSize: 13, color: T.slate700, margin: 0, lineHeight: 1.6 }}>
                                {record.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Modal footer ── */}
                <div style={{
                    padding: "16px 24px",
                    borderTop: `1px solid ${T.slate100}`,
                    display: "flex", justifyContent: "flex-end",
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 24px", borderRadius: 10,
                            background: T.green, color: T.white,
                            border: "none", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: T.font,
                            transition: "opacity 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ServiceHistory({ customerId }) {
    const [history,       setHistory]       = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [filter,        setFilter]        = useState("All Time");
    const [selectedRecord, setSelectedRecord] = useState(null);  // modal

    useEffect(() => {
        if (!customerId) return;
        const fetchHistory = async () => {
            try {
                // ── Fetch ALL requests (not just completed) ──
                const res  = await fetch(`http://localhost:8000/api/getCustomerRequest.php?customer_id=${customerId}`);
                const data = await res.json();
                if (data.success) {
                    // Only show finished requests — ongoing ones live in Repair Status
                    const finished = (data.data || []).filter(r =>
                        ["Completed", "Cancelled"].includes(r.status)
                    );
                    setHistory(finished);
                }
            } catch (err) {
                console.error("ServiceHistory fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [customerId]);

    // Filter uses created_at since we show all statuses now
    const filtered = history.filter(r => isWithinFilter(r.created_at, filter));

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

            {/* ── Details modal ── */}
            {selectedRecord && (
                <DetailsModal
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                />
            )}

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
                        View all your vehicle service requests and their details.
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
                        {filter !== "All Time" ? "Try a different time range." : "Your completed and cancelled repairs will appear here."}
                    </p>
                </div>
            ) : (
                /* ── History list card ── */
                <div style={{ ...T.card, overflow: "hidden" }}>
                    {filtered.map((record, idx) => {
                        const a       = ACCENT[ACCENT_CYCLE[idx % ACCENT_CYCLE.length]];
                        const isLast  = idx === filtered.length - 1;
                        const cfg     = STATUS_CONFIG[record.status] || STATUS_CONFIG["Pending"];

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
                                        background: cfg.color, flexShrink: 0, marginTop: 4,
                                    }} />
                                    {!isLast && (
                                        <div style={{ width: 1, flex: 1, background: T.slate200, marginTop: 4 }} />
                                    )}
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                                    background: cfg.bg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={cfg.icon} style={{ fontSize: 20, color: cfg.color }} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: T.slate900, margin: 0 }}>
                                            {record.issue_category || record.description || "Service Request"}
                                        </p>
                                        {/* Status badge matches actual status */}
                                        <span style={{
                                            borderRadius: 99, padding: "3px 10px",
                                            fontSize: 11, fontWeight: 700,
                                            background: cfg.bg, color: cfg.color,
                                        }}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <div style={{
                                        marginTop: 6, display: "flex", flexWrap: "wrap",
                                        alignItems: "center", gap: "4px 16px",
                                        fontSize: 12, color: T.slate500,
                                    }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400, fontSize: 11 }} />
                                            {formatDate(record.created_at)}
                                            {formatTime(record.created_at) && ` · ${formatTime(record.created_at)}`}
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
                                    onClick={() => setSelectedRecord(record)}
                                    style={{
                                        flexShrink: 0,
                                        display: "flex", alignItems: "center", gap: 8,
                                        borderRadius: 10,
                                        border: `1px solid ${cfg.color}`,
                                        padding: "8px 14px",
                                        fontSize: 13, fontWeight: 600,
                                        color: cfg.color,
                                        background: "transparent",
                                        cursor: "pointer", fontFamily: T.font,
                                        transition: "background 0.15s ease",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = cfg.bg}
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
