import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell, faCheck, faCircleCheck, faStar,
    faArrowRight, faWrench, faBoxesStacked, faHandshake,
    faClock, faCircleXmark, faStethoscope, faSpinner,
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

// ── Shared storage helpers ────────────────────────────────────────────────────
const storageKey = (id) => `fixgo_read_notifs_${String(id)}`;

const getReadIds = (id) => {
    try {
        return JSON.parse(localStorage.getItem(storageKey(id)) || "[]").map(String);
    } catch {
        return [];
    }
};

const saveReadIds = (id, ids) => {
    const deduped = [...new Set(ids.map(String))];
    localStorage.setItem(storageKey(id), JSON.stringify(deduped));
    window.dispatchEvent(new CustomEvent("fixgo_read_changed", { detail: { customerId: String(id) } }));
};
// ─────────────────────────────────────────────────────────────────────────────

const getMessage = (req) => {
    const shop = req.shop_name || "the shop";
    switch (req.status) {
        case "Accepted":       return `${shop} accepted your request. Please confirm below to lock in your booking.`;
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

const formatRefId = (id, createdAt) => {
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `REQ-${year}-${String(id).padStart(5, "0")}`;
};

// ── Exported hook ─────────────────────────────────────────────────────────────
export function useUnreadCount(customerId) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!customerId) { setCount(0); return; }
        const id = String(customerId);

        // Always reads localStorage fresh — no cached state that can go stale
        const computeCount = (notifs) => {
            const readIds = getReadIds(id);
            const unread  = notifs.filter(n => !readIds.includes(String(n.id))).length;
            console.log(`[useUnreadCount] id=${id} readIds=${JSON.stringify(readIds)} unread=${unread}`);
            return unread;
        };

        // Plain closure variable — avoids stale state in event handler
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

        // Re-compute instantly when Notification component marks items read
        const onReadChanged = (e) => {
            if (String(e.detail?.customerId) !== id) return;
            setCount(computeCount(cachedNotifs));
        };

        window.addEventListener("fixgo_read_changed", onReadChanged);
        fetchAndCount();
        const interval = setInterval(fetchAndCount, 30000);

        return () => {
            clearInterval(interval);
            window.removeEventListener("fixgo_read_changed", onReadChanged);
        };
    }, [customerId]);

    return count;
}

// ── Main Notification component ───────────────────────────────────────────────
export default function Notification({ customerId: rawId }) {
    const customerId = String(rawId || "");

    const [notifications, setNotifications]   = useState([]);
    const [loading, setLoading]               = useState(true);
    const [activeTab, setActiveTab]           = useState("all");
    const [confirming, setConfirming]         = useState(null);
    const [localConfirmed, setLocalConfirmed] = useState([]);
    const [readIds, setReadIds]               = useState([]);
    const [readIdsLoaded, setReadIdsLoaded]   = useState(false);

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
                setLocalConfirmed(prev =>
                    prev.filter(id => !filtered.find(n => String(n.id) === id && n.status === "Confirmed"))
                );
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

    const handleConfirm = async (e, requestId) => {
        e.stopPropagation();
        setConfirming(requestId);
        try {
            const res = await fetch("http://localhost:8000/api/updateStatus.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    request_id: requestId,
                    new_status: "Confirmed",
                    actor_id:   customerId,
                    actor_role: "customer",
                }),
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
                    <span style={{
                        background: T.green, color: T.white,
                        borderRadius: 99, padding: "4px 14px",
                        fontSize: 12, fontWeight: 700,
                    }}>
                        {unreadCount} unread
                    </span>
                )}
            </div>

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

            <div style={{ ...T.card, overflow: "hidden" }}>
                {filtered.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 12, padding: "64px 24px", textAlign: "center",
                    }}>
                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 36, color: T.slate200 }} />
                        <p style={{ fontSize: 13, color: T.slate400, margin: 0 }}>No notifications in this category.</p>
                    </div>
                ) : (
                    filtered.map((notif, idx) => {
                        const meta         = STATUS_META[notif.status] || STATUS_META["Pending"];
                        const isRead       = readIds.includes(String(notif.id));
                        const isLast       = idx === filtered.length - 1;
                        const isConfirming = confirming === notif.id;
                        const isConfirmed  = localConfirmed.includes(String(notif.id)) || notif.status === "Confirmed";

                        return (
                            <div key={notif.id} onClick={() => markRead(notif.id)} style={{
                                display: "flex", alignItems: "flex-start", gap: 16,
                                padding: "20px 24px",
                                borderBottom: isLast ? "none" : `1px solid ${T.slate100}`,
                                background: !isRead ? "#F0FDF4" : T.white,
                                cursor: "pointer", transition: "background 0.15s",
                            }}
                                onMouseEnter={e => { if (isRead) e.currentTarget.style.background = T.slate50; }}
                                onMouseLeave={e => { e.currentTarget.style.background = !isRead ? "#F0FDF4" : T.white; }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: meta.iconBg, flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 18, color: meta.iconColor }} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
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

                                    <p style={{ fontSize: 13, color: T.slate500, margin: "6px 0 8px", lineHeight: 1.5 }}>
                                        {getMessage(notif)}
                                    </p>

                                    <span style={{
                                        display: "inline-block", background: T.slate100, color: T.slate700,
                                        borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                                    }}>
                                        {notif.vehicle_brand || "Vehicle"} · {formatRefId(notif.id, notif.created_at)}
                                    </span>

                                    {notif.status === "Accepted" && (
                                        <div style={{
                                            marginTop: 14,
                                            background: isConfirmed ? T.greenMuted : T.blueBg,
                                            border: `1px solid ${isConfirmed ? T.green : "rgba(37,99,235,0.2)"}`,
                                            borderRadius: 14, padding: "16px 18px",
                                            display: "flex", flexWrap: "wrap",
                                            alignItems: "center", justifyContent: "space-between", gap: 12,
                                            transition: "all 0.3s",
                                        }}>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: isConfirmed ? T.green : T.blue }}>
                                                    {isConfirmed ? "✅ Booking confirmed!" : "Action required — confirm your booking"}
                                                </p>
                                                <p style={{ fontSize: 12, color: T.slate500, margin: "4px 0 0" }}>
                                                    {isConfirmed
                                                        ? "Head to the Repair Status tab to track your vehicle's progress."
                                                        : "Confirming locks in your appointment and lets the shop know you're coming."}
                                                </p>
                                            </div>
                                            {isConfirmed ? (
                                                <span style={{
                                                    display: "flex", alignItems: "center", gap: 6,
                                                    background: T.white, color: T.green, border: `1px solid ${T.green}`,
                                                    borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, flexShrink: 0,
                                                }}>
                                                    <FontAwesomeIcon icon={faCheck} style={{ fontSize: 11 }} /> Confirmed
                                                </span>
                                            ) : (
                                                <button onClick={(e) => handleConfirm(e, notif.id)} disabled={isConfirming} style={{
                                                    display: "flex", alignItems: "center", gap: 8,
                                                    background: isConfirming ? T.slate200 : T.blue,
                                                    color: isConfirming ? T.slate500 : T.white,
                                                    border: "none", borderRadius: 10, padding: "10px 18px",
                                                    fontSize: 13, fontWeight: 700,
                                                    cursor: isConfirming ? "not-allowed" : "pointer",
                                                    fontFamily: T.font, flexShrink: 0, transition: "background 0.15s",
                                                }}>
                                                    {isConfirming
                                                        ? <><FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: 12 }} /> Confirming…</>
                                                        : <><FontAwesomeIcon icon={faHandshake} style={{ fontSize: 13 }} /> Confirm Booking <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} /></>
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {notif.status === "Confirmed" && (
                                        <div style={{
                                            marginTop: 12, background: "rgba(13,148,136,0.07)",
                                            border: "1px solid rgba(13,148,136,0.2)", borderRadius: 10, padding: "10px 14px",
                                        }}>
                                            <p style={{ fontSize: 12, color: T.teal, margin: 0 }}>
                                                ✅ Head to the <strong>Repair Status</strong> tab to track your vehicle's progress in real-time.
                                            </p>
                                        </div>
                                    )}

                                    {notif.status === "Completed" && (
                                        <div style={{
                                            marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
                                            background: T.greenMuted, border: `1px solid ${T.slate200}`,
                                            borderRadius: 12, padding: "12px 16px",
                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <FontAwesomeIcon icon={faStar} style={{ color: T.green }} />
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>We'd love to hear about your experience!</p>
                                                    <p style={{ fontSize: 12, color: T.slate500, margin: 0 }}>Your feedback helps others find great workshops.</p>
                                                </div>
                                            </div>
                                            <button style={{
                                                display: "flex", alignItems: "center", gap: 6,
                                                background: T.green, color: T.white, border: "none",
                                                borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700,
                                                cursor: "pointer", fontFamily: T.font, flexShrink: 0, marginLeft: 12,
                                            }}>
                                                <FontAwesomeIcon icon={faStar} style={{ fontSize: 11 }} />
                                                Review & Rate
                                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                                            </button>
                                        </div>
                                    )}
                                </div>

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