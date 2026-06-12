import { useNavigate } from "react-router-dom";

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
    <span
      style={{
        background: "#EA580C",
        color: "#fff",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 7px",
        minWidth: 20,
        textAlign: "center",
        lineHeight: 1.5,
      }}
    >
      {count}
    </span>
  );
}

function Sidebar({ activeNav, setActiveNav }) {
  const handleNav = (id) => {
    setActiveNav(id);
  };

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #F3F4F6",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxShadow: "4px 0 24px rgba(0,0,0,0.10)",
      }}
    >
      {/* Shop Header */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#1F2937",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🚗
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Advanced Auto
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            Service Center
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background:
                activeNav === item.id ? "#FFF7ED" : "transparent",
              color:
                activeNav === item.id ? "#EA580C" : "#374151",
              fontWeight: activeNav === item.id ? 700 : 500,
              fontSize: 14,
              textAlign: "left",
              borderLeft:
                activeNav === item.id
                  ? "3px solid #EA580C"
                  : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 17 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            <Badge count={item.badge} />
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "12px 8px",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#6B7280",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 17 }}>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
