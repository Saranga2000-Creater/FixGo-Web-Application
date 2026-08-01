import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faCircleCheck,
    faHourglass,
    faStore,
    faPhone,
    faEnvelope,
    faClock,
    faMapPin,
    faTag,
    faCar,
    faRotate,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { api, UPLOADS_URL } from "../../src/services/api";

// ── Generic white card wrapper ────────────────────────────────────────────────
function PageCard({ children }) {
    return (
        <div className="bg-white rounded-[18px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            {children}
        </div>
    );
}

// ── Page title + subtitle ─────────────────────────────────────────────────────
function PageHeading({ title, sub }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0">{title}</h1>
            {sub && <p className="text-gray-500 mt-1.5 text-sm mb-0">{sub}</p>}
        </div>
    );
}

// ── Small rounded count pill ──────────────────────────────────────────────────
function Pill({ className, children }) {
    return (
        <span className={`rounded-full py-1 px-3 text-xs font-semibold ${className}`}>
            {children}
        </span>
    );
}

// ── Detail row inside the review modal ───────────────────────────────────────
function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={icon} className="text-gray-500 text-xs" />
            </div>
            <div>
                <p className="text-[11px] text-gray-400 m-0 font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-800 m-0 font-medium">{value || "—"}</p>
            </div>
        </div>
    );
}

// ── Modal to review a shop's full details before approving ───────────────────
function ReviewModal({ shop, onClose, onApprove, approving }) {
    if (!shop) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {shop.profileImageURL ? (
                            <img
                                src={`${UPLOADS_URL}/${shop.profileImageURL}`}
                                alt={shop.shopName}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
                                {(shop.shopName || "?")[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-900 m-0">{shop.shopName}</p>
                            <p className="text-xs text-gray-400 m-0">ID #{shop.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border-none cursor-pointer flex items-center justify-center transition-colors"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
                    </button>
                </div>

                {/* Details grid */}
                <div className="px-6 py-5 grid grid-cols-1 gap-4">
                    <DetailRow icon={faStore}    label="Owner"           value={shop.ownerName} />
                    <DetailRow icon={faEnvelope} label="Email"           value={shop.email} />
                    <DetailRow icon={faPhone}    label="Contact"         value={shop.contactNumber} />
                    <DetailRow icon={faMapPin}   label="Address"         value={shop.address} />
                    <DetailRow icon={faTag}      label="Category"        value={shop.category} />
                    <DetailRow icon={faCar}      label="Vehicle Types"   value={shop.vehicleCategories} />
                    <DetailRow icon={faClock}    label="Operating Hours" value={`${shop.openTime} – ${shop.closeTime}`} />
                    {shop.BRN && <DetailRow icon={faTag} label="Business Reg. No." value={shop.BRN} />}

                    {shop.description && (
                        <div>
                            <p className="text-[11px] text-gray-400 m-0 mb-1 font-semibold uppercase tracking-wide">Description</p>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 m-0 leading-relaxed">{shop.description}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="py-2.5 px-5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors font-sans"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onApprove(shop.id)}
                        disabled={approving}
                        className="py-2.5 px-6 rounded-xl bg-green-600 text-white text-sm font-bold cursor-pointer hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-sans flex items-center gap-2"
                    >
                        {approving && <FontAwesomeIcon icon={faRotate} className="animate-spin" />}
                        {approving ? "Approving…" : "Approve Shop"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Column headers for the verification table ─────────────────────────────────
function TableHeader({ cols }) {
    return (
        <div className="grid gap-4 py-2.5 px-6 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] [grid-template-columns:2fr_1.5fr_1.2fr_1fr]">
            {cols.map((c) => <span key={c}>{c}</span>)}
        </div>
    );
}

// ── One row per pending shop ──────────────────────────────────────────────────
function VerificationRow({ shop, isLast, onReview, onApprove, approving }) {
    return (
        <div className={`grid gap-4 items-center py-3.5 px-6 [grid-template-columns:2fr_1.5fr_1.2fr_1fr] ${!isLast ? "border-b border-gray-100" : ""}`}>
            {/* Shop name / ID */}
            <div className="flex items-center gap-3">
                {shop.profileImageURL ? (
                    <img
                        src={`${UPLOADS_URL}/${shop.profileImageURL}`}
                        alt={shop.shopName}
                        className="w-[38px] h-[38px] rounded-[10px] object-cover border border-gray-100 shrink-0"
                    />
                ) : (
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 shrink-0">
                        {(shop.shopName || "?")[0].toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="text-[13px] font-bold text-gray-900 m-0">{shop.shopName}</p>
                    <p className="text-[11px] text-gray-400 m-0">{shop.ownerName} · #{shop.id}</p>
                </div>
            </div>

            {/* Category */}
            <p className="text-xs text-gray-600 m-0">{shop.category || "—"}</p>

            {/* Email-verified status */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                <FontAwesomeIcon icon={faCircleCheck} /> Email Verified
            </span>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onReview(shop)}
                    className="rounded-[10px] bg-white text-gray-700 border border-gray-200 py-2 px-3 text-xs font-bold cursor-pointer font-sans hover:bg-gray-50 transition-colors"
                >
                    Review
                </button>
                <button
                    onClick={() => onApprove(shop.id)}
                    disabled={approving === shop.id}
                    className="rounded-[10px] bg-green-600 text-white border-none py-2 px-3 text-xs font-bold cursor-pointer font-sans hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                    {approving === shop.id && <FontAwesomeIcon icon={faRotate} className="animate-spin text-[10px]" />}
                    Approve
                </button>
            </div>
        </div>
    );
}

// ── Main VerificationQueue component ─────────────────────────────────────────
function VerificationQueue() {
    const [search, setSearch]         = useState("");
    const [shops, setShops]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [reviewShop, setReviewShop] = useState(null);   // shop currently open in modal
    const [approving, setApproving]   = useState(null);   // shop.id currently being approved

    // ── Fetch pending shops from backend ──────────────────────────────────────
    const fetchPending = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("getPendingShops.php");
            setShops(res.data || []);
        } catch (err) {
            setError(err.message || "Failed to load pending shops.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    // ── Approve a shop by ID ──────────────────────────────────────────────────
    const handleApprove = async (shopId) => {
        setApproving(shopId);
        try {
            await api.post("approveShop.php", { shopId });
            // Remove from queue immediately
            setShops((prev) => prev.filter((s) => s.id !== shopId));
            if (reviewShop?.id === shopId) setReviewShop(null);
        } catch (err) {
            alert(err.message || "Failed to approve shop. Please try again.");
        } finally {
            setApproving(null);
        }
    };

    const filtered = shops.filter(
        (s) =>
            s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
            s.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
            String(s.id).includes(search)
    );

    return (
        <div className="flex flex-col gap-5">
            <PageHeading
                title="Verification Queue"
                sub="Review and approve shop registrations before they go live."
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm shadow-[0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[320px]">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />
                    <input
                        className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent font-sans"
                        placeholder="Search by shop name, owner or ID…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Pill className="bg-[#FFF4EE] text-[#FF6B1A]">
                        {loading ? "…" : shops.length} Pending
                    </Pill>
                    <button
                        onClick={fetchPending}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-green-600 cursor-pointer transition-colors"
                        title="Refresh"
                    >
                        <FontAwesomeIcon icon={faRotate} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <PageCard>
                <TableHeader cols={["Shop Name / Owner", "Category", "Status", "Actions"]} />

                {loading && (
                    <div className="py-16 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
                        <FontAwesomeIcon icon={faRotate} className="animate-spin text-2xl text-green-500" />
                        Loading pending shops…
                    </div>
                )}

                {!loading && error && (
                    <div className="py-12 text-center text-red-500 text-sm">{error}</div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="py-16 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
                        <FontAwesomeIcon icon={faHourglass} className="text-3xl text-gray-300" />
                        {shops.length === 0
                            ? "No shops are pending approval right now."
                            : "No results match your search."}
                    </div>
                )}

                {!loading && !error && filtered.map((shop, idx) => (
                    <VerificationRow
                        key={shop.id}
                        shop={shop}
                        isLast={idx === filtered.length - 1}
                        onReview={setReviewShop}
                        onApprove={handleApprove}
                        approving={approving}
                    />
                ))}
            </PageCard>

            {/* Review modal */}
            <ReviewModal
                shop={reviewShop}
                onClose={() => setReviewShop(null)}
                onApprove={handleApprove}
                approving={approving === reviewShop?.id}
            />
        </div>
    );
}

export default VerificationQueue;
