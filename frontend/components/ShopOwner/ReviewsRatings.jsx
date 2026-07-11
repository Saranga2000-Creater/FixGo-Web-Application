import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api";

const AVATAR_COLORS = ["#7C3AED", "#059669", "#2563EB", "#D97706", "#F59E0B", "#DB2777", "#0891B2"];

function getShopIdFromToken() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.shop_id ?? payload.id ?? payload.user_id ?? null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

function getColorForName(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString.replace(" ", "T"));
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function Avatar({ initials, color, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color + "22", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.33, flexShrink: 0,
      border: `1.5px solid ${color}44`
    }}>
      {initials}
    </div>
  );
}

function Stars({ count, max = 5, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#F59E0B" : "#D1D5DB", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function ReviewsRatings() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shopId = getShopIdFromToken();
    const token = localStorage.getItem("jwt_token");

    if (!shopId) {
      setError("Could not determine shop id.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/getShopReviews.php?shop_id=${shopId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.success) {
          setError(data?.message || "Failed to load reviews.");
          return;
        }

        setReviews(data.data || []);
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);
      })
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
  }));

  const tabs = [
    { label: `All Reviews (${totalReviews})`, value: "All" },
    ...starCounts.map(({ star, count }) => ({
      label: `${star} Star${star !== 1 ? "s" : ""} (${count})`,
      value: star,
    })),
  ];

  const filteredReviews = activeTab === "All"
    ? reviews
    : reviews.filter((r) => Number(r.rating) === activeTab);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Reviews & Ratings
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>
          See what your customers are saying about your service.
        </p>
      </div>

      {/* Summary Card */}
      <div style={{
        background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
        padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 140 }}>
          <p style={{ fontSize: 56, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1 }}>
            {totalReviews > 0 ? Number(averageRating).toFixed(1) : "0.0"}
          </p>
          <div style={{ marginTop: 8 }}>
            <Stars count={Math.round(Number(averageRating))} size={22} />
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6, marginBottom: 0 }}>
            Based on {totalReviews} reviews
          </p>
        </div>

        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
          {starCounts.map((row) => {
            const pct = totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0;
            return (
              <div key={row.star} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 52, flexShrink: 0, fontSize: 13, color: "#6B7280" }}>
                  {row.star} {row.star === 1 ? "Star" : "Stars"}
                </span>
                <div style={{
                  flex: 1, height: 8, borderRadius: 99,
                  background: "#F3F4F6", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 99,
                    background: "#16A34A", width: `${pct}%`,
                  }} />
                </div>
                <span style={{ width: 16, textAlign: "right", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                  {row.count}
                </span>
                <span style={{ width: 48, textAlign: "right", fontSize: 13, color: "#9CA3AF" }}>
                  ({pct}%)
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 120 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "#F5EDFF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>💬</span>
          </div>
          <p style={{ fontSize: 36, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1 }}>
            {totalReviews}
          </p>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Total Reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{
        background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        {/* Tabs */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #F3F4F6",
          display: "flex", gap: 6, flexWrap: "wrap"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "none",
                background: activeTab === tab.value ? "#FFF7ED" : "transparent",
                color: activeTab === tab.value ? "#16A34A" : "#6B7280",
                fontWeight: activeTab === tab.value ? 700 : 400,
                fontSize: 13, cursor: "pointer",
                borderBottom: activeTab === tab.value ? "2px solid #16A34A" : "none"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Review Items */}
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
            Loading reviews...
          </div>
        ) : error ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#DC2626", fontSize: 14 }}>
            {error}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
            No reviews to show.
          </div>
        ) : (
          filteredReviews.map((r, i) => {
            const initials = getInitials(r.customer_name);
            const color = getColorForName(r.customer_name);

            return (
              <div key={r.id} style={{
                padding: "18px 20px",
                borderBottom: i < filteredReviews.length - 1 ? "1px solid #F9FAFB" : "none"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar initials={initials} color={color} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      marginBottom: 6, flexWrap: "wrap"
                    }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.customer_name}</span>
                      <Stars count={r.rating} />
                      <span style={{ fontSize: 13, color: "#9CA3AF" }}>{r.rating}.0</span>
                      <span style={{ fontSize: 13, color: "#9CA3AF" }}>· {timeAgo(r.created_at)}</span>
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{r.comment}</p>
                    )}
                  </div>
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

