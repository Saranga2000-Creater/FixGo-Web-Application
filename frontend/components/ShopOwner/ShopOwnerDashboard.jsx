import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ServiceRequests from "./ServiceRequests";
import ActiveRepairs from "./ActiveRepairs";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import ShopProfile from "./ShopProfile";
import Notification from "./Notification";
import Settings from "./Settings";
import Billing from "./Billing";
import { api } from "../../src/services/api";




const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "requests", label: "Service Requests", icon: "📋" },
  { id: "repairs", label: "Active Repairs", icon: "🔧" },
  { id: "history", label: "Service History", icon: "🕐" },
  { id: "reviews", label: "Reviews & Ratings", icon: "⭐" },
  { id: "profile", label: "Shop Profile", icon: "🏪" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ── Dashboard View (Forced Full Width) ──────────────────────────────────────
function DashboardView({ shopData, requestCount, activeRepairCount, completedJobCount })  {
  const stats = [
    { label: "New Requests", value: requestCount, sub: "Pending requests", subColor: "text-green-600", icon: "📋" },
    { label: "Active Jobs", value: activeRepairCount, sub: "View all", subColor: "text-emerald-600", icon: "🔧" },
    { label: "Completed Jobs", value: completedJobCount, sub: "+6 this week", subColor: "text-emerald-600", icon: "✅" },
    { label: "Average Rating", value: "4.8", sub: "(128 reviews)", subColor: "text-gray-500", icon: "⭐" },
  ];
  const quickActions = [
    { label: "Add New Service", icon: "➕" },
    { label: "Update Availability", icon: "📅" },
    { label: "View Calendar", icon: "🗓️" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full block">
      <div className="bg-gradient-to-b from-[#EEF7F0] to-white rounded-[18px] p-6 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-[28px] font-bold text-gray-900 m-0">
            Hello, {shopData?.name || "Shop"}! 👋
          </h1>

          <span className="text-sm font-semibold text-gray-700 bg-white py-2.5 px-4 rounded-xl border border-gray-200">
            {currentDate}
          </span>
        </div>

        <p className="text-gray-500 mt-2 mb-0 text-[15px]">
          Here's what's happening at your shop today.
        </p>
      </div>

      {/* Stat Cards Layout - Using custom grids designed to dynamically span your monitor size */}
      <div className="grid gap-5 mb-8 w-full [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-[18px] border border-[#E7EFE8] py-5 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-[250ms] ease-in-out cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-gray-500 text-[13px] mb-1">{s.label}</div>
            <div className="text-[32px] font-bold text-gray-900 leading-none">{s.value}</div>
            <div className={`text-[13px] mt-1.5 ${s.subColor}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="w-[60px] h-1 bg-green-600 rounded-full mb-3" />
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-4 w-full">
          {quickActions.map((a) => (
            <div
              key={a.label}
              className="bg-white rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-8 px-6 text-center cursor-pointer border border-gray-200 transition-transform duration-200 ease-in-out hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-green-600 flex items-center justify-center text-[22px] mx-auto mb-3">
                {a.icon}
              </div>
              <div className="font-semibold text-sm text-gray-900">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



function renderPage(
    activeNav,
    shopData,
    requestCount,
    activeRepairCount,
    completedJobCount,
    setActiveNav,
    fetchRequestCount
)  {
  switch (activeNav) {
       case "dashboard":  return (<DashboardView shopData={shopData}requestCount={requestCount} activeRepairCount={activeRepairCount} completedJobCount={completedJobCount}/>);
    case "requests":      return <ServiceRequests
  shopCategory={shopData?.categories}
  shopCoordinates={{
    lat: shopData?.latitude,
    lng: shopData?.longitude
  }}
  fetchRequestCount={fetchRequestCount}
/>;
    case "repairs":       return <ActiveRepairs />;
    case "history":       return <ServiceHistory />;
    case "reviews":       return <ReviewsRatings />;
    case "profile":       return <ShopProfile />;
    case "notifications":
    return (
        <Notification
            setActiveNav={setActiveNav}
        />
    );
    case "settings":      return <Settings />;
    case "billing":       return <Billing />;
    default:              return <DashboardView />;
  }
}

// ── Main Layout (Guaranteed Spanning Layout) ──────────────────────────────────
function ShopOwnerDashboard() {
  console.log("ShopOwnerDashboard rendered");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [shopData, setShopData] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [activeRepairCount, setActiveRepairCount] = useState(0);
  const [completedJobCount, setCompletedJobCount] = useState(0); 
  const [notificationCount, setNotificationCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

const fetchRequestCount = () => {
  api.get("getServiceRequests.php")
    .then((data) => {
      if (data.success) {
        const pendingCount = data.data.filter(
          request => request.status === "Pending"
        ).length;
        setRequestCount(pendingCount);
      }
    })
    .catch((err) => console.error(err));
};

useEffect(() => {
  fetchRequestCount();
}, []);

useEffect(() => {
  api.get("getServiceHistory.php")
    .then((data) => {
      if (data.success) {
        setCompletedJobCount(data.data.length);
      }
    })
    .catch((err) => console.error(err));
}, []);

useEffect(() => {
    const loadNotificationCount = () => {
        api.get("getNotifications.php")
        .then(data => {
            if (data.success) {
                const unread = data.data.filter(
                    n => Number(n.isRead) === 0
                ).length;
                setNotificationCount(unread);
            }
        })
        .catch(console.error);
    };

    loadNotificationCount();
    const interval = setInterval(loadNotificationCount, 5000);
    return () => clearInterval(interval);
}, []);

useEffect(() => {
  api.get("getShopProfile.php")
    .then((data) => {
      if (data.success) {
        setShopData(data.data);
      } else {
        console.error(data.message);
      }
    })
    .catch((err) => console.error(err));
}, []);

useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const shopId = JSON.parse(atob(token.split(".")[1])).shop_id;
    api.get(`getShopReviews.php?shop_id=${shopId}`)
        .then(data => {
            if (data.success) {
                setReviewCount(data.total_reviews);
            }
        })
        .catch(console.error);
}, []);

 
    const currentLabel =
    NAV_ITEMS.find((n) => n.id === activeNav)?.label || "Dashboard";
  return (
    <div className="flex min-h-screen bg-slate-50">
     <Sidebar
  activeNav={activeNav}
  setActiveNav={setActiveNav}
  shopData={shopData}
  requestCount={requestCount}
  activeRepairCount={activeRepairCount}
  notificationCount={notificationCount}
  reviewCount={reviewCount}
/>

      <main className="flex-1 p-6 ml-[240px]">
        {renderPage(
    activeNav,
    shopData,
    requestCount,
    activeRepairCount,
    completedJobCount,
    setActiveNav,
    fetchRequestCount
)}
      </main>
    </div>
  );
}

export default ShopOwnerDashboard;

