import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import RepairStatus from "./RepairStatus";
import ServiceHistory from "./ServiceHistory";
import ReviewsRatings from "./ReviewsRatings";
import Notification from "./Notification";
import Settings from "./Settings";
import CustomerSidebar from "./CustomerSidebar";

function CustomerControllDashboard() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState("dashboard");

    return (
        <div style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, display: "flex", background: "#f0f7f2", color: "#0f172a" }}>
            <div className="flex w-full h-full overflow-hidden">
                <CustomerSidebar
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onLogout={() => { sessionStorage.clear(); navigate("/"); }}
                />
                <main className="flex-1 overflow-y-auto bg-[#f0f7f2]">
                    <div className="px-4 py-5 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1180px]">
                            {currentPage === "dashboard"     && <Dashboard />}
                            {currentPage === "profile"       && <Profile />}
                            {currentPage === "repair"        && <RepairStatus />}
                            {currentPage === "history"       && <ServiceHistory />}
                            {currentPage === "reviews"       && <ReviewsRatings />}
                            {currentPage === "notifications" && <Notification />}
                            {currentPage === "settings"      && <Settings />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CustomerControllDashboard;