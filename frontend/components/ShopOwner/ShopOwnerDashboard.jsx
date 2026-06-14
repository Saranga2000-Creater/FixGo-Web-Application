import { useState } from "react";
import Sidebar from "./Sidebar";
import ServiceRequests from "./ServiceRequests";
import ActiveRepairs from "./ActiveRepairs";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import ShopProfile from "./ShopProfile";
import Notification from "./Notification";
import Settings from "./Settings";

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
    { label: "New Requests", value: 12, sub: "+4 today", subColor: "#EA580C", icon: "📋" },
    { label: "Active Jobs", value: 8, sub: "View all", subColor: "#059669", icon: "🔧" },
    { label: "Completed Jobs", value: 54, sub: "+6 this week", subColor: "#059669", icon: "✅" },
    { label: "Average Rating", value: "4.8", sub: "(128 reviews)", subColor: "#6B7280", icon: "⭐" },
  ];
  const quickActions = [
    { label: "Add New Service", icon: "➕", bg: "#FFF7ED", iconBg: "#EA580C" },
    { label: "Update Availability", icon: "📅", bg: "#EFF6FF", iconBg: "#2563EB" },
    { label: "View Calendar", icon: "🗓️", bg: "#F0FDF4", iconBg: "#059669" },
    { label: "Download Report", icon: "📄", bg: "#F5F3FF", iconBg: "#7C3AED" },
  ];
  return (
    <div style={{ width: "100%", display: "block" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>
          Hello, Advanced Auto! 👋
        </h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 15 }}>
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
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
            padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: "#6B7280", fontSize: 13, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: s.subColor, fontSize: 13, marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: "#111827", marginBottom: 14 }}>
          Quick Actions
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", // Expanded action card min-width
          gap: 16,
          width: "100%"
        }}>
          {quickActions.map((a) => (
            <div
              key={a.label}
              style={{
                background: a.bg, borderRadius: 14, padding: "26px 20px",
                textAlign: "center", cursor: "pointer",
                border: "1px solid transparent", transition: "transform 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: a.iconBg,
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
        background: "#F9FAFB",
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
        {/* Top Bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #F3F4F6",
            padding: "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxSizing: "border-box",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#EA580C",
              }}
            >
              Fix
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#111827",
              }}
            >
              Go
            </span>
          </div>

          {/* Breadcrumb */}
          <div
            style={{
              fontSize: 14,
              color: "#9CA3AF",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Dashboard</span>

            {activeNav !== "dashboard" && (
              <>
                <span>›</span>
                <span
                  style={{
                    color: "#111827",
                    fontWeight: 500,
                  }}
                >
                  {currentLabel}
                </span>
              </>
            )}
          </div>

          {/* Right Side */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              May 25, 2026
            </span>

            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#FFF7ED",
                border: "1.5px solid #FED7AA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              🔔
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {renderPage(activeNav)}
        </div>
      </div>
    </div>
  );
}

export default ShopOwnerDashboard;