import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faClipboard, faClipboardList, faCircleCheck,
    faComment, faStar, faArrowRight, faXmark,
    faChevronRight, faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8000/api";

const T = {
    green:      "#16A34A",
    greenDark:  "#0F7A38",
    greenLight: "#F0FDF4",
    greenMuted: "rgba(22,163,74,0.08)",
    blue:       "#2563EB",
    blueDark:   "#1D4ED8",
    blueBg:     "#EDF3FF",
    amber:      "#D97706",
    amberBg:    "rgba(217,119,6,0.10)",
    red:        "#DC2626",
    redDark:    "#B91C1C",
    redBg:      "#FEF2F2",
    redMuted:   "rgba(220,38,38,0.08)",
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

const NOTIFICATION_META = {
   NewRequest: {
    icon: faClipboardList,
    gradient: "linear-gradient(135deg, #D8F4DF 0%, #F0FDF4 100%)",
    iconColor: T.green,
    accent: T.green,
    badgeBg: T.greenMuted,
    badgeColor: T.green,
    label: "New Request",
    actionText: "Review this request and decide whether to accept or decline it.",
    buttonText: "View Service Requests",
    buttonColor: T.green,
    buttonColorDark: T.greenDark,
    targetNav: "requests",
},
    CustomerConfirmed: {
        icon: faCircleCheck,
        gradient: "linear-gradient(135deg, #D8F4DF 0%, #F0FDF4 100%)",
        iconColor: T.green,
        accent: T.green,
        badgeBg: T.greenMuted,
        badgeColor: T.green,
        label: "Confirmed",
        actionText: "The customer confirmed the booking.",
        buttonText: "Go to Active Repairs",
        buttonColor: T.green,
        buttonColorDark: T.greenDark,
        targetNav: "repairs",
    },
    CustomerCancelled: {
        icon: faComment,
        gradient: "linear-gradient(135deg, #FDE2E2 0%, #FEF2F2 100%)",
        iconColor: T.red,
        accent: T.red,
        badgeBg: T.redBg,
        badgeColor: T.red,
        label: "Cancelled",
        actionText: "The customer cancelled the booking.",
        buttonText: "",
        targetNav: null,
    },
    CustomerDeclined: {
        icon: faComment,
        gradient: "linear-gradient(135deg, #FDE2E2 0%, #FEF2F2 100%)",
        iconColor: T.red,
        accent: T.red,
        badgeBg: T.redBg,
        badgeColor: T.red,
        label: "Declined",
        actionText: "The customer declined the request.",
        buttonText: "View Service Requests",
        buttonColor: T.red,
        buttonColorDark: T.redDark,
        targetNav: "requests",
    },
    NewReview: {
        icon: faStar,
        gradient: "linear-gradient(135deg, #FBE7C6 0%, #FEF6E7 100%)",
        iconColor: T.amber,
        accent: T.amber,
        badgeBg: T.amberBg,
        badgeColor: T.amber,
        label: "New Review",
        actionText: "You received a new review.",
        buttonText: "View Reviews",
        buttonColor: T.amber,
        buttonColorDark: "#B45F04",
        targetNav: "reviews",
    },
};

const DEFAULT_META = {
    icon: faClipboard,
    gradient: "linear-gradient(135deg, #EFEFEF 0%, #F9FAFB 100%)",
    iconColor: T.slate500,
    accent: T.slate400,
    badgeBg: T.slate100,
    badgeColor: T.slate700,
    label: "Update",
    actionText: "",
    buttonText: "",
    targetNav: null,
};

const getNotificationMeta = (type) => NOTIFICATION_META[type] || DEFAULT_META;

const TABS = [
    { key: "all",       label: "All"       },
    { key: "unread",    label: "Unread"    },
    { key: "requests",  label: "Requests"  },
    { key: "reviews",   label: "Reviews"   },
    { key: "cancelled", label: "Cancelled" },
];

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

function Notification({ setActiveNav }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]              = useState(true);
    const [activeTab, setActiveTab]          = useState("all");

    const unreadCount = notifications.filter((n) => n.isUnread).length;

    const tabCount = (key) => {
        if (key === "all")       return notifications.length;
        if (key === "unread")    return unreadCount;
        if (key === "requests")  return notifications.filter(n => n.status === "NewRequest" || n.status === "CustomerConfirmed").length;
        if (key === "reviews")   return notifications.filter(n => n.status === "NewReview").length;
        if (key === "cancelled") return notifications.filter(n => n.status === "CustomerCancelled" || n.status === "CustomerDeclined").length;
        return 0;
    };

    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "unread")    return n.isUnread;
        if (activeTab === "requests")  return n.status === "NewRequest" || n.status === "CustomerConfirmed";
        if (activeTab === "reviews")   return n.status === "NewReview";
        if (activeTab === "cancelled") return n.status === "CustomerCancelled" || n.status === "CustomerDeclined";
        return true;
    });

    const loadNotifications = useCallback(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) { setLoading(false); return; }

        fetch(`${API_BASE}/getNotifications.php`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            if (res.status === 401) {
                alert("Your session has expired. Please log in again.");
                return null;
            }
            return res.json();
        })
        .then((data) => {
            if (!data || !data.success) return;

            const formatted = data.data.map((item) => {
                const meta = getNotificationMeta(item.type);
                return {
                    id: item.id,
                    serviceRequestId: item.service_request_id,
                    title: item.title,
                    subtitle: item.message,
                    status: item.type,
                    timestamp: item.created_at,
                    meta,
                    requestNumber: `REQ-${item.service_request_id || item.id}`,
                    vehicle: item.vehicle_brand || "",
                    isUnread: !item.isRead,
                };
            });

            setNotifications(formatted);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 5000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const markAsRead = (id) => {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const target = notifications.find((n) => n.id === id);
        if (!target || !target.isUnread) return;

        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
        );

        fetch(`${API_BASE}/markNotificationRead.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ notification_id: id }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.success) console.error("Failed to mark notification as read:", data);
        })
        .catch(console.error);
    };

    const markAllAsRead = () => {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));

        fetch(`${API_BASE}/markNotificationRead.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ mark_all: true }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.success) console.error("Failed to mark all notifications as read:", data);
        })
        .catch(console.error);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading notifications…</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Header ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18, padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 12,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: "linear-gradient(135deg, #16A34A, #0F7A38)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(22,163,74,0.28)", flexShrink: 0,
                    }}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 19, color: T.white }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: T.slate900, margin: 0, letterSpacing: "-0.02em" }}>Notifications</h1>
                        <p style={{ color: T.slate500, marginTop: 4, marginBottom: 0, fontSize: 14 }}>
                            Stay updated with your latest service requests and repair activities.
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <span style={{
                        background: "linear-gradient(135deg, #16A34A, #0F7A38)", color: T.white,
                        borderRadius: 99, padding: "6px 16px", fontSize: 12, fontWeight: 700,
                        boxShadow: "0 3px 8px rgba(22,163,74,0.3)", display: "flex", alignItems: "center", gap: 6,
                    }}>
                        <span style={{
                            width: 7, height: 7, borderRadius: "50%", background: T.white,
                            animation: "notifPulse 1.6s ease-in-out infinite",
                        }} />
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* ── Tab Bar ── */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TABS.map((tab) => {
                        const active = activeTab === tab.key;
                        return (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                borderRadius: 99,
                                border: `1px solid ${active ? T.green : T.slate200}`,
                                background: active ? "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(22,163,74,0.06))" : T.white,
                                color: active ? T.green : T.slate700,
                                padding: "7px 16px", fontSize: 13, fontWeight: 600,
                                fontFamily: T.font, cursor: "pointer", transition: "all 0.15s",
                                boxShadow: active ? "0 2px 6px rgba(22,163,74,0.15)" : "none",
                            }}>
                                {tab.label} ({tabCount(tab.key)})
                            </button>
                        );
                    })}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        border: `1px solid ${T.slate200}`, background: T.white,
                        borderRadius: 10, padding: "8px 16px",
                        fontSize: 13, fontWeight: 600, color: T.slate700,
                        cursor: "pointer", fontFamily: T.font,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.color = T.green; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.slate200; e.currentTarget.style.color = T.slate700; }}
                    >
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11, color: T.green }} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* ── Notification List ── */}
            <div style={{ ...T.card, overflow: "hidden" }}>
                {filteredNotifications.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "64px 24px", textAlign: "center" }}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 36, color: T.slate200 }} />
                        <p style={{ fontSize: 13, color: T.slate400, margin: 0 }}>No notifications in this category.</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification, idx) => {
                        const meta   = notification.meta;
                        const isLast = idx === filteredNotifications.length - 1;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                style={{
                                    display: "flex", alignItems: "flex-start", gap: 16,
                                    padding: "20px 24px 20px 20px",
                                    borderLeft: `4px solid ${notification.isUnread ? meta.accent : "transparent"}`,
                                    borderBottom: isLast ? "none" : `1px solid ${T.slate100}`,
                                    background: notification.isUnread ? "#F7FCF8" : T.white,
                                    cursor: "pointer", transition: "all 0.18s ease",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = notification.isUnread ? "#F0FDF4" : T.slate50;
                                    e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.02)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = notification.isUnread ? "#F7FCF8" : T.white;
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {/* Status Icon */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: meta.gradient, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: notification.isUnread ? `0 0 0 3px ${meta.iconColor}22` : "none",
                                    transition: "box-shadow 0.18s ease",
                                }}>
                                    <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 18, color: meta.iconColor }} />
                                </div>

                                {/* Body */}
                                <div style={{ flex: 1, minWidth: 0 }}>

                                    {/* Title + Badge */}
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 14.5, fontWeight: 700, color: T.slate900, margin: 0, letterSpacing: "-0.01em" }}>
                                            {notification.title}
                                        </p>
                                        <span style={{
                                            background: meta.badgeBg, color: meta.badgeColor,
                                            borderRadius: 99, padding: "3px 11px 3px 8px", fontSize: 11, fontWeight: 700,
                                            display: "inline-flex", alignItems: "center", gap: 5,
                                            border: `1px solid ${meta.badgeColor}22`,
                                        }}>
                                            <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 9 }} />
                                            {meta.label}
                                        </span>
                                        {notification.isUnread && (
                                            <span style={{
                                                fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em",
                                                color: T.white, background: T.green,
                                                borderRadius: 99, padding: "2.5px 8px",
                                            }}>
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <p style={{ fontSize: 13, color: T.slate500, margin: "6px 0 10px", lineHeight: 1.55 }}>
                                        {notification.subtitle}
                                    </p>

                                    {/* Ref pill(s) */}
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 6,
                                            background: T.slate100, color: T.slate700,
                                            borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                                        }}>
                                            🔧 {notification.requestNumber}
                                        </span>
                                        {notification.vehicle && (
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: 6,
                                                background: T.slate100, color: T.slate700,
                                                borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                                            }}>
                                                🚗 {notification.vehicle}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action box */}
                                    {meta.actionText && (
                                        <div style={{
                                            marginTop: 14,
                                            background: meta.gradient,
                                            border: `1px solid ${meta.accent}33`,
                                            borderRadius: 14, padding: "14px 18px",
                                        }}>
                                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 13, color: meta.badgeColor }} />
                                                    <span style={{ fontSize: 13, color: T.slate700, fontWeight: 500 }}>{meta.actionText}</span>
                                                </div>
                                                {meta.buttonText && meta.targetNav && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveNav(meta.targetNav);
                                                        }}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 6,
                                                            background: meta.buttonColor, color: T.white,
                                                            border: "none", borderRadius: 10, padding: "9px 16px",
                                                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                                                            fontFamily: T.font, flexShrink: 0,
                                                            boxShadow: `0 3px 8px ${meta.buttonColor}44`,
                                                            transition: "transform 0.12s ease, box-shadow 0.12s ease",
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = meta.buttonColorDark;
                                                            e.currentTarget.style.transform = "translateY(-1px)";
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = meta.buttonColor;
                                                            e.currentTarget.style.transform = "translateY(0)";
                                                        }}
                                                    >
                                                        {meta.buttonText}
                                                        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 11 }} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Timestamp + dot */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, color: T.slate400, whiteSpace: "nowrap" }}>{formatTime(notification.timestamp)}</span>
                                    <span style={{
                                        width: 9, height: 9, borderRadius: "50%",
                                        background: notification.isUnread ? meta.accent : T.slate200,
                                        display: "inline-block",
                                        boxShadow: notification.isUnread ? `0 0 0 4px ${meta.accent}22` : "none",
                                    }} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <style>{`
                @keyframes notifPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.7); }
                }
            `}</style>
        </div>
    );
}

export default Notification;