import { useNavigate } from "react-router-dom";
import { FiGrid, FiClipboard, FiClock, FiStar, FiHome, FiBell, FiSettings, FiLogOut, FiCreditCard } from "react-icons/fi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { UPLOADS_URL } from "../../src/services/api";


const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <FiGrid /> },
  { id: "requests", label: "Service Requests", icon: <FiClipboard /> },
  { id: "repairs", label: "Active Repairs", icon: <HiOutlineWrenchScrewdriver /> },
  { id: "history", label: "Service History", icon: <FiClock /> },
  { id: "reviews", label: "Reviews & Ratings", icon: <FiStar /> },
  { id: "profile", label: "Shop Profile", icon: <FiHome /> },
  { id: "notifications", label: "Notifications", icon: <FiBell /> },
  { id: "billing",       label: "Billing",       icon: <FiCreditCard /> },
  { id: "settings",      label: "Settings",      icon: <FiSettings /> },
];

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="bg-green-600 text-white rounded-full text-[11px] font-bold py-0.5 px-[7px] min-w-[20px] text-center leading-[1.5]">
      {count}
    </span>
  );
}

function Sidebar({ activeNav, setActiveNav, shopData, requestCount, activeRepairCount, notificationCount, reviewCount, billingCount, isOpen = false, onClose }) {
  const navigate = useNavigate();

  const handleNav = (id) => {
    setActiveNav(id);
    if (onClose) onClose();
  };

  const handleSignOut = () => {
    const preserved = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("fixgo_read_notifs_")) {
            preserved[key] = localStorage.getItem(key);
        }
    }
    localStorage.clear();
    Object.entries(preserved).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
    if (onClose) onClose();
    navigate("/");
  };

  return (
    <aside 
      className={`w-[240px] h-[calc(100vh-65px)] bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.08)] fixed left-0 top-[65px] justify-between z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Shop Header */}
        <div className="pt-5 px-4 pb-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-[22px] shrink-0 overflow-hidden">
            <img
              src={
                shopData?.profileImageURL
                  ? `${UPLOADS_URL}/${shopData.profileImageURL}`
                  : "/default-shop.png"
              }
              alt="Shop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="font-bold text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {shopData?.name || "Shop"}
            </div>
            <div className="text-xs text-gray-500">
              {shopData?.categories || "No Category"}
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border-none cursor-pointer text-sm text-left transition-all duration-150 ease-in-out ${
                  isActive
                    ? "bg-[#F0FDF4] text-green-600 font-bold border-l-4 border-green-600"
                    : "bg-transparent text-gray-700 font-medium hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-lg flex items-center ${
                    isActive ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                <Badge
                  count={
                    item.id === "requests"
                      ? requestCount
                      : item.id === "repairs"
                      ? activeRepairCount
                      : item.id === "reviews"
                      ? reviewCount
                      : item.id === "notifications"
                      ? notificationCount
                      : item.id === "billing"
                      ? billingCount
                      : 0
                  }
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100 bg-white shrink-0">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border-none cursor-pointer bg-transparent text-gray-500 font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <FiLogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;


