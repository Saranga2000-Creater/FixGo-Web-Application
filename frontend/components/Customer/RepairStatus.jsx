import { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHandshake, faWrench, faFlag, faShieldHalved,
    faCar, faChevronDown, faChevronUp, faCalendarDays,
    faClock, faCircleCheck, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const T = {
    green:     "#16A34A",
    greenLight:"#F0FDF4",
    greenBg:   "#EDF9F0",
    greenMuted:"rgba(22,163,74,0.08)",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.10)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    amber:     "#D97706",
    amberBg:   "rgba(217,119,6,0.10)",
    red:       "#DC2626",
    redBg:     "#FEF2F2",
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
        background:   "#FFFFFF",
        border:       "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow:    "0 1px 4px rgba(0,0,0,0.06)",
    },
};

const STATUS_CONFIG = {
    Pending:       { label: "Pending",     color: T.amber,    bg: T.amberBg,               icon: faClock,        desc: "Your request has been sent. Waiting for the shop to accept." },
    Accepted:      { label: "Accepted",    color: T.blue,     bg: T.blueBg,                icon: faCircleCheck,  desc: "The shop accepted your request! Go to Notifications to confirm your booking." },
    Confirmed:     { label: "Confirmed",   color: T.teal,     bg: T.tealBg,                icon: faHandshake,    desc: "" },
    "In Progress": { label: "In Progress", color: "#A855F7",  bg: "rgba(168,85,247,0.10)", icon: faWrench,       desc: "Your vehicle is currently being repaired." },
};

const STEPS = [
    { key: "Confirmed",   icon: faHandshake, label: "Confirmed",   desc: "Booking confirmed! The shop will begin work soon."  },
    { key: "In Progress", icon: faWrench,    label: "In Progress", desc: "Your vehicle is currently being repaired."          },
    { key: "Completed",   icon: faFlag,      label: "Completed",   desc: "Your repair is complete and your vehicle is ready!" },
];

const getStepIndex = (status) => {
    const idx = STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
};

const STEPPER_STATUSES = ["Confirmed", "In Progress"];
const ONGOING_STATUSES = ["Pending", "Accepted", "Confirmed", "In Progress"];

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : null;

const formatRefId = (id, createdAt) => {
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `REQ-${year}-${String(id).padStart(5, "0")}`;
};

function InfoRow({ label, value }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 14, borderBottom: `1px solid ${T.slate100}`,
        }}>
            <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.slate900, margin: 0 }}>{value || "—"}</p>
        </div>
    );
}

export default function RepairStatus({targetRequestId }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                const res  = await fetch("http://localhost:8000/api/getCustomerRequest.php", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
                const data = await res.json();
                if (data.success) {
                    const ongoing = (data.data || []).filter(r =>
                        ONGOING_STATUSES.includes(r.status)
                    );
                    setRequests(ongoing);

                    if (targetRequestId) {
                        const rawId = parseInt(targetRequestId.split("-")[2]);
                        const match = ongoing.find(r => r.id === rawId);
                        setExpanded(match ? match.id : ongoing[0]?.id);
                    } else {
                        if (ongoing.length > 0 && !expanded) setExpanded(ongoing[0].id);
                    }
                }
            } catch (err) {
                console.error("RepairStatus fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, [targetRequestId]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 256 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <FontAwesomeIcon icon={faWrench} style={{ fontSize: 36, color: T.green, opacity: 0.3 }} />
                    <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading repair status…</p>
                </div>
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
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Repair Status</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Track the progress of your active service requests.
                    </p>
                </div>
                <div style={{
                    fontSize: 14, fontWeight: 600, color: T.slate700,
                    background: T.white, padding: "10px 16px",
                    borderRadius: 12, border: `1px solid ${T.slate200}`,
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                </div>
            </div>

            {requests.length === 0 ? (
                <div style={{ ...T.card, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                    <FontAwesomeIcon icon={faCar} style={{ fontSize: 48, color: T.slate200 }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: T.slate900, margin: 0 }}>No active repairs</p>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>
                        You have no ongoing repairs right now. Completed repairs can be found in Service History.
                    </p>
                </div>
            ) : (
                requests.map((req) => {
                    const cfg         = STATUS_CONFIG[req.status] || STATUS_CONFIG["Pending"];
                    const isOpen      = expanded === req.id;
                    const showStepper = STEPPER_STATUSES.includes(req.status);
                    const currentIdx  = getStepIndex(req.status);
                    const hasTow      = req.requires_tow == 1;

                    return (
                        <div key={req.id} style={{ ...T.card, overflow: "hidden" }}>

                            <div style={{
                                padding: "20px 24px",
                                borderBottom: `1px solid ${T.slate100}`,
                                display: "flex", flexWrap: "wrap",
                                alignItems: "center", justifyContent: "space-between", gap: 16,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                                        background: cfg.bg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <FontAwesomeIcon icon={cfg.icon} style={{ fontSize: 22, color: cfg.color }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                            {req.vehicle_brand || "Your Vehicle"}
                                            {req.vehicle_color ? ` · ${req.vehicle_color}` : ""}
                                        </p>
                                        <p style={{ fontSize: 13, color: T.slate500, margin: "4px 0 0" }}>
                                            Shop: <span style={{ fontWeight: 600, color: T.slate700 }}>{req.shop_name || "—"}</span>
                                        </p>
                                        <p style={{ fontSize: 13, color: T.slate500, margin: "2px 0 0" }}>
                                            <span style={{ fontWeight: 600, color: T.slate700 }}>{formatRefId(req.id, req.created_at)}</span>
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{
                                        borderRadius: 99, background: cfg.bg,
                                        padding: "4px 14px", fontSize: 12,
                                        fontWeight: 700, color: cfg.color,
                                    }}>
                                        {cfg.label}
                                    </span>
                                    <button
                                        onClick={() => setExpanded(isOpen ? null : req.id)}
                                        style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            border: `1px solid ${T.slate200}`,
                                            background: T.white,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", color: T.slate400,
                                            transition: "background 0.15s",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = T.greenMuted}
                                        onMouseLeave={e => e.currentTarget.style.background = T.white}
                                    >
                                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ fontSize: 12 }} />
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

                                    {/* ── TOW TRUCK BANNER (Confirmed + requires_tow) ── */}
                                    {hasTow && req.status === "Confirmed" && (
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            background: "linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(22,163,74,0.06) 100%)",
                                            border: "1px solid rgba(13,148,136,0.30)",
                                            borderRadius: 14, padding: "16px 20px",
                                        }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                                                background: "rgba(13,148,136,0.12)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{ fontSize: 22 }}>🚛</span>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: T.teal, margin: 0 }}>
                                                    Your tow truck is on the way!
                                                </p>
                                                <p style={{ fontSize: 12, color: T.slate500, margin: "3px 0 0" }}>
                                                    Sit tight — the driver will arrive at your location shortly to pick up your vehicle.
                                                </p>
                                            </div>
                                            <span style={{
                                                marginLeft: "auto", flexShrink: 0,
                                                background: "rgba(13,148,136,0.12)",
                                                color: T.teal, borderRadius: 99,
                                                padding: "4px 12px", fontSize: 11, fontWeight: 700,
                                            }}>
                                                En Route
                                            </span>
                                        </div>
                                    )}

                                    {!showStepper && (
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 16,
                                            borderRadius: 14, border: `1px solid ${cfg.color}33`,
                                            background: cfg.bg, padding: "16px 20px",
                                        }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                                                background: `${cfg.color}18`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <FontAwesomeIcon icon={cfg.icon} style={{ fontSize: 18, color: cfg.color }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: cfg.color, margin: 0 }}>
                                                    {cfg.label}
                                                </p>
                                                <p style={{ fontSize: 13, color: T.slate500, margin: "3px 0 0" }}>
                                                    {cfg.desc}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── STEPPER ── */}
                                    {showStepper && (
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 40px 1fr 40px 1fr",
                                            alignItems: "center",
                                            gap: 0,
                                            padding: "24px 16px",
                                            background: T.slate50,
                                            borderRadius: 16,
                                            border: `1px solid ${T.slate200}`,
                                        }}>
                                            {STEPS.map((step, idx) => {
                                                const done         = idx < currentIdx;
                                                const active       = idx === currentIdx;
                                                const iconColor    = done ? T.green : active ? T.teal : T.slate300;
                                                const circleBg     = done ? T.greenMuted : active ? T.tealBg : T.white;
                                                const circleBorder = done ? T.green : active ? T.teal : T.slate200;

                                                const stepDesc = active
                                                    ? (step.key === "Confirmed"
                                                        ? (hasTow
                                                            ? "Your tow truck is on the way to pick up your vehicle. Sit tight!"
                                                            : "Please bring your vehicle to the shop. The shop will begin work once your vehicle arrives.")
                                                        : step.desc)
                                                    : done ? "Done" : "Upcoming";

                                                return (
                                                    <Fragment key={step.key}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                                            <div style={{
                                                                width: 64, height: 64, borderRadius: "50%",
                                                                background: circleBg,
                                                                border: `2.5px solid ${circleBorder}`,
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                position: "relative",
                                                                boxShadow: active ? `0 0 0 6px ${T.tealBg}` : "none",
                                                            }}>
                                                                <FontAwesomeIcon icon={step.icon} style={{ fontSize: 22, color: iconColor }} />
                                                                {done && (
                                                                    <span style={{
                                                                        position: "absolute", bottom: -4, right: -4,
                                                                        width: 20, height: 20, borderRadius: "50%",
                                                                        background: T.green, color: T.white,
                                                                        fontSize: 10, display: "flex",
                                                                        alignItems: "center", justifyContent: "center",
                                                                        fontWeight: 700,
                                                                    }}>✓</span>
                                                                )}
                                                            </div>
                                                            <div style={{ textAlign: "center" }}>
                                                                <p style={{
                                                                    fontSize: 13, fontWeight: 700, margin: 0,
                                                                    color: active ? T.teal : done ? T.green : T.slate400,
                                                                }}>{step.label}</p>
                                                                <p style={{
                                                                    fontSize: 11, margin: "4px 0 0",
                                                                    color: active ? T.slate500 : T.slate400,
                                                                    lineHeight: 1.4,
                                                                }}>
                                                                    {stepDesc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {idx < STEPS.length - 1 && (
                                                            <div style={{
                                                                height: 3, borderRadius: 99,
                                                                background: idx < currentIdx ? T.green : T.slate200,
                                                                marginBottom: 36,
                                                            }} />
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {showStepper && (
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 16,
                                            borderRadius: 14, border: `1px solid ${T.slate200}`,
                                            background: T.slate50, padding: "16px 20px",
                                        }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                                background: T.greenMuted,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: 16, color: T.green }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>Sit back and relax!</p>
                                                <p style={{ fontSize: 13, color: T.slate500, marginTop: 3, marginBottom: 0 }}>
                                                    We'll keep you updated at every step of the way.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{
                                        background: T.white, borderRadius: 14,
                                        border: `1px solid ${T.slate200}`, padding: 20,
                                    }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: "0 0 16px" }}>
                                            Request Details
                                        </h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            <InfoRow label="Reference ID"   value={formatRefId(req.id, req.created_at)} />
                                            <InfoRow label="Issue"          value={req.issue_category || req.description} />
                                            <InfoRow label="Workshop"       value={req.shop_name} />
                                            <InfoRow label="Vehicle"        value={`${req.vehicle_brand || "—"} · ${req.vehicle_color || "—"}`} />
                                            <InfoRow label="Submitted On"   value={`${formatDate(req.created_at)} · ${formatTime(req.created_at)}`} />
                                            <InfoRow label="Preferred Date" value={req.preferred_date ? formatDate(req.preferred_date) : null} />
                                            <InfoRow label="Current Status" value={cfg.label} />
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
