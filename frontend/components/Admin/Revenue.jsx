import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faMoneyBillWave, faChartLine, faStore, faDownload, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

// Sample per-shop revenue data (would normally come from the backend API)
const REVENUE_ROWS = [
    { id: "#SHP-9021", initials: "KM", shop: "Kandy Motors Ltd.",   bookings: 124, revenue: "LKR 248,000", commission: "LKR 37,200", status: "Paid"    },
    { id: "#SHP-8842", initials: "GR", shop: "Galle Road Repairs",  bookings:  87, revenue: "LKR 174,000", commission: "LKR 26,100", status: "Pending" },
    { id: "#SHP-7710", initials: "SA", shop: "Speedy Autos",        bookings:  63, revenue: "LKR 126,000", commission: "LKR 18,900", status: "Paid"    },
    { id: "#SHP-7401", initials: "PG", shop: "Perera Garage",       bookings:  42, revenue: "LKR  84,000", commission: "LKR 12,600", status: "Overdue" },
    { id: "#SHP-7308", initials: "CS", shop: "City Service Center", bookings:  31, revenue: "LKR  62,000", commission: "LKR  9,300", status: "Paid"    },
    { id: "#SHP-7201", initials: "EA", shop: "Elite Auto Care",     bookings:  58, revenue: "LKR 116,000", commission: "LKR 17,400", status: "Pending" },
];

// Maps each accent name to its matching background/icon/text Tailwind classes
const ACCENT_STYLES = {
    green:  { iconBg: "bg-green-50",  iconColor: "text-green-600", metaColor: "text-green-600" },
    blue:   { iconBg: "bg-[#EDF3FF]", iconColor: "text-blue-600",  metaColor: "text-blue-600" },
    orange: { iconBg: "bg-[#FFF4EE]", iconColor: "text-[#FF6B1A]", metaColor: "text-[#FF6B1A]" },
};

// Reusable top summary card (Gross Revenue / Total Commission / Active Billing)
function AdminSummaryCard({ accent, icon, title, count, meta }) {
    const s = ACCENT_STYLES[accent];
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-4">
                <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <FontAwesomeIcon icon={icon} className={`text-xl ${s.iconColor}`} />
                </div>
                <div>
                    <p className="text-[13px] text-gray-500 m-0">{title}</p>
                    <p className="text-[28px] font-bold text-gray-900 my-1">{count}</p>
                    {meta && (
                        <p className={`text-xs font-semibold m-0 flex items-center gap-1 ${s.metaColor}`}>
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                            {meta}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Generic white card wrapper with optional title and header action (e.g. a button)
function PageCard({ title, action, children }) {
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            {(title || action) && (
                <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
                    {title && <h2 className="text-[15px] font-bold text-gray-900 m-0">{title}</h2>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}

// Page title + subtitle block
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
            {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
        </div>
    );
}

// Column headers for the revenue table
function TableHeader({ cols }) {
    return (
        <div className="grid gap-4 py-2.5 px-6 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2fr_1fr_1fr_1fr_1fr]">
            {cols.map((c) => <span key={c}>{c}</span>)}
        </div>
    );
}

// Maps each status to badge Tailwind classes (green=Paid, orange=Pending, red=Overdue)
const STATUS_STYLES = {
    Paid:    "bg-green-50 text-green-600",
    Pending: "bg-[#FFF4EE] text-[#FF6B1A]",
    Overdue: "bg-red-100 text-red-600",
};

// One row in the revenue table: shop info, bookings, revenue, commission, and payment status
function RevenueRow({ row, isLast }) {
    const statusClass = STATUS_STYLES[row.status] || "";
    return (
        <div
            className={`grid gap-4 items-center py-3.5 px-6 [grid-template-columns:2fr_1fr_1fr_1fr_1fr] ${
                !isLast ? "border-b border-gray-100" : ""
            }`}
        >
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[11px] font-bold text-green-600 shrink-0">
                    {row.initials}
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-900 m-0">{row.shop}</p>
                    <p className="text-[11px] text-gray-400 m-0">{row.id}</p>
                </div>
            </div>
            <p className="text-[13px] text-gray-700 m-0">{row.bookings}</p>
            <p className="text-[13px] font-bold text-gray-900 m-0">{row.revenue}</p>
            <p className="text-[13px] text-gray-700 m-0">{row.commission}</p>
            <span className={`inline-block rounded-full py-1 px-3 text-xs font-semibold ${statusClass}`}>
                {row.status}
            </span>
        </div>
    );
}

// Main Revenue & Ledger page: period filter, 3 summary cards, and a per-shop revenue table
function Revenue() {
    // Currently selected time period for the report (not wired to real filtering yet)
    const [filter, setFilter] = useState("This Month");

    return (
        <div className="flex flex-col gap-5">
            {/* Heading + period dropdown */}
            <div className="flex justify-between items-start flex-wrap gap-3">
                <PageHeading title="Revenue & Ledger" sub="Monthly billing and commission tracking across all shops." />
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border-none outline-none text-sm text-gray-700 bg-transparent font-sans cursor-pointer"
                    >
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Top summary stats */}
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                <AdminSummaryCard accent="green"  icon={faMoneyBillWave} title="Gross Revenue"    count="LKR 42,000" meta="+18% vs last month" />
                <AdminSummaryCard accent="blue"   icon={faChartLine}     title="Total Commission" count="LKR 6,300" meta="15% avg rate"       />
                <AdminSummaryCard accent="orange" icon={faStore}         title="Active Billing"   count="10"    meta="Shops billed"       />
            </div>

            {/* Per-shop revenue table with CSV export */}
            <PageCard
                title="Shop Revenue Breakdown"
                action={
                    <button className="flex items-center gap-1.5 py-2 px-3.5 rounded-[10px] border-none bg-gray-900 text-sm font-semibold text-white cursor-pointer font-sans">
                        <FontAwesomeIcon icon={faDownload} className="text-[11px]" /> Export CSV
                    </button>
                }
            >
                <TableHeader cols={["Shop", "Bookings", "Revenue", "Commission", "Status"]} />
                {REVENUE_ROWS.map((row, idx) => (
                    <RevenueRow key={row.id} row={row} isLast={idx === REVENUE_ROWS.length - 1} />
                ))}
            </PageCard>
        </div>
    );
}

export default Revenue;
