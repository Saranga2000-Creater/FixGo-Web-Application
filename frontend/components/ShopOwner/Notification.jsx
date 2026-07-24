import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faClipboard, faClipboardList, faCircleCheck,
    faComment, faStar, faArrowRight, faXmark,
    faChevronRight, faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";


// Colors kept as JS constants because notification metadata below
// references them dynamically (gradient, iconColor, accent, etc. are
// data-driven per notification type, not static Tailwind classes).
const T = {
    green:      "#16A34A",
    greenDark:  "#0F7A38",
    red:        "#DC2626",
    redDark:    "#B91C1C",
    amber:      "#D97706",
    slate700:   "#374151",
    slate500:   "#6B7280",
    slate400:   "#9CA3AF",
    slate200:   "#E5E7EB",
    slate100:   "#F3F4F6",
    white:      "#FFFFFF",
    greenMuted: "rgba(22,163,74,0.08)",
    redBg:      "#FEF2F2",
    amberBg:    "rgba(217,119,6,0.10)",
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
        api.get("getNotifications.php")
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
        const target = notifications.find((n) => n.id === id);
        if (!target || !target.isUnread) return;

        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
        );

        api.post("markNotificationRead.php", { notification_id: id })
        .then((data) => {
            if (!data || !data.success) console.error("Failed to mark notification as read:", data);
        })
        .catch(console.error);
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));

        api.post("markNotificationRead.php", { mark_all: true })
        .then((data) => {
            if (!data || !data.success) console.error("Failed to mark all notifications as read:", data);
        })
        .catch(console.error);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-[13px] text-gray-500 font-sans">Loading notifications…</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 font-sans">

            {/* ── Header ── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 m-0">
                    Notifications
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Stay updated with your latest service requests and repair activities.
                </p>
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-full py-1.5 px-4 text-[13px] font-semibold font-sans cursor-pointer transition-all duration-150 border ${
                                    active
                                        ? "border-green-600 bg-gradient-to-br from-green-600/[0.12] to-green-600/[0.06] text-green-600 shadow-[0_2px_6px_rgba(22,163,74,0.15)]"
                                        : "border-gray-200 bg-white text-gray-700 shadow-none"
                                }`}
                            >
                                {tab.label} ({tabCount(tab.key)})
                            </button>
                        );
                    })}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-[10px] py-2 px-4 text-[13px] font-semibold text-gray-700 cursor-pointer font-sans shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-150 hover:border-green-600 hover:text-green-600"
                    >
                        <FontAwesomeIcon icon={faCheck} className="text-[11px] text-green-600" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* ── Notification List ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                        <FontAwesomeIcon icon={faBell} className="text-4xl text-gray-200" />
                        <p className="text-[13px] text-gray-400 m-0">No notifications in this category.</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification, idx) => {
                        const meta   = notification.meta;
                        const isLast = idx === filteredNotifications.length - 1;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`flex items-start gap-4 py-5 pr-6 pl-5 cursor-pointer transition-all duration-[180ms] ease-in-out hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] ${
                                    isLast ? "" : "border-b border-gray-100"
                                } ${
                                    notification.isUnread
                                        ? "bg-[#F7FCF8] hover:bg-[#F0FDF4]"
                                        : "bg-white hover:bg-gray-50"
                                }`}
                                style={{
                                    borderLeft: `4px solid ${notification.isUnread ? meta.accent : "transparent"}`,
                                }}
                            >
                                {/* Status Icon */}
                                <div
                                    className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-shadow duration-[180ms] ease-in-out"
                                    style={{
                                        background: meta.gradient,
                                        boxShadow: notification.isUnread ? `0 0 0 3px ${meta.iconColor}22` : "none",
                                    }}
                                >
                                    <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 18, color: meta.iconColor }} />
                                </div>

                                {/* Body */}
                                <div className="flex-1 min-w-0">

                                    {/* Title + Badge */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-[14.5px] font-bold text-gray-900 m-0 tracking-[-0.01em]">
                                            {notification.title}
                                        </p>
                                        <span
                                            className="rounded-full py-[3px] pr-[11px] pl-2 text-[11px] font-bold inline-flex items-center gap-1.5"
                                            style={{
                                                background: meta.badgeBg,
                                                color: meta.badgeColor,
                                                border: `1px solid ${meta.badgeColor}22`,
                                            }}
                                        >
                                            <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 9 }} />
                                            {meta.label}
                                        </span>
                                        {notification.isUnread && (
                                            <span className="text-[9.5px] font-extrabold tracking-[0.06em] text-white bg-green-600 rounded-full py-[2.5px] px-2">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <p className="text-[13px] text-gray-500 mt-1.5 mb-2.5 leading-[1.55]">
                                        {notification.subtitle}
                                    </p>

                                    {/* Ref pill(s) */}
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-lg py-1 px-3 text-xs font-semibold">
                                            🔧 {notification.requestNumber}
                                        </span>
                                        {notification.vehicle && (
                                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-lg py-1 px-3 text-xs font-semibold">
                                                🚗 {notification.vehicle}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action box */}
                                    {meta.actionText && (
                                        <div
                                            className="mt-3.5 rounded-2xl py-3.5 px-[18px]"
                                            style={{
                                                background: meta.gradient,
                                                border: `1px solid ${meta.accent}33`,
                                            }}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 13, color: meta.badgeColor }} />
                                                    <span className="text-[13px] text-gray-700 font-medium">{meta.actionText}</span>
                                                </div>
                                                {meta.buttonText && meta.targetNav && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveNav(meta.targetNav);
                                                        }}
                                                        className="flex items-center gap-1.5 text-white border-none rounded-[10px] py-2.5 px-4 text-[13px] font-bold cursor-pointer font-sans shrink-0 transition-transform duration-[120ms] ease-in-out hover:-translate-y-px group"
                                                        style={{
                                                            background: meta.buttonColor,
                                                            boxShadow: `0 3px 8px ${meta.buttonColor}44`,
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = meta.buttonColorDark; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = meta.buttonColor; }}
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
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap">{formatTime(notification.timestamp)}</span>
                                    <span
                                        className="w-[9px] h-[9px] rounded-full inline-block"
                                        style={{
                                            background: notification.isUnread ? meta.accent : T.slate200,
                                            boxShadow: notification.isUnread ? `0 0 0 4px ${meta.accent}22` : "none",
                                        }}
                                    />
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

