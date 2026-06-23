import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaperPlane, faCircleCheck, faHandshake, faStethoscope,
    faWrench, faBoxesStacked, faFlag, faShieldHalved,
    faCar, faChevronDown, faChevronUp, faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens — exact match to Admin ─────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenLight:"#F0FDF4",
    greenBg:   "#EDF9F0",
    greenMuted:"rgba(22,163,74,0.08)",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.10)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
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
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
};

const STEPS = [
    { key: "Pending",       icon: faPaperPlane,   label: "Request Sent",  desc: "Your repair request has been sent to the shop."              },
    { key: "Accepted",      icon: faCircleCheck,  label: "Accepted",      desc: "The shop accepted your request. Please confirm to proceed." },
    { key: "Confirmed",     icon: faHandshake,    label: "Confirmed",     desc: "Booking confirmed! The shop will begin work soon."          },
    { key: "Diagnosis",     icon: faStethoscope,  label: "Diagnosis",     desc: "The shop is diagnosing the issue with your vehicle."        },
    { key: "In Progress",   icon: faWrench,       label: "Repairing",     desc: "Your vehicle is currently being repaired."                  },
    { key: "Pending Parts", icon: faBoxesStacked, label: "Pending Parts", desc: "Waiting for spare parts. Repair will resume shortly."      },
    { key: "Completed",     icon: faFlag,         label: "Completed",     desc: "Your repair is complete and your vehicle is ready!"         },
];

const getStepIndex = (status) => {
    const idx = STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : null;

// ── Sub-components ────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 14,
            borderBottom: `1px solid ${T.slate100}`,
        }}>
            <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.slate900, margin: 0 }}>{value || "—"}</p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RepairStatus({ customerId }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        if (!customerId) return;
        const fetchRequests = async () => {
            try {
                const res  = await fetch(`http://localhost:8000/api/getCustomerRequest.php?customer_id=${customerId}`);
                const data = await res.json();
                if (data.success) {
                    const active = (data.data || []).filter(r => !["Completed", "Cancelled"].includes(r.status));
                    setRequests(active);
                    if (active.length > 0) setExpanded(active[0].id);
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
    }, [customerId]);

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

            {/* ── Page heading ── */}
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
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Repair Status</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        Track the progress of your repair request in real-time.
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

            {/* ── Empty state ── */}
            {requests.length === 0 ? (
                <div style={{ ...T.card, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                    <FontAwesomeIcon icon={faCar} style={{ fontSize: 48, color: T.slate200 }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: T.slate900, margin: 0 }}>No active repairs</p>
                    <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>Your in-progress service requests will appear here.</p>
                </div>
            ) : (
                requests.map((req) => {
                    const currentIdx  = getStepIndex(req.status);
                    const isOpen      = expanded === req.id;
                    const currentStep = STEPS[currentIdx];

                    return (
                        <div key={req.id} style={{ ...T.card, overflow: "hidden" }}>

                            {/* ── Vehicle / Shop header ── */}
                            <div style={{
                                padding: "20px 24px",
                                borderBottom: `1px solid ${T.slate100}`,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 16,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    {/* Vehicle icon */}
                                    <div style={{
                                        width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                                        background: T.greenBg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <FontAwesomeIcon icon={faCar} style={{ fontSize: 22, color: T.green }} />
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
                                            Request ID: <span style={{ fontWeight: 600, color: T.slate700 }}>#{req.id}</span>
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {/* Status badge */}
                                    <span style={{
                                        borderRadius: 99, background: T.greenBg,
                                        padding: "4px 14px", fontSize: 12,
                                        fontWeight: 700, color: T.green,
                                    }}>
                                        {req.status}
                                    </span>
                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => setExpanded(isOpen ? null : req.id)}
                                        style={{
                                            width: 36, height: 36,
                                            borderRadius: "50%",
                                            border: `1px solid ${T.slate200}`,
                                            background: T.white,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer", color: T.slate400,
                                            transition: "background 0.15s ease",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = T.greenBg}
                                        onMouseLeave={e => e.currentTarget.style.background = T.white}
                                    >
                                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ fontSize: 12 }} />
                                    </button>
                                </div>
                            </div>

                            {/* ── Expanded body ── */}
                            {isOpen && (
                                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

                                    {/* Stepper */}
                                    <div style={{ overflowX: "auto" }}>
                                        <div style={{
                                            display: "flex",
                                            minWidth: 640,
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                        }}>
                                            {STEPS.map((step, idx) => {
                                                const done    = idx < currentIdx;
                                                const active  = idx === currentIdx;
                                                const pending = idx > currentIdx;

                                                const circleStyle = {
                                                    width: 56, height: 56, borderRadius: "50%",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    position: "relative",
                                                    border: `2px solid ${done ? T.green : active ? T.teal : T.slate200}`,
                                                    background: done ? T.greenBg : active ? T.tealBg : T.white,
                                                };

                                                return (
                                                    <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        {/* Circle + connector */}
                                                        <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            {idx > 0 && (
                                                                <div style={{
                                                                    position: "absolute",
                                                                    right: "50%", top: "50%",
                                                                    height: 3, width: "100%",
                                                                    transform: "translateY(-50%)",
                                                                    background: done || active ? T.green : T.slate200,
                                                                }} />
                                                            )}
                                                            <div style={{ position: "relative", zIndex: 1 }}>
                                                                <div style={circleStyle}>
                                                                    <FontAwesomeIcon
                                                                        icon={step.icon}
                                                                        style={{ fontSize: 18, color: done ? T.green : active ? T.teal : T.slate200 }}
                                                                    />
                                                                    {done && (
                                                                        <span style={{
                                                                            position: "absolute", bottom: -4, right: -4,
                                                                            width: 18, height: 18, borderRadius: "50%",
                                                                            background: T.green, color: T.white,
                                                                            fontSize: 9, display: "flex",
                                                                            alignItems: "center", justifyContent: "center",
                                                                            fontWeight: 700,
                                                                        }}>✓</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Label */}
                                                        <div style={{ marginTop: 12, textAlign: "center", padding: "0 4px" }}>
                                                            <p style={{
                                                                fontSize: 11, fontWeight: 700, margin: 0,
                                                                color: active ? T.teal : done ? T.green : T.slate400,
                                                            }}>
                                                                {step.label}
                                                            </p>
                                                            {active && (
                                                                <p style={{ fontSize: 10, color: T.slate500, marginTop: 4, lineHeight: 1.4 }}>
                                                                    {step.desc}
                                                                </p>
                                                            )}
                                                            {!active && (
                                                                <p style={{ fontSize: 10, color: done ? T.slate400 : T.slate200, marginTop: 4, letterSpacing: "0.08em" }}>
                                                                    {done ? formatDate(req.created_at) || "Done" : "– – – –"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Relax banner */}
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 16,
                                        borderRadius: 14,
                                        border: `1px solid ${T.slate200}`,
                                        background: T.slate50,
                                        padding: "16px 20px",
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                            background: T.greenBg,
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

                                    {/* Repair Details card */}
                                    <div style={{
                                        background: T.white, borderRadius: 14,
                                        border: `1px solid ${T.slate200}`, padding: 20,
                                    }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: "0 0 16px" }}>Repair Details</h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            <InfoRow label="Issue"          value={req.issue_category || req.description} />
                                            <InfoRow label="Workshop"       value={req.shop_name} />
                                            <InfoRow label="Vehicle"        value={`${req.vehicle_brand || "—"} · ${req.vehicle_color || "—"}`} />
                                            <InfoRow label="Requested On"   value={`${formatDate(req.created_at)} · ${formatTime(req.created_at)}`} />
                                            <InfoRow label="Current Status" value={req.status} />
                                        </div>
                                    </div>

                                    {/* Accepted nudge */}
                                    {req.status === "Accepted" && (
                                        <div style={{
                                            borderRadius: 12,
                                            border: `1px solid rgba(37,99,235,0.2)`,
                                            background: T.blueBg,
                                            padding: "12px 16px",
                                        }}>
                                            <p style={{ fontSize: 13, color: T.blue, margin: 0 }}>
                                                ℹ️ <strong>{req.shop_name}</strong> has accepted your request. Go to the shop's page to <strong>confirm</strong> and unlock their contact details.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
