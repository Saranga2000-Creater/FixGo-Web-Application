import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

// Sample shop data awaiting verification (come from the backend API)
const VERIFICATION_QUEUE = [
    { id: "#SHP-9021", initials: "KM", name: "Kandy Motors Ltd.",   docs: ["BR_CERT", "TAX_ID"],           flag: "Verified",     action: "approve" },
    { id: "#SHP-8842", initials: "GR", name: "Galle Road Repairs",  docs: ["BR_CERT"],                     flag: "IP Match",     action: "review"  },
    { id: "#SHP-7710", initials: "SA", name: "Speedy Autos",        docs: ["BANK_ST", "OWN_ID"],           flag: "Pending Scan", action: "review"  },
    { id: "#SHP-7401", initials: "PG", name: "Perera Garage",       docs: ["BR_CERT", "OWN_ID", "TAX_ID"], flag: "Verified",     action: "approve" },
    { id: "#SHP-7308", initials: "CS", name: "City Service Center", docs: ["BR_CERT"],                     flag: "IP Match",     action: "review"  },
];

// Generic white card wrapper
function PageCard({ children }) {
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
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

// Column headers for the verification table
function TableHeader({ cols }) {
    return (
        <div className="grid gap-4 py-2.5 px-6 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2fr_1.5fr_1fr_1fr]">
            {cols.map((c) => <span key={c}>{c}</span>)}
        </div>
    );
}

// Small tag showing one submitted document type (e.g. BR_CERT, TAX_ID)
function DocBadge({ label }) {
    return (
        <span className="rounded-md border border-gray-200 bg-gray-50 py-0.5 px-2 text-[11px] font-semibold text-gray-500">
            {label}
        </span>
    );
}

// One row in the verification table: shop info, submitted docs, flag status, and action button
function VerificationRow({ shop, isLast }) {
    return (
        <div
            className={`grid gap-4 items-center py-3.5 px-6 [grid-template-columns:2fr_1.5fr_1fr_1fr] ${
                !isLast ? "border-b border-gray-100" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 shrink-0">
                    {shop.initials}
                </div>
                <div>
                    <p className="text-[13px] font-bold text-gray-900 m-0">{shop.name}</p>
                    <p className="text-[11px] text-gray-400 m-0">{shop.id}</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1">
                {shop.docs.map((d) => <DocBadge key={d} label={d} />)}
            </div>
            {/* Flag status: verified (green), IP match warning (orange), or pending scan (gray) */}
            <div>
                {shop.flag === "Verified" && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <FontAwesomeIcon icon={faCircleCheck} /> Verified
                    </span>
                )}
                {shop.flag === "IP Match" && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B1A]">
                        <FontAwesomeIcon icon={faTriangleExclamation} /> IP Match
                    </span>
                )}
                {shop.flag === "Pending Scan" && (
                    <span className="text-xs text-gray-400 italic">Pending Scan</span>
                )}
            </div>
            {/* Action button: green "Approve" for clean shops, outlined "Review" for flagged ones */}
            <div>
                {shop.action === "approve" ? (
                    <button className="rounded-[10px] bg-green-600 text-white border-none py-2 px-4 text-xs font-bold cursor-pointer font-sans">
                        Approve
                    </button>
                ) : (
                    <button className="rounded-[10px] bg-white text-gray-700 border border-gray-200 py-2 px-4 text-xs font-bold cursor-pointer font-sans">
                        Review
                    </button>
                )}
            </div>
        </div>
    );
}

// Small rounded label used for the "Pending" / "Approved today" counts
function Pill({ className, children }) {
    return <span className={`rounded-full py-1 px-3 text-xs font-semibold ${className}`}>{children}</span>;
}

// Main Verification Queue page: search box, pending/approved counts, and the shop table
function VerificationQueue() {
    // Search text typed into the search box, used to filter the table below
    const [search, setSearch] = useState("");

    return (
        <div className="flex flex-col gap-5">
            <PageHeading title="Verification Queue" sub="Review and approve shop credentials before they go live." />

            {/* Search bar + pending/approved count pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm shadow-[0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[320px]">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
                    <input
                        className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent font-sans"
                        placeholder="Search by shop name or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Pill className="bg-[#FFF4EE] text-[#FF6B1A]">42 Pending</Pill>
                    <Pill className="bg-green-50 text-green-600">8 Approved today</Pill>
                </div>
            </div>

            {/* Table, filtered live by shop name or ID matching the search text */}
            <PageCard>
                <TableHeader cols={["Shop Name / ID", "Submitted Docs", "Flags", "Actions"]} />
                {VERIFICATION_QUEUE
                    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
                    .map((shop, idx, arr) => (
                        <VerificationRow key={shop.id} shop={shop} isLast={idx === arr.length - 1} />
                    ))}
            </PageCard>
        </div>
    );
}

export default VerificationQueue;
