import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaperPlane, faCircleCheck, faHandshake, faStethoscope,
    faWrench, faBoxesStacked, faFlag, faShieldHalved,
    faCar, faChevronDown, faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const STEPS = [
    { key: "Pending",       icon: faPaperPlane,   label: "Request Sent",   desc: "Your repair request has been sent to the shop."               },
    { key: "Accepted",      icon: faCircleCheck,  label: "Accepted",        desc: "The shop accepted your request. Please confirm to proceed."  },
    { key: "Confirmed",     icon: faHandshake,    label: "Confirmed",       desc: "Booking confirmed! The shop will begin work soon."           },
    { key: "Diagnosis",     icon: faStethoscope,  label: "Diagnosis",       desc: "The shop is diagnosing the issue with your vehicle."         },
    { key: "In Progress",   icon: faWrench,       label: "Repairing",       desc: "Your vehicle is currently being repaired."                   },
    { key: "Pending Parts", icon: faBoxesStacked, label: "Pending Parts",   desc: "Waiting for spare parts. Repair will resume shortly."       },
    { key: "Completed",     icon: faFlag,         label: "Completed",       desc: "Your repair is complete and your vehicle is ready!"          },
];

const getStepIndex = (status) => {
    const idx = STEPS.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : null;

function RepairDetailRow({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-[#d1e7d7]/60 pb-4 last:border-0 last:pb-0">
            <p className="text-sm font-mono font-semibold text-[#274c3a]/70">{label}</p>
            <p className="text-sm font-mono text-[#14532d]">{value || "—"}</p>
        </div>
    );
}

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
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-[#274c3a]/40">
                    <FontAwesomeIcon icon={faWrench} className="text-4xl animate-pulse text-[#16a34a]/30" />
                    <p className="text-sm font-mono">Loading repair status…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Repair Status</h1>
                <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Track the progress of your repair request in real-time.</p>
            </section>

            {requests.length === 0 ? (
                <section className="rounded-[28px] border border-[#d1e7d7] bg-white p-12 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <FontAwesomeIcon icon={faCar} className="text-5xl text-[#d1e7d7]" />
                        <p className="text-base font-semibold text-[#14532d]">No active repairs</p>
                        <p className="text-sm font-mono text-[#274c3a]/50">Your in-progress service requests will appear here.</p>
                    </div>
                </section>
            ) : (
                requests.map((req) => {
                    const currentIdx = getStepIndex(req.status);
                    const isOpen     = expanded === req.id;
                    const currentStep = STEPS[currentIdx];

                    return (
                        <div key={req.id} className="rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)] overflow-hidden">

                            {/* ── Vehicle / Shop Header ── */}
                            <div className="p-6 border-b border-[#d1e7d7]/60">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/10">
                                            <FontAwesomeIcon icon={faCar} className="text-2xl text-[#16a34a]" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-[#14532d]">
                                                {req.vehicle_brand || "Your Vehicle"}
                                                {req.vehicle_color ? ` · ${req.vehicle_color}` : ""}
                                            </p>
                                            <p className="mt-1 text-sm font-mono text-[#274c3a]/70">
                                                Shop: <span className="font-semibold text-[#14532d]">{req.shop_name || "—"}</span>
                                            </p>
                                            <p className="text-sm font-mono text-[#274c3a]/70">
                                                Request ID: <span className="font-semibold text-[#14532d]">#{req.id}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-[#16a34a]/10 px-4 py-1.5 text-sm font-mono font-semibold text-[#16a34a]">
                                            {req.status}
                                        </span>
                                        <button
                                            onClick={() => setExpanded(isOpen ? null : req.id)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1e7d7] bg-white text-[#274c3a]/50 transition hover:bg-[#16a34a]/5"
                                        >
                                            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Expanded: Stepper + Details ── */}
                            {isOpen && (
                                <div className="p-6 space-y-5">

                                    {/* Stepper */}
                                    <div className="overflow-x-auto">
                                        <div className="flex min-w-[640px] items-start justify-between">
                                            {STEPS.map((step, idx) => {
                                                const done    = idx < currentIdx;
                                                const active  = idx === currentIdx;
                                                const pending = idx > currentIdx;

                                                return (
                                                    <div key={step.key} className="flex flex-1 flex-col items-center">
                                                        <div className="relative flex w-full items-center justify-center">
                                                            {idx > 0 && (
                                                                <div className={`absolute right-1/2 top-1/2 h-[3px] w-full -translate-y-1/2 ${done || active ? "bg-[#16a34a]" : "bg-[#d1e7d7]"}`} />
                                                            )}
                                                            <div className="relative z-10">
                                                                {done && (
                                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#16a34a] bg-[#16a34a]/10">
                                                                        <FontAwesomeIcon icon={step.icon} className="text-xl text-[#16a34a]" />
                                                                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a] text-[10px] text-white">✓</span>
                                                                    </div>
                                                                )}
                                                                {active && (
                                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0d9488] bg-[#0d9488]/10">
                                                                        <FontAwesomeIcon icon={step.icon} className="text-xl text-[#0d9488]" />
                                                                    </div>
                                                                )}
                                                                {pending && (
                                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d1e7d7] bg-white">
                                                                        <FontAwesomeIcon icon={step.icon} className="text-xl text-[#d1e7d7]" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 w-full px-1 text-center">
                                                            <p className={`text-xs font-mono font-semibold ${active ? "text-[#0d9488]" : done ? "text-[#14532d]" : "text-[#d1e7d7]"}`}>
                                                                {step.label}
                                                            </p>
                                                            {active && (
                                                                <p className="mt-1 text-[10px] font-mono leading-4 text-[#274c3a]/50">{step.desc}</p>
                                                            )}
                                                            {!active && (
                                                                <p className="mt-1 text-[10px] tracking-widest text-[#d1e7d7]">
                                                                    {done ? formatDate(req.created_at) || "Done" : "- - - -"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Relax banner */}
                                    <div className="flex items-center gap-4 rounded-2xl border border-[#d1e7d7] bg-[#f0f7f2] px-5 py-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/10">
                                            <FontAwesomeIcon icon={faShieldHalved} className="text-[#16a34a]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#14532d]">Sit back and relax!</p>
                                            <p className="text-sm font-mono text-[#274c3a]/60">We'll keep you updated at every step of the way.</p>
                                        </div>
                                    </div>

                                    {/* Repair Details */}
                                    <div className="rounded-2xl border border-[#d1e7d7] bg-white p-5">
                                        <h3 className="text-base font-semibold text-[#14532d] mb-5">Repair Details</h3>
                                        <div className="space-y-4">
                                            <RepairDetailRow label="Issue"           value={req.issue_category || req.description || "—"} />
                                            <RepairDetailRow label="Workshop"        value={req.shop_name}                                 />
                                            <RepairDetailRow label="Vehicle"         value={`${req.vehicle_brand || "—"} · ${req.vehicle_color || "—"}`} />
                                            <RepairDetailRow label="Requested On"    value={`${formatDate(req.created_at)} · ${formatTime(req.created_at)}`} />
                                            <RepairDetailRow label="Current Status"  value={req.status}                                   />
                                        </div>
                                    </div>

                                    {/* Accepted nudge */}
                                    {req.status === "Accepted" && (
                                        <div className="rounded-xl border border-[#2563eb]/20 bg-[#2563eb]/5 px-4 py-3">
                                            <p className="text-sm font-mono text-[#2563eb]">
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