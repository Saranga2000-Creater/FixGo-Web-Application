import { useNavigate } from "react-router-dom";
import { FiGrid, FiClipboard, FiClock, FiStar, FiHome, FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
  { id: "requests", label: "Service Requests", icon: <FiClipboard /> },
  { id: "repairs", label: "Active Repairs", icon: <HiOutlineWrenchScrewdriver /> },
  { id: "history", label: "Service History", icon: <FiClock /> },
  { id: "reviews", label: "Reviews & Ratings", icon: <FiStar /> },
  { id: "profile", label: "Shop Profile", icon: <FiHome /> },
  { id: "notifications", label: "Notifications", icon: <FiBell /> },
  { id: "settings", label: "Settings", icon: <FiSettings /> },
];

function Badge({ count }) {
  if (!count) return null;
  return (
    <span
      style={{
        background: "#16A34A",
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

function Sidebar({ activeNav, setActiveNav,shopData,requestCount, activeRepairCount, notificationCount }) {
  const handleNav = (id) => {
    setActiveNav(id);
  };

  return (
    <div
  style={{
    width: "240px",
    minHeight: "100vh",
    background: "#fff",
    borderRight: "1px solid #F3F4F6",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    boxShadow: "4px 0 24px rgba(0,0,0,0.10)",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
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
          <img
    src={
      shopData?.profileImageURL
        ? `http://localhost:8000/${shopData.profileImageURL}`
        : "/default-shop.png"
    }
    alt="Shop"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
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
           {shopData?.name || "Shop"} 
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
             {shopData?.categories || "No Category"}
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
                activeNav === item.id ? "#F0FDF4" : "transparent",
              color:
                activeNav === item.id ? "#16A34A" : "#374151",
              fontWeight: activeNav === item.id ? 700 : 500,
              fontSize: 14,
              textAlign: "left",
              
            }}
          >
            <span
  style={{
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    color: activeNav === item.id ? "#16A34A" : "#6B7280",
  }}
>
  {item.icon}
</span>
            <span style={{ flex: 1 }}>{item.label}</span>
<Badge
  count={
    item.id === "requests"
      ? requestCount
      : item.id === "repairs"
      ? activeRepairCount
      : item.id === "notifications"
      ? notificationCount
      : 0
  }
/>
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
          
          <FiLogOut size={18} />Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
