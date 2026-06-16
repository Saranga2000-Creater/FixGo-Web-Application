import { useState } from "react";
import Sidebar from "./Sidebar";
import ServiceRequests from "./ServiceRequests";
import ActiveRepairs from "./ActiveRepairs";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import ShopProfile from "./ShopProfile";
import Notification from "./Notification";
import Settings from "./Settings";
import { Footer } from "../Footer";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "requests", label: "Service Requests", icon: "📋" },
  { id: "repairs", label: "Active Repairs", icon: "🔧" },
  { id: "history", label: "Service History", icon: "🕐" },
  { id: "reviews", label: "Reviews & Ratings", icon: "⭐" },
  { id: "profile", label: "Shop Profile", icon: "🏪" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ── Dashboard View (Forced Full Width) ──────────────────────────────────────
function DashboardView() {
  const stats = [
    { label: "New Requests", value: 12, sub: "+4 today", subColor: "#16A34A", icon: "📋" },
    { label: "Active Jobs", value: 8, sub: "View all", subColor: "#059669", icon: "🔧" },
    { label: "Completed Jobs", value: 54, sub: "+6 this week", subColor: "#059669", icon: "✅" },
    { label: "Average Rating", value: "4.8", sub: "(128 reviews)", subColor: "#6B7280", icon: "⭐" },
  ];
  const quickActions = [
  {
    label: "Add New Service",
    icon: "➕",
    bg: "#FFFFFF",
    iconBg: "#16A34A",
  },
  {
    label: "Update Availability",
    icon: "📅",
    bg: "#FFFFFF",
    iconBg: "#16A34A",
  },
  {
    label: "View Calendar",
    icon: "🗓️",
    bg: "#FFFFFF",
    iconBg: "#16A34A",
  },
];
  return (
    <div style={{ width: "100%", display: "block" }}>
  <div
  style={{
    background: "linear-gradient(180deg, #EEF7F0, #FFFFFF)",
    borderRadius: 18,
    padding: "24px",
    marginBottom: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    }}
  >
    <h1
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: "#111827",
        margin: 0,
      }}
    >
      Hello, Advanced Auto! 👋
    </h1>

    <span
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: "#374151",
        background: "#FFFFFF",
        padding: "10px 16px",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
      }}
    >
      June 15, 2026
    </span>
  </div>

  <p
    style={{
      color: "#6B7280",
      marginTop: 8,
      marginBottom: 0,
      fontSize: 15,
    }}
  >
    Here's what's happening at your shop today.
  </p>
</div>

      {/* Stat Cards Layout - Using custom grids designed to dynamically span your monitor size */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Expanded width bounds
        gap: 20, 
        marginBottom: 32,
        width: "100%"
      }}>
        {stats.map((s) => (
           <div
    key={s.label}
    style={{
      background: "#FFFFFF",
      borderRadius: 18,
      border: "1px solid #E7EFE8",
      padding: "20px 24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      transition: "all 0.25s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
  e.currentTarget.style.boxShadow =
    "0 10px 24px rgba(0,0,0,0.08)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0) scale(1)";
  e.currentTarget.style.boxShadow =
    "0 4px 12px rgba(0,0,0,0.05)";
}}
  >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: s.subColor, fontSize: 13, marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div
  style={{
    width: 60,
    height: 4,
    background: "#16A34A",
    borderRadius: 999,
    marginBottom: 12,
  }}
/>
        <h2
  style={{
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 18,
  }}
>
  Quick Actions
</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          width: "100%"
        }}>
          {quickActions.map((a) => (
            <div
              key={a.label}
              style={{
  background: a.bg,
  borderRadius: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  padding: "32px 24px",
  textAlign: "center",
  cursor: "pointer",
  border: "1px solid #E5E7EB",
  transition: "all 0.2s ease",
}}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{
                width: 48, height: 48,borderRadius: 18,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", background: a.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, margin: "0 auto 12px"
              }}>{a.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



function renderPage(activeNav) {
  switch (activeNav) {
    case "dashboard":     return <DashboardView />;
    case "requests":      return <ServiceRequests />;
    case "repairs":       return <ActiveRepairs />;
    case "history":       return <ServiceHistory />;
    case "reviews":       return <ReviewsRatings />;
    case "profile":       return <ShopProfile />;
    case "notifications": return <Notification />; 
    case "settings":      return <Settings />;
    default:              return <DashboardView />;
  }
}

// ── Main Layout (Guaranteed Spanning Layout) ──────────────────────────────────
function ShopOwnerDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const currentLabel =
    NAV_ITEMS.find((n) => n.id === activeNav)?.label || "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:"#F4F8F5",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
       

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            padding: " 16px 24px",
            overflowY: "auto",
            boxSizing: "border-box",
            background: "#F4F8F5",
          }}
        >
          {renderPage(activeNav)}
        
        </div>

      </div>
    </div>

  );
}

export default ShopOwnerDashboard;