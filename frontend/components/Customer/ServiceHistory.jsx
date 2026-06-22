import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight, faCalendarDays, faChevronDown,
    faClockRotateLeft, faMapPin, faWrench,
} from "@fortawesome/free-solid-svg-icons";

const ACCENT_CYCLE = ["green", "teal", "blue", "violet", "yellow"];

const ACCENT_STYLES = {
    green:  { bg: "bg-[#16a34a]/10", text: "text-[#16a34a]", btn: "border-[#16a34a] text-[#16a34a] hover:bg-[#16a34a]/5",  dot: "bg-[#16a34a]", badge: "bg-[#16a34a]/10 text-[#16a34a]",  line: "bg-[#d1e7d7]" },
    teal:   { bg: "bg-[#0d9488]/10", text: "text-[#0d9488]", btn: "border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/5",  dot: "bg-[#0d9488]", badge: "bg-[#0d9488]/10 text-[#0d9488]",  line: "bg-[#d1e7d7]" },
    blue:   { bg: "bg-[#2563eb]/10", text: "text-[#2563eb]", btn: "border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb]/5",  dot: "bg-[#2563eb]", badge: "bg-[#2563eb]/10 text-[#2563eb]",  line: "bg-[#d1e7d7]" },
    violet: { bg: "bg-[#a855f7]/10", text: "text-[#a855f7]", btn: "border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/5", dot: "bg-[#a855f7]", badge: "bg-[#a855f7]/10 text-[#a855f7]",  line: "bg-[#d1e7d7]" },
    yellow: { bg: "bg-[#d97706]/10", text: "text-[#d97706]", btn: "border-[#d97706] text-[#d97706] hover:bg-[#d97706]/5", dot: "bg-[#d97706]", badge: "bg-[#d97706]/10 text-[#d97706]",  line: "bg-[#d1e7d7]" },
};

const FILTERS = ["All Time", "Last 3 Months", "Last 6 Months", "This Year"];

const isWithinFilter = (dateStr, filter) => {
    if (filter === "All Time" || !dateStr) return true;
    const date  = new Date(dateStr);
    const now   = new Date();
    const months = filter === "Last 3 Months" ? 3 : filter === "Last 6 Months" ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    return date >= cutoff;
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "";

export default function ServiceHistory({ customerId }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState("All Time");

    useEffect(() => {
        if (!customerId) return;
        const fetchHistory = async () => {
            try {
                const res  = await fetch(`http://localhost:8000/api/getCustomerServiceHistory.php?customer_id=${customerId}`);
                const data = await res.json();
                if (data.success) setHistory(data.data || []);
            } catch (err) {
                console.error("ServiceHistory fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [customerId]);

    const filtered = history.filter(r => isWithinFilter(r.completed_at, filter));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3 text-[#274c3a]/40">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-4xl animate-pulse text-[#16a34a]/30" />
                    <p className="text-sm font-mono">Loading service history…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Service History</h1>
                    <p className="mt-2 text-sm font-mono text-[#274c3a]/60">View your past vehicle services and repair details.</p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-2xl border border-[#d1e7d7] bg-white px-4 py-3 text-sm text-[#274c3a] shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#16a34a]/50" />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="appearance-none bg-transparent pr-5 text-sm font-mono text-[#274c3a] focus:outline-none"
                    >
                        {FILTERS.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none -ml-4 text-xs text-[#16a34a]/50" />
                </div>
            </section>

            {/* List */}
            {filtered.length === 0 ? (
                <section className="rounded-[28px] border border-[#d1e7d7] bg-white p-12 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <FontAwesomeIcon icon={faClockRotateLeft} className="text-5xl text-[#d1e7d7]" />
                        <p className="text-base font-semibold text-[#14532d]">No service history yet</p>
                        <p className="text-sm font-mono text-[#274c3a]/50">
                            {filter !== "All Time" ? "Try a different time range." : "Your completed repairs will appear here."}
                        </p>
                    </div>
                </section>
            ) : (
                <section className="rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                    {filtered.map((record, idx) => {
                        const a      = ACCENT_STYLES[ACCENT_CYCLE[idx % ACCENT_CYCLE.length]];
                        const isLast = idx === filtered.length - 1;

                        return (
                            <div key={record.id} className={`flex items-center gap-4 px-6 py-5 ${!isLast ? "border-b border-[#d1e7d7]/60" : ""}`}>
                                {/* Timeline dot + line */}
                                <div className="flex flex-col items-center self-stretch">
                                    <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${a.dot}`} />
                                    {!isLast && <div className={`mt-1 w-px flex-1 ${a.line}`} />}
                                </div>

                                {/* Icon */}
                                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${a.bg}`}>
                                    <FontAwesomeIcon icon={faWrench} className={`text-xl ${a.text}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-[#14532d]">
                                            {record.issue_category || record.description || "Service Completed"}
                                        </p>
                                        <span className={`rounded-full px-3 py-0.5 text-xs font-mono font-medium ${a.badge}`}>
                                            Completed
                                        </span>
                                    </div>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#274c3a]/60">
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faCalendarDays} className="text-[#16a34a]/40" />
                                            {formatDate(record.completed_at)}
                                            {formatTime(record.completed_at) && ` • ${formatTime(record.completed_at)}`}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faMapPin} className="text-[#16a34a]/40" />
                                            {record.shop_name || "—"}
                                        </span>
                                    </div>
                                    {record.vehicle_brand && (
                                        <p className="mt-1 text-xs font-mono text-[#274c3a]/40">
                                            {record.vehicle_brand}{record.vehicle_color ? ` · ${record.vehicle_color}` : ""}
                                        </p>
                                    )}
                                </div>

                                {/* View Details button */}
                                <button className={`shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-mono font-medium transition ${a.btn}`}>
                                    View Details <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                </button>
                            </div>
                        );
                    })}
                </section>
            )}
        </div>
    );
}