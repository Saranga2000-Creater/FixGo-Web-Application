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

function Sidebar({ activeNav, setActiveNav, shopData, requestCount, activeRepairCount, notificationCount, reviewCount, billingCount }) {
  const handleNav = (id) => {
    setActiveNav(id);
  };

  return (
    // NOTE: top-[72px] and h-[calc(100vh-72px)] assume the site navbar above
    // this component is 72px tall. If the sidebar still overlaps the navbar
    // or leaves a gap, adjust the "72px" value(s) below to match the navbar's
    // actual height.
    <div className="w-[240px] h-[calc(100vh-72px)] bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.10)] fixed left-0 top-[72px] overflow-y-auto z-40">
      {/* Shop Header */}
      <div className="pt-5 px-4 pb-4 border-b border-gray-100 flex items-center gap-3">
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
              className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border-none cursor-pointer text-sm text-left ${
                isActive
                  ? "bg-[#F0FDF4] text-green-600 font-bold"
                  : "bg-transparent text-gray-700 font-medium"
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

      {/* Logout */}
      <div className="py-3 px-2 border-t border-gray-100">
        <button className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border-none cursor-pointer bg-transparent text-gray-500 font-medium text-sm">
          <FiLogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;


