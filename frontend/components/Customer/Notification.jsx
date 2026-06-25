import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faCar, faCircleCheck, faStar,
    faArrowRight, faWrench, faBoxesStacked, faHandshake,
    faClock, faCircleXmark, faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens — exact match to Profile & Admin ───────────────────────────
const T = {
    green:      "#16A34A",
    greenLight: "#F0FDF4",
    greenBg:    "#EDF9F0",
    greenMuted: "rgba(22,163,74,0.08)",
    teal:       "#0D9488",
    tealBg:     "rgba(13,148,136,0.08)",
    blue:       "#2563EB",
    blueBg:     "#EDF3FF",
    violet:     "#A855F7",
    violetBg:   "#F5EDFF",
    amber:      "#D97706",
    amberBg:    "rgba(217,119,6,0.08)",
    red:        "#DC2626",
    redBg:      "#FEF2F2",
    slate900:   "#111827",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate400:   "#9CA3AF",
    slate200:   "#E5E7EB",
    slate100:   "#F3F4F6",
    slate50:    "#F9FAFB",
    white:      "#FFFFFF",
    font:       "'Segoe UI', system-ui, sans-serif",
    card: {
        background:   "#FFFFFF",
        border:       "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow:    "0 1px 4px rgba(0,0,0,0.06)",
    },
};

const STATUS_META = {
    Pending:         { icon: faClock,        iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Pending"       },
    Accepted:        { icon: faCircleCheck,  iconBg: "rgba(37,99,235,0.10)",  iconColor: "#2563EB", badgeBg: "rgba(37,99,235,0.10)",  badgeColor: "#2563EB",  label: "Accepted"      },
    Confirmed:       { icon: faHandshake,    iconBg: "rgba(13,148,136,0.10)", iconColor: "#0D9488", badgeBg: "rgba(13,148,136,0.10)", badgeColor: "#0D9488",  label: "Confirmed"     },
    Diagnosis:       { icon: faStethoscope,  iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Diagnosis"     },
    "In Progress":   { icon: faWrench,       iconBg: "rgba(168,85,247,0.10)", iconColor: "#A855F7", badgeBg: "rgba(168,85,247,0.10)", badgeColor: "#A855F7",  label: "In Progress"   },
    "Pending Parts": { icon: faBoxesStacked, iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Pending Parts" },
    Completed:       { icon: faCircleCheck,  iconBg: "rgba(22,163,74,0.10)",  iconColor: "#16A34A", badgeBg: "rgba(22,163,74,0.10)",  badgeColor: "#16A34A",  label: "Completed"     },
    Cancelled:       { icon: faCircleXmark,  iconBg: "#FEF2F2",               iconColor: "#DC2626", badgeBg: "#FEF2F2",               badgeColor: "#DC2626",  label: "Cancelled"     },
};

const NOTIF_WORTHY = ["Accepted", "Confirmed", "Diagnosis", "In Progress", "Pending Parts", "Completed", "Cancelled"];

const TABS = [
    { key: "all",      label: "All"            },
    { key: "unread",   label: "Unread"         },
    { key: "repair",   label: "Repair Updates" },
    { key: "complete", label: "Completed"      },
];

const getMessage = (req) => {
    const shop = req.shop_name || "the shop";
    switch (req.status) {
        case "Accepted":       return `${shop} accepted your request. Please confirm to lock in your booking.`;
        case "Confirmed":      return `Your booking with ${shop} is confirmed! Repair will begin soon.`;
        case "Diagnosis":      return `${shop} is currently diagnosing your vehicle.`;
        case "In Progress":    return `Your vehicle repair is now in progress at ${shop}.`;
        case "Pending Parts":  return `${shop} is waiting for spare parts to arrive.`;
        case "Completed":      return `Your repair at ${shop} is complete. Your vehicle is ready!`;
        case "Cancelled":      return `Your service request with ${shop} was cancelled.`;
        default:               return `Your request status was updated to ${req.status}.`;
    }
};

const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    if (d.toDateString() === today.toDateString())     return `Today, ${timeStr}`;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + `, ${timeStr}`;
};

export default function Notification({ customerId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [activeTab, setActiveTab]         = useState("all");
    const [readIds, setReadIds]             = useState(() => {
        try { return JSON.parse(localStorage.getItem("fixgo_read_notifs") || "[]"); }
        catch { return []; }
    });

    useEffect(() => {
        if (!customerId) return;
        const fetchNotifs = async () => {
            try {
                const res  = await fetch(`http://localhost:8000/api/getCustomerRequest.php?customer_id=${customerId}`);
                const data = await res.json();
                if (data.success) {
                    const filtered = (data.data || []).filter(r => NOTIF_WORTHY.includes(r.status));
                    setNotifications(filtered);
                }
            } catch (err) {
                console.error("Notification fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000);
        return () => clearInterval(interval);
    }, [customerId]);

    const markRead = (id) => {
        const updated = [...new Set([...readIds, id])];
        setReadIds(updated);
        localStorage.setItem("fixgo_read_notifs", JSON.stringify(updated));
    };

    const markAllRead = () => {
        const allIds = notifications.map(n => n.id);
        const updated = [...new Set([...readIds, ...allIds])];
        setReadIds(updated);
        localStorage.setItem("fixgo_read_notifs", JSON.stringify(updated));
    };

    const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

    const filtered = notifications.filter(n => {
        if (activeTab === "all")      return true;
        if (activeTab === "unread")   return !readIds.includes(n.id);
        if (activeTab === "repair")   return ["Accepted", "Confirmed", "Diagnosis", "In Progress", "Pending Parts"].includes(n.status);
        if (activeTab === "complete") return n.status === "Completed" || n.status === "Cancelled";
        return true;
    });

    const tabCount = (key) => {
        if (key === "all")      return notifications.length;
        if (key === "unread")   return unreadCount;
        if (key === "repair")   return notifications.filter(n => ["Accepted","Confirmed","Diagnosis","In Progress","Pending Parts"].includes(n.status)).length;
        if (key === "complete") return notifications.filter(n => ["Completed","Cancelled"].includes(n.status)).length;
        return 0;
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading notifications…</p>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Page heading — mirrors Profile/Admin header ── */}
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
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Notifications</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Stay updated with the latest repair updates and alerts.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span style={{
                        background: T.green, color: T.white,
                        borderRadius: 99, padding: "4px 14px",
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* ── Tab bar + Mark all read ── */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    borderRadius: 99,
                                    border: `1px solid ${active ? T.green : T.slate200}`,
                                    background: active ? T.greenMuted : T.white,
                                    color: active ? T.green : T.slate700,
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontFamily: T.font,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {tab.label} ({tabCount(tab.key)})
                            </button>
                        );
                    })}
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            border: `1px solid ${T.slate200}`,
                            background: T.white,
                            borderRadius: 10,
                            padding: "8px 16px",
                            fontSize: 13, fontWeight: 600,
                            color: T.slate700,
                            cursor: "pointer",
                            fontFamily: T.font,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11, color: T.green }} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* ── Notifications list card ── */}
            <div style={{ ...T.card, overflow: "hidden" }}>
                {filtered.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 12,
                        padding: "64px 24px", textAlign: "center",
                    }}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 36, color: T.slate200 }} />
                        <p style={{ fontSize: 13, color: T.slate400, margin: 0 }}>No notifications in this category.</p>
                    </div>
                ) : (
                    filtered.map((notif, idx) => {
                        const meta   = STATUS_META[notif.status] || STATUS_META["Pending"];
                        const isRead = readIds.includes(notif.id);
                        const isLast = idx === filtered.length - 1;

                        return (
                            <div
                                key={notif.id}
                                onClick={() => markRead(notif.id)}
                                style={{
                                    display: "flex", alignItems: "flex-start", gap: 16,
                                    padding: "20px 24px",
                                    borderBottom: isLast ? "none" : `1px solid ${T.slate100}`,
                                    background: !isRead ? "#F0FDF4" : T.white,
                                    cursor: "pointer",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => { if (isRead) e.currentTarget.style.background = T.slate50; }}
                                onMouseLeave={e => { e.currentTarget.style.background = !isRead ? "#F0FDF4" : T.white; }}
                            >
                                {/* Icon circle */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: meta.iconBg, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 18, color: meta.iconColor }} />
                                </div>

                                {/* Body */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                            {notif.status === "Completed" ? "Repair completed"   :
                                             notif.status === "Accepted"  ? "Request accepted"   :
                                             notif.status === "Confirmed" ? "Booking confirmed"  :
                                             "Repair status updated"}
                                        </p>
                                        <span style={{
                                            background: meta.badgeBg, color: meta.badgeColor,
                                            borderRadius: 99, padding: "3px 12px",
                                            fontSize: 11, fontWeight: 700,
                                        }}>
                                            {meta.label}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: 13, color: T.slate500, margin: "6px 0 8px", lineHeight: 1.5 }}>
                                        {getMessage(notif)}
                                    </p>

                                    <span style={{
                                        display: "inline-block",
                                        background: T.slate100, color: T.slate700,
                                        borderRadius: 8, padding: "4px 12px",
                                        fontSize: 12, fontWeight: 600,
                                    }}>
                                        {notif.vehicle_brand || "Vehicle"} · Request #{notif.id}
                                    </span>

                                    {/* Completed — review prompt */}
                                    {notif.status === "Completed" && (
                                        <div style={{
                                            marginTop: 12,
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            background: T.greenMuted, border: `1px solid ${T.slate200}`,
                                            borderRadius: 12, padding: "12px 16px",
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <FontAwesomeIcon icon={faStar} style={{ color: T.green }} />
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                                        We'd love to hear about your experience!
                                                    </p>
                                                    <p style={{ fontSize: 12, color: T.slate500, margin: 0 }}>
                                                        Your feedback helps others find great workshops.
                                                    </p>
                                                </div>
                                            </div>
                                            <button style={{
                                                display: "flex", alignItems: "center", gap: 6,
                                                background: T.green, color: T.white,
                                                border: "none", borderRadius: 10,
                                                padding: "8px 14px",
                                                fontSize: 13, fontWeight: 700,
                                                cursor: "pointer", fontFamily: T.font,
                                                flexShrink: 0, marginLeft: 12,
                                            }}>
                                                <FontAwesomeIcon icon={faStar} style={{ fontSize: 11 }} />
                                                Review & Rate
                                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Accepted — confirm nudge */}
                                    {notif.status === "Accepted" && (
                                        <div style={{
                                            marginTop: 12,
                                            background: T.blueBg, border: `1px solid rgba(37,99,235,0.2)`,
                                            borderRadius: 10, padding: "10px 14px",
                                        }}>
                                            <p style={{ fontSize: 12, color: T.blue, margin: 0 }}>
                                                ℹ️ Go to your <strong>Repair Status</strong> tab to confirm this shop and unlock their contact details.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Timestamp + unread dot */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, color: T.slate400, whiteSpace: "nowrap" }}>
                                        {formatTime(notif.created_at)}
                                    </span>
                                    <span style={{
                                        width: 10, height: 10, borderRadius: "50%",
                                        background: !isRead ? T.green : T.slate200,
                                        display: "inline-block",
                                    }} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
