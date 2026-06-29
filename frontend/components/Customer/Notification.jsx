import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faCircleCheck, faStar,
    faArrowRight, faWrench, faBoxesStacked, faHandshake,
    faClock, faCircleXmark, faStethoscope, faSpinner,
    faTruckPickup, faUser, faPhone, faCar, faIdCard,
    faStore, faXmark, faExternalLinkAlt, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const T = {
    green:      "#16A34A",
    greenLight: "#F0FDF4",
    greenBg:    "#EDF9F0",
    greenMuted: "rgba(22,163,74,0.08)",
    teal:       "#0D9488",
    blue:       "#2563EB",
    blueBg:     "#EDF3FF",
    amber:      "#D97706",
    red:        "#DC2626",
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
    { key: "cancel",   label: "Cancelled"      },
];

const storageKey = (id) => `fixgo_read_notifs_${String(id)}`;

const getReadIds = (id) => {
    try {
        return JSON.parse(localStorage.getItem(storageKey(id)) || "[]").map(String);
    } catch { return []; }
};

const saveReadIds = (id, ids) => {
    const deduped = [...new Set(ids.map(String))];
    localStorage.setItem(storageKey(id), JSON.stringify(deduped));
    window.dispatchEvent(new CustomEvent("fixgo_read_changed", { detail: { customerId: String(id) } }));
};

const getMessage = (req) => {
    const shop = req.shop_name || "the shop";
    switch (req.status) {
        case "Accepted":       return `${shop} accepted your request. Please confirm or decline below.`;
       
        case "Confirmed":      return req.requires_tow == 1
    ? `Your booking with ${shop} is confirmed! We're on our way to pick up your vehicle. Sit tight!`
    : `Your booking with ${shop} is confirmed! Please take your vehicle to the shop at your scheduled time.`;
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

const formatRefId = (id, createdAt) => {
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `REQ-${year}-${String(id).padStart(5, "0")}`;
};

// ── Decline Confirm Modal ─────────────────────────────────────────────────────
const DeclineModal = ({ shopName, refId, onConfirm, onCancel, isLoading }) => (
    <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.15s ease",
    }}>
        <div style={{
            background: T.white,
            borderRadius: 20,
            padding: "32px 28px",
            maxWidth: 420, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            animation: "slideUp 0.2s ease",
        }}>
            {/* Icon */}
            <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: T.redBg,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: 24, color: T.red }} />
            </div>

            {/* Text */}
            <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: T.slate900, margin: "0 0 8px" }}>
                    Decline this booking?
                </p>
                <p style={{ fontSize: 13, color: T.slate500, margin: 0, lineHeight: 1.6 }}>
                    You're about to decline the booking from{" "}
                    <strong style={{ color: T.slate700 }}>{shopName || "this shop"}</strong>
                    {refId && <> ({refId})</>}.
                    <br />This action cannot be undone.
                </p>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: T.slate200 }} />

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    style={{
                        flex: 1, padding: "11px 0",
                        borderRadius: 12, border: `1.5px solid ${T.slate200}`,
                        background: T.white, color: T.slate700,
                        fontSize: 14, fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: T.font, transition: "all 0.15s",
                    }}
                >
                    Keep Booking
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    style={{
                        flex: 1, padding: "11px 0",
                        borderRadius: 12, border: "none",
                        background: isLoading ? T.slate200 : T.red,
                        color: isLoading ? T.slate400 : T.white,
                        fontSize: 14, fontWeight: 700,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: T.font, transition: "all 0.15s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
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
        <div style={{
            marginTop: 14,
            background: "linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(22,163,74,0.06) 100%)",
            border: "1px solid rgba(13,148,136,0.25)",
            borderRadius: 14, padding: "16px 18px",
            display: "flex", flexDirection: "column", gap: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(13,148,136,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <FontAwesomeIcon icon={faTruckPickup} style={{ fontSize: 14, color: T.teal }} />
                </div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.teal, margin: 0 }}>
                        Tow Truck Service Included
                    </p>
                    <p style={{ fontSize: 11, color: T.slate500, margin: 0 }}>
                        {hasDetails
                            ? "The shop has assigned a tow truck for pickup"
                            : "The shop will arrange a tow truck to pick up your vehicle"}
                    </p>
                </div>
                <span style={{
                    marginLeft: "auto",
                    background: hasDetails ? "rgba(13,148,136,0.12)" : "rgba(217,119,6,0.10)",
                    color: hasDetails ? T.teal : T.amber,
                    borderRadius: 99, padding: "3px 10px", fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>
                    {hasDetails ? "En Route" : "Arranging"}
                </span>
            </div>

            {/* Dispatch details — show only if available */}
            {hasDetails && (
                <>
                    <div style={{ height: 1, background: "rgba(13,148,136,0.15)" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
                        {notif.dispatched_driver_name  && <DetailRow icon={faUser}        label="Driver"    value={notif.dispatched_driver_name} />}
                        {notif.dispatched_driver_phone && <DetailRow icon={faPhone}       label="Contact"   value={notif.dispatched_driver_phone} isPhone />}
                        {notif.dispatched_truck_brand  && <DetailRow icon={faTruckPickup} label="Truck"     value={`${notif.dispatched_truck_brand}${notif.dispatched_truck_color ? ` · ${notif.dispatched_truck_color}` : ""}`} />}
                        {notif.dispatched_truck_plate  && <DetailRow icon={faIdCard}      label="Plate No." value={notif.dispatched_truck_plate} isMono />}
                    </div>
                    {notif.promised_eta && notif.promised_eta > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(13,148,136,0.08)", borderRadius: 10, padding: "8px 12px" }}>
                            <FontAwesomeIcon icon={faClock} style={{ fontSize: 12, color: T.teal }} />
                            <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>
                                Estimated arrival: <strong>{notif.promised_eta} minutes</strong>
                            </span>
                        </div>
                    )}
                </>
            )}

            {/* No details yet — friendly message */}
            {!hasDetails && (
                <div style={{
                    background: "rgba(217,119,6,0.06)",
                    border: "1px solid rgba(217,119,6,0.2)",
                    borderRadius: 10, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 12, color: T.amber }} />
                    <p style={{ fontSize: 12, color: T.amber, margin: 0, fontWeight: 600 }}>
                        Tow truck details will appear here once the shop confirms the arrangement.
                    </p>
                </div>
            )}

            {notif.pickup_landmark && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(13,148,136,0.05)", borderRadius: 10, padding: "8px 12px" }}>
                    <span style={{ fontSize: 11, color: T.slate500, fontWeight: 600 }}>📍 Pickup:</span>
                    <span style={{ fontSize: 11, color: T.slate700 }}>{notif.pickup_landmark}</span>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ icon, label, value, isPhone, isMono }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{
            width: 24, height: 24, borderRadius: 6, background: "rgba(13,148,136,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
        }}>
            <FontAwesomeIcon icon={icon} style={{ fontSize: 10, color: T.teal }} />
        </div>
        <div>
            <p style={{ fontSize: 10, color: T.slate400, margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
            {isPhone ? (
                <a href={`tel:${value}`} style={{ fontSize: 12, color: T.teal, fontWeight: 700, textDecoration: "none" }}>{value}</a>
            ) : (
                <p style={{ fontSize: 12, color: T.slate700, fontWeight: 700, margin: 0, fontFamily: isMono ? "'Courier New', monospace" : "inherit", letterSpacing: isMono ? "0.08em" : "normal" }}>{value}</p>
            )}
        </div>
    </div>
);

// ── Exported hook ─────────────────────────────────────────────────────────────
export function useUnreadCount(customerId) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!customerId) { setCount(0); return; }
        const id = String(customerId);
        const computeCount = (notifs) => {
            const readIds = getReadIds(id);
            return notifs.filter(n => !readIds.includes(String(n.id))).length;
        };
        let cachedNotifs = [];

        const fetchAndCount = async () => {
            try {
                const res  = await fetch(`http://localhost:8000/api/getCustomerRequest.php?customer_id=${id}`);
                const data = await res.json();
                if (data.success) {
                    cachedNotifs = (data.data || []).filter(r => NOTIF_WORTHY.includes(r.status));
                    setCount(computeCount(cachedNotifs));
                }
            } catch {}
        };

        const onReadChanged = (e) => {
            if (String(e.detail?.customerId) !== id) return;
            setCount(computeCount(cachedNotifs));
        };

        window.addEventListener("fixgo_read_changed", onReadChanged);
        fetchAndCount();
        const interval = setInterval(fetchAndCount, 30000);
        return () => { clearInterval(interval); window.removeEventListener("fixgo_read_changed", onReadChanged); };
    }, [customerId]);

    return count;
}

// ── Main Notification component ───────────────────────────────────────────────
export default function Notification({ customerId: rawId }) {
    const customerId = String(rawId || "");
    const navigate   = useNavigate();

    const [notifications, setNotifications]   = useState([]);
    const [loading, setLoading]               = useState(true);
    const [activeTab, setActiveTab]           = useState("all");
    const [confirming, setConfirming]         = useState(null);
    const [declining, setDeclining]           = useState(null);
    const [localConfirmed, setLocalConfirmed] = useState([]);
    const [localDeclined, setLocalDeclined]   = useState([]);
    const [readIds, setReadIds]               = useState([]);
    const [readIdsLoaded, setReadIdsLoaded]   = useState(false);
    const [declineModal, setDeclineModal]     = useState(null); // { requestId, shopName, refId }

    useEffect(() => {
        if (!customerId) return;
        setReadIds(getReadIds(customerId));
        setReadIdsLoaded(true);
    }, [customerId]);

    const fetchNotifs = useCallback(async () => {
        if (!customerId) return;
        try {
            const res  = await fetch(`http://localhost:8000/api/getCustomerRequest.php?customer_id=${customerId}`);
            const data = await res.json();
            if (data.success) {
                const filtered = (data.data || []).filter(r => NOTIF_WORTHY.includes(r.status));
                setNotifications(filtered);
                setLocalConfirmed(prev => prev.filter(id => !filtered.find(n => String(n.id) === id && n.status === "Confirmed")));
                setLocalDeclined(prev  => prev.filter(id => !filtered.find(n => String(n.id) === id && n.status === "Cancelled")));
            }
        } catch (err) {
            console.error("Notification fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        if (!customerId) return;
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifs]);

    const unreadCount = notifications.filter(n => !readIds.includes(String(n.id))).length;

    const persistReadIds = (updated) => {
        const deduped = [...new Set(updated.map(String))];
        setReadIds(deduped);
        saveReadIds(customerId, deduped);
    };

    const markRead    = (id) => persistReadIds([...readIds, String(id)]);
    const markAllRead = ()   => persistReadIds([...readIds, ...notifications.map(n => String(n.id))]);

    // ── Confirm booking ───────────────────────────────────────────────────────
    const handleConfirm = async (e, requestId) => {
        e.stopPropagation();
        setConfirming(requestId);
        try {
            const res = await fetch("http://localhost:8000/api/updateStatus.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request_id: requestId, new_status: "Confirmed", actor_id: customerId, actor_role: "customer" }),
            });
            const data = await res.json();
            if (res.ok) {
                setLocalConfirmed(prev => [...prev, String(requestId)]);
                markRead(requestId);
                await fetchNotifs();
            } else {
                alert(data.message || "Could not confirm booking. Please try again.");
            }
        } catch (err) {
            console.error("Confirm error:", err);
            alert("Network error. Please check your connection and try again.");
        } finally {
            setConfirming(null);
        }
    };

    // ── Decline booking (opens modal) ─────────────────────────────────────────
    const openDeclineModal = (e, notif) => {
        e.stopPropagation();
        setDeclineModal({
            requestId: notif.id,
            shopName:  notif.shop_name,
            refId:     formatRefId(notif.id, notif.created_at),
        });
    };

    const handleDeclineConfirmed = async () => {
        if (!declineModal) return;
        const requestId = declineModal.requestId;
        setDeclining(requestId);
        try {
            const res = await fetch("http://localhost:8000/api/updateStatus.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    request_id: requestId,
                    new_status: "Cancelled",
                    actor_id:   customerId,
                    actor_role: "customer",
                    reason:     "Customer declined the booking.",
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setLocalDeclined(prev => [...prev, String(requestId)]);
                markRead(requestId);
                setDeclineModal(null);
                await fetchNotifs();
            } else {
                alert(data.message || "Could not decline booking. Please try again.");
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
        if (activeTab === "unread")   return !readIds.includes(String(n.id));
        if (activeTab === "repair")   return ["Accepted","Confirmed","Diagnosis","In Progress","Pending Parts"].includes(n.status);
        if (activeTab === "complete") return n.status === "Completed";
        if (activeTab === "cancel")   return n.status === "Cancelled";
        return true;
    });

    const tabCount = (key) => {
        if (key === "all")      return notifications.length;
        if (key === "unread")   return unreadCount;
        if (key === "repair")   return notifications.filter(n => ["Accepted","Confirmed","Diagnosis","In Progress","Pending Parts"].includes(n.status)).length;
        if (key === "complete") return notifications.filter(n => n.status === "Completed").length;
        if (key === "cancel")   return notifications.filter(n => n.status === "Cancelled").length;
        return 0;
    };

    if (loading || !readIdsLoaded) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading notifications…</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: T.font }}>

            {/* ── Decline Modal ── */}
            {declineModal && (
                <DeclineModal
                    shopName={declineModal.shopName}
                    refId={declineModal.refId}
                    isLoading={declining === declineModal.requestId}
                    onConfirm={handleDeclineConfirmed}
                    onCancel={() => setDeclineModal(null)}
                />
            )}

            {/* ── Header ── */}
            <div style={{
                background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
                borderRadius: 18, padding: "24px",
                border: `1px solid ${T.slate200}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Notifications</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Stay updated with the latest repair updates and alerts.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span style={{ background: T.green, color: T.white, borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {/* ── Tab Bar ── */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.key;
                        return (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                borderRadius: 99,
                                border: `1px solid ${active ? T.green : T.slate200}`,
                                background: active ? T.greenMuted : T.white,
                                color: active ? T.green : T.slate700,
                                padding: "6px 16px", fontSize: 13, fontWeight: 600,
                                fontFamily: T.font, cursor: "pointer", transition: "all 0.15s",
                            }}>
                                {tab.label} ({tabCount(tab.key)})
                            </button>
                        );
                    })}
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        border: `1px solid ${T.slate200}`, background: T.white,
                        borderRadius: 10, padding: "8px 16px",
                        fontSize: 13, fontWeight: 600, color: T.slate700,
                        cursor: "pointer", fontFamily: T.font,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11, color: T.green }} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* ── Notification List ── */}
            <div style={{ ...T.card, overflow: "hidden" }}>
                {filtered.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "64px 24px", textAlign: "center" }}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 36, color: T.slate200 }} />
                        <p style={{ fontSize: 13, color: T.slate400, margin: 0 }}>No notifications in this category.</p>
                    </div>
                ) : (
                    filtered.map((notif, idx) => {
                        const meta         = STATUS_META[notif.status] || STATUS_META["Pending"];
                        const isRead       = readIds.includes(String(notif.id));
                        const isLast       = idx === filtered.length - 1;
                        const isConfirming = confirming === notif.id;
                        const isDeclining  = declining  === notif.id;
                        const isConfirmed  = localConfirmed.includes(String(notif.id)) || notif.status === "Confirmed";
                        const isDeclined   = localDeclined.includes(String(notif.id));
                        const hasTow       = notif.requires_tow == 1;
                        return (
                            <div
                                key={notif.id}
                                onClick={() => markRead(notif.id)}
                                style={{
                                    display: "flex", alignItems: "flex-start", gap: 16,
                                    padding: "20px 24px",
                                    borderBottom: isLast ? "none" : `1px solid ${T.slate100}`,
                                    background: !isRead ? "#F0FDF4" : T.white,
                                    cursor: "pointer", transition: "background 0.15s",
                                }}
                                onMouseEnter={e => { if (isRead) e.currentTarget.style.background = T.slate50; }}
                                onMouseLeave={e => { e.currentTarget.style.background = !isRead ? "#F0FDF4" : T.white; }}
                            >
                                {/* Status Icon */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: meta.iconBg, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 18, color: meta.iconColor }} />
                                </div>

                                {/* Body */}
                                <div style={{ flex: 1, minWidth: 0 }}>

                                    {/* Title + Badge */}
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                            {notif.status === "Completed" ? "Repair completed"  :
                                             notif.status === "Accepted"  ? "Request accepted"  :
                                             notif.status === "Confirmed" ? "Booking confirmed" :
                                             "Repair status updated"}
                                        </p>
                                        <span style={{
                                            background: isConfirmed && notif.status === "Accepted" ? STATUS_META["Confirmed"].badgeBg : meta.badgeBg,
                                            color:      isConfirmed && notif.status === "Accepted" ? STATUS_META["Confirmed"].badgeColor : meta.badgeColor,
                                            borderRadius: 99, padding: "3px 12px", fontSize: 11, fontWeight: 700,
                                        }}>
                                            {isConfirmed && notif.status === "Accepted" ? "Confirmed" : meta.label}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    <p style={{ fontSize: 13, color: T.slate500, margin: "6px 0 8px", lineHeight: 1.5 }}>
                                        {getMessage(notif)}
                                    </p>

                                    {/* Ref pill */}
                                    <span style={{
                                        display: "inline-block", background: T.slate100, color: T.slate700,
                                        borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                                    }}>
                                        {notif.vehicle_brand || "Vehicle"} · {formatRefId(notif.id, notif.created_at)}
                                    </span>

                                    {/* ── ACCEPTED: Action card ── */}
                                    {notif.status === "Accepted" && (
                                        <div style={{
                                            marginTop: 14,
                                            background: isConfirmed ? T.greenMuted : isDeclined ? T.redMuted : T.blueBg,
                                            border: `1px solid ${isConfirmed ? T.green : isDeclined ? T.red : "rgba(37,99,235,0.2)"}`,
                                            borderRadius: 14, padding: "16px 18px", transition: "all 0.3s",
                                        }}>
                                            {/* Confirmed state */}
                                            {isConfirmed && (
                                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                                    <div>
                                                        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: T.green }}>✅ Booking confirmed!</p>
                                                        <p style={{ fontSize: 12, color: T.slate500, margin: "4px 0 0" }}>Head to the Repair Status tab to track your vehicle's progress.</p>
                                                    </div>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 6, background: T.white, color: T.green, border: `1px solid ${T.green}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                                                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11 }} /> Confirmed
                                                    </span>
                                                </div>
                                            )}

                                            {/* Declined state */}
                                            {isDeclined && !isConfirmed && (
                                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                                    <div>
                                                        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: T.red }}>❌ Booking declined</p>
                                                        <p style={{ fontSize: 12, color: T.slate500, margin: "4px 0 0" }}>You declined this booking. You can still search for another shop.</p>
                                                    </div>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 6, background: T.white, color: T.red, border: `1px solid ${T.red}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: 11 }} /> Declined
                                                    </span>
                                                </div>
                                            )}

                                            {/* Awaiting action */}
                                            {!isConfirmed && !isDeclined && (
                                                <>
                                                    <div style={{ marginBottom: 14 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: T.blue }}>
                                                            Action required — confirm or decline your booking
                                                        </p>
                                                        <p style={{ fontSize: 12, color: T.slate500, margin: "4px 0 0" }}>
                                                            Confirming locks in your appointment and lets the shop know you're coming.
                                                        </p>
                                                    </div>

                                                    {hasTow && <TowTruckCard notif={notif} />}

                                                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: hasTow ? 14 : 0 }}>
                                                        {/* Decline */}
                                                        <button
                                                            onClick={(e) => openDeclineModal(e, notif)}
                                                            disabled={isDeclining || isConfirming}
                                                            style={{
                                                                display: "flex", alignItems: "center", gap: 8,
                                                                background: T.white, color: T.red,
                                                                border: `1.5px solid ${T.red}`,
                                                                borderRadius: 10, padding: "10px 18px",
                                                                fontSize: 13, fontWeight: 700,
                                                                cursor: isDeclining ? "not-allowed" : "pointer",
                                                                fontFamily: T.font, flexShrink: 0, transition: "all 0.15s",
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} style={{ fontSize: 13 }} /> Decline
                                                        </button>

                                                        {/* Confirm */}
                                                        <button
                                                            onClick={(e) => handleConfirm(e, notif.id)}
                                                            disabled={isConfirming || isDeclining}
                                                            style={{
                                                                display: "flex", alignItems: "center", gap: 8,
                                                                background: isConfirming ? T.slate200 : T.blue,
                                                                color: isConfirming ? T.slate500 : T.white,
                                                                border: "none", borderRadius: 10, padding: "10px 18px",
                                                                fontSize: 13, fontWeight: 700,
                                                                cursor: isConfirming ? "not-allowed" : "pointer",
                                                                fontFamily: T.font, flexShrink: 0, transition: "background 0.15s",
                                                            }}
                                                        >
                                                            {isConfirming
                                                                ? <><FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: 12 }} /> Confirming…</>
                                                                : <><FontAwesomeIcon icon={faHandshake} style={{ fontSize: 13 }} /> Confirm Booking <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} /></>
                                                            }
                                                        </button>

                                                        {/* View Shop */}
                                                        {notif.shop_id && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/shop/${notif.shop_id}`); }}
                                                                style={{
                                                                    display: "flex", alignItems: "center", gap: 6,
                                                                    background: T.white, color: T.slate700,
                                                                    border: `1.5px solid ${T.slate200}`,
                                                                    borderRadius: 10, padding: "10px 14px",
                                                                    fontSize: 13, fontWeight: 600,
                                                                    cursor: "pointer", fontFamily: T.font, flexShrink: 0, transition: "all 0.15s",
                                                                }}
                                                                onMouseEnter={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.color = T.green; }}
                                                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.slate200; e.currentTarget.style.color = T.slate700; }}
                                                            >
                                                                <FontAwesomeIcon icon={faStore} style={{ fontSize: 12 }} />
                                                                View Shop & Take Direction
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 10 }} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* ── CONFIRMED: Track hint ── */}
                                    {notif.status === "Confirmed" && (
                                       <p style={{ fontSize: 12, color: T.teal, margin: 0 }}>
                                        {notif.requires_tow == 1
                                            ? <>🚛 Your tow truck is on the way! Track your vehicle's progress in the <strong>Repair Status</strong> tab.</>
                                            : <>🏪 Please bring your vehicle to the shop. Track progress in the <strong>Repair Status</strong> tab.</>
                                        }
                                        </p>
                                    )}

                                    {/* ── COMPLETED: Review prompt ── */}
                                    {notif.status === "Completed" && (
                                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", background: T.greenMuted, border: `1px solid ${T.slate200}`, borderRadius: 12, padding: "12px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <FontAwesomeIcon icon={faStar} style={{ color: T.green }} />
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>We'd love to hear about your experience!</p>
                                                    <p style={{ fontSize: 12, color: T.slate500, margin: 0 }}>Your feedback helps others find great workshops.</p>
                                                </div>
                                            </div>
                                            <button style={{ display: "flex", alignItems: "center", gap: 6, background: T.green, color: T.white, border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: T.font, flexShrink: 0, marginLeft: 12 }}>
                                                <FontAwesomeIcon icon={faStar} style={{ fontSize: 11 }} />
                                                Review & Rate
                                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Timestamp + dot */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, color: T.slate400, whiteSpace: "nowrap" }}>{formatTime(notif.created_at)}</span>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: !isRead ? T.green : T.slate200, display: "inline-block" }} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}