const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", badge: null },
  { id: "requests", label: "Service Requests", icon: "📋", badge: 12 },
  { id: "repairs", label: "Active Repairs", icon: "🔧", badge: 8 },
  { id: "history", label: "Service History", icon: "🕐", badge: null },
  { id: "reviews", label: "Reviews & Ratings", icon: "⭐", badge: null },
  { id: "profile", label: "Shop Profile", icon: "🏪", badge: null },
  { id: "notifications", label: "Notifications", icon: "🔔", badge: 5 },
  { id: "settings", label: "Settings", icon: "⚙️", badge: null },
];

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: "#EA580C", color: "#fff", borderRadius: 99,
      fontSize: 11, fontWeight: 700, padding: "2px 7px", minWidth: 20,
      textAlign: "center", lineHeight: 1.5
    }}>{count}</span>
  );
}

function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const handleNav = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)", zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100vh", width: 240,
        background: "#fff", borderRight: "1px solid #F3F4F6",
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 50,
        boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.10)" : "none"
      }}>
        {/* Shop Header */}
        <div style={{
          padding: "20px 16px 16px", borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "#1F2937",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0
          }}>🚗</div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: 14, color: "#111827",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>Advanced Auto</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Service Center</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <span style={{ color: "#F59E0B", fontSize: 12 }}>★</span>
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>4.8</span>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>(128)</span>
              <span style={{
                background: "#DCFCE7", color: "#15803D", borderRadius: 20,
                padding: "1px 7px", fontSize: 10, fontWeight: 700
              }}>✓ Verified</span>
            </div>
          </div>
          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              fontSize: 20, cursor: "pointer", color: "#9CA3AF",
              padding: 4, borderRadius: 6, flexShrink: 0
            }}
            aria-label="Close sidebar"
          >✕</button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: activeNav === item.id ? "#FFF7ED" : "transparent",
                color: activeNav === item.id ? "#EA580C" : "#374151",
                fontWeight: activeNav === item.id ? 700 : 500,
                fontSize: 14, marginBottom: 2, textAlign: "left",
                borderLeft: activeNav === item.id ? "3px solid #EA580C" : "3px solid transparent",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <Badge count={item.badge} />
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #F3F4F6" }}>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "#6B7280", fontWeight: 500, fontSize: 14
          }}>
            <span style={{ fontSize: 17 }}>🚪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
