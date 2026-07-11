import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCircleCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const T = {
    green:    "#16A34A",
    greenBg:  "#EDF9F0",
    orange:   "#FF6B1A",
    orangeBg: "#FFF4EE",
    slate900: "#111827",
    slate700: "#374151",
    slate500: "#6B7280",
    slate400: "#9CA3AF",
    slate200: "#E5E7EB",
    slate100: "#F3F4F6",
    slate50:  "#F9FAFB",
    white:    "#FFFFFF",
    font:     "'Segoe UI', system-ui, sans-serif",
};

const VERIFICATION_QUEUE = [
    { id: "#SHP-9021", initials: "KM", name: "Kandy Motors Ltd.",   docs: ["BR_CERT", "TAX_ID"],           flag: "Verified",     action: "approve" },
    { id: "#SHP-8842", initials: "GR", name: "Galle Road Repairs",  docs: ["BR_CERT"],                     flag: "IP Match",     action: "review"  },
    { id: "#SHP-7710", initials: "SA", name: "Speedy Autos",        docs: ["BANK_ST", "OWN_ID"],           flag: "Pending Scan", action: "review"  },
    { id: "#SHP-7401", initials: "PG", name: "Perera Garage",       docs: ["BR_CERT", "OWN_ID", "TAX_ID"], flag: "Verified",     action: "approve" },
    { id: "#SHP-7308", initials: "CS", name: "City Service Center", docs: ["BR_CERT"],                     flag: "IP Match",     action: "review"  },
];

function PageCard({ children }) {
    return (
        <div style={{ background: T.white, borderRadius: 18, border: `1px solid ${T.slate200}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {children}
        </div>
    );
}

function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>{title}</h1>
            {sub && <p style={{ color: T.slate500, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
        </div>
    );
}

function TableHeader({ cols }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: 16, padding: "10px 24px", background: T.slate50, borderBottom: `1px solid ${T.slate100}`, fontSize: 11, fontWeight: 700, color: T.slate500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {cols.map(c => <span key={c}>{c}</span>)}
        </div>
    );
}

function DocBadge({ label }) {
    return (
        <span style={{ borderRadius: 6, border: `1px solid ${T.slate200}`, background: T.slate50, padding: "3px 8px", fontSize: 11, fontWeight: 600, color: T.slate500 }}>{label}</span>
    );
}

function VerificationRow({ shop, isLast }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: 16, alignItems: "center", padding: "14px 24px", borderBottom: !isLast ? `1px solid ${T.slate100}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.slate100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.slate500, flexShrink: 0 }}>{shop.initials}</div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: T.slate900, margin: 0 }}>{shop.name}</p>
                    <p style={{ fontSize: 11, color: T.slate400, margin: 0 }}>{shop.id}</p>
                </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {shop.docs.map((d) => <DocBadge key={d} label={d} />)}
            </div>
            <div>
                {shop.flag === "Verified"     && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: T.green }}><FontAwesomeIcon icon={faCircleCheck} /> Verified</span>}
                {shop.flag === "IP Match"     && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: T.orange }}><FontAwesomeIcon icon={faTriangleExclamation} /> IP Match</span>}
                {shop.flag === "Pending Scan" && <span style={{ fontSize: 12, color: T.slate400, fontStyle: "italic" }}>Pending Scan</span>}
            </div>
            <div>
                {shop.action === "approve"
                    ? <button style={{ borderRadius: 10, background: T.green, color: T.white, border: "none", padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>Approve</button>
                    : <button style={{ borderRadius: 10, background: T.white, color: T.slate700, border: `1px solid ${T.slate200}`, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>Review</button>
                }
            </div>
        </div>
    );
}

function Pill({ bg, color, children }) {
    return <span style={{ borderRadius: 99, background: bg, color, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{children}</span>;
}

function VerificationQueue() {
    const [search, setSearch] = useState("");
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PageHeading title="Verification Queue" sub="Review and approve shop credentials before they go live." />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.white, border: `1px solid ${T.slate200}`, borderRadius: 12, padding: "10px 16px", fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", width: "100%", maxWidth: 320 }}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: T.slate400 }} />
                    <input
                        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: T.slate700, background: "transparent", fontFamily: T.font }}
                        placeholder="Search by shop name or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Pill bg={T.orangeBg} color={T.orange}>42 Pending</Pill>
                    <Pill bg={T.greenBg} color={T.green}>8 Approved today</Pill>
                </div>
            </div>
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
