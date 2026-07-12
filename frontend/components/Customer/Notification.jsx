import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faCircleCheck, faStar,
    faArrowRight, faWrench, faBoxesStacked, faHandshake,
    faClock, faCircleXmark, faStethoscope, faSpinner,
    faTruckPickup, faUser, faPhone, faIdCard,
    faStore, faXmark, faExternalLinkAlt, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const FONT = "'Segoe UI', system-ui, sans-serif";

const STATUS_META = {
    Pending:         { icon: faClock,        iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Pending"       },
    Accepted:        { icon: faCircleCheck,  iconBg: "rgba(37,99,235,0.10)",  iconColor: "#2563EB", badgeBg: "rgba(37,99,235,0.10)",  badgeColor: "#2563EB",  label: "Accepted"      },
    Confirmed:       { icon: faHandshake,    iconBg: "rgba(13,148,136,0.10)", iconColor: "#0D9488", badgeBg: "rgba(13,148,136,0.10)", badgeColor: "#0D9488",  label: "Confirmed"     },
    Diagnosis:       { icon: faStethoscope,  iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Diagnosis"     },
    "In Progress":   { icon: faWrench,       iconBg: "rgba(168,85,247,0.10)", iconColor: "#A855F7", badgeBg: "rgba(168,85,247,0.10)", badgeColor: "#A855F7",  label: "In Progress"   },
    "Pending Parts": { icon: faBoxesStacked, iconBg: "rgba(217,119,6,0.10)",  iconColor: "#D97706", badgeBg: "rgba(217,119,6,0.10)",  badgeColor: "#D97706",  label: "Pending Parts" },
    Completed:       { icon: faCircleCheck,  iconBg: "rgba(22,163,74,0.10)",  iconColor: "#16A34A", badgeBg: "rgba(22,163,74,0.10)",  badgeColor: "#16A34A",  label: "Completed"     },
    Cancelled:       { icon: faCircleXmark,  iconBg: "#FEF2F2",               iconColor: "#DC2626", badgeBg: "#FEF2F2",               badgeColor: "#DC2626",  label: "Cancelled"     },
    Declined:        { icon: faCircleXmark,  iconBg: "#FEF2F2",               iconColor: "#DC2626", badgeBg: "#FEF2F2",               badgeColor: "#DC2626",  label: "Declined"      },
};

const NOTIF_WORTHY = ["Accepted", "Confirmed", "Diagnosis", "In Progress", "Pending Parts", "Completed", "Cancelled", "Declined"];

const TABS = [
    { key: "all",      label: "All"            },
    { key: "unread",   label: "Unread"         },
    { key: "repair",   label: "Repair Updates" },
    { key: "complete", label: "Completed"      },
    { key: "cancel",   label: "Cancelled"      },
];

// ── Helper: decode the logged-in user's id from the stored JWT ──────────────
const getUserIdFromToken = () => {
    try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const id = payload.user_id || payload.id;
        return id ? String(id) : null;
    } catch {
        return null;
    }
};

const getMessage = (req) => {
    if (req.message) return req.message;
    const shop = req.shop_name || "the shop";
    switch (req.status) {
        case "Accepted":       return `${shop} accepted your request. Please confirm or decline below.`;
        case "Confirmed":      return req.requires_tow == 1
            ? `Your booking with ${shop} is confirmed! We're on our way to pick up your vehicle. Sit tight!`
            : `Your booking with ${shop} is confirmed! Please bring your vehicle to the shop.`;
        case "Diagnosis":      return `${shop} is currently diagnosing your vehicle.`;
        case "In Progress":    return `Your vehicle repair is now in progress at ${shop}.`;
        case "Pending Parts":  return `${shop} is waiting for spare parts to arrive.`;
        case "Completed":      return `Your repair at ${shop} is complete. Your vehicle is ready!`;
        case "Cancelled":      return `Your service request with ${shop} was cancelled.`;
        case "Declined":       return `Unfortunately, ${shop} declined your service request. Feel free to try another shop.`;
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

const formatRefId = (id, createdAt) => {
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `REQ-${year}-${String(id).padStart(5, "0")}`;
};

// ── Decline Confirm Modal ─────────────────────────────────────────────────────
const DeclineModal = ({ shopName, refId, onConfirm, onCancel, isLoading }) => (
    <div
        className="fixed inset-0 z-[9999] bg-black/45 flex items-center justify-center p-5"
        style={{ backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease" }}
    >
        <div
            className="bg-white rounded-[20px] py-8 px-7 max-w-[420px] w-full flex flex-col items-center gap-4"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)", animation: "slideUp 0.2s ease" }}
        >
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-red-600" />
            </div>

            <div className="text-center">
                <p className="text-[17px] font-bold text-gray-900 mb-2 mt-0">
                    Decline this booking?
                </p>
                <p className="text-[13px] text-gray-500 m-0 leading-relaxed">
                    You're about to decline the booking from{" "}
                    <strong className="text-gray-700">{shopName || "this shop"}</strong>
                    {refId && <> ({refId})</>}.
                    <br />This action cannot be undone.
                </p>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex gap-2.5 w-full">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className={`flex-1 py-[11px] rounded-xl border-[1.5px] border-gray-200 bg-white text-gray-700 text-sm font-semibold transition-all duration-150 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ fontFamily: FONT }}
                >
                    Keep Booking
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-[11px] rounded-xl border-none text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2
                        ${isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white cursor-pointer"}`}
                    style={{ fontFamily: FONT }}
                >
                    {isLoading
                        ? <><FontAwesomeIcon icon={faSpinner} spin /> Declining…</>
                        : <><FontAwesomeIcon icon={faXmark} /> Yes, Decline</>
                    }
                </button>
            </div>
        </div>

        <style>{`
            @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        `}</style>
    </div>
);

// ── Tow Truck Details Card ────────────────────────────────────────────────────
const TowTruckCard = ({ notif }) => {
    if (notif.requires_tow != 1) return null;

    const hasDetails = !!(notif.dispatched_driver_name || notif.dispatched_truck_brand || notif.dispatched_truck_plate);

    return (
        <div
            className="mt-3.5 border rounded-2xl py-4 px-[18px] flex flex-col gap-3"
            style={{
                background: "linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(22,163,74,0.06) 100%)",
                borderColor: "rgba(13,148,136,0.25)",
            }}
        >
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(13,148,136,0.12)" }}>
                    <FontAwesomeIcon icon={faTruckPickup} className="text-sm" style={{ color: "#0D9488" }} />
                </div>
                <div>
                    <p className="text-[13px] font-bold m-0" style={{ color: "#0D9488" }}>
                        Tow Truck Service Included
                    </p>
                    <p className="text-[11px] text-gray-500 m-0">
                        {hasDetails
                            ? "The shop has assigned a tow truck for pickup"
                            : "The shop will arrange a tow truck to pick up your vehicle"}
                    </p>
                </div>
                <span
                    className="ml-auto rounded-full py-0.5 px-2.5 text-[10px] font-bold flex-shrink-0"
                    style={{
                        background: hasDetails ? "rgba(13,148,136,0.12)" : "rgba(217,119,6,0.10)",
                        color: hasDetails ? "#0D9488" : "#D97706",
                    }}
                >
                    {hasDetails ? "En Route" : "Arranging"}
                </span>
            </div>

            {hasDetails && (
                <>
                    <div className="h-px" style={{ background: "rgba(13,148,136,0.15)" }} />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                        {notif.dispatched_driver_name  && <DetailRow icon={faUser}        label="Driver"    value={notif.dispatched_driver_name} />}
                        {notif.dispatched_driver_phone && <DetailRow icon={faPhone}       label="Contact"   value={notif.dispatched_driver_phone} isPhone />}
                        {notif.dispatched_truck_brand  && <DetailRow icon={faTruckPickup} label="Truck"     value={`${notif.dispatched_truck_brand}${notif.dispatched_truck_color ? ` · ${notif.dispatched_truck_color}` : ""}`} />}
                        {notif.dispatched_truck_plate  && <DetailRow icon={faIdCard}      label="Plate No." value={notif.dispatched_truck_plate} isMono />}
                    </div>
                    {notif.promised_eta && notif.promised_eta > 0 && (
                        <div className="flex items-center gap-2 rounded-[10px] py-2 px-3" style={{ background: "rgba(13,148,136,0.08)" }}>
                            <FontAwesomeIcon icon={faClock} className="text-xs" style={{ color: "#0D9488" }} />
                            <span className="text-xs font-semibold" style={{ color: "#0D9488" }}>
                                Estimated arrival: <strong>{notif.promised_eta} minutes</strong>
                            </span>
                        </div>
                    )}
                </>
            )}

            {!hasDetails && (
                <div
                    className="border rounded-[10px] py-2.5 px-3.5 flex items-center gap-2"
                    style={{ background: "rgba(217,119,6,0.06)", borderColor: "rgba(217,119,6,0.2)" }}
                >
                    <FontAwesomeIcon icon={faClock} className="text-xs" style={{ color: "#D97706" }} />
                    <p className="text-xs m-0 font-semibold" style={{ color: "#D97706" }}>
                        Tow truck details will appear here once the shop confirms the arrangement.
                    </p>
                </div>
            )}

            {notif.pickup_landmark && (
                <div className="flex items-start gap-2 rounded-[10px] py-2 px-3" style={{ background: "rgba(13,148,136,0.05)" }}>
                    <span className="text-[11px] text-gray-500 font-semibold">📍 Pickup:</span>
                    <span className="text-[11px] text-gray-700">{notif.pickup_landmark}</span>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ icon, label, value, isPhone, isMono }) => (
    <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "rgba(13,148,136,0.1)" }}>
            <FontAwesomeIcon icon={icon} className="text-[10px]" style={{ color: "#0D9488" }} />
        </div>
        <div>
            <p className="text-[10px] text-gray-400 m-0 font-semibold uppercase tracking-[0.04em]">{label}</p>
            {isPhone ? (
                <a href={`tel:${value}`} className="text-xs font-bold no-underline" style={{ color: "#0D9488" }}>{value}</a>
            ) : (
                <p
                    className="text-xs text-gray-700 font-bold m-0"
                    style={{ fontFamily: isMono ? "'Courier New', monospace" : "inherit", letterSpacing: isMono ? "0.08em" : "normal" }}
                >
                    {value}
                </p>
            )}
        </div>
    </div>
);

// ── Shared sync signal ──────────────────────────────────────────────────────
const notifyUnreadChanged = () => {
    window.dispatchEvent(new Event("fixgo_unread_changed"));
};

// ── Exported hook ─────────────────────────────────────────────────────────────
export function useUnreadCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            setCount(0);
            return;
        }

        const fetchAndCount = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                const res = await fetch("http://localhost:8000/api/getNotifications.php", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    const unread = (data.data || []).filter(n => Number(n.isRead) === 0).length;
                    setCount(unread);
                }
            } catch {}
        };

        fetchAndCount();
        const interval = setInterval(fetchAndCount, 15000);
        window.addEventListener("fixgo_unread_changed", fetchAndCount);
        return () => {
            clearInterval(interval);
            window.removeEventListener("fixgo_unread_changed", fetchAndCount);
        };
    }, []);

    return count;
}

// ── Main Notification component ───────────────────────────────────────────────
export default function Notification() {
    const navigate   = useNavigate();

    const [notifications, setNotifications]   = useState([]);
    const [loading, setLoading]               = useState(true);
    const [activeTab, setActiveTab]           = useState("all");
    const [confirming, setConfirming]         = useState(null);
    const [declining, setDeclining]           = useState(null);
    const [localConfirmed, setLocalConfirmed] = useState([]);
    const [localDeclined, setLocalDeclined]   = useState([]);
    const [declineModal, setDeclineModal]     = useState(null);
    const [userId, setUserId]                 = useState(null);
    const [reviewModal, setReviewModal]       = useState(null);
    const [reviewedIds, setReviewedIds]       = useState([]);

    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) return;
        setUserId(id);
    }, []);
    useEffect(() => {
    if (!userId) return;
    const fetchReviewed = async () => {
        try {
            const token = localStorage.getItem("jwt_token");
            const res = await fetch("http://localhost:8000/api/getCustomerReviews.php", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const ids = (data.data || []).map(r => String(r.service_request_id));
                setReviewedIds(ids);
            }
        } catch (err) {
            console.error("Fetch reviewed ids error:", err);
        }
    };
    fetchReviewed();
}, [userId]);

    const fetchNotifs = useCallback(async () => {
        const token = localStorage.getItem("jwt_token");
        try {
            const res = await fetch("http://localhost:8000/api/getNotifications.php", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const filtered = (data.data || []).filter(r => NOTIF_WORTHY.includes(r.status));
                setNotifications(filtered);
                setLocalConfirmed(prev => prev.filter(id => !filtered.find(n => String(n.service_request_id) === id && n.current_status === "Confirmed")));
                setLocalDeclined(prev  => prev.filter(id => !filtered.find(n => String(n.service_request_id) === id && n.current_status === "Cancelled")));
                notifyUnreadChanged();
            }
        } catch (err) {
            console.error("Notification fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000);
        return () => clearInterval(interval);
    }, [userId, fetchNotifs]);

    const unreadCount = notifications.filter(n => Number(n.isRead) === 0).length;

    const markRead = async (notificationId) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: 1 } : n));
        try {
            const token = localStorage.getItem("jwt_token");
            await fetch("http://localhost:8000/api/markNotificationRead.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ notification_id: notificationId }),
            });
        } catch (err) {
            console.error("Mark read error:", err);
        } finally {
            notifyUnreadChanged();
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: 1 })));
        try {
            const token = localStorage.getItem("jwt_token");
            await fetch("http://localhost:8000/api/markNotificationRead.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ mark_all: true }),
            });
        } catch (err) {
            console.error("Mark all read error:", err);
        } finally {
            notifyUnreadChanged();
        }
    };

    const handleConfirm = async (e, notif) => {
        e.stopPropagation();
        const requestId = notif.service_request_id;
        setConfirming(notif.id);
        try {
            const token = localStorage.getItem("jwt_token");
            const res = await fetch("http://localhost:8000/api/updateStatus.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    request_id: requestId,
                    new_status: "Confirmed",
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setLocalConfirmed(prev => [...prev, String(requestId)]);
                await markRead(notif.id);
                await fetchNotifs();
            } else {
                alert(data.message || "Could not confirm booking. Please try again.");
                await fetchNotifs();
            }
        } catch (err) {
            console.error("Confirm error:", err);
            alert("Network error. Please check your connection and try again.");
        } finally {
            setConfirming(null);
        }
    };

    const openDeclineModal = (e, notif) => {
        e.stopPropagation();
        setDeclineModal({
            notifId:   notif.id,
            requestId: notif.service_request_id,
            shopName:  notif.shop_name,
            refId:     formatRefId(notif.service_request_id, notif.created_at),
        });
    };

    const handleDeclineConfirmed = async () => {
        if (!declineModal) return;
        const { requestId, notifId } = declineModal;
        setDeclining(requestId);
        try {
            const token = localStorage.getItem("jwt_token");
            const res = await fetch("http://localhost:8000/api/updateStatus.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    request_id: requestId,
                    new_status: "Cancelled",
                    reason:     "Customer declined the booking.",
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setLocalDeclined(prev => [...prev, String(requestId)]);
                await markRead(notifId);
                setDeclineModal(null);
                await fetchNotifs();
            } else {
                alert(data.message || "Could not decline booking. Please try again.");
                setDeclineModal(null);
                await fetchNotifs();
            }
        } catch (err) {
            console.error("Decline error:", err);
            alert("Network error. Please check your connection and try again.");
        } finally {
            setDeclining(null);
        }
    };

    const filtered = notifications.filter(n => {
        if (activeTab === "all")      return true;
        if (activeTab === "unread")   return Number(n.isRead) === 0;
        if (activeTab === "repair")   return ["Accepted","Confirmed","Diagnosis","In Progress","Pending Parts"].includes(n.status);
        if (activeTab === "complete") return n.status === "Completed";
        if (activeTab === "cancel")   return n.status === "Cancelled" || n.status === "Declined";
        return true;
    });

    const tabCount = (key) => {
        if (key === "all")      return notifications.length;
        if (key === "unread")   return unreadCount;
        if (key === "repair")   return notifications.filter(n => ["Accepted","Confirmed","Diagnosis","In Progress","Pending Parts"].includes(n.status)).length;
        if (key === "complete") return notifications.filter(n => n.status === "Completed").length;
        if (key === "cancel")   return notifications.filter(n => n.status === "Cancelled" || n.status === "Declined").length;
        return 0;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <p className="text-[13px] text-gray-500" style={{ fontFamily: FONT }}>Loading notifications…</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5" style={{ fontFamily: FONT }}>

            {declineModal && (
                <DeclineModal
                    shopName={declineModal.shopName}
                    refId={declineModal.refId}
                    isLoading={declining === declineModal.requestId}
                    onConfirm={handleDeclineConfirmed}
                    onCancel={() => setDeclineModal(null)}
                />
            )}
            {reviewModal && (
                <ReviewModal
                    isOpen={!!reviewModal}
                     onClose={() => setReviewModal(null)}
                    serviceRequestId={reviewModal.requestId}
                    shopId={reviewModal.shopId}
                    shopName={reviewModal.shopName}
                    onSubmitted={(requestId) => setReviewedIds(prev => [...prev, String(requestId)])}
                />
            )}

            {/* ── Header ── */}
            <div
                className="rounded-[18px] p-6 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex justify-between items-center"
                style={{ background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)" }}
            >
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 m-0">Notifications</h1>
                    <p className="text-gray-500 mt-1.5 mb-0 text-sm">
                        Stay updated with the latest repair updates and alerts.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-green-600 text-white rounded-full py-1 px-3.5 text-xs font-bold">
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* ── Tab Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    {TABS.map(tab => {
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-full border py-1.5 px-4 text-[13px] font-semibold cursor-pointer transition-all duration-150
                                    ${active ? "border-green-600 text-green-600" : "border-gray-200 bg-white text-gray-700"}`}
                                style={{ background: active ? "rgba(22,163,74,0.08)" : undefined, fontFamily: FONT }}
                            >
                                {tab.label} ({tabCount(tab.key)})
                            </button>
                        );
                    })}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-[10px] py-2 px-4 text-[13px] font-semibold text-gray-700 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                        style={{ fontFamily: FONT }}
                    >
                        <FontAwesomeIcon icon={faCheck} className="text-[11px] text-green-600" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* ── Notification List ── */}
            <div className="bg-white border border-gray-200 rounded-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                        <FontAwesomeIcon icon={faBell} className="text-4xl text-gray-200" />
                        <p className="text-[13px] text-gray-400 m-0">No notifications in this category.</p>
                    </div>
                ) : (
                    filtered.map((notif, idx) => {
                        const meta         = STATUS_META[notif.status] || STATUS_META["Pending"];
                        const isRead       = Number(notif.isRead) === 1;
                        const isLast       = idx === filtered.length - 1;
                        const isConfirming = confirming === notif.id;
                        const isDeclining  = declining  === notif.service_request_id;

                        const isConfirmed  = localConfirmed.includes(String(notif.service_request_id))
                            || ["Confirmed", "Diagnosis", "In Progress", "Pending Parts", "Completed"].includes(notif.current_status);
                        const isDeclined   = localDeclined.includes(String(notif.service_request_id))
                            || notif.current_status === "Cancelled";
                        const hasTow       = notif.requires_tow == 1;
                        return (
                            <div
                                key={notif.id}
                                onClick={() => !isRead && markRead(notif.id)}
                                className={`flex items-start gap-4 py-5 px-6 cursor-pointer transition-colors duration-150
                                    ${isLast ? "border-b-0" : "border-b border-gray-100"}
                                    ${!isRead ? "hover:bg-[#F0FDF4]" : "hover:bg-gray-50"}`}
                                style={{ background: !isRead ? "#F0FDF4" : "#FFFFFF" }}
                            >
                                {/* Status Icon */}
                                <div
                                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                                    style={{ background: meta.iconBg }}
                                >
                                    <FontAwesomeIcon icon={meta.icon} className="text-lg" style={{ color: meta.iconColor }} />
                                </div>

                                {/* Body */}
                                <div className="flex-1 min-w-0">

                                    {/* Title + Badge */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-bold text-gray-900 m-0">
                                            {notif.title || (
                                                notif.status === "Completed" ? "Repair completed"  :
                                                notif.status === "Accepted"  ? "Request accepted"  :
                                                notif.status === "Confirmed" ? "Booking confirmed" :
                                                notif.status === "Declined"  ? "Request declined"  :
                                                "Repair status updated"
                                            )}
                                        </p>
                                        <span
                                            className="rounded-full py-0.5 px-3 text-[11px] font-bold"
                                            style={{
                                                background: isConfirmed && notif.status === "Accepted" ? STATUS_META["Confirmed"].badgeBg : meta.badgeBg,
                                                color:      isConfirmed && notif.status === "Accepted" ? STATUS_META["Confirmed"].badgeColor : meta.badgeColor,
                                            }}
                                        >
                                            {isConfirmed && notif.status === "Accepted" ? "Confirmed" : meta.label}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    <p className="text-[13px] text-gray-500 mt-1.5 mb-2 leading-relaxed">
                                        {getMessage(notif)}
                                    </p>

                                    {/* Ref pill */}
                                    <span className="inline-block bg-gray-100 text-gray-700 rounded-lg py-1 px-3 text-xs font-semibold">
                                        {notif.vehicle_brand || "Vehicle"} · {formatRefId(notif.service_request_id, notif.created_at)}
                                    </span>

                                    {/* ── ACCEPTED: Action card ── */}
                                    {notif.status === "Accepted" && (
                                        <div
                                            className="mt-3.5 border rounded-2xl py-4 px-[18px] transition-all duration-300"
                                            style={{
                                                background: isConfirmed ? "rgba(22,163,74,0.08)" : isDeclined ? "rgba(220,38,38,0.08)" : "#EDF3FF",
                                                borderColor: isConfirmed ? "#16A34A" : isDeclined ? "#DC2626" : "rgba(37,99,235,0.2)",
                                            }}
                                        >
                                            {isConfirmed && (
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[13px] font-bold m-0 text-green-600">✅ Booking confirmed!</p>
                                                        <p className="text-xs text-gray-500 mt-1 mb-0">Head to the Repair Status tab to track your vehicle's progress.</p>
                                                    </div>
                                                    <span className="flex items-center gap-1.5 bg-white text-green-600 border border-green-600 rounded-[10px] py-2 px-4 text-[13px] font-bold flex-shrink-0">
                                                        <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> Confirmed
                                                    </span>
                                                </div>
                                            )}

                                            {isDeclined && !isConfirmed && (
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-[13px] font-bold m-0 text-red-600">❌ Booking declined</p>
                                                        <p className="text-xs text-gray-500 mt-1 mb-0">You declined this booking. You can still search for another shop.</p>
                                                    </div>
                                                    <span className="flex items-center gap-1.5 bg-white text-red-600 border border-red-600 rounded-[10px] py-2 px-4 text-[13px] font-bold flex-shrink-0">
                                                        <FontAwesomeIcon icon={faXmark} className="text-[11px]" /> Declined
                                                    </span>
                                                </div>
                                            )}

                                            {!isConfirmed && !isDeclined && (
                                                <>
                                                    <div className="mb-3.5">
                                                        <p className="text-[13px] font-bold m-0 text-blue-600">
                                                            Action required — confirm or decline your booking
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 mb-0">
                                                            Confirming locks in your appointment and lets the shop know you're coming.
                                                        </p>
                                                    </div>

                                                    {hasTow && <TowTruckCard notif={notif} />}

                                                    <div className={`flex gap-2.5 flex-wrap ${hasTow ? "mt-3.5" : "mt-0"}`}>
                                                        <button
                                                            onClick={(e) => openDeclineModal(e, notif)}
                                                            disabled={isDeclining || isConfirming}
                                                            className={`flex items-center gap-2 bg-white text-red-600 border-[1.5px] border-red-600 rounded-[10px] py-2.5 px-[18px] text-[13px] font-bold flex-shrink-0 transition-all duration-150 ${isDeclining ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                            style={{ fontFamily: FONT }}
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} className="text-[13px]" /> Decline
                                                        </button>

                                                        <button
                                                            onClick={(e) => handleConfirm(e, notif)}
                                                            disabled={isConfirming || isDeclining}
                                                            className={`flex items-center gap-2 border-none rounded-[10px] py-2.5 px-[18px] text-[13px] font-bold flex-shrink-0 transition-colors duration-150
                                                                ${isConfirming ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white cursor-pointer"}`}
                                                            style={{ fontFamily: FONT }}
                                                        >
                                                            {isConfirming
                                                                ? <><FontAwesomeIcon icon={faSpinner} spin className="text-xs" /> Confirming…</>
                                                                : <><FontAwesomeIcon icon={faHandshake} className="text-[13px]" /> Confirm Booking <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" /></>
                                                            }
                                                        </button>

                                                        {notif.shop_id && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/shop/${notif.shop_id}`); }}
                                                                className="flex items-center gap-1.5 bg-white text-gray-700 border-[1.5px] border-gray-200 rounded-[10px] py-2.5 px-3.5 text-[13px] font-semibold cursor-pointer flex-shrink-0 transition-all duration-150 hover:border-green-600 hover:text-green-600"
                                                                style={{ fontFamily: FONT }}
                                                            >
                                                                <FontAwesomeIcon icon={faStore} className="text-xs" />
                                                                View Shop & Take Direction
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* ── CONFIRMED: Tow card + track hint + View Shop button ── */}
                                    {notif.status === "Confirmed" && (
                                        <>
                                            {hasTow && <TowTruckCard notif={notif} />}
                                            <div className={`flex flex-wrap items-center justify-between gap-2.5 ${hasTow ? "mt-2.5" : "mt-0"}`}>
                                                <p className="text-xs m-0" style={{ color: "#0D9488" }}>
                                                    {hasTow
                                                        ? <>🚛 Your tow truck is on the way! Track progress in the <strong>Repair Status</strong> tab.</>
                                                        : <>🏪 Please bring your vehicle to the shop. Track progress in the <strong>Repair Status</strong> tab.</>
                                                    }
                                                </p>
                                                {!hasTow && notif.shop_id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/shop/${notif.shop_id}`); }}
                                                        className="flex items-center gap-1.5 bg-white text-gray-700 border-[1.5px] border-gray-200 rounded-[10px] py-2 px-3.5 text-[13px] font-semibold cursor-pointer flex-shrink-0 transition-all duration-150 hover:border-green-600 hover:text-green-600"
                                                        style={{ fontFamily: FONT }}
                                                    >
                                                        <FontAwesomeIcon icon={faStore} className="text-xs" />
                                                        View Shop & Take Directions
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* ── DECLINED: Simple heads-up, encourage trying another shop ── */}
                                    {notif.status === "Declined" && (
                                        <div
                                            className="mt-3 flex items-center justify-between rounded-xl py-3 px-4 gap-3"
                                            style={{ background: "rgba(220,38,38,0.08)", border: "1px solid #DC262633" }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900 m-0">This shop couldn't take your request</p>
                                                    <p className="text-xs text-gray-500 m-0">Browse other nearby shops to get your vehicle sorted.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate("/shops"); }}
                                                className="flex items-center gap-1.5 bg-white text-gray-700 border-[1.5px] border-gray-200 rounded-[10px] py-2 px-3.5 text-[13px] font-semibold cursor-pointer flex-shrink-0"
                                                style={{ fontFamily: FONT }}
                                            >
                                                Find Another Shop
                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                                            </button>
                                        </div>
                                    )}

                                    {/* ── COMPLETED: Review prompt ── */}
                                    {notif.status === "Completed" && (
    <div
        className="mt-3 flex items-center justify-between border border-gray-200 rounded-xl py-3 px-4"
        style={{ background: "rgba(22,163,74,0.08)" }}
    >
        <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faStar} className="text-green-600" />
            <div>
                <p className="text-[13px] font-bold text-gray-900 m-0">We'd love to hear about your experience!</p>
                <p className="text-xs text-gray-500 m-0">Your feedback helps others find great workshops.</p>
            </div>
        </div>

        {reviewedIds.includes(String(notif.service_request_id)) ? (
            <span className="flex items-center gap-1.5 text-green-600 text-[13px] font-bold flex-shrink-0 ml-3">
                <FontAwesomeIcon icon={faCheck} /> Reviewed
            </span>
        ) : (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setReviewModal({
                        requestId: notif.service_request_id,
                        shopId: notif.shop_id,
                        shopName: notif.shop_name,
                    });
                }}
                className="flex items-center gap-1.5 bg-green-600 text-white border-none rounded-[10px] py-2 px-3.5 text-[13px] font-bold cursor-pointer flex-shrink-0 ml-3"
                style={{ fontFamily: FONT }}
            >
                <FontAwesomeIcon icon={faStar} className="text-[11px]" />
                Review & Rate
                <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
            </button>
        )}
    </div>
)}
                                </div>

                                {/* Timestamp + dot */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="text-[11px] text-gray-400 whitespace-nowrap">{formatTime(notif.created_at)}</span>
                                    <span
                                        className="w-2.5 h-2.5 rounded-full inline-block"
                                        style={{ background: !isRead ? "#16A34A" : "#E5E7EB" }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}