import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faWrench,
    faComment,
    faCircleCheck,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE = "http://localhost:8000/api";

// NOTE: adjust these keys if your actual `servicerequest.status` / `notification.type`
// values differ (e.g. if you use "Confirmed" instead of "Accepted", etc).


const NOTIFICATION_META = {

    NewRequest: {
        icon: faClipboard,
        iconBg: "bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
        cardBg: "bg-blue-50 border-blue-200",
        actionText: "Review this request and decide whether to accept or decline it.",
        buttonText: "View Service Requests",
        targetNav: "requests",
    },

    CustomerConfirmed: {
        icon: faCircleCheck,
        iconBg: "bg-green-500",
        badge: "bg-green-100 text-green-700",
        cardBg: "bg-green-50 border-green-200",
        actionText: "The customer confirmed the booking.",
        buttonText: "Go to Active Repairs",
        targetNav: "repairs",
    },

    CustomerCancelled: {
        icon: faComment,
        iconBg: "bg-red-500",
        badge: "bg-red-100 text-red-700",
        cardBg: "bg-red-50 border-red-200",
        actionText: "The customer cancelled the booking.",
        buttonText: "",
        targetNav: null,
    },

    CustomerDeclined: {
        icon: faComment,
        iconBg: "bg-red-500",
        badge: "bg-red-100 text-red-700",
        cardBg: "bg-red-50 border-red-200",
        actionText: "The customer declined the request.",
        buttonText: "View Service Requests",
        targetNav: "requests",
    },

    NewReview: {
        icon: faStar,
        iconBg: "bg-yellow-500",
        badge: "bg-yellow-100 text-yellow-700",
        cardBg: "bg-yellow-50 border-yellow-200",
        actionText: "You received a new review.",
        buttonText: "View Reviews",
        targetNav: "reviews",
    }
};

const DEFAULT_META = {
    icon: faClipboard,
    iconBg: "bg-gray-400",
    badge: "bg-gray-100 text-gray-700",
    cardBg: "bg-gray-50 border-gray-200",
    actionText: "",
    buttonText: "",
    targetNav: null,
};

function getNotificationMeta(type) {
    return NOTIFICATION_META[type] || DEFAULT_META;
}

function Notification({ setActiveNav }) {

    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    const unreadCount = notifications.filter((n) => n.isUnread).length;

    const filters = [
        {
            label: "All",
            value: "All",
            count: notifications.length,
        },
        {
            label: "Unread",
            value: "Unread",
            count: unreadCount,
        },
    ];

    const filteredNotifications = notifications.filter((notification) => {
        if (activeFilter === "Unread") {
            return notification.isUnread;
        }

        return true;
    });

    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    };

    const loadNotifications = () => {

        const token = localStorage.getItem("jwt_token");

        if (!token) return;

        fetch(`${API_BASE}/getNotifications.php`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
                    icon: meta.icon,
                    iconBg: meta.iconBg,
                    badgeClass: meta.badge,
                    actionColor: meta.cardBg,
                    actionText: meta.actionText,
                    buttonText: meta.buttonText,
                    targetNav: meta.targetNav,
                    requestNumber: `REQ-${item.service_request_id || item.id}`,
                    vehicle: item.vehicle_brand || "",
                    isUnread: !item.isRead,
                };
            });

            setNotifications(formatted);
        })
        .catch(console.error);

    };

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(loadNotifications, 5000);

        return () => clearInterval(interval);

    }, []);

    const markAsRead = (id) => {

        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const target = notifications.find((n) => n.id === id);
        if (!target || !target.isUnread) return;

        // Optimistic update
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isUnread: false }
                    : notification
            )
        );

        fetch(`${API_BASE}/markNotificationRead.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ notification_id: id }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.success) {
                console.error("Failed to mark notification as read:", data);
            }
        })
        .catch(console.error);

    };

    const markAllAsRead = () => {

        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        // Optimistic update
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                isUnread: false,
            }))
        );

        fetch(`${API_BASE}/markNotificationRead.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mark_all: true }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.success) {
                console.error("Failed to mark all notifications as read:", data);
            }
        })
        .catch(console.error);

    };

     return (
    <div className="w-full">

        {/* Header */}

        <div className="mb-8">

            <h1 className="text-2xl font-bold text-gray-900">
                Notifications
            </h1>

            <p className="mt-2 text-sm text-gray-500">
                Stay updated with your latest service requests and repair activities.
            </p>

        </div>

        {/* Filter Bar */}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

            <div className="flex flex-wrap gap-3">

                {filters.map((filter) => (

                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all

                        ${
                            activeFilter === filter.value
                                ? "bg-green-50 border-green-600 text-green-700"
                                : "bg-white border-gray-200 text-gray-600 hover:border-green-500 hover:bg-green-50"
                        }`}
                    >

                        {filter.label}

                        <span className="ml-2 text-xs">

                            ({filter.count})

                        </span>

                    </button>

                ))}

            </div>

            {unreadCount > 0 && (

                <button

                    onClick={markAllAsRead}

                    className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"

                >

                    Mark all as read

                </button>

            )}

        </div>

        {/* Notification Cards */}

        <div className="space-y-4">

            {filteredNotifications.length === 0 ? (

                <div className="rounded-xl border border-gray-200 bg-white py-20 text-center">

                    <p className="text-sm text-gray-500">

                        No notifications available.

                    </p>

                </div>

            ) : (

                filteredNotifications.map((notification) => (

                    <div

                        key={notification.id}

                        onClick={() => markAsRead(notification.id)}

                        className={`rounded-2xl border shadow-sm transition-all cursor-pointer

                        ${
                            notification.isUnread
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200"
                        }

                        hover:shadow-md hover:border-gray-300`}

                    >

                        <div className="p-5 flex gap-4">

                            {/* Icon */}

                            <div

                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-base flex-shrink-0 ${notification.iconBg}`}

                            >

                                <FontAwesomeIcon

                                    icon={notification.icon}

                                />

                            </div>

                            {/* Content */}

                            <div className="flex-1">

                                <div className="flex justify-between">

                                    <div>

                                        <div className="flex items-center gap-2 flex-wrap">

                                            <h2 className="text-[15px] font-semibold text-gray-900">

                                                {notification.title}

                                            </h2>

                                            <span

                                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${notification.badgeClass}`}

                                            >

                                                {notification.status}

                                            </span>

                                        </div>

                                        <p className="mt-1 text-[13px] text-gray-500">

                                            {notification.subtitle}

                                        </p>

                                        <div className="flex gap-2 mt-3 flex-wrap">

                                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-[11px]">

                                                {notification.requestNumber}

                                            </span>

                                            {notification.vehicle && (

                                                <span className="bg-gray-100 px-3 py-1 rounded-lg text-[11px]">

                                                    {notification.vehicle}

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-[11px] text-gray-500">

                                            {formatDate(notification.timestamp)}

                                        </p>

                                        {notification.isUnread && (

                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-2 ml-auto"></div>

                                        )}

                                    </div>

                                </div>

                                {/* Action Box */}

                                {notification.actionText && (

                                    <div

                                        className={`mt-4 rounded-xl border p-4 ${notification.actionColor}`}

                                    >

                                        <div className="flex justify-between items-center gap-4">

                                            <div className="flex items-center gap-2">

                                                <FontAwesomeIcon

                                                    icon={faCircleCheck}

                                                    className="text-green-600 text-sm"

                                                />

                                                <span className="text-[13px] text-gray-700">

                                                    {notification.actionText}

                                                </span>

                                            </div>

                                            {notification.buttonText && notification.targetNav && (

                                                <button

                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setActiveNav(notification.targetNav);

                                                    }}

                                                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition"

                                                >

                                                    {notification.buttonText}

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>
            </div>
);
}

export default Notification;


