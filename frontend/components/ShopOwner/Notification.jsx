import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboard,
    faWrench,
    faComment,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

function Notification({ setActiveNav }) {

    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    const unreadCount = notifications.filter(
        (notification) => notification.isUnread
    ).length;

    const counts = {
        all: notifications.length,
        unread: notifications.filter((n) => n.isUnread).length,
        pending: notifications.filter((n) => n.status === "Pending").length,
        confirmed: notifications.filter((n) => n.status === "Confirmed").length,
        cancelled: notifications.filter((n) => n.status === "Cancelled").length,
    };

    const filteredNotifications = notifications.filter((notification) => {

        if (activeFilter === "All") return true;

        if (activeFilter === "Unread")
            return notification.isUnread;

        if (activeFilter === "Service Requests")
            return notification.status === "Pending";

        if (activeFilter === "Confirmed")
            return notification.status === "Confirmed";

        if (activeFilter === "Cancelled")
            return notification.status === "Cancelled";

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

        const shopId = localStorage.getItem("shopId");

        if (!shopId) return;

        fetch(
            `http://localhost:8000/api/getShopNotifications.php?shop_id=${shopId}`
        )
            .then((res) => res.json())
            .then((data) => {

                if (!data.success) return;

                const formatted = data.data.map((item) => {

                    let title = "";
                    let icon = faClipboard;
                    let iconBg = "bg-blue-500";

                    let actionText = "";
                    let buttonText = "";
                    let actionColor = "";

                    switch (item.status) {

                        case "Pending":

                            title = `${item.customer_name} sent a new service request`;

                            icon = faClipboard;
                            iconBg = "bg-blue-500";

                            actionText =
                                "Review this request and decide whether to accept or decline it.";

                            buttonText = "View Service Requests";

                            actionColor =
                                "bg-blue-50 border-blue-200";

                            break;

                        case "Confirmed":

                            title =
                                `${item.customer_name} confirmed the booking`;

                            icon = faWrench;
                            iconBg = "bg-green-500";

                            actionText =
                                "The customer confirmed the booking. You can now begin the repair.";

                            buttonText = "Go to Active Repairs";

                            actionColor =
                                "bg-green-50 border-green-200";

                            break;

                        case "Cancelled":

                            title =
                                `${item.customer_name} cancelled the request`;

                            icon = faComment;
                            iconBg = "bg-red-500";

                            actionText =
                                "No further action is required.";

                            buttonText = "";

                            actionColor =
                                "bg-red-50 border-red-200";

                            break;
                    }

                    return {

                        id: item.id,

                        title,

                        subtitle: item.description,

                        status: item.status,

                        timestamp:
                            item.status === "Pending"
                                ? item.created_at
                                : item.status === "Confirmed"
                                ? item.confirmed_at
                                : item.cancelled_at,

                        icon,

                        iconBg,

                        actionText,

                        buttonText,

                        actionColor,

                        requestNumber:
                            item.request_number || `REQ-${item.id}`,

                        vehicle:
                            item.vehicle_brand || "",

                        isUnread: true,
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

        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isUnread: false }
                    : notification
            )
        );

    };

    const markAllAsRead = () => {

        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                isUnread: false,
            }))
        );

    };

     return (
    <div className="w-full">

        {/* Header */}

        <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-900">
                Notifications
            </h1>

            <p className="mt-2 text-sm text-gray-500">
                Stay updated with your latest service requests and repair activities.
            </p>

        </div>

        {/* Filter Bar */}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

            <div className="flex flex-wrap gap-3">

                {[
                    {
                        label: "All",
                        value: "All",
                        count: counts.all,
                    },
                    {
                        label: "Unread",
                        value: "Unread",
                        count: counts.unread,
                    },
                    {
                        label: "Service Requests",
                        value: "Service Requests",
                        count: counts.pending,
                    },
                    {
                        label: "Confirmed",
                        value: "Confirmed",
                        count: counts.confirmed,
                    },
                    {
                        label: "Cancelled",
                        value: "Cancelled",
                        count: counts.cancelled,
                    },
                ].map((filter) => (

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

                <div className="rounded-xl border bg-white py-20 text-center">

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
                                : "bg-white"
                        }

                        hover:shadow-md`}

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

                                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold

                                                ${
                                                    notification.status === "Pending"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : notification.status === "Confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}

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

                                        {notification.buttonText && (

                                            <button

                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    if (
                                                        notification.status ===
                                                        "Pending"
                                                    ) {

                                                        setActiveNav(
                                                            "requests"
                                                        );

                                                    }

                                                    if (
                                                        notification.status ===
                                                        "Confirmed"
                                                    ) {

                                                        setActiveNav(
                                                            "repairs"
                                                        );

                                                    }

                                                }}

                                                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition"

                                            >

                                                {notification.buttonText}

                                            </button>

                                        )}

                                    </div>

                                </div>

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