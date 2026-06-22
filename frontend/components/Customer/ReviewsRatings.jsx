import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faChevronDown,
    faClipboardList,
    faCommentDots,
    faOilCan,
    faStar,
    faWrench,
} from "@fortawesome/free-solid-svg-icons";

const ACCENT_STYLES = {
    green:  { bg: "bg-[#16a34a]/10", text: "text-[#16a34a]"  },
    teal:   { bg: "bg-[#0d9488]/10", text: "text-[#0d9488]"  },
    blue:   { bg: "bg-[#2563eb]/10", text: "text-[#2563eb]"  },
    violet: { bg: "bg-[#a855f7]/10", text: "text-[#a855f7]"  },
    yellow: { bg: "bg-[#d97706]/10", text: "text-[#d97706]"  },
};

const RATING_BREAKDOWN = [
    { stars: 5, count: 8, pct: 67 },
    { stars: 4, count: 3, pct: 25 },
    { stars: 3, count: 1, pct: 8  },
    { stars: 2, count: 0, pct: 0  },
    { stars: 1, count: 0, pct: 0  },
];

const MY_REVIEWS = [
    { id: 1, title: "Engine Overheating",    shop: "Advanced Auto Service Center", date: "May 25, 2026", rating: 5.0, comment: "Excellent service! The team was professional and fixed the issue quickly. Very satisfied.", icon: faWrench,        accent: "green"  },
    { id: 2, title: "Brake Pad Replacement", shop: "QuickFix Auto Care",           date: "Mar 12, 2026", rating: 4.5, comment: "Good service and on-time delivery.\nStaff is polite.",                                   icon: faClipboardList, accent: "blue"   },
    { id: 3, title: "Oil Change & Filter",   shop: "Advanced Auto Service Center", date: "Jan 18, 2026", rating: 5.0, comment: "Very happy with the service quality.\nHighly recommend!",                                icon: faOilCan,        accent: "teal"   },
    { id: 4, title: "General Checkup",       shop: "AutoCare Plus",                date: "Nov 05, 2025", rating: 4.0, comment: "Nice experience overall.\nWill use FixGo again.",                                        icon: faClipboardList, accent: "violet" },
];

function StarDisplay({ rating, size = "sm" }) {
    const sizeClass = size === "lg" ? "text-2xl" : "text-base";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={`${sizeClass} ${rating >= s || (rating >= s - 0.5 && rating < s) ? "text-amber-400" : "text-[#d1e7d7]"}`}
                >★</span>
            ))}
        </div>
    );
}

function ReviewsRatings() {
    const [filter, setFilter] = useState("All Time");

    return (
        <div className="space-y-5">
            <section>
                <h1 className="text-[28px] font-semibold tracking-tight text-[#14532d]">Reviews & Ratings</h1>
                <p className="mt-2 text-sm font-mono text-[#274c3a]/60">See your reviews and ratings for past services.</p>
            </section>

            <section className="rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex flex-col items-center justify-center md:w-48">
                        <p className="text-6xl font-bold text-[#14532d]">4.8</p>
                        <StarDisplay rating={4.8} size="lg" />
                        <p className="mt-2 text-sm font-mono text-[#274c3a]/60">Based on 12 reviews</p>
                    </div>

                    <div className="flex-1 space-y-2">
                        {RATING_BREAKDOWN.map((row) => (
                            <div key={row.stars} className="flex items-center gap-3">
                                <span className="w-12 shrink-0 text-sm font-mono text-[#274c3a]/70">{row.stars} {row.stars === 1 ? "Star" : "Stars"}</span>
                                <div className="flex-1 overflow-hidden rounded-full bg-[#d1e7d7]/40 h-2.5">
                                    <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${row.pct}%` }} />
                                </div>
                                <span className="w-4 shrink-0 text-right text-sm font-mono text-[#14532d]">{row.count}</span>
                                <span className="w-10 shrink-0 text-right text-sm font-mono text-[#274c3a]/40">({row.pct}%)</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 md:w-36">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a855f7]/10">
                            <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-[#a855f7]" />
                        </div>
                        <p className="text-4xl font-bold text-[#14532d]">12</p>
                        <p className="text-sm font-mono text-[#274c3a]/60">Total Reviews</p>
                    </div>
                </div>
            </section>

            <section className="rounded-[28px] border border-[#d1e7d7] bg-white shadow-[0_4px_12px_rgb(22,163,74,0.06)]">
                <div className="flex items-center justify-between border-b border-[#d1e7d7]/60 px-6 py-4">
                    <h2 className="text-base font-semibold text-[#14532d]">My Reviews</h2>
                    <div className="flex items-center gap-2 rounded-xl border border-[#d1e7d7] bg-[#f0f7f2] px-3 py-2 text-sm text-[#274c3a]">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-[#16a34a]/50" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-transparent pr-4 text-sm font-mono text-[#274c3a] focus:outline-none"
                        >
                            <option>All Time</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                            <option>This Year</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none -ml-3 text-xs text-[#16a34a]/50" />
                    </div>
                </div>

                {MY_REVIEWS.map((review, idx) => {
                    const a = ACCENT_STYLES[review.accent];
                    const isLast = idx === MY_REVIEWS.length - 1;
                    return (
                        <div key={review.id} className={`grid grid-cols-[auto_1fr_auto_1fr] items-start gap-0 ${!isLast ? "border-b border-[#d1e7d7]/60" : ""}`}>
                            <div className="flex items-center px-6 py-5">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${a.bg}`}>
                                    <FontAwesomeIcon icon={review.icon} className={`text-xl ${a.text}`} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center border-r border-[#d1e7d7]/60 py-5 pr-6">
                                <p className="text-sm font-semibold text-[#14532d]">{review.title}</p>
                                <p className="mt-0.5 text-xs font-mono text-[#274c3a]/60">{review.shop}</p>
                                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono text-[#274c3a]/60">
                                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#16a34a]/50" />
                                    <span>{review.date}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center px-8 py-5 border-r border-[#d1e7d7]/60">
                                <p className="text-2xl font-bold text-[#14532d]">{review.rating.toFixed(1)}</p>
                                <StarDisplay rating={review.rating} />
                            </div>
                            <div className="flex items-center py-5 pr-6 pl-6">
                                <p className="text-sm font-mono leading-5 text-[#274c3a]/70 whitespace-pre-line">{review.comment}</p>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

export default ReviewsRatings;