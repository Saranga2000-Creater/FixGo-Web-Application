const REVIEWS = [
  {
    id: 1, initials: "SJ", color: "#7C3AED", name: "Sanduni Jayawardhana",
    rating: 5, time: "2 days ago",
    comment: "Excellent service! They fixed my car quickly and the staff was very friendly.",
    replied: true
  },
  {
    id: 2, initials: "NC", color: "#059669", name: "Nimal C.",
    rating: 4, time: "5 days ago",
    comment: "Good experience. Fair pricing and quality work.",
    replied: true
  },
  {
    id: 3, initials: "KP", color: "#2563EB", name: "Kavindu Perera",
    rating: 5, time: "1 week ago",
    comment: "Very professional and transparent. Highly recommend Advanced Auto!",
    replied: true
  },
  {
    id: 4, initials: "MG", color: "#D97706", name: "Madushan G.",
    rating: 3, time: "1 week ago",
    comment: "Work was okay but it took longer than expected.",
    replied: false
  },
  {
    id: 5, initials: "TH", color: "#F59E0B", name: "Tharindu H.",
    rating: 4, time: "2 weeks ago",
    comment: "Good customer service and reasonable prices.",
    replied: true
  },
];

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
  const tabs = ["All Reviews (128)", "5 Stars (98)", "4 Stars (18)", "3 Stars (8)", "2 Stars (3)", "1 Star (1)"];
  const stats = [
    { label: "Average Rating", value: "4.8", sub: "(128 reviews)", subColor: "#6B7280", icon: "⭐" },
    { label: "Total Reviews",  value: "128", sub: "+12 this month", subColor: "#059669", icon: "💬" },
    { label: "5 Star Reviews", value: "98",  sub: "76.6% of all reviews", subColor: "#059669", icon: "🌟" },
  ];

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

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16, marginBottom: 24
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
            padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: "#6B7280", fontSize: 13 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ color: s.subColor, fontSize: 13, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
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
          {tabs.map((tab, i) => (
            <button key={tab} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: i === 0 ? "#FFF7ED" : "transparent",
              color: i === 0 ? "#16A34A" : "#6B7280",
              fontWeight: i === 0 ? 700 : 400,
              fontSize: 13, cursor: "pointer",
              borderBottom: i === 0 ? "2px solid #16A34A" : "none"
            }}>{tab}</button>
          ))}
        </div>

        {/* Review Items */}
        {REVIEWS.map((r, i) => (
          <div key={r.id} style={{
            padding: "18px 20px",
            borderBottom: i < REVIEWS.length - 1 ? "1px solid #F9FAFB" : "none"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Avatar initials={r.initials} color={r.color} />
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 6, flexWrap: "wrap"
                }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.name}</span>
                  <Stars count={r.rating} />
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>{r.rating}.0</span>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>· {r.time}</span>
                  {r.replied
                    ? <span style={{
                        background: "#DCFCE7", color: "#15803D",
                        borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600
                      }}>Replied</span>
                    : <button style={{
                        background: "transparent", border: "1px solid #D1D5DB",
                        borderRadius: 20, padding: "2px 12px",
                        fontSize: 12, cursor: "pointer", color: "#374151"
                      }}>Reply</button>
                  }
                </div>
                <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsRatings;
