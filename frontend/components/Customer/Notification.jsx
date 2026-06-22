import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faCar, faCircleCheck, faStar,
    faArrowRight, faWrench, faBoxesStacked, faHandshake,
    faClock, faCircleXmark, faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

const STATUS_META = {
    Pending:          { icon: faClock,        iconBg: "bg-[#d97706]/10", iconColor: "text-[#d97706]", badge: "bg-[#d97706]/10 text-[#d97706]",   label: "Pending"       },
    Accepted:         { icon: faCircleCheck,  iconBg: "bg-[#2563eb]/10", iconColor: "text-[#2563eb]", badge: "bg-[#2563eb]/10 text-[#2563eb]",   label: "Accepted"      },
    Confirmed:        { icon: faHandshake,    iconBg: "bg-[#0d9488]/10", iconColor: "text-[#0d9488]", badge: "bg-[#0d9488]/10 text-[#0d9488]",   label: "Confirmed"     },
    Diagnosis:        { icon: faStethoscope, iconBg: "bg-[#d97706]/10", iconColor: "text-[#d97706]", badge: "bg-[#d97706]/10 text-[#d97706]",   label: "Diagnosis"     },
    "In Progress":    { icon: faWrench,       iconBg: "bg-[#a855f7]/10", iconColor: "text-[#a855f7]", badge: "bg-[#a855f7]/10 text-[#a855f7]",   label: "In Progress"   },
    "Pending Parts":  { icon: faBoxesStacked, iconBg: "bg-[#d97706]/10", iconColor: "text-[#d97706]", badge: "bg-[#d97706]/10 text-[#d97706]",   label: "Pending Parts" },
    Completed:        { icon: faCircleCheck,  iconBg: "bg-[#16a34a]/10", iconColor: "text-[#16a34a]", badge: "bg-[#16a34a]/10 text-[#16a34a]",   label: "Completed"     },
    Cancelled:        { icon: faCircleXmark,  iconBg: "bg-red-100",      iconColor: "text-red-500",   badge: "bg-red-100 text-red-600",           label: "Cancelled"     },
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-[#274c3a]/40">
                    <FontAwesomeIcon icon={faBell} className="text-4xl animate-pulse text-[#16a34a]/30" />
                    <p className="text-sm font-mono">Loading notifications…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Notifications</h1>
                <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Stay updated with the latest updates and alerts.</p>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-mono font-medium transition ${
                                activeTab === tab.key
                                    ? "border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]"
                                    : "border-[#d1e7d7] bg-white text-[#274c3a] hover:border-[#16a34a]/50 hover:bg-[#16a34a]/5"
                            }`}
                        >
                            {tab.label} ({tabCount(tab.key)})
                        </button>
                    ))}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-[#d1e7d7] bg-white px-4 py-2 text-sm font-mono font-medium text-[#274c3a] shadow-[0_4px_12px_rgb(22,163,74,0.06)] transition hover:bg-[#16a34a]/5"
                    >
                        <FontAwesomeIcon icon={faCheck} className="text-xs text-[#16a34a]" />
                        Mark all as read
                    </button>
                )}
            </section>

            <section className="rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <FontAwesomeIcon icon={faBell} className="text-4xl text-[#d1e7d7]" />
                        <p className="text-sm font-mono text-[#274c3a]/40">No notifications in this category.</p>
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
                                className={`cursor-pointer px-6 py-5 transition hover:bg-[#16a34a]/[0.02] ${!isLast ? "border-b border-[#d1e7d7]/60" : ""} ${!isRead ? "bg-[#f0f7f2]" : ""}`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}>
                                        <FontAwesomeIcon icon={meta.icon} className={`text-xl ${meta.iconColor}`} />
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-semibold text-[#14532d]">
                                                {notif.status === "Completed" ? "Repair completed" :
                                                 notif.status === "Accepted"  ? "Request accepted" :
                                                 notif.status === "Confirmed" ? "Booking confirmed" :
                                                 "Repair status updated"}
                                            </p>
                                            <span className={`rounded-full px-3 py-0.5 text-xs font-mono font-medium ${meta.badge}`}>
                                                {meta.label}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm font-mono text-[#274c3a]/70">{getMessage(notif)}</p>
                                        <span className="mt-2 inline-block rounded-lg bg-[#d1e7d7] px-3 py-1 text-xs font-mono font-medium text-[#14532d]">
                                            {notif.vehicle_brand || "Vehicle"} · Request #{notif.id}
                                        </span>

                                        {/* Completed — show review prompt */}
                                        {notif.status === "Completed" && (
                                            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#d1e7d7] bg-[#16a34a]/5 px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <FontAwesomeIcon icon={faStar} className="text-[#16a34a]" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#14532d]">We'd love to hear about your experience!</p>
                                                        <p className="text-xs font-mono text-[#274c3a]/60">Your feedback helps others find great workshops.</p>
                                                    </div>
                                                </div>
                                                <button className="ml-4 flex shrink-0 items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2 text-sm font-mono font-medium text-white transition hover:bg-[#16a34a]/80 active:scale-95">
                                                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                                                    Review & Rate
                                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Accepted — confirm nudge */}
                                        {notif.status === "Accepted" && (
                                            <div className="mt-3 rounded-xl border border-[#2563eb]/20 bg-[#2563eb]/5 px-4 py-3">
                                                <p className="text-xs font-mono text-[#2563eb]">
                                                    ℹ️ Go to your <strong>Repair Status</strong> tab to confirm this shop and unlock their contact details.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Time + unread dot */}
                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                        <span className="text-xs font-mono text-[#274c3a]/40 whitespace-nowrap">
                                            {formatTime(notif.created_at)}
                                        </span>
                                        <span className={`h-2.5 w-2.5 rounded-full ${!isRead ? "bg-[#16a34a]" : "bg-[#d1e7d7]"}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );
}