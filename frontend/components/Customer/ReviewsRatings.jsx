import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faChevronDown,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
    green:     "#16A34A",
    greenBg:   "#EDF9F0",
    teal:      "#0D9488",
    tealBg:    "rgba(13,148,136,0.10)",
    blue:      "#2563EB",
    blueBg:    "#EDF3FF",
    violet:    "#A855F7",
    violetBg:  "#F5EDFF",
    yellow:    "#D97706",
    yellowBg:  "rgba(217,119,6,0.10)",
    amber:     "#F59E0B",
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

function StarDisplay({ rating, size = "sm" }) {
    const fontSize = size === "lg" ? 22 : 15;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{
                    fontSize,
                    color: rating >= s || (rating >= s - 0.5 && rating < s) ? T.amber : T.slate200,
                }}>★</span>
            ))}
        </div>
    );
}

function ReviewsRatings() {
    const [filter, setFilter] = useState("All Time");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                const res = await fetch("http://localhost:8000/api/getCustomerReviews.php", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setReviews(data.data || []);
            } catch (err) {
                console.error("Fetch reviews error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const totalReviews = reviews.length;

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <p style={{ fontSize: 13, color: T.slate500, fontFamily: T.font }}>Loading reviews…</p>
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
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.slate900, margin: 0 }}>Reviews & Ratings</h1>
                    <p style={{ color: T.slate500, marginTop: 6, marginBottom: 0, fontSize: 14 }}>
                        See your reviews and ratings for past services.
                    </p>
                </div>
            </div>

            {/* ── My Reviews list ── */}
            <div style={{ ...T.card, overflow: "hidden" }}>

                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${T.slate100}`,
                }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: T.slate900, margin: 0 }}>My Reviews</h2>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: T.slate50, border: `1px solid ${T.slate200}`,
                        borderRadius: 10, padding: "8px 12px", fontSize: 13,
                    }}>
                        <FontAwesomeIcon icon={faCalendarDays} style={{ color: T.slate400 }} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                border: "none", outline: "none",
                                fontSize: 13, color: T.slate700,
                                background: "transparent",
                                fontFamily: T.font, cursor: "pointer",
                            }}
                        >
                            <option>All Time</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, color: T.slate400 }} />
                    </div>
                </div>

                {totalReviews === 0 ? (
                    <div style={{ padding: "48px 24px", textAlign: "center" }}>
                        <p style={{ fontSize: 13, color: T.slate400, margin: 0 }}>You haven't left any reviews yet.</p>
                    </div>
                ) : (
                    reviews.map((review, idx) => {
                        const isLast = idx === reviews.length - 1;
                        return (
                            <div
                                key={review.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto 1fr",
                                    alignItems: "start",
                                    borderBottom: !isLast ? `1px solid ${T.slate100}` : "none",
                                }}
                            >
                                <div style={{ padding: "20px 20px 20px 24px", display: "flex", alignItems: "center" }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: "50%",
                                        background: T.greenBg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <FontAwesomeIcon icon={faWrench} style={{ fontSize: 20, color: T.green }} />
                                    </div>
                                </div>

                                <div style={{
                                    padding: "20px 20px 20px 0",
                                    borderRight: `1px solid ${T.slate100}`,
                                    display: "flex", flexDirection: "column", justifyContent: "center",
                                }}>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: T.slate900, margin: 0 }}>
                                        {review.issue_category || review.vehicle_brand || "Service"}
                                    </p>
                                    <p style={{ fontSize: 12, color: T.slate500, margin: "3px 0 0" }}>{review.shop_name}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: T.slate400 }}>
                                        <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: 11 }} />
                                        <span>{new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                    </div>
                                </div>

                                <div style={{
                                    padding: "20px 24px",
                                    borderRight: `1px solid ${T.slate100}`,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                }}>
                                    <p style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                        {Number(review.rating).toFixed(1)}
                                    </p>
                                    <div style={{ marginTop: 4 }}><StarDisplay rating={Number(review.rating)} /></div>
                                </div>

                                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center" }}>
                                    <p style={{
                                        fontSize: 13, color: T.slate700,
                                        lineHeight: 1.6, margin: 0,
                                        whiteSpace: "pre-line",
                                    }}>
                                        {review.comment || "No comment left."}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ReviewsRatings;
