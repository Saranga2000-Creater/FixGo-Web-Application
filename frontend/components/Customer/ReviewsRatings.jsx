import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faChevronDown,
    faClipboardList,
    faCommentDots,
    faOilCan,
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

const ACCENT = {
    green:  { iconBg: T.greenBg,  iconColor: T.green  },
    teal:   { iconBg: T.tealBg,   iconColor: T.teal   },
    blue:   { iconBg: T.blueBg,   iconColor: T.blue   },
    violet: { iconBg: T.violetBg, iconColor: T.violet },
    yellow: { iconBg: T.yellowBg, iconColor: T.yellow },
};

const RATING_BREAKDOWN = [
    { stars: 5, count: 8,  pct: 67 },
    { stars: 4, count: 3,  pct: 25 },
    { stars: 3, count: 1,  pct: 8  },
    { stars: 2, count: 0,  pct: 0  },
    { stars: 1, count: 0,  pct: 0  },
];

const MY_REVIEWS = [
    { id: 1, title: "Engine Overheating",    shop: "Advanced Auto Service Center", date: "May 25, 2026", rating: 5.0, comment: "Excellent service! The team was professional and fixed the issue quickly. Very satisfied.", icon: faWrench,        accent: "green"  },
    { id: 2, title: "Brake Pad Replacement", shop: "QuickFix Auto Care",           date: "Mar 12, 2026", rating: 4.5, comment: "Good service and on-time delivery.\nStaff is polite.",                                   icon: faClipboardList, accent: "blue"   },
    { id: 3, title: "Oil Change & Filter",   shop: "Advanced Auto Service Center", date: "Jan 18, 2026", rating: 5.0, comment: "Very happy with the service quality.\nHighly recommend!",                                icon: faOilCan,        accent: "teal"   },
    { id: 4, title: "General Checkup",       shop: "AutoCare Plus",                date: "Nov 05, 2025", rating: 4.0, comment: "Nice experience overall.\nWill use FixGo again.",                                        icon: faClipboardList, accent: "violet" },
];

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

            {/* ── Summary card ── */}
            <div style={{ ...T.card, padding: 24 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32 }}>

                    {/* Average score */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 140 }}>
                        <p style={{ fontSize: 56, fontWeight: 700, color: T.slate900, margin: 0, lineHeight: 1 }}>4.8</p>
                        <div style={{ marginTop: 8 }}><StarDisplay rating={4.8} size="lg" /></div>
                        <p style={{ fontSize: 13, color: T.slate500, marginTop: 6, marginBottom: 0 }}>Based on 12 reviews</p>
                    </div>

                    {/* Rating breakdown bars */}
                    <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
                        {RATING_BREAKDOWN.map((row) => (
                            <div key={row.stars} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ width: 52, flexShrink: 0, fontSize: 13, color: T.slate500 }}>
                                    {row.stars} {row.stars === 1 ? "Star" : "Stars"}
                                </span>
                                <div style={{
                                    flex: 1, height: 8, borderRadius: 99,
                                    background: T.slate100, overflow: "hidden",
                                }}>
                                    <div style={{
                                        height: "100%", borderRadius: 99,
                                        background: T.green, width: `${row.pct}%`,
                                    }} />
                                </div>
                                <span style={{ width: 16, textAlign: "right", fontSize: 13, fontWeight: 600, color: T.slate900 }}>{row.count}</span>
                                <span style={{ width: 44, textAlign: "right", fontSize: 13, color: T.slate400 }}>({row.pct}%)</span>
                            </div>
                        ))}
                    </div>

                    {/* Total reviews */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 120 }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: "50%",
                            background: T.violetBg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: 22, color: T.violet }} />
                        </div>
                        <p style={{ fontSize: 36, fontWeight: 700, color: T.slate900, margin: 0, lineHeight: 1 }}>12</p>
                        <p style={{ fontSize: 13, color: T.slate500, margin: 0 }}>Total Reviews</p>
                    </div>
                </div>
            </div>

            {/* ── My Reviews list ── */}
            <div style={{ ...T.card, overflow: "hidden" }}>

                {/* Card header with filter */}
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

                {/* Review rows */}
                {MY_REVIEWS.map((review, idx) => {
                    const a      = ACCENT[review.accent];
                    const isLast = idx === MY_REVIEWS.length - 1;

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
                            {/* Icon */}
                            <div style={{ padding: "20px 20px 20px 24px", display: "flex", alignItems: "center" }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: "50%",
                                    background: a.iconBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <FontAwesomeIcon icon={review.icon} style={{ fontSize: 20, color: a.iconColor }} />
                                </div>
                            </div>

                            {/* Title + shop + date */}
                            <div style={{
                                padding: "20px 20px 20px 0",
                                borderRight: `1px solid ${T.slate100}`,
                                display: "flex", flexDirection: "column", justifyContent: "center",
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: T.slate900, margin: 0 }}>{review.title}</p>
                                <p style={{ fontSize: 12, color: T.slate500, margin: "3px 0 0" }}>{review.shop}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: T.slate400 }}>
                                    <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: 11 }} />
                                    <span>{review.date}</span>
                                </div>
                            </div>

                            {/* Star rating */}
                            <div style={{
                                padding: "20px 24px",
                                borderRight: `1px solid ${T.slate100}`,
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <p style={{ fontSize: 24, fontWeight: 700, color: T.slate900, margin: 0 }}>
                                    {review.rating.toFixed(1)}
                                </p>
                                <div style={{ marginTop: 4 }}><StarDisplay rating={review.rating} /></div>
                            </div>

                            {/* Comment */}
                            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center" }}>
                                <p style={{
                                    fontSize: 13, color: T.slate700,
                                    lineHeight: 1.6, margin: 0,
                                    whiteSpace: "pre-line",
                                }}>
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ReviewsRatings;
