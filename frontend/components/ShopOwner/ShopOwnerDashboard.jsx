import { useState } from "react";
import Sidebar from "./Sidebar";
import ServiceRequests from "./ServiceRequests";
import ActiveRepairs from "./ActiveRepairs";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import ShopProfile from "./ShopProfile";
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

// ── Notifications View (Forced Full Width) ──────────────────────────────────
function NotificationsView() {
  const items = [
    { icon: "📋", title: "New service request from Sanduni J.", desc: "Toyota Prius · Engine Overheating", time: "10 min ago", unread: true },
    { icon: "🔧", title: "Repair completed for Kavindu P.", desc: "Honda Fit · Oil Change", time: "1 hr ago", unread: true },
    { icon: "⭐", title: "New 5-star review from Sanduni Jayawardhana", desc: '"Excellent service!"', time: "2 hrs ago", unread: false },
    { icon: "📋", title: "New service request from Nimal C.", desc: "Suzuki Alto · Brake Pad Replacement", time: "3 hrs ago", unread: false },
    { icon: "💬", title: "Message from Madushan G.", desc: "Query about clutch repair estimate.", time: "5 hrs ago", unread: false },
  ];
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Notifications</h1>
        <p style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>Stay updated with your shop activity.</p>
      </div>
      <div style={{
        background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", width: "100%"
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: "16px 20px",
            borderBottom: i < items.length - 1 ? "1px solid #F9FAFB" : "none",
            display: "flex", gap: 14, alignItems: "flex-start",
            background: item.unread ? "#FFF7ED" : "transparent"
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: item.unread ? "#FDBA74" : "#F3F4F6",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0
            }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: item.unread ? 700 : 500, fontSize: 14, color: "#111827" }}>
                {item.title}
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{item.desc}</div>
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{item.time}</div>
            {item.unread && (
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#EA580C", marginTop: 6, flexShrink: 0
              }} />
            )}
          </div>
        ))}
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
    case "notifications": return <NotificationsView />;
    case "settings":      return <Settings />;
    default:              return <DashboardView />;
  }
}

// ── Main Layout (Guaranteed Spanning Layout) ──────────────────────────────────
function ShopOwnerDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLabel = NAV_ITEMS.find(n => n.id === activeNav)?.label || "Dashboard";

  return (
    <div style={{
      display: "flex", 
      width: "100vw",               // Forces visual window track expansion
      minHeight: "100vh", 
      background: "#F9FAFB",
      fontFamily: "'Segoe UI', system-ui, sans-serif", 
      position: "relative",
      boxSizing: "border-box"
    }}>
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Workspace Column */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        minWidth: 0,
        width: "100%" 
      }}>

        {/* Top Bar Navigation UI */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #F3F4F6",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 30,
          width: "100%",
          boxSizing: "border-box"
        }}>
          {/* Hamburger Icon */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 8px", borderRadius: 8,
              display: "flex", flexDirection: "column", gap: 5, flexShrink: 0
            }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#374151", borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#374151", borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#374151", borderRadius: 2 }} />
          </button>

          {/* Brand Logo Elements */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#EA580C", letterSpacing: "-0.5px" }}>Fix</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: "#111827", letterSpacing: "-0.5px" }}>Go</span>
          </div>

          {/* Breadcrumb Indicator */}
          <div style={{ fontSize: 14, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 6 }}>
            <span>Dashboard</span>
            {activeNav !== "dashboard" && (
              <>
                <span>›</span>
                <span style={{ color: "#111827", fontWeight: 500 }}>{currentLabel}</span>
              </>
            )}
          </div>

          {/* Right side Metadata utilities */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, color: "#6B7280" }}>May 25, 2026</span>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#FFF7ED", border: "1.5px solid #FED7AA",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, cursor: "pointer"
            }}>🔔</div>
          </div>
        </div>

        {/* Outer Workspace Content Frame wrapper - Configured to force full width scaling */}
        <div style={{ 
          flex: 1, 
          padding: "32px", 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch", // Forces layout components to pull out to the left/right container edges
          width: "100%",
          boxSizing: "border-box"
        }}>
          {renderPage(activeNav)}
        </div>
      </div>
    </div>
  );
}

export default ShopOwnerDashboard;